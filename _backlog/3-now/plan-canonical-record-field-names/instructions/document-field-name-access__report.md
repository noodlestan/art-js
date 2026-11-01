# Sub-Agent REPORT (#producer)

**Plan:** `canonical-record-field-names`

**Iteration Id:** `document-field-name-access`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                           | Outcome                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rewrite the design's access model              | `$PACKAGE/knowledge/design/records.md` gained a **Field Names** section — canonical grammar `/^[a-z][a-zA-Z0-9]*$/` as API-only syntax gate, the two never-conflated guarantees, `labelToName`/`nameToLabel` with worked traces, invariants and directions A/B, reserved names with the exact extraction error, the `name → field` index with promotion and guards, derived labels, codec constraint — cross-referencing each ADR in one line. |
| Extract the three settled decisions as ADRs    | Three new ADRs under `$PACKAGE/knowledge/adr/`, structured after the `cli.art` exemplar (Status `Adopted`, Context, Decision, Consequences); ADR 1 records the `record.Repository` → `record.repository` consumer migration note.                                                                                                                                                                                                              |
| Refresh the overview and README                | `$PACKAGE/knowledge/overview.md` use cases and fixture map rebuilt over `$PACKAGE/tests/fixtures/` (01–20, incl. `18`/`19`/`20`) with canonical-name routes; `$PACKAGE/README.md` gained a Usage section (canonical examples) and the 0.0.x migration note.                                                                                                                                                                                    |
| Commit `document-field-access` (policy NOPUSH) | Commit `1a370b9` created locally on `main` in `$PROJECT`; **not pushed**, per policy.                                                                                                                                                                                                                                                                                                                                                          |

#### Files changed

- `libs/records/knowledge/design/records.md` — added the Field Names section; rewrote "Reserved names" and "Field and Section Behaviour" to field-name addressing; documented `renameField(fromName, toName)` name-to-name; converted every example to canonical names (`record.repository`, `record.canonicalName`).
- `libs/records/knowledge/adr/canonical-field-names.art` — NEW: grammar, guarantees, no label fallback or dual mode, label policy.
- `libs/records/knowledge/adr/field-name-index.art` — NEW: one index at extraction, first-wins, promotion on removal, construction-time reserved abort.
- `libs/records/knowledge/adr/rename-field-by-name.art` — NEW: validation order, relabel via `nameToLabel(toName)`, old spelling forgotten, `fromName` not grammar-gated.
- `libs/records/knowledge/overview.md` — use-case table and fixture map rebuilt over `tests/fixtures/` ids 01–20.
- `libs/records/README.md` — usage example with canonical names plus the migration note (`record.Repository` → `record.repository`, `record['Canonical Name']` → `record.canonicalName`, name-based `renameField`, derived labels).

#### Verification

- `$PACKAGE`: `npm run lint:fix`, `npm run lint` (prettier, eslint, tsc), `npm run test` (515 tests, 38 files), `npm run build` — all green.
- `$PROJECT`: `npm run ci` — green (8/8 turbo tasks); pre-commit hook (`clean`, `extract`, `ci`) passed on commit `1a370b9`.
- `grep -n "exact field name\|exact label" $PACKAGE/knowledge/design/records.md` — no matches.
- Design states the reachable reserved set (`name`, `save`, `renameField`) with `TypeError: Field label "Name" resolves to reserved name "name"` and distinguishes reserved **names** from `__`-prefixed **labels**; three ADRs referenced from the design.
- `git diff -- $PACKAGE/CHANGELOG.md` empty; commit contains no `src/` or `tests/` file.
- Overview fixture map matches `ls $PACKAGE/tests/fixtures/` exactly (01–20); plan Follow Ups still holds the Art Works migration entry, unchanged.

## Blockers (if any)

None.
