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

## Entry Point

```ts
function parse(markdown: string): ArtDocument;
```

The public entry point is `parse` in `src/parse/parse.ts`. Its contract is **markdown only** — it takes a markdown source string and returns an `ArtDocument`. Configuration is currently fixed to the default parser config; config injection will be allowed later.

## Constructs Overview

The parser drives detection through the construct contract types from `@art-js/constructs`. Each construct contributes a parser (and optionally a serializer) that knows how to recognise and build its own records; the parser stays construct-agnostic and never names a concrete construct.

See [Constructs Architecture](../../constructs/architecture/index.md) for the full details of the construct layers (factories, parsers, serializers) and their contracts.
