# Art JS Ecosystem Overview

The **art-js** repository is a modular JavaScript ecosystem for parsing and serialising a domain-specific markdown dialect called Art-MD. Its defining architectural choice is a **construct-agnostic pipeline**: the parser and serializer know nothing about which concrete constructs exist. They operate on a shared contract — factory types and data shapes — and concrete constructs are injected at configuration time.

## Supporting Packages

- `@art-js/primitives` — provides low-level types shared across the ecosystem, such as `MdastNode`, `VisitContext`, and `Point`. Neither the parser nor the serializer depend on prisms directly; these types flow through the contract layer defined by `@art-js/constructs`.

## Md-Art-Md Roundtrip

The core of the ecosystem is a bidirectional pipeline: markdown → `ArtDocument` (parse) and `ArtDocument` → markdown (serialise). Three packages implement this pipeline, each with a distinct role and a strict separation of concerns.

### The Contract Layer: `@art-js/constructs`

`@art-js/constructs` is the glue of the ecosystem. It defines two things:

1. **Contract types** — `ConstructCreator`, `ConstructPreProcessor`, `ConstructHandler`, `ConstructParser`, `ConstructParserFactory` for the parse direction; `ConstructToMdast` and `ConstructToMdastFactory` for the serialise direction. These interfaces are the only thing the parser and serializer know about individual constructs.

2. **Data shapes and registry** — `ArtDocument`, `Construct`, `BlockContent`, and `InlineContent` describe the intermediate representation. The `BlockConstructMap` and `InlineConstructMap` interfaces form an _open registry_: new construct types are added via TypeScript declaration merging, not by modifying a central enum.

The constructs package also ships the concrete implementations: each construct (e.g. `FieldBlock`, `SectionBlock`, `Tag`) exports both a parser factory and a toMdast factory. These concrete factories are _not_ imported by the parser or serializer directly — they are composed at configuration time.

### The Parse Direction: `@art-js/parser`

The parser transforms raw markdown into an `ArtDocument`. Its core (`buildDocument` in `builder.ts`) drives a generic algorithm:

1. Parse the markdown into an mdast tree.
2. Visit each node, first trying any construct **pre-processors** (e.g. a tag pre-processor that detects `#tag` patterns before the generic factory layer).
3. If no pre-processor matches, ask the **factory** layer — each construct's `ConstructCreator.detect` is consulted to see if it claims the node.
4. If no construct claims the node, fall back to the **default construct** (`createNaturalBlockParser`), which treats unrecognised content as natural markdown.

The parser's configuration (`ParserConfig`) holds only two fields: `defaultConstruct` and a list of `ConstructParserFactory`. The parser core never names a specific construct type. It drives detection entirely through the contract interfaces.

### The Serialise Direction: `@art-js/serializer`

The serializer transforms an `ArtDocument` back into markdown. Its core (`artAstToMdast` in `artAstToMdast.ts`) builds a **registry** from the config: each `ConstructToMdastFactory` is instantiated and stored in a `Map<string, ConstructToMdast>` keyed by the construct's `construct` string. When walking the `ArtDocument`, it looks up each node by this key and dispatches to the matching `toMdast` implementation.

Like the parser, the serializer's configuration (`SerializerConfig`) holds only a list of `ConstructToMdastFactory`. It never names a concrete construct — it dispatches generically through the registry.

### Where the Ecosystem Is Glued Together

The only place where concrete constructs and the pipeline meet is in the **default config factories**:

- `createDefaultConfig.ts` (parser) imports concrete construct parser factories from `@art-js/constructs` and wires them into a `ParserConfig`.
- `createDefaultSerializerConfig.ts` (serializer) imports concrete `*ToMdast` factories from `@art-js/constructs` and wires them into a `SerializerConfig`.

This is a **composition decision**, not a hardcoded dependency. The parser and serializer libraries have no import-level knowledge of `FieldBlock`, `SectionBlock`, or any other concrete construct. A consumer could supply a completely different set of constructs by providing a custom config.

### Separation

Parser and serializer are independent of each other. They share only the data contract (`ArtDocument`, `Construct` shapes) defined by `@art-js/constructs`. Neither package imports from the other. A consumer can use the parser without the serializer, or vice versa. The only binding between them is the shared vocabulary of construct types and the `ArtDocument` intermediate representation.

## Planned Packages

The following packages are part of the art-js ecosystem but are not yet implemented or their roles are not yet defined in code:

- `@art-js/dev-server`
- `@art-js/language-server`
- `@art-js/watcher`
- `@art-js/tools`
