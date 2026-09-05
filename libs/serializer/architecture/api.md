# Serializer API

The `@art-js/serializer` package transforms an `ArtDocument` back into markdown. It is **construct-agnostic** — it knows only the contract types defined by `@art-js/constructs` (see [Constructs API](../../constructs/architecture/api.md)).

## SerializerConfig

```ts
interface SerializerConfig {
  constructs: ConstructToMdastFactory[];
}
```

The only configuration the serializer accepts is a list of ConstructToMdastFactory — the same factory type defined in the constructs contract. Each factory is instantiated once during setup and registered in an internal `Map<string, ConstructToMdast>` keyed by the construct string.

The serializer never names a concrete construct. It dispatches entirely through the registry built from this config.

## artAstToMdast

```ts
function artAstToMdast(config: SerializerConfig, document: ArtDocument): Node;
```

The public entry point. Takes a SerializerConfig and an ArtDocument, returns an mdast Root node.

### Dispatch Algorithm

1. **Build registry** — iterate `config.constructs`, call each factory, store the resulting ConstructToMdast in a Map keyed by `impl.construct`.
2. **Visit children** — for each top-level BlockContent in `document.children`, recursively visit the construct tree:
   - Gather nested children (from `node.children` or `node.value` arrays) and visit them first (bottom-up).
   - Look up the construct's ConstructToMdast adapter in the registry.
   - Call `impl.toMdast(node, childNodes)` to produce the mdast node.
3. **Handle nesting** — for constructs with nested content (SectionBlock, FieldBlock), the main node is returned followed by the converted children as **siblings** in the mdast output. This matches how markdown structures work: a heading is followed by its body content as sibling nodes, not as mdast children.
4. **Wrap in root** — all converted children are collected into a `{ type: 'root', children: [...] }` node.

### Contract Reference

The serializer depends on two types from `@art-js/constructs`:

- **ConstructToMdastFactory** — factory function that produces a ConstructToMdast adapter. See [Constructs API → Construct Serializer API](../../constructs/architecture/api.md#construct-serializer-api).
- **ConstructToMdast** — the adapter interface: `{ construct: string; toMdast(node, children): Node }`. The construct string is the registry key; `toMdast` converts one construct record into an mdast node, receiving already-converted children.

The serializer has no import-level dependency on any concrete construct (FieldBlock, SectionBlock, etc.). All wiring happens through the config.
