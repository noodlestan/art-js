# Constructs API

The `@art-js/constructs` package defines the **contract** that binds the parser and serializer. It owns three things: the factory functions each construct exposes, the parser/serializer interfaces each side depends on, and the data shapes that flow through the pipeline. Neither the parser nor the serializer knows about concrete constructs — they only know these types.

## Construct Factories API

Each construct exposes a factory function that builds a construct record from plain data, plus a factory-data type describing the minimal input required.

```ts
createDocument(data: DocumentFactoryData): ArtDocument
createFieldBlock(data: FieldBlockFactoryData): FieldBlock
...
createTag(data: TagFactoryData): Tag
```

Each `{Construct}FactoryData` describes the data needed to build that construct. For example:

```ts
type FieldBlockFactoryData = {
  name: string;
  children?: BlockContent[];
  tags?: Tag[];
};
```

Factories are collected in the `CONSTRUCTS` registry (see [Registry](#registry)) so the parser and serializer can look them up by construct name.

## Construct Parser API

The parser depends on two hooks, the container type that combines them, and a factory that produces the container.

### ConstructProcessor

```ts
type ConstructProcessor = {
  captureNode(context: ParserVisitContext, node: MdastNode): Construct | null;
};
```

Claims an entire mdast node immediately and returns a Construct record. Used by constructs that detect and capture in one pass (e.g. `FieldInline` detecting **Name:** patterns in paragraphs, or `SectionBlock` matching heading nodes). Returns `null` to pass through to the next construct.

### ConstructIntegrator

```ts
type ConstructIntegrator = {
  integrate(context: ParserVisitContext, node: MdastNode, construct: Construct): ParserVisitContext;
};
```

Runs **after** a record is created. An integrator can mutate the active `ParserVisitContext` — typically to push a nested context for constructs that own subsequent content (e.g. `SectionBlock` nesting child content under a heading, `FieldBlock` capturing following blocks). Returns the (possibly new) context for subsequent visits.

### ConstructParser

```ts
type ConstructParser = {
  readonly name: string;
  processor?: ConstructProcessor;
  integrator?: ConstructIntegrator;
};
```

A construct may implement any combination of the two hooks. A leaf construct like `FieldInline` uses only `processor` (detects and captures in one pass). A nesting construct like `SectionBlock` uses `processor` (detect + create) and `integrator` (push nested context).

### ConstructParserFactory

```ts
type ConstructParserFactory = () => ConstructParser;
```

The parser's config holds a list of these factories. Each factory is called once during config setup to produce a `ConstructParser` instance. This indirection allows the runtime construct parser to be configured (future use cases).

## Construct Serializer API

The serializer depends on the serializer type and a factory that produces it.

### ConstructSerializer

```ts
type ConstructSerializer = {
  readonly name: string;
  toMdast(node: Construct, children: Node[]): Node;
};
```

Converts one `Construct` record back into an mdast `Node`. The `name` string is the key used by the serializer's registry to look up the correct adapter. `children` are the already-converted mdast children of the construct (if it has nested content).

### ConstructSerializerFactory

```ts
type ConstructSerializerFactory = () => ConstructSerializer;
```

The serializer's config holds a list of these factories. Each is instantiated during config setup and registered in a `Map<string, ConstructSerializer>` keyed by the construct name. This indirection allows the runtime construct parser to be configured (future use cases).

## Construct Types

### Registry

The `BlockConstructMap`, `InlineConstructMap`, and `ConstructMap` types in `constructs/types.ts` form the construct registry. Each concrete construct declares its type and is added to the appropriate map:

```ts
interface BlockConstructMap {
  SectionBlock: SectionBlock;
  FieldBlock: FieldBlock;
  FieldInline: FieldInline;
  NaturalBlock: NaturalBlock;
}

interface InlineConstructMap {
  NaturalExpression: NaturalExpression;
  Tag: Tag;
}

type ConstructMap = BlockConstructMap & InlineConstructMap;
```

The registry is an **open registry**. The block and inline maps are declared as `interface`s, so new constructs can be added by an extending package via declaration merging — no central enum or switch statement needs updating:

```ts
// In an extending package
declare module '@art-js/constructs/src/constructs/types' {
  interface BlockConstructMap {
    MyConstruct: MyConstruct;
  }
}
```

The `interface` declarations are exempted from the No Interface convention via a `@conventions-ignore` tag, since declaration merging is the mechanism that keeps the registry open.

### ArtDocument

The top-level intermediate representation produced by the parser and consumed by the serializer. Defined in `@art-js/primitives` (`libs/primitives/src/document/types.ts`). It is a container construct holding a list of child constructs:

```ts
type ArtDocument = ContainerConstructBase & {
  construct: 'Document';
};
```

### Construct

The union of all registered construct types:

```ts
type Construct = ConstructMap[keyof ConstructMap];
```

### BlockContent / InlineContent

Convenience aliases for the block and inline subsets of the construct union:

```ts
type BlockContent = BlockConstructMap[keyof BlockConstructMap];
type InlineContent = InlineConstructMap[keyof InlineConstructMap];
```
