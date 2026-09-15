# Constructs Implementation

This file documents the implementation patterns used by existing constructs.

**Adding new constructs:** When a new construct is implemented that uses the parser or serializer contract in a way not covered by an existing example, add a new section here describing the pattern. The goal is to keep this file as a living guide — each distinct way of combining the contract hooks should have a concrete example.

## How the Parser API Is Implemented

Each construct implements a subset of the two parser hooks (`processor`, `handler`). The examples below cover every combination currently in use.

### Pattern 1: Processor Only — Leaf Inline Construct

**Used by:** `FieldInline`

A processor-only construct claims a node in a single pass and returns the finished record. No factory or handler is needed because the construct is a leaf — it does not own subsequent content.

```ts
// createFieldInlineParser.ts
export const createFieldInlineParser: ConstructParserFactory = () => ({
  processor: createFieldInlineProcessor(),
});
```

The processor detects a paragraph starting with `**Name:**` where content follows on the same line:

```ts
// createFieldInlineProcessor.ts
captureNode(context, node) {
  if (node.type !== 'paragraph') return null;
  // Check first child is a strong node (the **Name:** part)
  if (!isFieldStrong(first, context)) return null;
  // If nothing follows the strong node, it's not inline — return null
  if (paragraphRaw.slice(strongRaw.length).trim().length === 0) return null;
  // Build the record: extract name, convert remaining children to NaturalExpression
  return { construct: 'FieldInline', name, value: [...], position };
}
```

**Key point:** Returning `null` from `captureNode` passes the node to the factory layer. This is how `FieldInline` and `FieldBlock` coexist on the same detection pattern — `FieldInline`'s processor returns `null` when the content is on the next line, letting `FieldBlock` claim it via its own processor.

### Pattern 2: Processor + Handler — Block Construct with Nested Content

**Used by:** `FieldBlock`

A construct that uses both `processor` and `handler` detects a node, creates a record, and then pushes a nested context to capture subsequent content.

```ts
// createFieldBlockParser.ts
export const createFieldBlockParser: ConstructParserFactory = () => ({
  processor: createFieldBlockProcessor(),
  handler: createFieldBlockHandler(),
});
```

The processor detects `**Name:**` where the remainder of the line is empty (content follows on next lines):

```ts
// createFieldBlockProcessor.ts
captureNode(context, node) {
  if (node.type !== 'paragraph') return null;
  if (!isFieldStrong(first, context)) return null;
  // If remainder after "**Name:**" is NOT empty, this is FieldInline territory
  if (remainder.trim().length > 0) return null;
  // Build the record with an empty value array — content will be captured by the handler
  return createFieldBlockFromParagraph(node, context);
}
```

The handler pushes a nested context and defines a boundary function:

```ts
// createFieldBlockHandler.ts
const FIELD_BLOCK_BOUNDARIES = new Set(['FieldBlock', 'FieldInline', 'SectionBlock']);

handle(record, _node, context) {
  context.push(record);
  const newCtx = createNestedContext(
    'FieldBlock',
    context,
    undefined,
    field.value,       // the array to append captured records to
    undefined,
    closeFieldBlock,   // boundary function
  );
  return newCtx;
}

function closeFieldBlock(record, context) {
  // Return to parent when a boundary construct arrives
  if (!FIELD_BLOCK_BOUNDARIES.has(record.construct)) return context;
  const parent = context.parent();
  if (!parent) return context;
  parent.lastEnd = context.lastEnd;
  return parent;
}
```

**Key point:** The boundary function (`closeFieldBlock`) is called by the parser's `beforeRecord()` hook. When a new record arrives whose `construct` is in the boundary set, the nested context closes and the parser returns to the parent context.

### Pattern 3: Processor + Handler — Block Construct with Detection

**Used by:** `SectionBlock`

A construct that uses `processor` (detect + create) and `handler` detects a node, creates a record, and then pushes a nested context to capture subsequent content.

```ts
// createSectionBlockParser.ts
export const createSectionBlockParser: ConstructParserFactory = () => ({
  processor: createSectionBlockProcessor(),
  handler: createSectionBlockHandler(),
});
```

The processor detects heading nodes and extracts the section name, depth, optional kind, and trailing tags:

```ts
// createSectionBlockProcessor.ts
export function createSectionBlock(node: Heading, context: ParserVisitContext): SectionBlock {
  const text = rawSlice(node, context)
    .replace(/^[ \t]*#+[ \t]*/, '')
    .trim();
  const { tags, stripped: textWithoutTags } = extractTags(text);
  const kindMatch = textWithoutTags.match(KIND_PATTERN);
  const section: SectionBlock = {
    construct: 'SectionBlock',
    name: kindMatch?.[2]?.trim() ?? textWithoutTags,
    children: [],
    depth: node.depth,
    position: nodePosition(node),
  };
  if (kindMatch?.[1]) section.kind = kindMatch[1];
  if (tags.length) section.tags = tags;
  return section;
}

export function createSectionBlockProcessor(): ConstructProcessor {
  return {
    captureNode(context, node) {
      return node.type === 'heading' ? createSectionBlock(node as Heading, context) : null;
    },
  };
}
```

The handler manages nesting by depth — a shallower heading closes deeper sections:

```ts
// createSectionBlockHandler.ts
handle(record, node, context) {
  const section = record as SectionBlock;
  let ctx = context;
  const heading = node as Heading;

  // Walk up the context stack, closing sections whose depth >= the new heading's depth
  while (ctx.capturing() === 'SectionBlock') {
    const parentSection = findTagable(ctx) as SectionBlock;
    if (parentSection && sectionDepth(parentSection) >= heading.depth) {
      const p = ctx.parent();
      if (p) { p.lastEnd = ctx.lastEnd; ctx = p; }
    } else {
      break;
    }
  }

  ctx.push(section);
  const newCtx = createNestedContext('SectionBlock', ctx, undefined, section.children, section);
  return newCtx;
}
```

**Key point:** The handler walks up the context stack to find the correct nesting level. This is how markdown heading hierarchy is preserved — `## Sub` nests under `# Title`, but a new `# Title` closes all previous sections.

## How the Serializer API Is Implemented

Every construct implements `ConstructToMdast` — a single `toMdast(node, children)` method. The `construct` string is the registry key.

### Pattern A: Leaf Construct — Inline Content as Children

**Used by:** `FieldInline`

The `toMdast` method receives already-converted children and places them inline:

```ts
// createFieldInlineToMdast.ts
toMdast(node, children) {
  const field = node as FieldInline;
  return {
    type: 'paragraph',
    children: [
      { type: 'strong', children: [{ type: 'text', value: `${field.name}:` }] },
      { type: 'text', value: ' ' },
      ...children,  // inline children follow the label
    ],
  };
}
```

### Pattern B: Leaf Construct — Label Only, Children Ignored

**Used by:** `FieldBlock`

The block form renders only the label. The value content is rendered by the nested records, not by this construct:

```ts
// createFieldBlockToMdast.ts
toMdast(node, _children) {
  const field = node as FieldBlock;
  return {
    type: 'paragraph',
    children: [
      { type: 'strong', children: [{ type: 'text', value: `${field.name}:` }] },
    ],
  };
}
```

**Key point:** The serializer's `artAstToMdast` function handles the sibling placement of nested content for `FieldBlock` and `SectionBlock` — the `toMdast` method only produces the construct's own node.

### Pattern C: Construct with Computed Output

**Used by:** `SectionBlock`

The `toMdast` method reconstructs the heading syntax from the record's data:

```ts
// createSectionBlockToMdast.ts
toMdast(node, _children) {
  const section = node as SectionBlock;
  const depth = section.depth ?? 1;
  const tagSyntax = section.tags?.length
    ? ' ' + section.tags.map(t => `(#${t.name})`).join(' ')
    : '';
  // Re-parse the heading text to get proper mdast children
  const parsed = fromMarkdown(`# ${section.name}${tagSyntax}`);
  const heading = parsed.children.find(c => c.type === 'heading');
  const children = heading?.children ?? [{ type: 'text', value: section.name }];
  return { type: 'heading', depth, children };
}
```

**Key point:** Using `fromMarkdown` to parse the heading text ensures that inline formatting in the section name (e.g. `# Title with **bold**`) is preserved as proper mdast children.

### Pattern D: Minimal Text Construct

**Used by:** `Tag`

The simplest serializer — a single text node:

```ts
// createTagToMdast.ts
toMdast(node) {
  const tag = node as Tag;
  return { type: 'text', value: `@${tag.name}` };
}
```
