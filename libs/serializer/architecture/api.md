# Serializer API

The `@art-js/serializer` package transforms an `ArtDocument` back into markdown. It is **construct-agnostic** — it knows only the contract types defined by `@art-js/constructs` (see [Constructs API](../../constructs/architecture/api.md)).

## SerializerConfig

```ts
type SerializerConfig = {
  constructs: ConstructSerializerFactory[];
};
```

The only configuration the serializer accepts is a list of `ConstructSerializerFactory` — the same factory type defined in the constructs contract. Each factory is instantiated once during setup and registered in an internal `Map<string, ConstructSerializer>` keyed by the construct name.

The serializer never names a concrete construct. It dispatches entirely through the registry built from this config.

## Entry Point

```ts
function serialize(document: ArtDocument): string;
```

The public entry point. Takes an `ArtDocument` and returns a markdown string. It builds the default config, converts the document to an mdast `Root` via `artAstToMdast`, then renders it with `toMarkdown` (using `-` bullets and `_` emphasis).

## artAstToMdast

```ts
function artAstToMdast(config: SerializerConfig, document: ArtDocument): Node;
```

The conversion core. Takes a `SerializerConfig` and an `ArtDocument`, returns an mdast `Root` node. See [Serializer Implementation](implementation.md) for the conversion algorithm.

### Dispatch Algorithm

1. **Build registry** — iterate `config.constructs`, call each factory, store the resulting `ConstructSerializer` in a Map keyed by `impl.name`.
2. **Visit children** — for each top-level child in `document.children`, recursively visit the construct tree:
   - Gather nested children (from `node.children` or `node.value` arrays) and visit them first (bottom-up).
   - Look up the construct's `ConstructSerializer` adapter in the registry.
   - Call `impl.toMdast(node, childNodes)` to produce the mdast node.
3. **Handle nesting** — for constructs with nested content (SectionBlock, FieldBlock), the main node is returned followed by the converted children as **siblings** in the mdast output. This matches how markdown structures work: a heading is followed by its body content as sibling nodes, not as mdast children.
4. **Wrap in root** — all converted children are collected into a `{ type: 'root', children: [...] }` node.

### Contract Reference

The serializer depends on two types from `@art-js/constructs`:

- **ConstructSerializerFactory** — factory function that produces a `ConstructSerializer` adapter. See [Constructs API → Construct Serializer API](../../constructs/architecture/api.md#construct-serializer-api).
- **ConstructSerializer** — the adapter type: `{ readonly name: string; toMdast(node, children): Node }`. The construct name is the registry key; `toMdast` converts one construct record into an mdast node, receiving already-converted children.

The serializer has no import-level dependency on any concrete construct (FieldBlock, SectionBlock, etc.). All wiring happens through the config.
