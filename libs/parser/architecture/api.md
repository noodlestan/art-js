# Parser API

The `@art-js/parser` package transforms raw markdown into an ArtDocument. It is **construct-agnostic** — it knows only the contract types defined by `@art-js/constructs` (see [Constructs API](../../constructs/architecture/api.md)).

## ParserConfig

```ts
interface ParserConfig {
  defaultConstruct: ConstructParserFactory;
  constructs: ConstructParserFactory[];
}
```

The parser accepts two fields:

- **defaultConstruct** — a fallback factory used when no construct claims a node. Typically `createNaturalBlockParser`, which treats unrecognised content as natural markdown.
- **constructs** — a list of ConstructParserFactory, each producing a ConstructParser instance. Factories are consulted in order during parsing.

The parser core never names a specific construct type. It drives detection entirely through the contract interfaces.

## buildDocument

```ts
function buildDocument(config: ParserConfig, source: string): ArtDocument;
```

The public entry point. Takes a ParserConfig and a markdown source string, returns an ArtDocument.

### Dispatch Algorithm

1. **Parse to mdast** — the source is parsed into an mdast tree via `fromMarkdown`.
2. **Visit nodes** — each mdast node is visited in tree order:
   - **Pre-processors run first** — any construct with a `preProcessor` hook is consulted. If one returns a Construct record, the node is claimed and the factory layer is skipped.
   - **Factories run next** — if no pre-processor claimed the node, each construct's `factory.detect()` is consulted in order. The first match wins; its `factory.create()` builds the Construct record.
   - **Fallback** — if no factory matches, `config.defaultConstruct` is used.
3. **Handler runs** — after a record is created, if the construct has a `handler` hook, it is called with the record and node. The handler may push a nested VisitContext (e.g. SectionBlock nesting child content).
4. **Context management** — the active context's `beforeRecord()` is called before each new record. If it signals a boundary (e.g. a new SectionBlock at a shallower depth), the context returns to its parent.

### Contract Reference

The parser depends on four types from `@art-js/constructs`:

- **ConstructParserFactory** — factory function that produces a ConstructParser. See [Constructs API → Construct Parser API](../../constructs/architecture/api.md#construct-parser-api).
- **ConstructParser** — the union of three optional hooks: `preProcessor`, `factory`, `handler`.
- **ConstructPreProcessor** — claims a node immediately, bypassing factory detection.
- **ConstructCreator** — the detect/create pair used by the factory layer.

The parser has no import-level dependency on any concrete construct (FieldBlock, SectionBlock, etc.). All wiring happens through the config.
