# Report: organise-records-document-private

**Plan:** Adopt Codec Construct API  
**Iteration:** `organise-records-document-private`  
**Agent:** agent-worker  
**Date:** 2026-11-02

## Summary

Regrouped `$PACKAGE/src/records-document/private` into `placement/` and `sections/`, left `createRecordsCollection.ts` and `types.ts` at root. Updated imports across the moved files and adjusted only the in-repo import from outside private (`records-document/createRecordsDocument.ts` unchanged - it still imports from `./private/createRecordsCollection.js` which remains at root). No exports/public API changes.

## Changes

- Created `private/placement/` with: `resolveAppendPlacement.ts`, `resolvePrependPlacement.ts`, `resolveRecordPlacement.ts`, `resolveRootPlacement.ts`, `resolveSiblingPlacement.ts`
- Created `private/sections/` with: `collectSectionBlocks.ts`, `findAnchorLocation.ts`, `findFirstSectionIndex.ts`, `findSectionContainer.ts`, `getSectionDepth.ts`
- Updated import paths for cross-group references (one more `../` when crossing). All imports remain relative with `.js` extensions.
- `private/createRecordsCollection.ts` imports updated to `./placement/resolveRecordPlacement.js` and `./sections/collectSectionBlocks.js`
- Ran `npm run lint:fix` in `$PACKAGE` to satisfy import/order; lint passes.

## Commits

- Commit: `95d3fcd` (NOPUSH) in `$PROJECT` (art-js) on branch `main`
  - Message: "refactor(records): Regroup private document modules.\n\n- Separate the placement strategies from the section lookup helpers."

## Verification

From `$PACKAGE` (`libs/records`):

- `npm run lint` ✓
- `npm run build` ✓
- `npm run test:unit` (38 passed) ✓
- `npm run test:integration` (477 passed) ✓

From `$PROJECT` (art-js):

- `npm run ci` ✓ (pre-commit hook ran clean/extract/ci successfully)

## Notes

- No files touched outside `libs/records/src/records-document/private/` except the staged commit (and `createRecordsDocument.ts` import already pointed to root-level `private/createRecordsCollection` - no change needed).
- No changes to `$PACKAGE/src/record/**`, `$PACKAGE/tests/**`, `$TESTS`, `$PACKAGE/src/index.ts`, or `$PACKAGE/src/api/index.ts`.
- Nothing else staged.
