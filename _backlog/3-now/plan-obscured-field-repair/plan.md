# Plan: Obscured Field Repair

**ID:** `obscured-field-repair`

**Status:** `READY`

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
- `implement-copy-on-write-repair` — implement the spec across source, unit/integration tests, consumer fixtures, and README.
- `finalize-repair-knowledge` — synchronize package knowledge with the implemented surface and rewrite the `UNRELEASED` entry; no version bump or publish.

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
- ADR: Records – `$PACKAGE/knowledge/adr/records.art` — collection, handle, and anchor decisions to review.
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
| Iteration: Implement Copy-On-Write Repair `./instructions/implement-copy-on-write-repair.md` | `READY` |
| Iteration: Finalize Repair Knowledge and Changelog                                           | `DRAFT` |

### Iteration: Specify Copy-On-Write Repair

**Id:** `spec-copy-on-write-repair`

**Status:** `DONE`

**Purpose:** Specify the copy-on-write contract before implementation.

**Description:** Updates four knowledge files to specify the repair helpers, snapshot semantics, and collection apply API. No source or test changes.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/spec-copy-on-write-repair.md`

**Changes:**

- Rewrite `$PACKAGE/knowledge/design/fields.md` — this is where every name lands:
  - Replace `## Reading and Writing by Label` with the repair-helpers section: use the `record.__section` snapshot, inspect with `getObscuredFields`, rename with `renameObscuredField`, optionally edit `children`, apply through `replaceRecordSection`, then use the returned handle. The snapshot is caller-owned; deletion needs no helper. `renameObscuredField` requires a section member that is obscured, otherwise throws `TypeError('Field is not obscured; use record.renameField instead')`; it validates the new name before changing the supplied copy.
  - Snapshot semantics: every `record.__section` access returns a deep clone of the live section, mutations to it never reach the record, and section-level changes go through `replaceRecordSection`; the apply contract states that the old handle's field surface is dead and the returned handle supersedes it.
  - Public Field API block: drop the five `…ByLabel` signatures; `relabelField` and the shipped `0.2.0` surface stay.
  - Reserved names: fifteen → ten member names and fourteen → nine reachable collision labels; remove the obsolete collision labels from the enumeration and extraction-abort set.
  - Status and Scope lines: `relabelField` shipped with `implement-label-repair-api`; the snapshot semantics, the helpers, and the apply API are specified here and land with `implement-copy-on-write-repair`. The rewritten file must describe only the surface that exists: no sentence advertises by-label members, and no sentence narrates their absence — no "removed", "reversed", "was", "never released", "replaced by", no residual example, count note, or footnote mentioning them.
- Amend `$PACKAGE/knowledge/adr/fields.art`, in the file's established format:
  - Add the copy-on-write decision: `__section` is a per-access snapshot; the capsule mutates the live section internally; standalone helpers operate on the caller's copy; apply returns a fresh handle and retires the old one.
  - Delete the `Label Repair and By-Label Access` decision outright and absorb anything still true (`relabelField`, the repair helpers, the escape hatch being relabel plus helpers) into the new decision and the amended clauses — the ADR must read as if that decision was never written: no "reversed", no "removed", no "never released", no naming of the five members anywhere in the file.
  - Amend only the overturned clauses of `Canonical Field Names` (the escape hatch is now relabel plus the repair helpers) and `The name → field Index` (no access path scans section fields for a label); every other adopted decision stays byte-identical.
- Update `$PACKAGE/knowledge/design/records.md`:
  - The `ArtRecord` type in `## Public API` loses the five `…ByLabel` signatures; `__section` is documented as a per-access snapshot.
  - `RecordsDocumentCollection` gains `replaceRecordSection(record: ArtRecord, section: SectionBlock): ArtRecord`; the export block gains the `getObscuredFields` and `renameObscuredField` value exports.
  - `### Mutating and Saving Records` stops telling consumers to change section properties through `record.__section` and shows the copy-and-apply flow instead — including removing a duplicate by editing the copy, and an inline content source (the four-method object over a markdown string, as the package's own test helpers already do) so a repair can start from a string without any filesystem adapter; the placement paragraph states that anchors resolve through the collection's private handle→section bridge with the foreign-anchor error unchanged; the Record Model note records the snapshot and the apply choke point.
- Refresh the document purposes in `$PACKAGE/knowledge/index.md` so both field rows mention the copy-on-write repair flow and the two repair helpers.

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

**Status:** `READY`

**Purpose:** Implement and verify the copy-on-write API, shared section-generation lifecycle, and stale-handle contract across the package and both suites.

**Description:** Implements the reviewed spec across the record proxy, collection, repair helpers, anchor placement, tests, and README, retiring superseded handles by rotating a shared per-section generation token. Knowledge documents are finalized in iteration 3.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-copy-on-write-repair.md`

**Changes:**

- Snapshot the section at the proxy: `createRecordProxy`'s `getSection` returns `structuredClone(capsule.section)` — a fresh deep clone per access. The capsule keeps mutating the live section internally and stays untouched.
- Add the collection's private handle→section bridge and the apply API in `$PACKAGE/src/records-document/private/createRecordsCollection.ts`:
  - Track handles with a `WeakMap<ArtRecord, HandleEntry>` containing the live section and the handle's generation token, plus a `WeakMap<SectionBlock, GenerationToken>` holding the current token for each live section. `createRecordHandle` obtains the current token, so handles from repeated `extract()` calls share it; handles from `addRecord()` use the same registration path. A centralized guard considers a handle current only when its captured token matches the section's current token.
  - `replaceRecordSection(record, section)`: require a current handle owned by the collection; validate a `SectionBlock` root, require `section.name` and `section.depth` to match the live section, and preserve empty names for unsaved `addRecord()` handles. Run `createFieldIndex` and stage cloned mutable `tags`/`children` before mutation. Reserved-label and clone failures leave the live section untouched. Do not replace the section object or assign its `name` or `depth`. On success, rotate the section token, re-extract, and return the new handle; older handles for that section become stale.
- Enforce handle retirement centrally. Pass a lifecycle guard/token into `createRecordProxy`; its single guard must protect property getters/setters (including `name` and `__section`), all proxy traps for dynamic field access and reflection/enumeration, and wrappers around every exposed capsule method, including `save()`. For collection handles, the guard compares the handle's captured generation token with the current token for its live section. For standalone `createRecord()` handles, supply a private always-active token (or equivalent always-active guard) that is never registered with a collection or rotated, so standalone reads, writes, and saves keep working. Method wrappers check lifecycle when invoked, not only when retrieved, so a captured method reference also throws after collection replacement. Collection operations that accept handles check the collection's handle entry before use: an unregistered standalone handle is foreign and `replaceRecordSection` throws `The record is not part of this document`; anchor placement preserves `The placement anchor is not part of this document`. Collection-wide operations that do not consume a handle remain unaffected.
- Reseat anchor resolution on the bridge: `findAnchorLocation` resolves the anchor handle through the bridge instead of reading `anchor.__section` (which now returns a clone); it throws the superseded-handle error for a retired same-collection handle, and preserves the existing foreign-anchor error and exact message for foreign collections, standalone `createRecord()` handles, and removed sections; thread the bridge through `resolveRecordPlacement` and the sibling, append, and prepend resolvers.
- Land the two standalone helpers as public exports: `getObscuredFields(section)` and `renameObscuredField(section, field, newName)`. `getObscuredFields` returns actual obscured field objects in document order. `renameObscuredField` first requires membership by identity; a member field that is not obscured throws `TypeError('Field is not obscured; use record.renameField instead')`. Before mutation, require a canonical, non-reserved `newName`, require `nameToLabel(newName)` to parse under the codec field-label pattern, and require no other field in the section to derive that key. On success, change only the stored label; rejected operations leave the working copy unchanged.
- Remove the five `…ByLabel` members end to end: proxy functions and descriptors, capsule members, the `ArtRecord` and `ArtRecordCapsule` type entries, the five `RESERVED_FIELD_NAMES` entries (fifteen → ten), `findSectionFieldByLabel` and its unit test, and every remaining `ByLabel` use — audit with a repository-wide search over `$PACKAGE` and `$PROJECT/tests/records` before the commit.
- Keep the public API boundary explicit throughout implementation and docs: remove `setFieldMarkdownByLabel`, `setFieldValueByLabel`, `getFieldMarkdownByLabel`, `getFieldTextByLabel`, and `getFieldValueByLabel` from `ArtRecord`, its capsule/proxy, and the reserved-name set; keep `relabelField` on `ArtRecord`; export exactly `getObscuredFields(section)` and `renameObscuredField(section, field, newName)` as standalone `@art-js/records` helpers; add `replaceRecordSection(record, section)` to `RecordsDocumentCollection`.
- Land the tests with the source, green in the same commit:
  - Rewrite `$PACKAGE/tests/fixtures/26-by-label-field-access` as `$PACKAGE/tests/fixtures/26-obscured-field-repair` — the walkthrough case: a document with three same-name fields (`**Field One:** Foo`, `**Field one:** Bar`, `**Field One:** Baz`), extract → copy → `getObscuredFields` → rename the second field to `fieldTwo` → drop the duplicate by editing the copy's `children` → `replaceRecordSection` → save → reload asserting `fieldOne === 'Foo'`, `fieldTwo === 'Bar'`, and `Baz` gone. Rewrite `$PROJECT/tests/records/fixtures/09-label-repair-access` against the same helper flow.
  - Rewrite the `recordFieldByLabel` and `recordFieldRelabel` fixture tables and their tests against the copy-and-apply flow (rename on the working copy, then apply — no drop step required of the tables; relabel composes on the handle returned by the apply); rename `recordFieldByLabel.*` to `recordObscuredRepair.*` — the surface it named is gone.
  - Replace the two contract tests that mutate a live `record.__section` without weakening what they prove, using internal capsule/context seams and no test-only exposure: the reserved-label rebuild case in `$PACKAGE/src/record/private/field-index/createFieldIndex.test.ts` becomes a capsule-seam test — the test owns the section, injects the reserved field into it, and expects `capsule.deleteField` to throw the reserved-label `TypeError` on rebuild; the splice case in `$PACKAGE/tests/record-helpers/recordFieldPromotion.test.ts` splits into a public snapshot-immunity assertion (mutating `record.__section` changes nothing) and a capsule-seam assertion (an external splice over the owned section leaves `capsule.fields` untouched).
  - Add coverage for snapshot semantics (fresh clone per access, deep clone, current at access) and apply (current collection-owned handle, matching name/depth, reserved-label rejection, staged-copy atomicity, preserved section identity, applied content on the returned handle, save/reload, and non-obscured helper rejection with `TypeError('Field is not obscured; use record.renameField instead')`). Verify repeated `extract()` handles share a token; an `addRecord()` handle and later extracted handles share a token; replacement invalidates all of them. Verify stale property access, enumeration, method calls, `save()`, replacement, and anchor placement throw the specified error, including a method captured before replacement. Verify standalone `createRecord()` handles remain usable for reads, writes, and saves, but are rejected by collection replacement and placement with the existing foreign-handle errors.
  - Update the reserved-name fixtures and counts (`recordReservedLabel.fixtures.ts` to nine collision labels, `isReservedFieldName.*` to ten names, `recordFieldAccess.fixtures.ts`, the proxy member lists) and audit every `__section` use in both suites: read-only snapshot assertions stay, captures held across an operation re-read the snapshot, and mutations move to the apply flow or a capsule seam.
  - Keep the placement and `addRecord` fixtures green with the bridge — fixtures `12`–`16` and the foreign-anchor cases `14`/`16`.
- Refresh `$PACKAGE/README.md` with current API examples, reserved counts, and the snapshot contract. All `$PACKAGE/knowledge/**` updates, including the final overview and stale-handle/design reconciliation, belong to iteration 3.
- Validate from `$PACKAGE`: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:integration`; then from `$PROJECT`: `npm run ci`. Every iteration commits only green states.

**Dependencies:**

- Iteration: Specify Copy-On-Write Repair.

#### Commits:

| ID                               | Repository / Checkout / Branch   | Policy   | Hash    | Status     |
| -------------------------------- | -------------------------------- | -------- | ------- | ---------- |
| `implement-copy-on-write-repair` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `(TBD)` | `AUTHORED` |

##### Commit: `implement-copy-on-write-repair`

**Repository:** Art JS

**Message:**

```text
build(records): Repair obscured fields on a copy.

- Snapshot `__section` and ship `replaceRecordSection` with the section helpers.
- Drop the five by-label members and reseat anchors on the WeakMap bridge.
- Rewrite the repair fixtures and the live-section contract tests.
```

### Iteration: Finalize Repair Knowledge and Changelog

**Id:** `finalize-repair-knowledge`

**Status:** `DRAFT`

**Purpose:** Synchronize all package knowledge with the implemented repair contract and make the `UNRELEASED` entry accurate.

**Description:** Perform the final post-implementation reconciliation of package knowledge and rewrite the `UNRELEASED` entry. Iteration 1 remains the completed initial specification commit; this iteration owns all remaining and final knowledge changes. Knowledge documents describe the current surface positively, without history of the superseded by-label API. No version bump or publish.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Execute the Changes listed above.

Before starting: run `npm ci` from `$WORKSPACE` and from `$PROJECT` (Setting Up).

Validate after the edits — from `$PACKAGE`: `npm run lint`; from `$PROJECT`: `npm run ci`.

After executing: stage exactly the knowledge and changelog files named in this iteration (never `git add -A`), then commit `finalize-repair-knowledge` with the blueprint below from `$PROJECT` — the pre-commit hook runs `npm run clean`, `npm run extract`, `npm run ci`; fix any reported failure and retry. Do not push. STOP: no version bump, no publish — the entry stays under `UNRELEASED`.

Inlined instructions carry no separate report file — report the outcome in chat.

**Changes:**

- Finalize the package knowledge files against the implemented behavior:
  - Rewrite `$PACKAGE/knowledge/design/fields.md` and `$PACKAGE/knowledge/design/records.md` to positively specify the complete current API, snapshot/apply behavior, shared generation tokens, standalone always-active handles, collection foreign-handle errors, and validation contracts.
  - Review `$PACKAGE/knowledge/adr/fields.art`, `$PACKAGE/knowledge/adr/records.art`, and any other package ADRs relevant to fields, records, collection lifecycle, or anchors. For each relevant decision, determine whether it should be retained, rewritten, eliminated, or added. Eliminate the obsolete by-label decision; rewrite decisions whose contracts changed; add an adopted decision only where no existing ADR is the correct home. Keep unrelated adopted decisions unchanged.
  - Record the ADR disposition (resource, retain/rewrite/eliminate/add, and rationale) in the completion report; update the knowledge index for every changed or added ADR.
  - Refresh `$PACKAGE/knowledge/index.md` and `$PACKAGE/knowledge/overview.md` to match the finalized docs and fixture map.
  - Audit the package knowledge files indexed by `$PACKAGE/knowledge/index.md` for references to the superseded API and its history. Rewrite any relevant occurrence as a positive description of the current behavior. Knowledge files must not name the superseded methods, narrate their removal or absence, compare the current API against them, say that only a particular set of methods exists, or preserve historical commentary about that surface.
  - Rename the repair ADR decision to `Repair by content-copying the section through the collection` if that title remains in the selected ADR.
- Rewrite the `## UNRELEASED` section at the top of `$PACKAGE/CHANGELOG.md` (above `## 0.2.0`, keeping the file's `### Added` / `### Changed` house style):
  - **Added — Label Repair:** `relabelField(name, label)` rewrites a stored label in place while keeping the field's name, position, tags, and value; the label must re-parse through the codec and re-derive the field's current name (unchanged — it ships).
  - **Added — Obscured Field Repair:** `getObscuredFields(section)` and `renameObscuredField(section, field, newName)` repair a shadowed field on a working copy, and `RecordsDocumentCollection.replaceRecordSection(record, section)` applies the copy back and returns the handle that supersedes the old one.
  - **Changed — Section Snapshots:** `record.__section` returns a deep clone per access; section changes go through `replaceRecordSection`.
  - **Changed — Reserved Names:** the reserved set holds ten handle-member names (`relabelField` is the only addition over `0.2.0`); labels resolving to them abort extraction (nine reachable collision labels); the `0.2.0` name-addressed surface is unchanged.
- Replace the entire `UNRELEASED` section with the current entries above. Do not retain the stale by-label announcement or add a removal/history note.
- Keep the entry truthful to the finalized knowledge and implemented surface — no claim beyond what the package now supports; do not add a version heading or publish.

**Dependencies:**

- Iteration: Implement Copy-On-Write Repair.

#### Commits:

| ID                          | Repository / Checkout / Branch   | Policy   | Hash    | Status     |
| --------------------------- | -------------------------------- | -------- | ------- | ---------- |
| `finalize-repair-knowledge` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `(TBD)` | `AUTHORED` |

##### Commit: `finalize-repair-knowledge`

**Repository:** Art JS

**Message:**

```text
docs(records): Finalize repair knowledge and unreleased entry.

- Align design and ADR decisions with the implemented repair lifecycle.
- Rewrite the UNRELEASED entry and refresh the knowledge index.
```

---

## Work

### Next

Iteration `spec-copy-on-write-repair` is done. The implementation instruction is ready; next execute iteration 2. `finalize-repair-knowledge` remains `DRAFT` and depends on implementation.

### Blockers

- None. Iteration 2 is `READY`; `finalize-repair-knowledge` remains `DRAFT` pending implementation.

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

- **Version bump and publishing** — release ownership stays outside this plan: no `package.json` version change and no publish. The `UNRELEASED` entry is rewritten here (iteration `finalize-repair-knowledge`), but moving it under a version heading belongs to the next release plan.
- **`replaceRecordContent(markdown)`** — no markdown-sugar apply member; it is recorded in Follow Ups as thin sugar over `replaceRecordSection`.
- **Write-back through `__section`** — mutating a snapshot never reaches the record; no write-through, no dirty tracking, no live-section escape hatch is reintroduced.
- **Renaming `__section` to `section`** — the member keeps its current `__` name; the cosmetic rename is out of this plan.
- **A helper for reserved-key fields** — a hand-built section carrying a label that resolves to a reserved name still fails at re-extraction with the standard abort; `getObscuredFields` returns shadowed fields only.
- **Label-addressed rekey, collision reporting, and label enumeration** — deferred follow-ups stay deferred; enumeration of raw labels remains a `__section` walk over a snapshot.
- **Art MD changes** — the codec's field pattern and constructs are read-only reference; the pre-existing digit-bearing-label gap is not fixed here (`renameObscuredField` gates its own derived labels against the pattern).
- **Consumer migration** — no `$ART_WORKS` changes.
- **Other follow-ups** — collision reporting, acronym-preserving labels, and the Art Works migration remain out of scope.

### Evidence

- Iteration `spec-copy-on-write-repair` completed and was committed as `d0cd786`; iterations 2 and 3 have not been executed.

### Findings

- Extracted sections freeze `name` and `depth` as non-writable; apply must validate they match and leave them unchanged, copying only mutable content.
- Five by-label methods exist in the current source and are announced only under `UNRELEASED`; published `0.2.0` did not include them.
- Repeated `extract()` calls can create several handles for one live section; replacement must retire every associated handle, including references to methods captured before retirement.
- The field index derives keys from labels; helper renames must keep label/name derivation coupled.
- `$PROJECT/tests/records` resolves the package through `dist`; build `$PACKAGE` before the consumer suite.

### Decisions

- **Copy-on-write:** `record.__section` returns a fresh deep clone; helpers mutate only the supplied section copy.
- **Apply:** the collection resolves handles through a private bridge, validates and copies the repair into the existing live section (preserving anchor identity), then returns a freshly extracted handle.
- **Helpers:** keep exactly two standalone helpers; `renameObscuredField` accepts only an obscured field; deleting a duplicate edits the working copy's `children`.
- **Anchors and reactivity:** placement resolves record handles through the collection bridge; all applies pass through the collection as the future reactive mutation seam.
- **History-free knowledge:** rewritten knowledge describes only the current API; planning history stays in this plan, not in specs or user-facing docs.
- **Old handles:** the collection retires all handles for the replaced section; a centralized proxy/collection lifecycle guard throws the documented superseded-handle error on any later handle use, including captured method calls and anchor use.
- **Standalone handles:** `createRecord()` receives a private always-active lifecycle token so its normal record operations remain usable; it has no collection handle entry, so every collection that receives it rejects it as foreign.

### Knowledge to Update

- **`$PACKAGE/knowledge/design/fields.md`** — initial copy-on-write spec (iteration 1, completed); final positive API, helper, apply, and lifecycle contract (iteration 3).
- **`$PACKAGE/knowledge/design/records.md`** — initial public API and usage spec (iteration 1, completed); final collection, apply, anchor, and lifecycle contract (iteration 3).
- **`$PACKAGE/knowledge/adr/fields.art`** — initial copy-on-write decision (iteration 1, completed); final field/repair decision audit (iteration 3).
- **`$PACKAGE/knowledge/adr/records.art`** — final collection, handle lifecycle, and anchor decision audit (iteration 3).
- **`$PACKAGE/knowledge/index.md`** — final knowledge descriptions (iteration 3).
- **`$PACKAGE/README.md`** — repair API and reserved names (iteration 2).
- **`$PACKAGE/knowledge/overview.md`** — final use cases and fixture map (iteration 3).
- **`$PACKAGE/CHANGELOG.md`** — the rewritten `UNRELEASED` entry (iteration 3).

### Follow Ups

- **`replaceRecordContent(markdown)`** — thin sugar that parses markdown and calls `replaceRecordSection`; not part of this plan.
- **An in-memory content source** — a public `createContentSource`-style helper that starts from a markdown string, so repair and quick-edit flows stop hand-rolling the four-method object (the recipe inlines one meanwhile; may belong to `$ART_LIB`).
- **Release** — version bump and publish are owned by the next release plan, which inherits the rewritten `UNRELEASED` changelog entry.
- **Follow-ups** — collision reporting, acronym-preserving labels, Art Works migration, and the codec's digit-bearing-label gap remain out of scope.

### Feedback

- None — no iteration has been delegated.
