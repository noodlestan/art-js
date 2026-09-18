# Constructs Architecture

## Documents

| Document                         | Description                                                      |
| -------------------------------- | ---------------------------------------------------------------- |
| [api.md](api.md)                 | Constructs API: contract types, data shapes, registry            |
| [factories.md](factories.md)     | Construct factories: building construct records from plain data  |
| [parsers.md](parsers.md)         | Construct parsers: parser hook patterns with examples            |
| [serializers.md](serializers.md) | Construct serializers: serializer contract and tag serialization |

## Layout

The `@art-js/constructs` package is split into three layers, each with its own `src/` folder and public surface:

```
src/
├── factories/     # construct record factories (createX from factory-data)
├── parser/        # construct parsers (processor + integrator hooks)
├── serializer/    # construct serializers (toMdast)
└── index.ts       # re-exports the three public surfaces
```

Each layer follows the same shape: one folder per construct under `constructs/`, shared helpers in sibling folders, a `types.ts` for the layer's contract, an internal `index.ts` barrel, and a `public.ts` exposing the layer's public surface (factory list, fallback, and entry points).
