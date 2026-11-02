# Sub-Agent REPORT (#producer)

**Plan:** `canonical-record-field-names`

**Iteration Id:** `handle-collisions-and-reserved-labels`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                                             | Change                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abort index construction on reserved-converting labels           | `createFieldIndex` now throws `TypeError: Field label "{label}" resolves to reserved name "{name}"` when `labelToName` yields a name rejected by `isReservedFieldName` — the single site used by capsule creation and the create/delete/rename rebuilds; slim co-located cases cover the positives, the `__`-label negatives, the empty section, and the hand-inserted-`Name` rebuild edge                              |
| Pin first-wins precedence and promotion from the extraction path | extraction-path rows re-assert precedence (`First`, one `purpose` key, both fields kept in `__section`), delete/rename promotion with the promoted label, the shadowed-removal no-op, and the mutation guards (reserved `get`/`set`/`delete`, canonical miss write appending `nameToLabel`, non-canonical miss write, rename collision leaving document and keys byte-identical) — assertions only, no behaviour change |
| Add the duplicate-name and reserved-label fixtures               | `19-duplicate-field-names` (codec-parsed `**Purpose:**`/`**purpose:**`: extraction reads `First`, name enumerated once, delete promotes `Second`, save keeps `**purpose:**`, reload reads back) and `20-reserved-label-throws` (`**Name:**` aborts extraction with the exact message and no record escapes; read path unaffected)                                                                                       |
| Commit `collisions-and-reserved`                                 | commit `84dadcb` created from `$PROJECT`; policy `NOPUSH` — created locally, **not** pushed                                                                                                                                                                                                                                                                                                                             |

#### Files changed

- `$PACKAGE/src/record/private/createFieldIndex.ts` — reserved-label guard throwing the pinned `TypeError`.
- `$PACKAGE/src/record/private/createFieldIndex.test.ts` — slim cases: three positive label rows, `__section`/`__foo` registration, rebuild-after-hand-insert edge, empty section kept.
- `$PACKAGE/tests/record-helpers/recordReservedLabel.fixtures.ts` — new data-only tables: nine reserved label rows (`Name`/`NAME`/`name`, `Save`/`save`/`SAVE`, `Rename Field`/`RenameField`/`rename field`) and four non-reserved rows (`__section`/`__foo`/`__recordField`/`Section`).
- `$PACKAGE/tests/record-helpers/recordReservedLabel.test.ts` — new suite: positives through `extractTestRecord` (exact message per row), `__`-labels through `createSectionRecord` (no throw, registered name).
- `$PACKAGE/tests/record-helpers/recordFieldPromotion.test.ts` — keys-once and both-fields-held case; promoted-label assertion after delete.
- `$PACKAGE/tests/record-helpers/recordFieldAccess.fixtures.ts` — `extractedAccessDocument` (codec-parseable twin of `accessFields`).
- `$PACKAGE/tests/record-helpers/recordFieldAccess.test.ts` — new `record field access from an extracted record` describe re-asserting the guard cells from an extracted record, reusing the landed tables.
- `$PACKAGE/tests/fixtures/19-duplicate-field-names/` — new `_records/playlist.art` + `integration.test.ts` (4 cases).
- `$PACKAGE/tests/fixtures/20-reserved-label-throws/` — new `_records/artist.art` + `integration.test.ts` (3 cases).

Verification: `npm run lint:fix`, `npm run lint`, `npm run test` (38 files, 515 tests), `npm run build` from `$PACKAGE` — green; `npm run ci` from `$PROJECT` — green (8/8 turbo tasks); the `pre-commit` hook (`npm run clean`, `npm run extract`, `npm run ci`) passed on commit `84dadcb`. Scope checks: `git diff --stat` on `$PACKAGE/src` shows only `createFieldIndex.ts` plus its slim test; fixtures `18-canonical-name-round-trip` and `09-section-depth`, `knowledge/**`, and `$PROJECT/tests/records` are untouched; all fixture labels are letter-led per the codec constraint; dot-notation disables appear only on literal bracket keys; working tree clean apart from this report, which is intentionally uncommitted.
