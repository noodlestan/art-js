# Convention Adoption Report: Primitives

**Package:** `@art-js/primitives`

**Base path:** `$PROJECT/libs/primitives/`

**Scope:** Source files only. Test files are excluded.

## Findings

| Convention                  | File / line                                                                                                                   | Issue                                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| No Interface                | [`src/types.ts:2`](../../libs/primitives/src/types.ts#L2)                                                                     | Declares `ConstructBase` with `interface`; use a `type` declaration.                                                                |
| No Interface                | [`src/types.ts:9`](../../libs/primitives/src/types.ts#L9)                                                                     | Declares `ContainerConstructBase` with `interface`; use a `type` declaration.                                                       |
| No Interface                | [`src/types.ts:14`](../../libs/primitives/src/types.ts#L14)                                                                   | Declares `Point` with `interface`; use a `type` declaration.                                                                        |
| No Interface                | [`src/types.ts:21`](../../libs/primitives/src/types.ts#L21)                                                                   | Declares `Position` with `interface`; use a `type` declaration.                                                                     |
| No Interface                | [`src/parser/types.ts:33`](../../libs/primitives/src/parser/types.ts#L33)                                                     | Declares `ParserVisitContext` with `interface`; use a `type` declaration.                                                           |
| No Interface                | [`src/point.ts:2`](../../libs/primitives/src/point.ts#L2)                                                                     | Declares `Point` with `interface`; use a `type` declaration.                                                                        |
| No Interface                | [`src/point.ts:9`](../../libs/primitives/src/point.ts#L9)                                                                     | Declares `Position` with `interface`; use a `type` declaration.                                                                     |
| Types Location              | [`src/point.ts:2`](../../libs/primitives/src/point.ts#L2)                                                                     | Exports `Point` from `point.ts`; exported types should be declared in the module's `types.ts`.                                      |
| Types Location              | [`src/point.ts:9`](../../libs/primitives/src/point.ts#L9)                                                                     | Exports `Position` from `point.ts`; exported types should be declared in the module's `types.ts`.                                   |
| Barrel File Imports         | [`src/parser/types.ts:12`](../../libs/primitives/src/parser/types.ts#L12)                                                     | Imports `ConstructBase` directly from `../types` instead of the available module barrel.                                            |
| Barrel File Imports         | [`src/parser/helpers/createParserVisitContext.ts:1`](../../libs/primitives/src/parser/helpers/createParserVisitContext.ts#L1) | Imports root-module types directly from `../../types` instead of the available module barrel.                                       |
| Barrel File Imports         | [`src/parser/helpers/createParserVisitContext.ts:2`](../../libs/primitives/src/parser/helpers/createParserVisitContext.ts#L2) | Imports parser types directly from `../types` instead of the available parser barrel.                                               |
| Barrel File Imports         | [`src/parser/helpers/nodePosition.ts:3`](../../libs/primitives/src/parser/helpers/nodePosition.ts#L3)                         | Imports `Position` directly from `../../point` instead of the canonical shared types exposed by the module barrel.                  |
| No Abbreviations            | [`src/parser/helpers/createParserVisitContext.ts:9`](../../libs/primitives/src/parser/helpers/createParserVisitContext.ts#L9) | Uses the abbreviated local name `ctx`; use a descriptive name such as `context`.                                                    |
| Expand Multi-Level Literals | [`src/parser/helpers/nodePosition.ts:16`](../../libs/primitives/src/parser/helpers/nodePosition.ts#L16)                       | Returned `start` and `end` object literals are kept on single lines despite containing multiple fields; expand their nested fields. |

## Excluded Findings

- Test files were excluded from this audit.
- Closure functions were not treated as violations; the File as Function convention should allow closure functions when they intentionally capture local state and are not reusable outside their enclosing function.
- The All Caps Constants convention was not applied to runtime/configured objects; it should be restricted to module-level literal and regular-expression constants.
