# Convention Adoption Report: Parser

**Package:** `@art-js/parser`

**Base path:** `$PROJECT/libs/parser/`

**Scope:** Source files only. Test files are excluded.

## Findings

| Convention                | File / line                                                                                         | Issue                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| No Interface              | [`src/config/types.ts:3`](../../libs/parser/src/config/types.ts#L3)                                 | Declares `ParserConfig` with `interface`; use a `type` declaration.                                        |
| No Interface              | [`src/buildDocument/buildDocument.ts:18`](../../libs/parser/src/buildDocument/buildDocument.ts#L18) | Declares `HandleResult` with `interface`; use a `type` declaration.                                        |
| Barrel File Imports       | [`src/buildDocument/buildDocument.ts:14`](../../libs/parser/src/buildDocument/buildDocument.ts#L14) | Imports `ParserConfig` directly from `../config/types` even though `config/index.ts` is the module barrel. |
| No Single Character Names | [`src/buildDocument/buildDocument.ts:99`](../../libs/parser/src/buildDocument/buildDocument.ts#L99) | Uses the single-character callback parameter `n`; use a semantic name such as `node`.                      |

## Excluded or Corrected Findings

- The Constants Location finding was excluded because the upstream convention has been fixed, but the package cannot currently be reinstalled to verify the updated convention source.
- Nested closure functions were not reported as violations. The convention should allow closure functions when they intentionally capture local state and are not reusable outside their enclosing function.
- The module-level `markdownTree` naming finding was not reported. The All Caps Constants convention should be restricted to module-level literal and regular-expression constants.
