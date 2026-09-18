# Constructs Parsers

**Purpose:** A living guide for implementing the **parser side** of a new construct. It is written from the constructs perspective — what hooks a construct parser needs, what each hook is invoked with, and what it should do in different scenarios. It deliberately does not explain the inner workings of the parser visitor loop; it only describes the contract a construct must satisfy and the tools it has to work with.

## Layout

Construct parsers live under `src/parser/`. Each construct gets its own folder under `src/parser/constructs/`, and shared parsing helpers live in sibling folders.

```
src/parser/
├── constructs/          # one folder per construct parser
│   └── SectionBlock/
│       ├── createSectionBlockParser.ts   # the ConstructParserFactory
│       ├── index.ts                      # public surface: exports the parser factory
│       └── private/                      # implementation details, not exported
│           ├── index.ts                  # exports processor + integrator
│           ├── constants.ts              # constants used internally by parser
│           ├── processor/createSectionBlockProcessor.ts
│           ├── integrator/createSectionBlockIntegrator.ts
│           └── helpers/createSectionBlockFromNode.ts, findParentSection.ts
├── document/            # createArtDocumentFromNode — the root document
├── [...]/               # helper directories
├── types.ts             # contracts: Processor, Integrator, Parser, ParserFactory
├── index.ts             # internal barrel
└── public.ts            # CONSTRUCT_PARSERS, DEFAULT_CONSTRUCT_PARSER, createArtDocumentFromNode
```

The `ArtDocument` factory is `createArtDocumentFromNode`, and builds an empty document attached to an `mdast` tree.

The parser contract types (`ConstructProcessor`, `ConstructIntegrator`, `ConstructParser`, `ConstructParserFactory`) are declared in `types.ts`.

The package's public parser surface is declared in `public.ts` — the `CONSTRUCT_PARSERS` factory list, the `DEFAULT_CONSTRUCT_PARSER` fallback, and `createArtDocumentFromNode`.

### Construct Layout

Each construct folder follows the same shape. The public surface is the `index.ts`, which exports only the `ConstructParserFactory`:

```ts
// src/parser/constructs/SectionBlock/index.ts
export { createSectionBlockParser } from './createSectionBlockParser';
```

Everything else lives under `private/` and is not exported from the construct's `index.ts`. The `private/index.ts` re-exports the processor and integrator so the factory can compose them:

```ts
// src/parser/constructs/SectionBlock/private/index.ts
export * from './integrator/createSectionBlockIntegrator';
export * from './processor/createSectionBlockProcessor';
```

The factory composes the hooks into a `ConstructParser`:

```ts
// src/parser/constructs/SectionBlock/createSectionBlockParser.ts
export const createSectionBlockParser: ConstructParserFactory = () => ({
  processor: createSectionBlockProcessor(),
  integrator: createSectionBlockIntegrator(),
});
```

The `private/` folder may also hold `constants.ts` (e.g. `KIND_PATTERN`) and `helpers/` (e.g. `createSectionBlockFromNode`, `findParentSection`), each with its own test file.

### Helpers

- **`fields/`** — helpers shared by the field constructs: `isFieldStrong` (detect the `**Name:**` label), `stripStrong` (extract the label text), and related constants.
- **`mdast/`** — `rawSlice`, which returns the raw markdown slice of a node from the source.
- **`naturalExpression/`** — `createNaturalExpressionFromNode`, which converts a child node into a `NaturalExpression`.
- **`tags/`** — `extractTags`, which parses trailing `(#tag)` syntax out of text.

## The Parser Contract

A construct parser is described by a `ConstructParser`, which may implement any combination of two hooks: a `processor` and an `integrator`. The hooks are invoked by the parser with a `ParserVisitContext` and the current mdast node; the construct decides what to do with them.

### ConstructProcessor

```ts
type ConstructProcessor = {
  captureNode(context: ParserVisitContext, node: MdastNode): Construct | null;
};
```

Invoked with the active `ParserVisitContext` and the current mdast `node`. The construct should:

- Return a finished `Construct` record if the node belongs to this construct (detect + capture in one pass).
- Return `null` to pass the node through to the next construct.

A processor-only construct is a **leaf** — it claims a node and produces a complete record, owning no subsequent content.

### ConstructIntegrator

```ts
type ConstructIntegrator = {
  integrate(context: ParserVisitContext, node: MdastNode, construct: Construct): ParserVisitContext;
};
```

Invoked **after** a record is created. The construct should mutate the active context — typically to capture the construct as a child and push a nested context for constructs that own subsequent content. It returns the (possibly new) context that subsequent visits should use.

An integrator is used by **container** constructs that capture following content as children.

### ConstructParser

```ts
type ConstructParser = {
  readonly name: string;
  processor?: ConstructProcessor;
  integrator?: ConstructIntegrator;
};
```

A construct may implement any combination of the two hooks:

- **Processor only** — leaf construct that detects and captures in one pass (e.g. `FieldInline`, `NaturalBlock`).
- **Processor + integrator** — container construct that detects a node, creates a record, and pushes a nested context to capture subsequent content (e.g. `FieldBlock`, `SectionBlock`).

### ConstructParserFactory

```ts
type ConstructParserFactory = () => ConstructParser;
```

The parser config holds a list of these factories. Each factory is called once during config setup to produce a `ConstructParser` instance.

## The ParserVisitContext

The context is the construct's window into the parse. It exposes:

- `construct` — the construct the current context belongs to.
- `source` — the mdast tree and raw markdown (used by helpers such as `rawSlice`, `nodePosition`, `extractTags`).
- `captureChildConstruct(child)` — append a child to the current construct.
- `childContext(construct, onBeforeConstruct?)` — push a nested context for a construct that owns subsequent content; the optional `onBeforeConstruct` is invoked before a construct is captured and can act as a boundary.
- `parent()` — walk up to the enclosing context.
- `onBeforeConstruct(construct)` — invoked before a construct is captured; used to close a nested context when a boundary construct arrives.

## Scenarios

### Scenario 1: Leaf Construct — Processor Only

**Used by:** `FieldInline`, `NaturalBlock`

A leaf construct claims a node in a single pass and returns the finished record. No integrator is needed because the construct does not own subsequent content.

```ts
// createFieldInlineProcessor.ts
export function createFieldInlineProcessor(): ConstructProcessor {
  return {
    captureNode(context, node) {
      if (node.type !== 'paragraph') {
        return null;
      }
      const paragraph = node as Paragraph;
      const first = paragraph.children[0];
      if (first === undefined || !isFieldStrong(first, context)) {
        return null;
      }
      return createFieldInlineFromNode(paragraph, context);
    },
  };
}
```

**Key point:** Returning `null` from `captureNode` passes the node through to the next construct. This is how `FieldInline` and `FieldBlock` coexist on the same detection pattern — `FieldInline`'s processor returns `null` when the content is on the next line, letting `FieldBlock` claim it via its own processor.

A leaf construct may also capture unconditionally, acting as a fallback that claims any node it is offered:

```ts
// createNaturalBlockProcessor.ts
export function createNaturalBlockProcessor(): ConstructProcessor {
  return {
    captureNode(context, node) {
      return createNaturalBlockFromNode(node, context);
    },
  };
}
```

### Scenario 2: Block Construct with Nested Content — Processor + Integrator

**Used by:** `FieldBlock`

A construct that uses both `processor` and `integrator` detects a node, creates a record, and then pushes a nested context to capture subsequent content.

The processor detects the construct and creates the record:

```ts
// createFieldBlockProcessor.ts
export function createFieldBlockProcessor(): ConstructProcessor {
  return {
    captureNode(context, node) {
      if (node.type !== 'paragraph') {
        return null;
      }
      const paragraph = node as Paragraph;
      const first = paragraph.children[0];
      if (first === undefined || !isFieldStrong(first, context)) {
        return null;
      }
      return createFieldBlockFromNode(paragraph, context);
    },
  };
}
```

The integrator captures the record as a child of the current context, then pushes a nested context so following blocks become children of the field:

```ts
// createFieldBlockIntegrator.ts
export function createFieldBlockIntegrator(): ConstructIntegrator {
  return {
    integrate(context, _node, construct) {
      const field = construct as FieldBlock;
      context.captureChildConstruct(field);
      return context.childContext(field, onBeforeConstruct);
    },
  };
}
```

**Key point:** The integrator calls `captureChildConstruct(field)` to attach the record to the current context, then `childContext(field, onBeforeConstruct)` to push a nested context. The optional `onBeforeConstruct` boundary closes the nested context when a boundary construct arrives (e.g. another `FieldBlock`, `FieldInline`, or `SectionBlock`).

### Scenario 3: Block Construct with Heading Hierarchy — Processor + Integrator

**Used by:** `SectionBlock`

A construct that nests by a hierarchy (heading depth) detects a node, then walks up the context stack to find the correct nesting level before pushing a nested context.

The processor detects heading nodes:

```ts
// createSectionBlockProcessor.ts
export function createSectionBlockProcessor(): ConstructProcessor {
  return {
    captureNode(context, node) {
      if (node.type !== 'heading') {
        return null;
      }
      return createSectionBlockFromNode(node as Heading, context);
    },
  };
}
```

The integrator walks up the context stack, closing sections whose depth is greater than or equal to the new heading's depth, before capturing and pushing a nested context:

```ts
// createSectionBlockIntegrator.ts
export function createSectionBlockIntegrator(): ConstructIntegrator {
  return {
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
    },
  };
}
```

**Key point:** The integrator walks up the context stack, closing sections whose depth is `>=` the new heading's depth, before capturing and pushing a nested context. This is how markdown heading hierarchy is preserved — `## Sub` nests under `# Title`, but a new `# Title` closes all previous sections.

### Scenario 4: Parsing Trailing Tags with `extractTags`

**Used by:** `SectionBlock`, `FieldInline`

Constructs that support trailing `(#tag)` syntax use the shared `extractTags` helper. It returns `{ tags, stripped }` — the parsed tags and the remaining text with the tag syntax removed.

`SectionBlock` extracts tags from the heading text, then uses the stripped text for the section name:

```ts
// createSectionBlockFromNode.ts
const text = rawSlice(node, context)
  .replace(/^[ \t]*#+[ \t]*/, '')
  .trim();
const { tags, stripped } = extractTags(text);
const kindMatch = stripped.match(KIND_PATTERN);
const section = createSectionBlock({
  name: kindMatch?.[2]?.trim() ?? stripped,
  kind: kindMatch?.[1],
  depth: node.depth,
  children: [],
  tags,
});
```

`FieldInline` uses `extractTags` twice: once on the remainder after the label to decide whether content follows (if nothing remains, it returns `null` and lets `FieldBlock` claim the node), and once on the last child's text to pull out trailing tags:

```ts
// createFieldInlineFromNode.ts
const afterStrong = paragraphRaw.slice(strongRaw.length);
const { stripped } = extractTags(afterStrong);
if (stripped.trim().length === 0) {
  return null;
}
// ...
const last = children[children.length - 1];
let tags: Tag[] = [];
if (last?.type === 'text' && typeof last.value === 'string') {
  const extracted = extractTags(last.value);
  if (extracted.tags.length) {
    tags = extracted.tags;
    last.value = extracted.stripped;
  }
}
```

**Key point:** `extractTags` is the single source of truth for `(#tag)` syntax. A construct that supports tags should call it on the text it owns and store the returned `tags` on its record, using `stripped` for the display text.

### Scenario 5: Delegating Child Parsing to Another Construct

**Used by:** `FieldInline`

A construct that owns inline content can delegate the conversion of each child node to another construct's `fromNode` helper, rather than re-implementing the child's parsing.

`FieldInline` maps each paragraph child after the label through `createNaturalExpressionFromNode`, then trims the edges:

```ts
// createFieldInlineFromNode.ts
const expressions = paragraph.children
  .slice(1)
  .map(child => createNaturalExpressionFromNode(child));
const children = trimFieldEdges(expressions);
```

**Key point:** Delegating to `createNaturalExpressionFromNode` keeps the child-parsing logic in one place — `FieldInline` only handles its own label and tag concerns, and reuses the shared conversion for the value content.

## Choosing Hooks for a New Construct

Use this decision guide to determine what a new construct's parser needs:

- **Leaf / self-contained** — implement `processor` only. Detect the node and return the finished record in one pass; return `null` to pass through.
- **Owns subsequent content** — implement `processor` + `integrator`. The processor creates the record; the integrator calls `captureChildConstruct` and pushes a nested context via `childContext`.
- **Nests by a hierarchy (depth / kind)** — implement `processor` + `integrator`, and have the integrator walk the context stack (via `parent()`) to find the correct nesting level before pushing a nested context.

## Checklist for a New Construct Parser

- What does the construct detect? (node type, pattern, first-child shape)
- Does it own children? (needs an integrator that pushes a `childContext`)
- Does it nest by a hierarchy? (integrator must walk the context stack)
- What boundary closes it? (an `onBeforeConstruct` passed to `childContext`)
- When should it return `null` to pass the node through to another construct?
