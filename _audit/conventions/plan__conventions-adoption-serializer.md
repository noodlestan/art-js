# Convention Adoption Report: Serializer

**Package:** `@art-js/serializer`

**Base path:** `$PROJECT/libs/serializer/`

**Scope:** Source files only. Test files are excluded.

## Findings

| Convention                                 | File / line                                                                                                | Issue                                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| No Interface                               | [`src/config/types.ts:3`](../../libs/serializer/src/config/types.ts#L3)                                    | Declares `SerializerConfig` with `interface`; use a `type` declaration.                                                      |
| No Nested Ternaries                        | [`src/artAstToMdast/artAstToMdast.ts:14-18`](../../libs/serializer/src/artAstToMdast/artAstToMdast.ts#L14) | Uses a nested conditional expression to select `rawChildren`; use statements or a helper with early returns instead.         |
| No Complex Inline Types                    | [`src/artAstToMdast/artAstToMdast.ts:14`](../../libs/serializer/src/artAstToMdast/artAstToMdast.ts#L14)    | Declares a multi-property object type inline in the `visit` function parameter. Extract it into a named type.                |
| No Complex Inline Types                    | [`src/artAstToMdast/artAstToMdast.ts:23`](../../libs/serializer/src/artAstToMdast/artAstToMdast.ts#L23)    | Declares a multi-property object type inline in the type predicate. Extract it into a named type.                            |
| No Chained Array Methods on Multiple Lines | [`src/artAstToMdast/artAstToMdast.ts:21-26`](../../libs/serializer/src/artAstToMdast/artAstToMdast.ts#L21) | Splits a `.filter(...).flatMap(...)` array-method chain across multiple lines; extract the intermediate filtered collection. |

## Excluded Findings

- Test files were excluded from this audit.
- Closure functions were not treated as violations; the File as Function convention should allow closure functions when they intentionally capture local state and are not reusable outside their enclosing function.
- The All Caps Constants convention was not applied to runtime/configured objects; it should be restricted to module-level literal and regular-expression constants.
