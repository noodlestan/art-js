# Sub-Agent REPORT (#producer)

**Plan:** `label-repair-api`

**Iteration Id:** `implement-label-repair-api`

**Outcome:** `COMPLETED`

## Evidence

### Precondition — shipped spec pinned before any file change

Run from `$PROJECT` at step 1, and re-run after the commit (identical both times):

```bash
git log -1 --format=%h -- libs/records/knowledge/design/fields.md   # f74746f
grep -c "^## Relabeling a Field" libs/records/knowledge/design/fields.md                # 1
grep -c "^## Reading and Writing by Label" libs/records/knowledge/design/fields.md      # 1
grep -c "relabelField(name: string, label: string)" libs/records/knowledge/design/fields.md # 2
grep -c "getFieldValueByLabel" libs/records/knowledge/design/records.md                 # 1
```

All five checks matched the pinned revision — no drift, implementation proceeded from `f74746f`.

### Changes

| Goal (instruction)                                                                                    | Shipped as                                                                                                                                                                                                           | Evidence                                                                                       |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `relabelField(name, label)` with validation-before-mutation gates and index-key invariance            | Signature on `ArtRecord` + `ArtRecordCapsule`; five gates in spec order (reserved → not-found → word character → codec label pattern → re-derivation); only `field.name` written; no index rebuild; proxy descriptor | `recordFieldRelabel.test.ts`, `createRecordCapsule.test.ts`, fixture `25-…`                    |
| Five `…ByLabel` twins behind an exact-label lookup                                                    | `findSectionFieldByLabel` helper (document order, exact `name === label`, non-fields skipped); five capsule methods routed through the existing value paths; five proxy descriptors                                  | `findSectionFieldByLabel.test.ts`, `recordFieldByLabel.test.ts`, `createRecordCapsule.test.ts` |
| Six new handle members added to the reserved set                                                      | `RESERVED_FIELD_NAMES` grows to fifteen entries in the spec's order; fallout (proxy guards, extraction abort) unchanged and re-pinned in the test tables                                                             | `isReservedFieldName.test.ts` (fifteen), `recordReservedLabel.test.ts` (fourteen)              |
| Full test coverage — unit, fixture-table, two in-package fixtures, one external consumer fixture      | Fixture tables `recordFieldRelabel.*` / `recordFieldByLabel.*`, extended reserved/access tables, co-located unit tests, fixtures `25-`, `26-`, external `09-`                                                        | 50 test files / 709 tests green in `$PACKAGE`; 9 files / 47 tests in `$PROJECT/tests/records`  |
| Docs refresh (plan bullet 4): fixture-map rows + field-surface additions and grown reserved-name note | `knowledge/overview.md` gains rows `25-relabel-field-round-trip` and `26-by-label-field-access`; `README.md` gains the relabel/by-label usage lines and the fifteen-names / fourteen-labels note                     | `knowledge/overview.md`, `README.md`                                                           |
| Green at every commit, one `NOPUSH` commit                                                            | Single commit `cc17409` with the prescribed message; pre-commit hook (`clean`, `extract`, `ci`) green; not pushed                                                                                                    | `git log origin/main..HEAD` shows only the pre-existing plan commits plus this one             |

#### Files changed

- `libs/records/src/record/types.ts` — `relabelField` + the five `…ByLabel` signatures on `ArtRecord` (verbatim from the spec).
- `libs/records/src/record/private/types.ts` — the same six members on `ArtRecordCapsule`.
- `libs/records/src/record/private/constants.ts` — `RECORD_FIELD_LABEL_PATTERN` (codec `FIELD_TEXT_PATTERN` minus its colon, `$ART_MD` source commented) and the six reserved names appended (fifteen total, spec order).
- `libs/records/src/record/private/capsule/createRecordCapsule.ts` — `relabelField` gates and in-place `field.name` write; `setFieldByLabel` + the five by-label methods over `findSectionFieldByLabel`.
- `libs/records/src/record/private/capsule/createRecordProxy.ts` — six passthroughs and six `configurable: true`, `value`, non-enumerable descriptors.
- `libs/records/src/record/private/section-field/findSectionFieldByLabel.ts` — new exact-label, first-in-document-order lookup helper.
- `libs/records/src/record/private/section-field/findSectionFieldByLabel.test.ts` — unit coverage: order, exactness, non-field skip, miss.
- `libs/records/src/record/private/capsule/createRecordCapsule.test.ts` — slim unit coverage: house-spelling relabel, gate order + untouched state, by-label hit/miss/never-create, non-canonical label never reaching the name grammar.
- `libs/records/src/record/private/capsule/createRecordProxy.test.ts` — the six descriptors: function on read, configurable, non-enumerable, absent from `Object.keys`, write and delete refused with `TypeError`, `in` true.
- `libs/records/tests/record-helpers/recordFieldRelabel.fixtures.ts` / `.test.ts` — gate table (five gates), success table, index invariance, no-promotion, save/reload, rename-then-relabel composition.
- `libs/records/tests/record-helpers/recordFieldByLabel.fixtures.ts` / `.test.ts` — hit/miss tables, shadowed `Id`/`ID` pair, deep-clone read, miss writes never create, form conversion preserving name/tags/position, container rejection, save/reload.
- `libs/records/tests/record-helpers/isReservedFieldName.fixtures.ts` / `.test.ts` — six names added to the reserved and canonical-reserved tables; fifteen-entry pin.
- `libs/records/tests/record-helpers/recordReservedLabel.fixtures.ts` / `.test.ts` — six collision-label rows; `reachableCollisionLabels` fourteen-entry pin (each resolves to a reserved name and appears in the abort table).
- `libs/records/tests/record-helpers/recordFieldAccess.fixtures.ts` — `deleteHandleCases` and `memberTrueCases` extended with the six members.
- `libs/records/tests/fixtures/25-relabel-field-round-trip/` — record file + scenario: relabel preserving name/position/tags/value/index, persist + reload, rejected relabel leaving the saved file byte-identical.
- `libs/records/tests/fixtures/26-by-label-field-access/` — record file + scenario: `Id`/`ID` pair, by-label read/write/miss semantics, first-wins surviving save → reload.
- `tests/records/fixtures/09-label-repair-access/` — consumer-facing fixture: extract, `relabelField`, all five twins, save, re-read through the FS adapter (runs against `dist`).
- `libs/records/knowledge/overview.md` — fixture-map rows for `25-` and `26-`.
- `libs/records/README.md` — relabel/by-label usage lines and the grown reserved-name note (fifteen names, fourteen reachable collision labels).

No other file changed: the four contract knowledge files, `CHANGELOG.md`, manifests, and `_backlog/1-done/` are untouched.

### Commits

| ID                           | Repository | Policy   | Hash      | Status                  |
| ---------------------------- | ---------- | -------- | --------- | ----------------------- |
| `implement-label-repair-api` | `$PROJECT` | `NOPUSH` | `cc17409` | `COMMITTED`, not pushed |

- Message: `build(records): Add label repair and by-label field access.` with the two prescribed bullets; 26 files, staged file-by-file from `git status --short` (no `git add -A`, no `git add .`).
- The single iteration commit was amended in place once to add the spec's _composition_ assertion (rename → relabel) before finalising — still exactly one commit for the iteration.
- The pre-commit hook ran `npm run clean`, `npm run extract`, `npm run ci` green both times; no `--no-verify`.
- No push, no `npm version`, no `npm publish`.

### Verification

- **Setting Up:** `npm ci` from `$WORKSPACE` and from `$PROJECT`; `package-lock.json` unchanged (no dependency change).
- **Verifying Step (`$PACKAGE`):** `lint:fix` (clean), `lint` (prettier + eslint + tsc green), `build`, `test:unit` → 13 files / 100 tests, `test:integration` → 37 files / 609 tests — all green.
- **Verifying Completion (`$PROJECT`):** `npm run ci` → prettier clean, `turbo run ci` 8/8 tasks green (re-confirmed by the pre-commit hook on the committed tree).
- **Coverage gate:** statements 96.58%, branches 92.43%, functions 98.16%, lines 96.56% — above lines 90 / functions 90 / branches 70 / statements 90.
- **External suite:** fresh `$PACKAGE` build, then `$PROJECT/tests/records` → 9 files / 47 tests green, including `09-label-repair-access`.
- **Staging guard:** commit contains only `$PACKAGE/src/**`, `$PACKAGE/tests/**`, `$PROJECT/tests/records/**`, plus `$PACKAGE/knowledge/overview.md` and `$PACKAGE/README.md`; a forbidden-path grep over the commit returns nothing.
- **Spec never moved:** post-commit `git log -1 --format=%h -- libs/records/knowledge/design/fields.md` → `f74746f`; precondition greps still `1 / 1 / 2 / 1`.
- **Instruction verify lines:** `grep -c "ByLabel" $PACKAGE/src/record/types.ts` → `5`; `RESERVED_FIELD_NAMES` → 15 entries; reachable collision labels → 14, each aborting with `TypeError: Field label "{label}" resolves to reserved name "{name}"`.
- **Working tree:** `git status --short` clean in `$PROJECT` and `$WORKSPACE` before rendering this report; this report is left unstaged for the delegator.

### Spec bullet → test mapping

| Spec bullet (`design/fields.md`, `f74746f`)                                                             | Test(s)                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Relabel — **Address** (index lookup, first-wins holder, shadowed not addressable)                       | `recordFieldRelabel.test.ts` no-promotion test; `createRecordCapsule.test.ts` house-spelling relabel                                                                            |
| Relabel — **Validation before mutation**, the five gates in order                                       | `recordFieldRelabel.test.ts` `relabelRejectionCases` (snapshot equality); `createRecordCapsule.test.ts` gate-order test (reserved before absent, word-character before pattern) |
| Relabel — a rejected relabel leaves document and index untouched                                        | `recordFieldRelabel.test.ts` rejection table; fixture `25-relabel-field-round-trip` byte-identical saved file                                                                   |
| Relabel — **Index effect**: only `field.name` changes; position, tags, value, keys untouched            | `recordFieldRelabel.test.ts` "only the stored label changes"; fixture `25-…` name/position/tags/value/index assertion                                                           |
| Relabel — **No grammar, no reservation on labels**                                                      | `recordFieldRelabel.test.ts` success table (`PURPOSE`, `Canonical name` pass despite failing the name grammar); reserved-name rejection row                                     |
| Relabel — **Shadowed duplicates** never promoted, keep their own label                                  | `recordFieldRelabel.test.ts` no-promotion test (`PURPOSE` holder + `purpose` shadow both retained)                                                                              |
| Relabel — **Composition** with `renameField`                                                            | `recordFieldRelabel.test.ts` "renaming and then relabelling" persists `**Brand new:**` through save/reload                                                                      |
| By-label — **Addressing**: exact stored label, document order, first match, no conversion/index         | `findSectionFieldByLabel.test.ts` (order, exactness, non-field skip, miss); `recordFieldByLabel.test.ts` shadowed-pair read                                                     |
| By-label — **Reads**: same as the name-addressed twins, `undefined` on a miss, value stays a deep clone | `recordFieldByLabel.test.ts` hit table, miss table, clone-isolation test; fixture `26-by-label-field-access`                                                                    |
| By-label — **Writes**: throw on a miss, never create, label never changed by a value write              | `recordFieldByLabel.test.ts` miss-write table (children + keys unchanged), label-preserved assertions; `createRecordCapsule.test.ts` miss test                                  |
| By-label — **Value semantics unchanged**: parse, automatic form, container rejection, form conversion   | `recordFieldByLabel.test.ts` block-conversion (name/tags/position), container `TypeError`, construct write, save/reload test                                                    |
| By-label — **Coexistence with the `0.2.0` surface** (signatures and proxy routes untouched)             | entire pre-existing suite green unchanged (`recordFieldRename`, `recordFieldAccess`, `recordFieldPromotion`, …)                                                                 |
| Reserved names — **fifteen member names**, fourteen reachable collision labels, exact abort message     | `isReservedFieldName.test.ts` fifteen-pin; `recordReservedLabel.test.ts` fourteen-pin + abort rows; `recordFieldAccess.fixtures.ts` extended guard tables                       |

## Blockers (if any)

None.

## Notes

- `knowledge/overview.md` uses `UNRELEASED` in the fixture-map Target column: this plan ships no version bump, and the changelog iteration owns the release wording.
- Proxy read of the six new members returns the member function (exactly like `renameField`); a same-named field can never occupy them, and write and delete are refused with a `TypeError` — all three behaviours asserted for each of the six in `createRecordProxy.test.ts`.
- `RECORD_FIELD_LABEL_PATTERN` is `/^[A-Za-z](?:[A-Za-z ]*[A-Za-z])?$/`: the codec pattern minus its colon, with the spec's "no leading or trailing whitespace" made explicit (a plain `/^[A-Za-z][A-Za-z ]*$/` would still admit a trailing space, which the gate list rejects).
