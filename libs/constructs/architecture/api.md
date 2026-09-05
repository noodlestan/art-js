# Constructs API

The `@art-js/constructs` package defines the **contract** that binds the parser and serializer. It owns two things: the factory interfaces each side depends on, and the data shapes that flow through the pipeline. Neither the parser nor the serializer knows about concrete constructs — they only know these types.

## Construct Parser API

The parser depends on three interfaces, each representing a stage in the parse pipeline:

### `ConstructPreProcessor`

```ts
interface ConstructPreProcessor {
  preProcess(node: MdastNode, context: VisitContext): Construct | null;
}
```

Runs **before** the factory layer. A pre-processor can claim an entire mdast node immediately and return a Construct record. Used by constructs that need to intercept a node before generic detection (e.g. `FieldInline` detecting **Name:** patterns in paragraphs). Returns `null` to pass through to the factory layer.

### `ConstructCreator`

```ts
interface ConstructCreator {
  detect(node: MdastNode, context: VisitContext): boolean;
  create(node: MdastNode, context: VisitContext): Construct | Construct[];
}
```

The factory interface. `detect()` answers "can I handle this node?" — if true, `create()` builds the `Construct` record. Multiple factories are consulted in order; the first match wins. If none match, the parser falls back to its default construct.

### `ConstructHandler`

```ts
interface ConstructHandler {
  handle(record: Construct, node: MdastNode, context: VisitContext): VisitContext;
}
```

Runs **after** a record is created. A handler can mutate the active `VisitContext` — typically to push a nested context for constructs that own subsequent content (e.g. `SectionBlock` nesting child content under a heading, `FieldBlock` capturing following blocks). Returns the (possibly new) context for subsequent visits.

### `ConstructParser`

```ts
interface ConstructParser {
  preProcessor?: ConstructPreProcessor;
  handler?: ConstructHandler;
  factory?: ConstructCreator;
}
```

A construct may implement any combination of the three hooks. A leaf construct like `FieldInline` uses only `preProcessor` (detects and captures in one pass). A nesting construct like `SectionBlock` uses `factory` (detect + create) and `handler` (push nested context).

### `ConstructParserFactory`

```ts
type ConstructParserFactory = () => ConstructParser;
```

The parser's config holds a list of these factories. Each factory is called once during config setup to produce a `ConstructParser` instance. This indirection keeps the parser config serializable and avoids sharing mutable state between parse runs.

## Construct Serializer API

The serializer depends on two interfaces:

### ConstructToMdast

```ts
interface ConstructToMdast {
  construct: string;
  toMdast(node: Construct, children: Node[]): Node;
}
```

Converts one `Construct` record back into an mdast `Node`. The `construct` string is the key used by the serializer's registry to look up the correct adapter. `children` are the already-converted mdast children of the construct (if it has nested content).

### ConstructToMdastFactory

```ts
type ConstructToMdastFactory = () => ConstructToMdast;
```

The serializer's config holds a list of these factories. Each is instantiated during config setup and registered in a `Map<string, ConstructToMdast>` keyed by the construct string.

## Data Shapes

### Construct

The union of all registered construct types. Defined via the open `ConstructMap` interface, which extends `BlockConstructMap` and `InlineConstructMap`. New constructs are added via TypeScript declaration merging — no central enum or switch statement.

```ts
type Construct = ConstructMap[keyof ConstructMap];
```

### BlockContent / InlineContent

Convenience aliases for the block and inline subsets of the construct union:

```ts
type BlockContent = BlockConstructMap[keyof BlockConstructMap];
type InlineContent = InlineConstructMap[keyof InlineConstructMap];
```

### ArtDocument

The top-level intermediate representation produced by the parser and consumed by the serializer. Defined in `constructs/Document/types`. It holds a list of BlockContent records and optional metadata (source position, etc.).

### Registry

The `BlockConstructMap` and `InlineConstructMap` interfaces in registry.ts form an **open registry**. Each concrete construct declares its type in a private `types.ts` and augments the appropriate map via declaration merging:

```ts
// In constructs/SectionBlock/private/types.ts
declare module '../../registry' {
  interface BlockConstructMap {
    SectionBlock: SectionBlock;
  }
}
```

This means the registry grows automatically as new constructs are added — no central file needs updating.
