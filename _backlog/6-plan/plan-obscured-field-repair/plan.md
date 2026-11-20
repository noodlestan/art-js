# Plan: Obscured Field Repair

**ID:** `obscured-field-repair`

**Status:** `DRAFT`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Has Context File:** `FALSE`

**Skill:** `write-plan`

**Purpose:** Let consumers repair obscured fields safely using section snapshots and collection-managed replacement.

**Description:** Replace the unreleased label-addressed surface with a copy-on-write repair flow, a collection apply API, and two section helpers. Specify, implement, test, and document the change in three iterations; no version bump or publish.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$PACKAGE/knowledge/design/fields.md` (Design) — The field contract this plan amends; it owns every field API name.

::READ `$PACKAGE/knowledge/design/records.md` (Design) — The `__section` contract, the Public API, and placement.

---

## Path Variables

This section lists the path variables used throughout the plan file and its downstream work items. All file references in the plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                | Purpose                                          |
| ------------ | ---------------------------- | ------------------------------------------------ |
| `$WORKSPACE` | Current working directory    | Workspace root directory                         |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates      |
| `$SKILLS`    | `$WORKSPACE/.agents/skills`  | Art agent modes and skills                       |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes          |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package                    |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout — codec field pattern, read-only |

## Summary

Specify, implement, and document copy-on-write repair in three iterations. Scope is `$PACKAGE` and its package and consumer tests; Art MD is reference only. No version bump or publish.

## Scope

Changes are confined to one package's source, knowledge, and docs, its in-package test suites, and the external consumer suite; Art MD is read-only reference; no deployment, release artefact, or consumer code is touched.

### (Scope) Package: Records

**Record:** `$PACKAGE/_records/package.art`

**Role:** — Changes required: the spec that owns the API names, then the implementation beside it.

**Partial:**

- `owner` — Project: Art JS
- `path` — `$PACKAGE/`
- `canonicalName` — `@art-js/records`
- `published` — `true`
- `deployment` — NPM Package Deployment: Records

**Changes:**

- `spec-copy-on-write-repair` — update the fields spec, ADR, records design, and knowledge index to define the copy-on-write contract and public surface.
- `implement-copy-on-write-repair` — implement the spec across source, unit/integration tests, consumer fixtures, README, and overview.
- `rewrite-unreleased-changelog` — align the `UNRELEASED` entry with the final surface; no version bump or publish.

### (Scope) Package: Records Tests

**Record:** `$PROJECT/tests/records/_records/package.art`

**Role:** — Third-party consumer of the shipped surface; its fixture must exercise the repair flow through the built package, not only in-package.

**Partial:**

- `owner` — Project: Art JS
- `path` — `$PROJECT/tests/records/`
- `canonicalName` — `@art-js/test-records`
- `published` — `false`

**Changes:**

- Rewrite the consumer fixture to exercise the copy-and-apply repair flow through the built package; see the implementation iteration for the fixture scenario.

## Execution Context

Execution occurs from `$WORKSPACE/`; package work is performed in `$PROJECT` on branch `main`, with source under `$PACKAGE/src`, fixture tables under `$PACKAGE/tests/record-helpers/`, in-package fixtures under `$PACKAGE/tests/fixtures`, and the consumer suite under `$PROJECT/tests/records`. `$ART_MD` is read-only reference for the codec's field pattern. Commits are `NOPUSH`; this plan ships no version bump and no publish.

## Upstream Work

- Plan: Label Repair API – `$PROJECT/_backlog/3-now/plan-label-repair-api/plan.md` — the `DELIVERED` work whose never-released by-label surface and `UNRELEASED` entry this plan reworks.
- Plan: Canonical Record Field Names – `$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md` — origin of the repair follow-ups; reference only, never edited.
- Parking Lot: Art JS – `$PROJECT/_backlog/_parking-lot.md` — project short-term tracker.

## Required Skills

- `write-plan` – `$SKILLS/write-plan/SKILL.md`

## Domains

- Plans – `$DOMAINS/plans/index.md`
- Work – `$DOMAINS/work/index.md`
- Commits – `$DOMAINS/commits/index.md`
- Operations – `$DOMAINS/operations/index.md`
- Packages – `$DOMAINS/packages/index.md`

## Resource Kinds in Scope

- Package – `$DOMAINS/packages/structures/package.art`

## Workflows

- Planning Work – `$DOMAINS/work/workflows/planning-work/workflow.art`
- Executing Work – `$DOMAINS/work/workflows/executing-work/workflow.art`

## Knowledge

- Design: Fields – `$PACKAGE/knowledge/design/fields.md` — the field contract this plan amends; owns all field API names.
- Design: Records – `$PACKAGE/knowledge/design/records.md` — the `__section` contract, the `ArtRecord` public type, and placement.
- ADR: Fields – `$PACKAGE/knowledge/adr/fields.art` — the decisions to amend and record.
- Plan: Label Repair API – `$PROJECT/_backlog/3-now/plan-label-repair-api/plan.md` — the work being reworked.
- Plan: Canonical Record Field Names – `$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md` — origin follow-ups; reference only.
- Guide: Art JS – `$PROJECT/_guide.md` — layout, verification, and commit rules.
- Guide: Records – `$PACKAGE/_guide.md` — package layout and step verification.
- Conventions: TypeScript – `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md`
- Conventions: Unit Tests – `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md`

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                                     | Status  |
| -------------------------------------------------------------------------------------------- | ------- |
| Iteration: Specify Copy-On-Write Repair `./instructions/spec-copy-on-write-repair.md`        | `DONE`  |
| Iteration: Implement Copy-On-Write Repair `./instructions/implement-copy-on-write-repair.md` | `DRAFT` |
| Iteration: Rewrite Unreleased Changelog                                                      | `DRAFT` |

### Iteration: Specify Copy-On-Write Repair

**Id:** `spec-copy-on-write-repair`

**Status:** `DONE`

**Purpose:** Specify the copy-on-write contract before implementation.

**Description:** Updates four knowledge files to specify the repair helpers, snapshot semantics, and collection apply API. No source or test changes.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/spec-copy-on-write-repair.md`

**Changes:**

- Rewrite `$PACKAGE/knowledge/design/fields.md` — this is where every name lands:
  - Replace `## Reading and Writing by Label` with the repair-helpers section: the copy-on-write flow (read a snapshot with `record.__section` → `getObscuredFields(section)` → `renameObscuredField(section, field, newName)` → drop duplicates by editing the copy's `children` directly → `RecordsDocumentCollection.replaceRecordSection(record, section)` → use the returned handle → save → reload); the snapshot is a plain Art AST the caller owns and may edit freely — including removing a duplicate field by splicing `children` — so exactly two helpers exist and deletion needs neither a helper nor the record; `getObscuredFields(section)` returns the actual obscured field objects of that section in document order, a field being obscured when an earlier sibling derives the same `labelToName` key; `renameObscuredField(section, field, newName)` throws unless `field` belongs to `section` and `newName` yields a valid and unique key — canonical, non-reserved, its derived label re-parses under the codec field pattern, and no other field in `section` derives it — then rewrites only the field's stored label; the five `…ByLabel` signatures are gone.
  - Snapshot semantics: every `record.__section` access returns a deep clone of the live section, mutations to it never reach the record, and section-level changes go through `replaceRecordSection`; the apply contract states that the old handle's field surface is dead and the returned handle supersedes it.
  - Public Field API block: drop the five `…ByLabel` signatures; `relabelField` and the shipped `0.2.0` surface stay.
  - Reserved names: fifteen → ten member names and fourteen → nine reachable collision labels; drop the five `…ByLabel` collision labels from the enumerated list and from the extraction-abort set.
  - Status and Scope lines: `relabelField` shipped with `implement-label-repair-api`; the snapshot semantics, the helpers, and the apply API are specified here and land with `implement-copy-on-write-repair`. The rewritten file must describe only the surface that exists: no sentence advertises by-label members, and no sentence narrates their absence — no "removed", "reversed", "was", "never released", "replaced by", no residual example, count note, or footnote mentioning them.
- Amend `$PACKAGE/knowledge/adr/fields.art`, in the file's established format:
  - Add the copy-on-write decision: `__section` is a per-access snapshot; the capsule keeps mutating the live section internally; helpers are pure over the caller's working copy; every apply crosses the collection (validate → content-copy → re-extract), so a future reactive `capsuleFactory` lands at one choke point; the old handle is documented dead.
  - Delete the `Label Repair and By-Label Access` decision outright and absorb anything still true (`relabelField`, the repair helpers, the escape hatch being relabel plus helpers) into the new decision and the amended clauses — the ADR must read as if that decision was never written: no "reversed", no "removed", no "never released", no naming of the five members anywhere in the file.
  - Amend only the overturned clauses of `Canonical Field Names` (the escape hatch is now relabel plus the repair helpers) and `The name → field Index` (no access path scans section fields for a label); every other adopted decision stays byte-identical.
- Update `$PACKAGE/knowledge/design/records.md`:
  - The `ArtRecord` type in `## Public API` loses the five `…ByLabel` signatures; `__section` is documented as a per-access snapshot.
  - `RecordsDocumentCollection` gains `replaceRecordSection(record: ArtRecord, section: SectionBlock): ArtRecord`; the export block gains the `getObscuredFields` and `renameObscuredField` value exports.
  - `### Mutating and Saving Records` stops telling consumers to change section properties through `record.__section` and shows the copy-and-apply flow instead — including removing a duplicate by editing the copy, and an inline content source (the four-method object over a markdown string, as the package's own test helpers already do) so a repair can start from a string without any filesystem adapter; the placement paragraph states that anchors resolve through the collection's private handle→section bridge with the foreign-anchor error unchanged; the Record Model note records the snapshot and the apply choke point.
- Refresh the document purposes in `$PACKAGE/knowledge/index.md` so both field rows mention the copy-on-write repair flow and the two repair helpers.
- Read the work being reworked — `$PROJECT/_backlog/3-now/plan-label-repair-api/plan.md` — and the origin plan's Not In Scope and Follow Ups (`$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md`) for reference only; never edit anything under `_backlog/`.

**Dependencies:**

- None.

#### Commits:

| ID                          | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| --------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `spec-copy-on-write-repair` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `d0cd786` | `COMMITTED` |

##### Commit: `spec-copy-on-write-repair`

**Repository:** Art JS

**Message:**

```text
docs(records): Specify copy-on-write repair and section helpers.

- Turn `__section` into a per-access snapshot and document the repair flow.
- Reverse the by-label members and record the copy-on-write decisions.
```

### Iteration: Implement Copy-On-Write Repair

**Id:** `implement-copy-on-write-repair`

**Status:** `DRAFT`

**Purpose:** Ship the reviewed spec green at every commit across the package and both suites.

**Description:** Implements the reviewed spec across the record proxy, collection, repair helpers, anchor placement, tests, README, and overview.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Snapshot the section at the proxy: `createRecordProxy`'s `getSection` returns `structuredClone(capsule.section)` — a fresh deep clone per access. The capsule keeps mutating the live section internally and stays untouched.
- Add the collection's private handle→section bridge and the apply API in `$PACKAGE/src/records-document/private/createRecordsCollection.ts`:
  - a `WeakMap<ArtRecord, SectionBlock>` populated in `createRecordHandle`, so every `extract()` and `addRecord()` handle is registered;
  - `replaceRecordSection(record, section)`: resolve the live section through the bridge (a miss throws `The record is not part of this document`); validate the incoming `SectionBlock` root, `section.depth === live.depth`, and a non-empty name, rejecting a differing frozen heading with the existing immutable-name error; run `createFieldIndex` over the incoming section so a reserved label throws before any mutation; copy only mutable `tags` and a deep clone of `children` into the live section. Leave frozen `name` and `depth` untouched after validating they match. Never object-swap, so document membership and anchor identity survive; then re-extract the record with a fresh capsule, register the new handle, and return it.
- Reseat anchor resolution on the bridge: `findAnchorLocation` resolves the anchor handle through the bridge instead of reading `anchor.__section` (which now returns a clone); the foreign-anchor error and its exact message stay for handles from other collections, standalone `createRecord()` handles, and removed sections; thread the bridge through `resolveRecordPlacement` and the sibling, append, and prepend resolvers.
- Land the two pure helpers as public exports (implementations beside the field-name helpers, re-exported through `src/api/`): `getObscuredFields(section)` and `renameObscuredField(section, field, newName)` with the spec's gates — membership of `field` in `section`, canonical and non-reserved `newName`, a derived label that re-parses under the codec field pattern, and an unoccupied key — validating before mutating and rewriting only the field's stored label.
- Remove the five `…ByLabel` members end to end: proxy functions and descriptors, capsule members, the `ArtRecord` and `ArtRecordCapsule` type entries, the five `RESERVED_FIELD_NAMES` entries (fifteen → ten), `findSectionFieldByLabel` and its unit test, and every remaining `ByLabel` use — audit with a repository-wide search over `$PACKAGE` and `$PROJECT/tests/records` before the commit.
- Land the tests with the source, green in the same commit:
  - Rewrite `$PACKAGE/tests/fixtures/26-by-label-field-access` as `$PACKAGE/tests/fixtures/26-obscured-field-repair` — the walkthrough case: a document with three same-name fields (`**Field One:** Foo`, `**Field one:** Bar`, `**Field One:** Baz`), extract → copy → `getObscuredFields` → rename the second field to `fieldTwo` → drop the duplicate by editing the copy's `children` → `replaceRecordSection` → save → reload asserting `fieldOne === 'Foo'`, `fieldTwo === 'Bar'`, and `Baz` gone. Rewrite `$PROJECT/tests/records/fixtures/09-label-repair-access` against the same helper flow.
  - Rewrite the `recordFieldByLabel` and `recordFieldRelabel` fixture tables and their tests against the copy-and-apply flow (rename on the working copy, then apply — no drop step required of the tables; relabel composes on the handle returned by the apply); rename `recordFieldByLabel.*` to `recordObscuredRepair.*` — the surface it named is gone.
  - Replace the two contract tests that mutate a live `record.__section` without weakening what they prove, using internal capsule/context seams and no test-only exposure: the reserved-label rebuild case in `$PACKAGE/src/record/private/field-index/createFieldIndex.test.ts` becomes a capsule-seam test — the test owns the section, injects the reserved field into it, and expects `capsule.deleteField` to throw the reserved-label `TypeError` on rebuild; the splice case in `$PACKAGE/tests/record-helpers/recordFieldPromotion.test.ts` splits into a public snapshot-immunity assertion (mutating `record.__section` changes nothing) and a capsule-seam assertion (an external splice over the owned section leaves `capsule.fields` untouched).
  - Add the new coverage: snapshot semantics (fresh clone per access, deep clone, current at access) and the apply API (every validation guard, section-object identity preserved so the record remains a usable anchor after apply, atomic reserved-label rejection leaving the live section untouched, the returned handle reading the applied content, and the documented-dead old handle).
  - Update the reserved-name fixtures and counts (`recordReservedLabel.fixtures.ts` to nine collision labels, `isReservedFieldName.*` to ten names, `recordFieldAccess.fixtures.ts`, the proxy member lists) and audit every `__section` use in both suites: read-only snapshot assertions stay, captures held across an operation re-read the snapshot, and mutations move to the apply flow or a capsule seam.
  - Keep the placement and `addRecord` fixtures green with the bridge — fixtures `12`–`16` and the foreign-anchor cases `14`/`16`.
- Refresh `$PACKAGE/README.md` (drop the by-label sentence and examples, reserved counts ten names and nine collision labels, `__section` snapshot comment) and `$PACKAGE/knowledge/overview.md` (use-case rows and the fixture map for the rewritten fixtures) — both read as if the by-label surface never existed: current surface only, no removal narrative.
- Validate from `$PACKAGE`: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:integration`; then from `$PROJECT`: `npm run ci`. Every iteration commits only green states.

**Dependencies:**

- Iteration: Specify Copy-On-Write Repair.

#### Commits:

| ID                               | Repository / Checkout / Branch   | Policy   | Hash    | Status        |
| -------------------------------- | -------------------------------- | -------- | ------- | ------------- |
| `implement-copy-on-write-repair` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `(TBD)` | `PLACEHOLDER` |

##### Commit: `implement-copy-on-write-repair`

**Repository:** Art JS

**Message:**

```text
build(records): Repair obscured fields on a copy.

- Snapshot `__section` and ship `replaceRecordSection` with the section helpers.
- Drop the five by-label members and reseat anchors on the WeakMap bridge.
- Rewrite the repair fixtures and the live-section contract tests.
```

### Iteration: Rewrite Unreleased Changelog

**Id:** `rewrite-unreleased-changelog`

**Status:** `DRAFT`

**Purpose:** Make the `UNRELEASED` entry tell the truth about the surface that will ship.

**Description:** Rewrites the `UNRELEASED` entry for the final repair surface. No version bump or publish.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Execute the Changes listed above.

Before starting: run `npm ci` from `$WORKSPACE` and from `$PROJECT` (Setting Up).

Validate after the edits — from `$PACKAGE`: `npm run lint`; from `$PROJECT`: `npm run ci`.

After executing: stage exactly `$PACKAGE/CHANGELOG.md` (never `git add -A`), then commit `rewrite-unreleased-changelog` with the blueprint below from `$PROJECT` — the pre-commit hook runs `npm run clean`, `npm run extract`, `npm run ci`; fix any reported failure and retry. Do not push. STOP: no version bump, no publish — the entry stays under `UNRELEASED`.

Inlined instructions carry no separate report file — report the outcome in chat.

**Changes:**

- Rewrite the `## UNRELEASED` section at the top of `$PACKAGE/CHANGELOG.md` (above `## 0.2.0`, keeping the file's `### Added` / `### Changed` house style):
  - **Added — Label Repair:** `relabelField(name, label)` rewrites a stored label in place while keeping the field's name, position, tags, and value; the label must re-parse through the codec and re-derive the field's current name (unchanged — it ships).
  - **Added — Obscured Field Repair:** `getObscuredFields(section)` and `renameObscuredField(section, field, newName)` repair a shadowed field on a working copy, and `RecordsDocumentCollection.replaceRecordSection(record, section)` applies the copy back and returns the handle that supersedes the old one.
  - **Changed — Section Snapshots:** `record.__section` returns a deep clone per access; section changes go through `replaceRecordSection`.
  - **Changed — Reserved Names:** the reserved set holds ten handle-member names (`relabelField` is the only addition over `0.2.0`); labels resolving to them abort extraction (nine reachable collision labels); the `0.2.0` name-addressed surface is unchanged.
- The by-label entry and its five names vanish with the rewrite: the final `## UNRELEASED` section mentions them in no form — no removal note, no "never released" remark, no "no longer" phrasing inside the CHANGELOG itself.
- Keep the entry truthful to the shipped spec (`design/fields.md`, pinned by `spec-copy-on-write-repair`) — no claim beyond what the spec states; no file other than `$PACKAGE/CHANGELOG.md` changes.

**Dependencies:**

- Iteration: Implement Copy-On-Write Repair.

#### Commits:

| ID                             | Repository / Checkout / Branch   | Policy   | Hash    | Status        |
| ------------------------------ | -------------------------------- | -------- | ------- | ------------- |
| `rewrite-unreleased-changelog` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `(TBD)` | `PLACEHOLDER` |

##### Commit: `rewrite-unreleased-changelog`

**Repository:** Art JS

**Message:**

```text
docs(records): Rewrite the UNRELEASED repair entry.

- Record the copy-on-write repair flow and drop the by-label members.
- Note the reserved set: ten names, nine collision labels.
```

---

## Work

### Next

Iteration `spec-copy-on-write-repair` is done. Next: review the apply and stale-handle contracts, then write the implementation instruction. Keep iteration 2 `DRAFT` until that review and instruction are complete.

### Blockers

- None. Iteration 2 remains `DRAFT` pending architecture review and instruction writing.

---

## Operating Instructions

This section lists the operating instructions relevant to this work item.

| Operation              | Source                                                        | Origin | Overrides | Workflow       | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------- | ------ | --------- | -------------- | ------------------------------------------------------------ |
| Writing Commit Message | `$WORKSPACE/knowledge/conventions/writing-commit-message.art` |        |           | Planning Work  | Write standardized message according to context conventions. |
| Setting Up             | `$WORKSPACE/_guide.md`                                        |        |           | Executing Work | Prepare the execution environment.                           |
| Verifying Step         | `$PACKAGE/_guide.md`                                          |        |           | Executing Work | Validate lint, tests and build for a package step.           |
| Verifying Completion   | `$PROJECT/_guide.md`                                          |        |           | Executing Work | Confirm the work item satisfies its intended outcome.        |

::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` — Commit message conventions.

---

## Coordination

### Not In Scope

- **Version bump and publishing** — release ownership stays outside this plan: no `package.json` version change and no publish. The `UNRELEASED` entry is rewritten here (iteration `rewrite-unreleased-changelog`), but moving it under a version heading belongs to the next release plan.
- **`replaceRecordContent(markdown)`** — no markdown-sugar apply member; it is recorded in Follow Ups as thin sugar over `replaceRecordSection`.
- **Runtime enforcement of dead handles** — the old handle's death is a documented contract, not a thrown brand; section-scoped revocation stays a Follow Up.
- **Write-back through `__section`** — mutating a snapshot never reaches the record; no write-through, no dirty tracking, no live-section escape hatch is reintroduced.
- **Renaming `__section` to `section`** — the member keeps its current `__` name; the cosmetic rename is out of this plan.
- **A helper for reserved-key fields** — a hand-built section carrying a label that resolves to a reserved name still fails at re-extraction with the standard abort; `getObscuredFields` returns shadowed fields only.
- **Label-addressed rekey, collision reporting, and label enumeration** — deferred follow-ups stay deferred; enumeration of raw labels remains a `__section` walk over a snapshot.
- **Art MD changes** — the codec's field pattern and constructs are read-only reference; the pre-existing digit-bearing-label gap is not fixed here (`renameObscuredField` gates its own derived labels against the pattern).
- **Editing `_backlog/1-done`** — the origin plan is reference-only; nothing under `_backlog/1-done/` is modified.
- **Consumer migration** — no `$ART_WORKS` changes.
- **The other inherited follow-ups** — collision reporting, acronym-preserving labels, and the Art Works migration stay recorded in `Plan: Canonical Record Field Names`.

### Evidence

- None — planning only; no iteration has been executed.

### Findings

- Extracted sections freeze `name` and `depth` as non-writable; apply must validate they match and leave them unchanged, copying only mutable content.
- Repeated `extract()` calls can create several handles for one live section; the collection bridge must account for handle lifecycle during replacement.
- The field index derives keys from labels; helper renames must keep label/name derivation coupled.
- `$PROJECT/tests/records` resolves the package through `dist`; build `$PACKAGE` before the consumer suite.

### Decisions

- **Copy-on-write:** `record.__section` returns a fresh deep clone; helpers mutate only the supplied section copy.
- **Apply:** the collection resolves handles through a private bridge, validates and copies the repair into the existing live section (preserving anchor identity), then returns a freshly extracted handle.
- **Helpers:** keep exactly `getObscuredFields(section)` and `renameObscuredField(section, field, newName)`; deleting a duplicate is direct editing of the working copy's `children`.
- **Anchors and reactivity:** placement resolves record handles through the collection bridge; all applies pass through the collection as the future reactive mutation seam.
- **History-free knowledge:** rewritten knowledge describes only the current API; planning history stays in this plan, not in specs or user-facing docs.
- **Old handles:** currently documented invalid after apply, not runtime-revoked; enforcement remains a Follow Up.

### Knowledge to Update

- **`$PACKAGE/knowledge/design/fields.md`** — repair contract and public API (iteration 1).
- **`$PACKAGE/knowledge/adr/fields.art`** — copy-on-write decision (iteration 1).
- **`$PACKAGE/knowledge/design/records.md`** — public types, apply API, usage, and placement (iteration 1).
- **`$PACKAGE/knowledge/index.md`** — refreshed document purposes (iteration 1).
- **`$PACKAGE/README.md`** — repair API and reserved names (iteration 2).
- **`$PACKAGE/knowledge/overview.md`** — use cases and fixture map (iteration 2).
- **`$PACKAGE/CHANGELOG.md`** — the rewritten `UNRELEASED` entry (iteration 3).

### Follow Ups

- **`replaceRecordContent(markdown)`** — thin sugar that parses markdown and calls `replaceRecordSection`; not part of this plan.
- **Dead-handle enforcement** — section-scoped revocation or a generation check if a consumer defect ever shows stale-handle use.
- **An in-memory content source** — a public `createContentSource`-style helper that starts from a markdown string, so repair and quick-edit flows stop hand-rolling the four-method object (the recipe inlines one meanwhile; may belong to `$ART_LIB`).
- **Release** — version bump and publish are owned by the next release plan, which inherits the rewritten `UNRELEASED` changelog entry.
- **Inherited follow-ups** — collision reporting, acronym-preserving labels, and the Art Works migration stay in `Plan: Canonical Record Field Names`; the codec's digit-bearing-label gap stays in `Plan: Label Repair API`.

### Feedback

- None — no iteration has been delegated.
