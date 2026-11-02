# Report: organise-record-private

**Plan:** `plan-adopt-codec-construct-api`  
**Iteration:** `organise-record-private`  
**Commit:** `27f15c0`  
**Policy:** `NOPUSH`  
**Status:** `DONE`

## Summary

Regrouped `$PACKAGE/src/record/private` into four groups (`field-name/`, `field-index/`, `section-field/`, `capsule/`), left `types.ts` and `constants.ts` at root. Deleted `getSectionField.ts`, `makeSectionDepthReadOnly.ts`, `makeSectionNameReadOnly.ts` and folded call sites into `src/record/private/capsule/createRecordCapsule.ts` (uses `context.codec.toText(field)`, both `makeSectionNameReadOnly` calls replaced by `defineReadOnlyProperty(...)`, imported `defineReadOnlyProperty`). Moved co-located tests with sources; no tests left at private root. Updated imports to cross group boundaries with `../` and `.js` extensions. Updated cross-references in `src/record/wrapSectionAsRecord.ts` and `tests/record-helpers/*`. No exports/public API/`$PACKAGE/src/index.ts`/`$PACKAGE/src/api/index.ts`/`$PACKAGE/tests/**`/`$TESTS` touched outside scope.

## Verification

- `grep -rn "getSectionField|makeSectionDepthReadOnly|makeSectionNameReadOnly" $PACKAGE/src $PACKAGE/tests` → empty
- `$PACKAGE`: `npm run lint` (pass), `npm run build` (pass), `npm run test:unit` (9 files, 38 tests passed), `npm run test:integration` (29 files, 477 tests passed)
- `$PROJECT`: `npm run ci` (pass) via pre-commit hook during commit

## Changes

- Moved 21 files → grouped structure + deleted 3 pass-throughs
- `src/record/wrapSectionAsRecord.ts`: imports point to `./private/capsule/*`
- `tests/record-helpers/*`: imports point to grouped paths

## Commit

`27f15c0 refactor(records): Regroup private record modules.`
