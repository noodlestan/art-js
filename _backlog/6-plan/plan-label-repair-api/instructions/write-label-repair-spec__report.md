# Sub-Agent REPORT (#producer)

**Plan:** `label-repair-api`

**Iteration Id:** `write-label-repair-spec`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal (instruction)                                                                                                                                                 | Result                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Relabel section in `design/fields.md` — intent, address, three label gates with validation-before-mutation, index-key invariance, shadowed duplicates, composition | Written as `## Relabeling a Field`, placed with the write operations                                            |
| Raw by-label access section — five named twins, exact-label addressing, miss semantics, unchanged value semantics, `0.2.0` coexistence                             | Written as `## Reading and Writing by Label`, the section immediately after the relabel section                 |
| Public Field API block, Reserved names, Status/Scope, no-escape-hatch claims, Field Names / Field and Section Behaviour wording, Decisions pointer                 | 6 signatures added; 15 handle-member names / 14 reachable collision labels; denied claims replaced              |
| Amend `adr/fields.art` — appended decision + exactly the two overturned clauses                                                                                    | `## Decision: Label Repair and By-Label Access` appended; both clauses amended; diff 8 insertions / 2 deletions |
| `records.md` `ArtRecord` public type + pointer wording; `index.md` purposes                                                                                        | 6 members added to `ArtRecord`; both index rows mention label repair and by-label access                        |

#### Files changed

- `$PACKAGE/knowledge/design/fields.md` — added `## Relabeling a Field` and `## Reading and Writing by Label`; extended Status/Purpose/Scope with the specified-here / lands-in-`implement-label-repair-api` claim; Public Field API block carries `relabelField` and the five `…ByLabel` twins; Reserved names grown to fifteen handle-member names with the fourteen reachable collision labels (the original eight plus `Relabel Field`, `Set Field Markdown By Label`, `Set Field Value By Label`, `Get Field Markdown By Label`, `Get Field Text By Label`, `Get Field Value By Label`); replaced the "reachable only by walking `record.__section`" / "no per-name accessor" claims; qualified the index-scan sentence; Field Names, Derived labels, Field and Section Behaviour, and the Decisions pointer cross-reference the new sections.
- `$PACKAGE/knowledge/adr/fields.art` — appended `## Decision: Label Repair and By-Label Access` (`**Status:** Adopted`); amended the `Canonical Field Names` no-escape-hatch clause and the `The name → field Index` scan clause; every other decision byte-identical.
- `$PACKAGE/knowledge/design/records.md` — `ArtRecord` gains `relabelField` plus the five `…ByLabel` members; field-members pointer and `## Field and Section Behaviour` pointer updated.
- `$PACKAGE/knowledge/index.md` — `design/fields.md` and `adr/fields.art` purposes refreshed to mention label repair and by-label access.

Not touched: `knowledge/overview.md`, `README.md`, everything under `_backlog/1-done/`, all `src/`, `tests/`, manifests, lock, changelog, roadmap.

#### Commit

- `f74746f` — `docs(records): Specify label repair and by-label field access.` — policy `NOPUSH`, local only (branch ahead of `origin/main`, never pushed), exactly the four knowledge paths (4 files, +87/−26). Pre-commit hook green: `0-clean` → `1-extract` → `2-ci` (prettier repo-wide + `turbo run ci` 8/8, consumer suite 40 tests).

#### Verification

- Precondition block passed before any file was touched: `## Public Field API` = 1, `no per-name accessor` = 1, `There is no label escape hatch` = 1, `no access path scans section fields` = 1, origin plan present (`origin-ok`).
- Verifying Step from `$PACKAGE`: `npm run lint:fix` then `npm run lint` green (prettier, eslint, `tsc --noEmit`) after every step and at the end.
- Verifying Completion from `$PROJECT`: `npm run ci` green — repo prettier clean, `turbo run ci` 8/8 tasks.
- Final greps: `grep -c "no per-name accessor" $PACKAGE/knowledge/design/fields.md` → `0`; `grep -c "There is no label escape hatch" $PACKAGE/knowledge/adr/fields.art` → `0`; `grep -c "no access path scans section fields" $PACKAGE/knowledge/adr/fields.art` → `0`.
- `git diff -- $PACKAGE/knowledge/adr/fields.art` shows only the appended decision and the two amended passages.
- Content checks: relabel section states intent, address, the three label gates in validation-before-mutation order, index-key invariance (no rekey, no promotion), and shadowed-duplicate behaviour; by-label section names all five twins and states `undefined` for reads / throw for writes / never creates, with the `0.2.0` signatures unchanged; `grep -n "relabel\|by-label" $PACKAGE/knowledge/design/records.md $PACKAGE/knowledge/index.md` finds the updates.
- `git status --short`: nothing under `_backlog/1-done/`; only the four knowledge paths were staged (explicit `git add`, never `git add -A` / `git add .`); `knowledge/overview.md` and `README.md` clean.

#### Note (pre-existing condition, disclosed)

Step 1's `git status --short` was not empty before any edit: `_backlog/6-plan/plan-label-repair-api/plan.md` was already modified by the delegator (uncommitted `PLANNING` → `READY` status flip). That file was prettier-unclean, which failed the repo-wide `npm run ci` and would have failed the pre-commit hook's `2-ci`. Per the instruction's "a hook failure fails the commit; fix the reported failure and retry", `prettier --write` was run on that file only — a table re-alignment; the `READY` content is the delegator's and unchanged. It stays unstaged, is not part of `f74746f`, and is left for the delegator to commit with this report.

## Blockers (if any)

None.
