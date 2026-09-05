# Art JS Architecture

## Principles

Art JS is a **construct-agnostic pipeline**: the parser and serializer know nothing about which concrete constructs exist. They operate on a shared contract — factory types and data shapes — and concrete constructs are injected at configuration time.

### Composition Over Hardcoding

The parser and serializer have no import-level dependency on any concrete construct. Wiring happens through config factories (`createDefaultConfig.ts`, `createDefaultSerializerConfig.ts`). A consumer can supply a completely different set of constructs by providing a custom config. See [principles.md](principles.md) for the full set of design principles.

### Open Registry

Constructs are registered via TypeScript declaration merging — no central enum or switch statement. New constructs augment `BlockConstructMap` or `InlineConstructMap` and are automatically discovered by the parser and serializer. See [Constructs API](../libs/constructs/architecture/api.md#registry).

### Separation of Concerns

Parser and serializer are independent of each other. They share only the data contract (`ArtDocument`, `Construct` shapes) defined by `@art-js/constructs`. Neither package imports from the other. See [components.md](components.md) for the full component map.

### Natural Fallback

Unrecognised markdown is preserved as `NaturalBlock` records rather than dropped. The parser is lenient — it classifies nodes, it does not validate syntax.

## Documents

| Document                                           | Description                                                           |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| [principles.md](principles.md)                     | Design principles for the Art JS ecosystem                            |
| [overview.md](overview.md)                         | Md-Art-Md Roundtrip, Constructs, Parser, Serializer, Planned Packages |
| [components.md](components.md)                     | Components, relationships, and package links                          |
| [art-md-fixture-tests.md](art-md-fixture-tests.md) | Fixture test suite for parser and serializer                          |

## Package Architecture References

| Package    | Architecture Index                                                                |
| ---------- | --------------------------------------------------------------------------------- |
| Constructs | [libs/constructs/architecture/index.md](../libs/constructs/architecture/index.md) |
| Parser     | [libs/parser/architecture/index.md](../libs/parser/architecture/index.md)         |
| Serializer | [libs/serializer/architecture/index.md](../libs/serializer/architecture/index.md) |
