# Serializer Architecture

The `@art-js/serializer` package transforms an `ArtDocument` back into markdown.

The serializer is **construct-agnostic** — it drives conversion entirely through the contract types from `@art-js/constructs` and never names a concrete construct.

## Documents

| Document                               | Description                                                         |
| -------------------------------------- | ------------------------------------------------------------------- |
| [api.md](api.md)                       | Serializer API: config, entry point, contract references            |
| [implementation.md](implementation.md) | Serializer implementation: entry point, Art AST to mdast conversion |

## Layout

Its `src/` layout:

```
src/
├── artAstToMdast/   # artAstToMdast: registry build, visit, sibling placement
├── config/          # SerializerConfig type + createDefaultSerializerConfig
├── serializer/      # serialize entry point (ArtDocument → markdown)
└── index.ts         # exports serialize
```
