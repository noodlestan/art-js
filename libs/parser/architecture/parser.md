# Parser Implementation

**Purpose:** Explain how the `@art-js/parser` package maps raw markdown into an `ArtDocument` — the MD to Art mapping, the parser entry point, and the document builder's visit loop and dispatch. It is written from the parser's perspective: how nodes are claimed, how constructs enter capturing mode, and how the context stack is mutated.

## MD to Art Overview

The parser walks an mdast tree and produces an `ArtDocument` populated with constructs. The mapping is driven by the construct contract types from `@art-js/constructs`; the parser itself never names a concrete construct.

### Block / Phrasing Boundary

MDAST distinguishes block-level nodes (headings, paragraphs, lists, code) from phrasing children (text, emphasis, links, inline code). The parser models this boundary deliberately:

```
NaturalBlock        → block content (paragraph, list, code, heading, ...)
NaturalExpression   → phrasing content (text, emphasis, strong, link, inlineCode, ...)
```

`NaturalBlock` handles block-level structure. `NaturalExpression` handles inline/phrasing content within blocks. Attributes (e.g. list-item `checked`, `spread`) are retained generically — no special cases per node type.

### Inline Constructs Consume the Full Paragraph Tail

When an inline construct (e.g. `FieldInline`) claims a paragraph, it must consume **every** child after the field label. Phrasing children become `NaturalExpression` records, preserving their mdast `type`, attributes, value, and recursive children.

```
**Greeting:** Hello, are _you_ there?

FieldInline
  name: "Greeting"
  value:
    NaturalExpression { type: "text",    value: "Hello, are " }
    NaturalExpression { type: "emphasis", children: [text("you")] }
    NaturalExpression { type: "text",    value: " there?" }
```

This leaves room for future constructs to claim or transform an inline child instead of silently losing its structure.

### Block Constructs Own Their Capture Boundary

Block constructs (e.g. `FieldBlock`) capture following natural blocks into their `value`. The capture closes when a boundary record arrives:

```
FieldBlock:
  capture the following NaturalBlock values in field.value
  stop when the next FieldBlock, FieldInline, or SectionBlock begins
```

The active context calls `onBeforeConstruct(construct)` — if a boundary record arrives, the context returns to its parent. The builder remains construct-agnostic.

### Natural Conversion Is Recursive

Natural conversion recurses through all mdast children and retains generic attributes. No restrictive special cases per node type — list-item attributes, code metadata, and other mdast fields pass through.

### Tags and NaturalExpressions

`Tag` and `NaturalExpression` do **not** have their own parser factory. They are not claimed as top-level nodes by the visit loop; instead they are produced by other constructs' processors:

- **Tags** — each construct that supports `(#tag)` syntax knows how to extract tags, and where from, and does so in its own processor hook via the shared `extractTags` helper. For example, `SectionBlock` extracts tags from the heading text, while `FieldInline` extracts them from the paragraph tail.
- **NaturalExpression** — inline constructs delegate child conversion to `createNaturalExpressionFromNode` rather than registering a parser for it.

Because they are produced inside other constructs' processors, they need no entry in the parser's construct list.

## Parser Entry Point

`src/parse/parse.ts` exposes the single public function `parse(markdown: string): ArtDocument`. Its responsibilities:

1. **Build the default config** — `createDefaultConfig()` returns the `ParserConfig` (the default construct and the ordered construct list).
2. **Create the document parser context** — `createDocumentParserContext(markdown)` parses the source to an mdast tree via `fromMarkdown`, initialises the `ArtDocument` via `createArtDocumentFromNode`, and wraps both in a `ParserVisitContext`.
3. **Instantiate the construct parsers** — calls each `ConstructParserFactory` to produce `ConstructParser` instances.
4. **Delegate to the builder** — calls `buildDocument(defaultConstruct, constructParsers, docContext)` and returns the resulting `ArtDocument`.

```ts
export function parse(markdown: string = ''): ArtDocument {
  const config = createDefaultConfig();
  const docContext = createDocumentParserContext(markdown);

  const defaultConstruct = config.defaultConstruct();
  const constructParsers = config.constructs.map(create => create());

  return buildDocument(defaultConstruct, constructParsers, docContext);
}
```

## Document Builder

`src/buildDocument/buildDocument.ts` walks the mdast tree and assembles the `ArtDocument`. It keeps a mutable `currentContext` that starts as the document context and is reassigned as constructs enter and leave capturing mode.

### Visit Loop

The builder visits every node in the mdast tree in order via `unist-util-visit`. For each node it decides whether a construct claims it, whether it falls back to the default construct, or whether it is skipped.

```ts
function visitNode(node: Node): typeof SKIP | undefined {
  if (node.type === 'root') {
    return undefined;
  }

  const result = tryConstructs(node as RootContent);
  if (result) {
    integrate(node, result.constructs, result.integrator);
    return SKIP;
  }

  if (isBlockType(node.type)) {
    return handleNaturalBlock(node);
  }

  return SKIP;
}
```

### Construct Mapping — Claiming a Node

`tryConstructs` consults each construct's `processor` in order. The first processor whose `captureNode` returns a record claims the node; the construct's `integrator` (if any) is carried along.

```ts
function tryConstructs(node: RootContent): HandleResult | null {
  for (let i = 0; i < constructParsers.length; i++) {
    const constructParser = constructParsers[i] as ConstructParser;
    const processor = constructParser.processor;
    const construct = processor?.captureNode(currentContext, node);
    if (construct) {
      const integrator = constructParser.integrator ?? null;
      return { constructs: [construct], integrator };
    }
  }
  return null;
}
```

For example, `SectionBlock`'s processor claims heading nodes:

```ts
captureNode(context, node) {
	if (node.type !== 'heading') {
		return null;
	}
	return createSectionBlockFromNode(node as Heading, context);
}
```

### Fallback — handleNaturalBlock

If no construct claims the node and it is a block type, the builder falls back to the default construct (`NaturalBlock`). It captures the record directly as a child of the current context.

```ts
function handleNaturalBlock(node: Node): typeof SKIP | undefined {
  if (!defaultConstruct.processor) {
    return SKIP;
  }

  const construct = defaultConstruct.processor.captureNode(currentContext, node) as Construct;
  currentContext = currentContext.onBeforeConstruct(construct);
  currentContext.captureChildConstruct(construct);
  return node.type === 'paragraph' ? undefined : SKIP;
}
```

### Integrate — Context Mutation

After a node is claimed, `integrate` runs. For each construct it first calls `onBeforeConstruct` (letting the active context close if a boundary arrives), then either:

- **Calls the construct's `integrator`** — the construct enters capturing mode, mutating the context (e.g. pushing a nested context) and returning the context for subsequent visits.
- **Captures the construct directly** — for leaf constructs with no integrator, the record is appended as a child of the current context.

```ts
function integrate(
  node: Node,
  constructs: Construct[],
  integrator: ConstructIntegrator | null,
): void {
  for (const construct of constructs) {
    currentContext = currentContext.onBeforeConstruct(construct);

    if (integrator) {
      currentContext = integrator.integrate(currentContext, node, construct);
    } else {
      currentContext.captureChildConstruct(construct as BlockContent);
    }
  }
}
```

For example, `SectionBlock`'s integrator walks up the context stack by heading depth to find the correct nesting level, then captures the section and pushes a nested context:

```ts
integrate(context, node, construct) {
	const section = construct as SectionBlock;
	let currentContext = context;

	const heading = node as Heading;
	while (currentContext.construct.construct === 'SectionBlock') {
		const parentSection = findParentSection(currentContext);
		if (parentSection && sectionDepth(parentSection) >= heading.depth) {
			const parentContext = currentContext.parent();
			if (parentContext) {
				currentContext = parentContext;
			}
		} else {
			break;
		}
	}

	currentContext.captureChildConstruct(section);
	return currentContext.childContext(section);
}
```

A leaf construct such as `FieldInline` has no integrator, so `integrate` captures it directly as a child of the current context.

## See Also

- [Parser API](api.md) — the parser config, entry point, and constructs overview.
- [Constructs Architecture](../../constructs/architecture/index.md) — the three construct layers (factories, parsers, serializers) and their layout.
- [Constructs API](../../constructs/architecture/api.md) — the contract types the parser drives detection through.
- [Constructs Parsers](../../constructs/architecture/parsers.md) — the parser hooks (`ConstructProcessor`, `ConstructIntegrator`) and the scenarios each construct implements.
