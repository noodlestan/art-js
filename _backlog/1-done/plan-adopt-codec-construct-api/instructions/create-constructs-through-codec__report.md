# Instructions Report: `create-constructs-through-codec`

**Plan:** `adopt-codec-construct-api`  
**Iteration Id:** `create-constructs-through-codec`  
**Commit:** `63d07a5`  
**Status:** COMPLETED  
**Policy:** NOPUSH

## Summary

Replaced the three private construct helpers (`createTextBlock`, `createTextExpression`, `readText`) with codec-driven construction and text extraction. Threaded `ArtCodec` through `RecordHandleContext` and `RecordsCollectionContext` and wired it at all construction sites. Updated tests/helpers to supply a real codec instance. Behaviour preserved; fixtures unchanged.

## Context

- Dependency precondition verified: `@art-md/codec@0.0.5`, `@art-md/primitives@0.0.7` present; `libs/records/package.json` declares them as specified.
- Commit policy: NOPUSH (no push performed).
- Pre-commit hook ran `npm run clean`, `npm run extract`, `npm run ci` across the repo and passed.

## Changes Made

### Modified (12)

- `libs/records/src/record/types.ts` — added `codec: ArtCodec` to `RecordHandleContext`
- `libs/records/src/record/createRecord.ts` — pass `context.codec` to handle context
- `libs/records/src/record/private/createRecordCapsule.ts` — pass `context.codec` to get/set/append
- `libs/records/src/record/private/setSectionField.ts` — use `codec.create<NaturalExpression>('NaturalExpression', {type:'text', value})` and `codec.create<NaturalBlock>('NaturalBlock', {value, children:[]})`
- `libs/records/src/record/private/getSectionField.ts` — use `codec.toText(field)`
- `libs/records/src/record/private/appendSectionField.ts` — use `codec.create<NaturalExpression>`; keep `FieldInline` literal wrapper
- `libs/records/src/records-document/private/types.ts` — added `codec: ArtCodec` to `RecordsCollectionContext`
- `libs/records/src/records-document/createRecordsDocument.ts` — pass `context.codec` to collection context
- `libs/records/src/records-document/private/createRecordsCollection.ts` — pass `context.codec` to record context
- `libs/records/src/record/createRecord.test.ts` — use `createArtCodec()` instance
- `libs/records/src/record/private/createRecordProxy.test.ts` — use `createArtCodec()` instance
- `libs/records/src/record/private/createFieldIndex.test.ts` — use `createArtCodec()` instance
- `libs/records/tests/helpers/records/createSectionRecord.ts` — use `createArtCodec()`; updated doc comment

### Deleted (3)

- `libs/records/src/record/private/createTextBlock.ts`
- `libs/records/src/record/private/createTextExpression.ts`
- `libs/records/src/record/private/readText.ts`

## Verification Evidence

- `libs/records`: `npm run lint` ✓, `npm run test:unit` (9 files, 38 tests) ✓, `npm run test:integration` (29 files, 477 tests) ✓, `npm run build` ✓, `npm run ci` ✓
- `tests/records`: `npm run lint` ✓, `npm run test` (7 files, 34 tests) ✓, `npm run build` ✓, `npm run ci` ✓
- `checkouts/art-js`: `npm run ci` ✓ (all turbo tasks passed)
- `git diff --stat`: 13 files changed, 51 insertions(+), 23 deletions(-) (plus 3 deletions committed)
- `grep -rn "createTextBlock\|createTextExpression\|readText" libs/records/src` → nothing
- `grep -rn "codec: {} as never" libs/records/src libs/records/tests` → nothing
- `git status --short`: clean (except untracked node_modules)
- Fixtures unchanged: no files under `libs/records/tests/fixtures` or `tests/records/fixtures` modified
- Commit: `63d07a5` on `main`, ahead of origin/main by 1 (no push)

## Notes

All call sites verified: `createRecordCapsule` passes `context.codec` to `getSectionField`, `setSectionField`, and `appendSectionField`. Helpers take codec as first parameter. Only `FieldInline` wrapper remains as literal in append path.
