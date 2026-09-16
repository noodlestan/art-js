# Sub-Agent REPORT (#producer)

**Plan:** `refactor-constructs`

**Iteration Id:** `rename-serializer-types`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Renamed serializer types so serializers are identified by `name` like every other construct API surface.

#### Files changed

| File                                                                             | Change                                                                                                                                                              |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$CONSTRUCTS/src/constructs/types.ts`                                            | Renamed `ConstructToMdast` → `ConstructSerializer`, `ConstructToMdastFactory` → `ConstructSerializerFactory`; changed `construct: string` → `readonly name: string` |
| `$CONSTRUCTS/src/constructs/Document/createDocumentToMdast.ts`                   | Return type → `ConstructSerializer`, discriminator → `name: 'Document'`                                                                                             |
| `$CONSTRUCTS/src/constructs/NaturalBlock/createNaturalBlockToMdast.ts`           | Return type → `ConstructSerializer`, discriminator → `name: 'NaturalBlock'`                                                                                         |
| `$CONSTRUCTS/src/constructs/NaturalExpression/createNaturalExpressionToMdast.ts` | Return type → `ConstructSerializer`, discriminator → `name: 'NaturalExpression'`                                                                                    |
| `$CONSTRUCTS/src/constructs/FieldBlock/createFieldBlockToMdast.ts`               | Return type → `ConstructSerializer`, discriminator → `name: 'FieldBlock'`                                                                                           |
| `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlineToMdast.ts`             | Return type → `ConstructSerializer`, discriminator → `name: 'FieldInline'`                                                                                          |
| `$CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockToMdast.ts`           | Return type → `ConstructSerializer`, discriminator → `name: 'SectionBlock'`                                                                                         |
| `$SERIALIZER/src/config/types.ts`                                                | `ConstructToMdastFactory` → `ConstructSerializerFactory`                                                                                                            |
| `$SERIALIZER/src/artAstToMdast.ts`                                               | Import `ConstructSerializer`; registry type `Map<string, ConstructSerializer>`; key by `impl.name`                                                                  |
| `$CONSTRUCTS/src/index.ts`                                                       | Export `ConstructSerializer` and `ConstructSerializerFactory` instead of old names                                                                                  |

## Blockers (if any)

None.

## Feedback

Not requested.
