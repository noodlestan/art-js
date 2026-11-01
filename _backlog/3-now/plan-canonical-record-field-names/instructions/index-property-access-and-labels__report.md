# Sub-Agent REPORT (#producer)

**Plan:** `canonical-record-field-names`

**Iteration Id:** `index-property-access-and-labels`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Step | Change                                                                                                                                                                                                                                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1/7  | Added `FieldIndex` (`ReadonlyMap<FieldName, SectionField>`) and `createFieldIndex`; the capsule builds the index once at creation and exposes it as `fields`.                                                                                                                                                                |
| 2/7  | `get`/`set`/`deleteProperty` resolve through the index; `assertFieldName` gates API names reserved-then-canonical; `get`/`set` section helpers take a resolved `SectionField`.                                                                                                                                               |
| 3/7  | Create registers the appended name; value updates keep the loaded label; delete removes by resolved field and rebuilds the index, promoting the first duplicate in document order.                                                                                                                                           |
| 4/7  | `renameField` validates in the fixed order (reserved → not found → canonical → already exists), relabels via `nameToLabel(toName)`, then rebuilds (swap + promotion on the vacated name).                                                                                                                                    |
| 5/7  | `has`, `ownKeys`, `getOwnPropertyDescriptor` read the index through `getExposedFieldNames` (a thin view over `capsule.fields`, reserved names excluded); `listSectionFieldNames` kept raw and off every access path.                                                                                                         |
| 6/7  | Aligned the 11 in-package label-access fixtures, the `09-section-depth` persisted-label assertion (`**Owner:** foo`), and the six `$PROJECT/tests/records` cases (`01`–`06`); created `18-canonical-name-round-trip`; added fixture-driven record-helper suites for the name-class table, promotion, rename, and conversion. |

The single behaviour change landed: label-based access no longer resolves; every trap reads the `name → field` index built at extraction, so reads, writes, membership, and enumeration never scan section fields or convert a label.

#### Files changed

- `$PACKAGE/src/record/private/types.ts` — added `FieldIndex`; exposed `readonly fields` on `ArtRecordCapsule`.
- `$PACKAGE/src/record/private/createFieldIndex.ts` (+ `.test.ts`) — one document-order pass; first occurrence wins; slim co-located tests.
- `$PACKAGE/src/record/private/createRecordCapsule.ts` — builds/rebuilds the index; `getField`/`setField`/`deleteField`/`renameField` now index operations with promotion and the four-step rename validation.
- `$PACKAGE/src/record/private/createRecordProxy.ts` (+ `.test.ts`) — traps gate reserved names, then delegate to the capsule; new co-located guard tests.
- `$PACKAGE/src/record/private/assertFieldName.ts`, `assertNotReservedFieldName.ts` (new) — reserved-first then canonical gate; verbatim `Record field names starting with "__" are reserved` message preserved.
- `$PACKAGE/src/record/private/getSectionField.ts`, `setSectionField.ts`, `deleteSectionField.ts`, `appendSectionField.ts` (new) — resolved-field signatures; append generates the label via `nameToLabel`.
- `$PACKAGE/src/record/private/getExposedFieldNames.ts` (+ `.test.ts`) — thin view over the index; reserved names excluded.
- `$PACKAGE/src/record/private/listSectionFieldNames.ts` (+ new `.test.ts`) — pinned to raw labels.
- `$PACKAGE/src/record/private/findSectionField.ts`, `renameSectionField.ts` — deleted (no remaining callers; no exact-label comparison left on any access path).
- `$PACKAGE/tests/record-helpers/recordFieldAccess|recordFieldPromotion|recordFieldRename|recordLabelConversion.{fixtures,test}.ts` (new) — exhaustive `it.each` tables with `%s` titles over data-only `.fixtures.ts` siblings.
- `$PACKAGE/tests/helpers/records/extractTestRecord.ts`, `createSectionRecord.ts` (+ barrel) — shared harnesses: codec extraction from a markdown document, and hand-built sections for labels the codec cannot parse.
- `$PACKAGE/tests/fixtures/04,05,06,07,08,10,11,12,13,15,17` — label access replaced with canonical names; assertions now check extracted names and label preservation.
- `$PACKAGE/tests/fixtures/09-section-depth/integration.test.ts` — only change: persisted label asserted as `**Owner:** foo`.
- `$PACKAGE/tests/fixtures/18-canonical-name-round-trip/` (new) — `**Canonical Name:**` update survives save with every untouched line byte-identical; reload reads the new value.
- `$PROJECT/tests/records/fixtures/01`–`06/integration.test.ts` — label access replaced with canonical names; `01` inverts the case-sensitivity case, asserts extracted names from `getFieldNames`, and pins that a label-based write throws and appends nothing.

### Verification

- Step verifies: `npm run test:unit` + `npm run test:integration` green from `$PACKAGE` at every step; final `$PACKAGE` suite **35 files / 479 tests passed**; `tests/records` **7 files / 34 tests passed**.
- Verifying Step (`$PACKAGE`): `lint:fix`, `lint` (prettier + eslint + tsc), `test`, `build` — all green.
- Verifying Completion: `npm run ci` from `$PROJECT` — **8/8 tasks successful**; the same CI re-ran inside the `pre-commit` hook (`clean`, `extract`, `ci`) and passed.
- Commit `05a7a88` — `refactor(records): Resolve record fields through a name index.` — created locally, **not pushed** (policy `NOPUSH`; verified with `git log origin/main..HEAD`).

Final Verification checklist:

- Every name-class table cell is pinned per trap in `tests/record-helpers/recordFieldAccess.test.ts` plus `createRecordProxy.test.ts` (see Feedback for the two delete cells that cannot surface as `false`).
- `labelToName` call sites in `$PACKAGE/src/record/private`: only `createFieldIndex.ts` (line 15) — the index build, invoked at capsule creation and by mutation rebuilds (delete promotion, rename, create); all other hits are the converter's own module and tests.
- Label preservation: `18-canonical-name-round-trip` asserts `content` equals the original document with only the `**Canonical Name:**` line substituted — every other byte identical.
- All four promotion scenarios asserted in `recordFieldPromotion.test.ts`, including the promoted `**purpose:**` label surviving a save.
- Rename validation order, byte-identical document/keys on every rejection, and relabel via `nameToLabel(toName)` asserted in `recordFieldRename.test.ts`.
- `$PACKAGE/src/record/createRecord.test.ts` untouched (`git diff --name-only` empty) and its reserved-message assertion passes.
- `03-read-assert-extract` unmodified; `09-section-depth` diff is exactly the one persisted-label assertion.
- No index helper exported from `$PACKAGE/src/index.ts` or `$PACKAGE/src/api/index.ts` (barrels untouched).
- New tests follow the Step 6 layout: data-only `.fixtures.ts`, `it.each` `%s` titles, no mocks or spies.
- Neither forbidden assertion appears (grep for `labelToName(labelToName` and `nameToLabel(labelToName(label)) ===` returns no matches).

## Blockers (if any)

None — outcome is `COMPLETED`.

## Feedback

### For the planner

- The Step 2 name-class table's `delete rec[name] = false` cells (handle row and canonical-miss row) cannot surface as `false` at the call site: a Proxy `deleteProperty` trap returning a falsy result always throws `TypeError: 'deleteProperty' on proxy: trap returned falsish…` unless the property is a non-configurable own property of the target (verified in Node 24). The traps do return `false` exactly as the rules text specifies ("Reflect.has wins first", "on an index miss returns false"), and today's behaviour is unchanged; the tests pin the observable `TypeError` for those two cells. Consider re-wording those cells as "reports not-removed (surfaced as TypeError)" in a later iteration.
- The Art MD codec's field pattern is `/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`: `**3A33:**` and `**Ação:**` never parse as fields from Markdown (they stay paragraphs). Digit-led and non-ASCII conversion coverage therefore uses hand-built sections (`createSectionRecord` helper) — codec documents can only ever carry letter-led labels. Worth stating in the plan's test design so future iterations do not assume those labels round-trip through the codec.
- `getExposedFieldNames` now takes the `FieldIndex` directly (a thin view over the index) rather than the capsule — same intent as Step 5, slightly different seam.
- Mutation rebuilds are implemented as a full `createFieldIndex(section)` pass inside the capsule (create/delete/rename), rather than a targeted delete-then-promote scan; the observable behaviour matches Step 3's rules and additionally keeps enumeration in document order after rename and promotion.

### For the technical writers

- `$PACKAGE/knowledge/design/records.md` still documents the exact-label behaviour this iteration replaced ("A field property such as `record.owner` resolves by exact field name"; `renameField()` "changes the field label in place"). It was listed as reading only, not as a file to modify, so it was left untouched — it should be updated in a follow-up so the design matches the shipped behaviour.

### For the crew

- The external package (`$PROJECT/tests/records`) resolves `@art-js/records` through `dist`: run `npm run build` in `$PACKAGE` before its tests, or stale-dist results will look like regressions.
- Field access on `ArtRecord` must use bracket notation with the `// eslint-disable-next-line dot-notation` comment (TS `noPropertyAccessFromIndexSignature` + eslint `dot-notation`); the disable comment is only needed for literal keys — variable-key access needs none, and unused directives fail lint.
- A concurrent session modified `_backlog/3-now/plan-adopt-codec-construct-api/plan.md` during this run; it was excluded from the commit and remains uncommitted for its owner.
