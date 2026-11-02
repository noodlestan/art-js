# Sub-Agent REPORT (#producer)

**Plan:** `canonical-record-field-names`

**Iteration Id:** `define-field-name-contract`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                                     | Change                                                                                                  | Evidence                                                                                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Expose the canonical field name grammar as one predicate | Added `FieldName` type and `isCanonicalFieldName` (`/^[a-z][a-zA-Z0-9]*$/`)                             | `npm run test:unit` green — 34 grammar accept/reject cases                                                                                             |
| Generate a field name from a stored label in one pass    | Added `labelToName` — single code-point pass, word class `[\p{L}\p{M}\p{N}]`, `TypeError` when no words | 75 cases — 17 rule-table rows, 5 derived families (boundaries, separators, Unicode, casing), `TypeError` rows, determinism                             |
| Generate a label from a field name in one pass           | Added `nameToLabel` — splits before every uppercase, remainder kept as-is                               | 139 cases — 10 rule-table rows, 8 direction B rows, 121-name exhaustive direction B enumeration                                                        |
| Widen `isReservedFieldName` to cover handle member names | Added `name`, `save`, `renameField` beside the `__` prefix (list also carries `__section`)              | 23 cases — reserved set, non-reserved set, canonical-and-reserved cross-predicate; untouched `createRecord.test.ts` `__private` assertion still passes |
| Commit as prescribed                                     | One commit, `build(records): Add field name helpers.`                                                   | `224deb6` created locally; policy NOPUSH respected — branch is `ahead 1` of `origin/main`, nothing pushed                                              |

No proxy or serialization behaviour changed: the four modules are imported only by their own tests, and no export was added to the barrel files.

#### Files changed

- `$PACKAGE/src/record/private/types.ts` — added `export type FieldName = string;` as the first (dependency-free) type.
- `$PACKAGE/src/record/private/isCanonicalFieldName.ts` — the canonical field name grammar predicate.
- `$PACKAGE/src/record/private/isCanonicalFieldName.fixtures.ts` — 34 accept/reject rows (data only).
- `$PACKAGE/src/record/private/isCanonicalFieldName.test.ts` — `it.each` with `GIVEN name "%s" provided THEN canonical is %s`.
- `$PACKAGE/src/record/private/labelToName.ts` — label → name extractor, one pass, throws `TypeError` on no words.
- `$PACKAGE/src/record/private/labelToName.fixtures.ts` — rule table (17 rows) + 5 derived families + no-word rows (data only).
- `$PACKAGE/src/record/private/labelToName.test.ts` — `it.each` per family with `WHEN label "%s" provided THEN name is "%s"`, plus determinism.
- `$PACKAGE/src/record/private/nameToLabel.ts` — name → label generator, one pass, space-joined.
- `$PACKAGE/src/record/private/nameToLabel.fixtures.ts` — rule table (10 rows) + direction B names (8 rows), data only.
- `$PACKAGE/src/record/private/nameToLabel.test.ts` — rule table, direction B round trips, exhaustive enumeration up to length 5 over `a`/`B`/`1` filtered by `isCanonicalFieldName` (121 names).
- `$PACKAGE/src/record/private/isReservedFieldName.ts` — widened predicate: `__` prefix OR reserved member list.
- `$PACKAGE/src/record/private/isReservedFieldName.fixtures.ts` — reserved, non-reserved, and cross-predicate rows (data only).
- `$PACKAGE/src/record/private/isReservedFieldName.test.ts` — `it.each` per family + `name`/`save`/`renameField` asserted canonical AND reserved.

**Verification:**

- Verifying Step (`$PACKAGE`): `npm run lint:fix`, `npm run lint`, `npm run test`, `npm run build` — all green (records: 273 unit + 109 integration tests).
- Verifying Completion (`$PROJECT`): `npm run ci` green — 8/8 turbo tasks (prettier/eslint/tsc, builds, unit + integration suites).
- Commit hook (`lefthook` `0-clean`, `1-extract`, `2-ci`) green; no `--no-verify` used.
- Failure-title inspection: a deliberately failing row rendered `WHEN label "userID" provided THEN name is "userid"` — the `%s` interpolation requirement holds (the row's expectation was then corrected to the rule-derived `userId`).
- Fixture files contain data only: no imports, no loops, no assertions.
- Forbidden assertions absent: no `labelToName(labelToName(x))`, no `nameToLabel(labelToName(label)) === label`.
- `FieldName` declared in `$PACKAGE/src/record/private/types.ts`; no helper exported from `$PACKAGE/src/index.ts` or `$PACKAGE/src/api/index.ts`.
- Rule table (Step 2) and round-trip table (Step 3) fully asserted; exhaustive direction B enumeration present.
- Each converter contains exactly one `for (const character of …)` pass over its input; no loop re-applies a converter to its own output.

**Step 4 safety reasoning (why the widening stays green):**

`isReservedFieldName` is called only from `assertFieldName` and `getExposedFieldNames`, and both are reached only from the `createRecordProxy` traps. The `get`/`set`/`deleteProperty` traps early-return whenever `Reflect.has(target, property)` is true; the target is `Object.create(null)` with own properties `name`, `__section`, `renameField`, `save` — so no trap can ever deliver those four names to the predicate, and property operations on them keep their existing behaviour. `getExposedFieldNames` feeds only the `has` trap (which returns `true` earlier for target properties), `ownKeys` (which merges and dedups the target's own keys, so `Object.keys` is unchanged), and `getOwnPropertyDescriptor` (which returns the target descriptor first). Excluding `name`/`save`/`renameField` from the exposed-name list therefore changes neither `Object.keys` nor `in`. No contradicting path was found; the existing `__private` throw test passes untouched.

**Deviations (hook-driven, semantics unchanged):**

- `capitalize` was moved above the `return` inside `labelToName`, and `buildExhaustiveNames` above its first use inside the `describe` — `@typescript-eslint/no-use-before-define` rejects the instruction snippet's ordering; the closures and logic are identical.

**Working tree (uncommitted, outside this iteration's commit scope):**

- `$PROJECT/_backlog/3-now/plan-canonical-record-field-names/plan.md` — delegator-owned edit, pre-existing before execution, left untouched.
- `$PACKAGE/knowledge/design/records.md` and `$PACKAGE/src/records-document/types.ts` — the mandated `npm run lint:fix` normalised two pre-existing prettier violations (multi-line union collapsed). Left uncommitted deliberately: the 13-file commit scope forbids staging them, but reverting them would fail the repo-wide `prettier . -c` gate on every future commit.

## Blockers (if any)

None.
