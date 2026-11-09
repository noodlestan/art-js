# Instructions: `spec-copy-on-write-repair`

**Plan:** `obscured-field-repair`

**Iteration Id:** `spec-copy-on-write-repair`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

RULE: This iteration is **documentation-only**. The ONLY paths you may stage are the four knowledge files: `$PACKAGE/knowledge/design/fields.md`, `$PACKAGE/knowledge/adr/fields.art`, `$PACKAGE/knowledge/design/records.md`, `$PACKAGE/knowledge/index.md`. Never `git add -A`, never `git add .`. Forbidden: `$PACKAGE/knowledge/overview.md`, `$PACKAGE/README.md`, and `$PACKAGE/CHANGELOG.md` (iterations 2 and 3 own them), anything under `$PACKAGE/src`, `$PACKAGE/tests`, `$PROJECT/tests/records`, anything under `$PROJECT/_backlog/`, manifests, and `dist`. Nothing under `$PROJECT/_backlog/1-done/` is ever edited — the origin plan is reference only.

RULE: **History-free knowledge.** Every file you write must read as if the five `…ByLabel` members never existed: no "removed", no "reversed", no "never released", no "replaced by", no residual example, count note, or footnote naming them. The plan file and the commit message carry that history; the knowledge must not.

**Precondition:** pin the shipped spec you are reworking. Before touching any file, confirm the structure you are rewriting matches what the plan describes:

```bash
cd $PROJECT
git log -1 --format=%h -- libs/records/knowledge/design/fields.md                   # must print f74746f
grep -c "^## Reading and Writing by Label" libs/records/knowledge/design/fields.md  # must print 1
grep -c "^## Relabeling a Field" libs/records/knowledge/design/fields.md            # must print 1
grep -c "ByLabel" libs/records/knowledge/design/fields.md                           # must print 16
grep -c "fifteen" libs/records/knowledge/design/fields.md                           # must print 1
grep -c "^## Decision: Label Repair and By-Label Access" \
  libs/records/knowledge/adr/fields.art                                             # must print 1
grep -c "ByLabel" libs/records/knowledge/design/records.md                          # must print 5
grep -ci "by-label" libs/records/knowledge/index.md                                 # must print 2
test -f _backlog/3-now/plan-label-repair-api/plan.md && echo upstream-ok
test -f _backlog/1-done/plan-canonical-record-field-names/plan.md && echo origin-ok
```

If any check fails — a heading moved, a count changed, the pin drifted, an origin file is missing — REPORT A BLOCKER with the actual state and STOP: do not improvise a different edit.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/spec-copy-on-write-repair__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `spec-copy-on-write-repair`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                | Purpose                                          |
| ------------ | ---------------------------- | ------------------------------------------------ |
| `$WORKSPACE` | Current working directory    | Workspace root directory                         |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates      |
| `$SKILLS`    | `$WORKSPACE/.agents/skills`  | Art agent modes and skills                       |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes          |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package                    |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout — codec field pattern, read-only |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `spec-copy-on-write-repair`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Write the copy-on-write repair surface into `$PACKAGE/knowledge/design/fields.md` — the single specification of the records field API, and the place every field API name lives: the repair section that replaces `## Reading and Writing by Label` (the copy-and-apply flow, the two section helpers `getObscuredFields(section)` and `renameObscuredField(section, field, newName)`, `__section` as a per-access snapshot the caller owns, the direct `children` edit for dropping a duplicate, and the dead-handle contract of `replaceRecordSection`); then align the rest of the knowledge — the Public Field API block, the reserved-name counts (ten names, nine collision labels), the Status and Scope lines, the ADR (the new copy-on-write decision, the by-label decision gone as if never written), the `ArtRecord` type, apply API, recipe, and placement in `records.md`, and the knowledge index. Commit as `docs(records): Specify copy-on-write repair and section helpers.`

This is a **specification** iteration: you write documentation, not code. The plan states intent only — you name every API, following Conventions: TypeScript. The implementation of the spec is the next iteration (`implement-copy-on-write-repair`), which stays `DRAFT` until this spec lands.

Commit `spec-copy-on-write-repair` is `NOPUSH`.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript (for the API signatures you write into the spec).

- design: `$PACKAGE/knowledge/design/fields.md` — the shipped spec you rewrite, pinned `f74746f`; read it end to end before writing.
- design: `$PACKAGE/knowledge/design/records.md` — the `ArtRecord` public type, the collection type, the usage recipe, and the placement paragraph you keep accurate.
- adr: `$PACKAGE/knowledge/adr/fields.art` — the field decisions; one decision is deleted, one is added, two clauses are amended.
- reference: `$PROJECT/_backlog/3-now/plan-label-repair-api/plan.md` — the work whose surface this plan reworks. **Reference only.**
- reference: `$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md` — Not In Scope ("Label escape hatches") and Follow Ups: the origin of this work. **Reference only — never edit anything under `_backlog/1-done/`.**
- reference: `$ART_MD/libs/constructs/src/parser/fields/constants.ts` — `FIELD_TEXT_PATTERN`, the codec gate `renameObscuredField` mirrors for its derived labels.
- knowledge: `$PACKAGE/knowledge/index.md` — the register you refresh.
- guide: `$PACKAGE/_guide.md` — package layout and operating instructions.
- guide: `$PROJECT/_guide.md` — repository layout, workspaces, and operating instructions.
- guide: `$WORKSPACE/_guide.md` — workspace orientation and operating instructions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root, and again from the `$PROJECT` root — the workspace is not a build root, every project repo builds standalone:

```bash
npm ci # to install dependencies.
```

If `npm ci` changes `$PROJECT/package-lock.json`, revert that file and REPORT A BLOCKER — this iteration changes no dependency.

### Verifying Step

**Purpose:** Validate lint for a documentation step.

**Instructions:** (From `$PACKAGE/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
```

This iteration writes Markdown and `.art` files only; `tsc --noEmit` must stay green because it runs anyway, but you are not expected to run the test suites between steps.

### Verifying Completion

**Purpose:** Confirm the work item satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root:

```bash
npm run ci # lint, test and build
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there — or reuse the blueprint message provided at the commit step, which is already authored.

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 7 — Read the origin follow-ups and inventory every by-label claim
- Step 2 / 7 — Replace the by-label section with the repair section in `design/fields.md`
- Step 3 / 7 — Update the spec's Public Field API, Reserved names, wording, and Status/Scope
- Step 4 / 7 — Rework `adr/fields.art`: add copy-on-write, delete the by-label decision
- Step 5 / 7 — Update `records.md`: types, apply API, recipe, placement
- Step 6 / 7 — Refresh `index.md` and run the history-free audit
- Step 7 / 7 — Verify and commit `spec-copy-on-write-repair`

## Steps

### Step `1 / 7` — Read the origin follow-ups and inventory every by-label claim

**Description:** Know exactly which claims, signatures, counts, and pointers the copy-on-write surface overturns, before writing a word.

**Instructions:**

1. Read `$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md` — Not In Scope entry "Label escape hatches" and the Follow Ups entry "Label-writing repair API". That follow-up is the intent you are turning into a spec: records stop exposing their live section, repair runs on a copy, the collection applies it back. Reference only: never edit this file or anything else under `_backlog/1-done/`.
2. Read `$PROJECT/_backlog/3-now/plan-label-repair-api/plan.md` — the delivered work whose surface this spec replaces; its `UNRELEASED` changelog entry is rewritten by a later iteration, not by you.
3. Read `$PACKAGE/knowledge/design/fields.md` end to end (pinned `f74746f`) and mark every passage the rewrite touches:
   - `## Reading and Writing by Label` — the whole section, replaced.
   - The Scope line (the "label-repair members" sentence) and the Status line (the "land with `implement-label-repair-api`" claim).
   - The Public Field API block: the five `…ByLabel` signatures and the naming sentence that describes `ByLabel` as the addressing marker.
   - Reserved names: "the fifteen handle-member names" enumeration and the "Fourteen collisions" paragraph with its five by-label labels.
   - Reading Field Values intro and Reading raw ("values are addressable by name and by stored label").
   - Field and Section Behaviour (the label-addressed reads/writes sentence, and the `record.__section` sentence that must gain snapshot semantics).
   - The closing Decisions pointer.
4. Read `$PACKAGE/knowledge/adr/fields.art` and mark: `## Decision: Label Repair and By-Label Access` (deleted outright), the escape-hatch clause inside `Canonical Field Names`, and the by-label scan clause inside `The name → field Index`. Every other decision stays byte-identical.
5. Read `$PACKAGE/knowledge/design/records.md` and mark: the five `…ByLabel` signatures in the `ArtRecord` type, the field-members pointer line, `### Mutating and Saving Records` (the "change section properties through `record.__section`" recipe), the placement paragraph (the anchor `__section` sentence), the Record Model note, and the Field and Section Behaviour pointer ("how a value is addressed by stored label").
6. Read `$PACKAGE/knowledge/index.md` — the two purposes that mention by-label access.
7. Read the codec gate `FIELD_TEXT_PATTERN` in `$ART_MD/libs/constructs/src/parser/fields/constants.ts` — the round trip `renameObscuredField`'s derived label must survive.

**Expected outcome:** an inventory (kept in your working notes, summarised in the report) of every section, signature, count, and pointer to rewrite, and of every clause to keep byte-identical.

**Verify:** no file changed yet; `git status --short` is empty.

### Step `2 / 7` — Replace the by-label section with the repair section in `design/fields.md`

**Description:** Specify the copy-on-write repair flow and the two helpers — the plan states the intent; this section decides and names them.

**Instructions:**

1. Delete `## Reading and Writing by Label` and add `## Repairing Obscured Fields` in its place (the spec's own heading style, placed with the other write operations). It must state all of the following:
   - **The flow.** Read a snapshot with `record.__section` → `getObscuredFields(section)` → `renameObscuredField(section, field, newName)` → optionally drop a duplicate by editing the copy's `children` directly → `RecordsDocumentCollection.replaceRecordSection(record, section)` → use the returned handle → `save()` → reload. Every step except the grab and the apply is section-scoped: no helper takes a record.
   - **The snapshot is a plain Art AST the caller owns.** It may be edited freely, including removing a duplicate field by splicing `children`; deletion needs neither a helper nor the record. Exactly two helpers exist.
   - **`getObscuredFields(section)`** returns the actual obscured field objects of that section (`FieldBlock | FieldInline` constructs from `@art-md/constructs`) in document order; a field is obscured when an earlier sibling derives the same key under `labelToName`. It never mutates anything.
   - **`renameObscuredField(section, field, newName)`** validates before mutating, in this order: `field` must be a member of the given `section` (identity — a field from another copy is rejected); `newName` must be canonical (`/^[a-z][a-zA-Z0-9]*$/`) and not reserved; `nameToLabel(newName)` must re-parse as a field under the codec's label pattern (so save → reload keeps it); and no other field in `section` may derive `newName`. On success only the field's stored label changes to `nameToLabel(newName)` — position, tags, and value untouched. A rejected rename leaves the copy untouched.
   - **Apply contract.** `replaceRecordSection(record, section)` lives on `RecordsDocumentCollection`: it resolves the record's live section through the collection, validates the incoming copy, applies it by content-copy — never an object swap, so document membership and anchor identity survive — re-extracts the record with a fresh capsule, and returns the new handle. **The old handle's field surface is dead: every field read, write, enumeration, rename, relabel, and delete through it is invalid; callers must use the returned handle.**
   - **Snapshot semantics.** Every `record.__section` access returns a deep clone of the live section: mutations to it never reach the record, it is current at the moment of access, and section-level changes go through `replaceRecordSection`.
   - **Coexistence.** The shipped `0.2.0` surface (`setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, `renameField`, `delete`) and `relabelField` keep every existing signature and behaviour; the proxy accessor and setter routes are untouched.

**Expected outcome:** a reviewer can answer "how do I repair an obscured field, what does each helper validate, and what happens to the old handle?" from this file alone.

**Verify:** `grep -c "^## Repairing Obscured Fields" $PACKAGE/knowledge/design/fields.md` prints `1`; `grep -c "^## Reading and Writing by Label" $PACKAGE/knowledge/design/fields.md` prints `0`; both helper signatures appear; `npm run lint` from `$PACKAGE` is green.

### Step `3 / 7` — Update the spec's Public Field API, Reserved names, wording, and Status/Scope

**Description:** Make the rest of the spec consistent with the new repair section, history-free.

**Instructions:**

1. **Public Field API block.** Remove the five `…ByLabel` signatures; keep `relabelField` and every shipped `0.2.0` signature. The block stays the home of ArtRecord member names — the two helpers are standalone value exports, so add a pointer line under the block to `## Repairing Obscured Fields` for them; rewrite the naming sentence so it no longer describes `ByLabel` as an addressing marker.
2. **Reserved names.** The reserved set is now **ten** member names — `name`, `save`, `renameField`, `__section`, `setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, `relabelField` — and **nine** reachable collision labels (`Name`, `Save`, `Rename Field`, `Set Field Markdown`, `Set Field Value`, `Get Field Markdown`, `Get Field Text`, `Get Field Value`, `Relabel Field`). Rewrite the enumeration, the "fifteen" count, the "Fourteen collisions" paragraph (it becomes nine: the original eight plus `Relabel Field`), and the abort list. Extraction aborts on those nine labels exactly as before.
3. **Replace the label-addressed claims.** In Reading Field Values and Reading raw, values are addressable by **name**; the field **container** and label enumeration remain reachable through a `record.__section` **snapshot**; obscured fields are repaired through `## Repairing Obscured Fields`.
4. **Field Names / Field and Section Behaviour.** `renameField` and `relabelField` remain the operations that rewrite a stored label; drop the label-addressed reads/writes sentence; the `record.__section` sentence gains the snapshot semantics (deep clone per access, mutations never reach the record).
5. **Status and Scope lines.** The shipped claim keeps covering only the implemented surface: `relabelField` shipped with `implement-label-repair-api`; the snapshot semantics, the two helpers, and the apply API are specified here and land with `implement-copy-on-write-repair`. Rewrite both lines so they describe only that — no sentence advertising by-label members and no sentence narrating their absence.
6. **Closing Decisions pointer.** Cover naming, index resolution, rename, form selection, the string-write route, the read model, and copy-on-write repair.

**Expected outcome:** no sentence in `fields.md` mentions the by-label members in any form, and no sentence contradicts the repair section.

**Verify:** `grep -c "ByLabel" $PACKAGE/knowledge/design/fields.md` prints `0`; `grep -ci "by-label" $PACKAGE/knowledge/design/fields.md` prints `0`; `grep -c "fifteen" $PACKAGE/knowledge/design/fields.md` prints `0`; `grep -c "Fourteen" $PACKAGE/knowledge/design/fields.md` prints `0`; `grep -c "^## Relabeling a Field" $PACKAGE/knowledge/design/fields.md` still prints `1`; `npm run lint` from `$PACKAGE` is green.

### Step `4 / 7` — Rework `adr/fields.art`: add copy-on-write, delete the by-label decision

**Description:** Record the new decision and remove the old one outright, so the ADR reads as if it was never written.

**Instructions:**

1. Add `## Decision: Copy-On-Write Repair` to `$PACKAGE/knowledge/adr/fields.art`, in the file's established format (`## Decision: …`, `**Status:** Adopted`, one `**Decision:**` paragraph): `__section` is a per-access snapshot the caller owns; the capsule keeps mutating the live section internally; the two helpers are pure over the caller's working copy and no helper takes a record; deleting a duplicate is a direct `children` edit on the copy; every apply crosses the collection (validate → content-copy → re-extract), so a future reactive `capsuleFactory` lands at one choke point and helpers never touch live state; the apply returns the new handle and the old handle's field surface is documented dead; the escape hatch for a shadowed field is `relabelField` plus the repair helpers; the names are owned by `design/fields.md` (spec first).
2. **Delete** `## Decision: Label Repair and By-Label Access` entirely, absorbing anything still true (`relabelField`'s gates and index invariance) into the new decision. The file must read as if that decision was never written: no "reversed", no "removed", no "never released", and no naming of the five members anywhere in the file.
3. Amend `Canonical Field Names`: replace the escape-hatch clause ("relabel plus by-label value access — … the `…ByLabel` twins read and write values by exact stored label") with wording that points at the new decision — the escape hatch is `relabelField` plus the repair helpers; `record.__section` remains the only route to the field container and to label enumeration, as a snapshot.
4. Amend `The name → field Index`: replace the by-label scan clause with — name-addressed access resolves through the index; no access path scans the live section for a label (the helpers operate on caller-owned copies, never on live state).
5. Touch nothing else: every other adopted decision stays byte-identical.

**Expected outcome:** the ADR records the copy-on-write decision and contains no claim, decision, or name the shipped spec no longer has.

**Verify:** `grep -c "^## Decision: Label Repair and By-Label Access" $PACKAGE/knowledge/adr/fields.art` prints `0`; `grep -c "ByLabel" $PACKAGE/knowledge/adr/fields.art` prints `0`; `grep -ci "by-label" $PACKAGE/knowledge/adr/fields.art` prints `0`; `grep -c "^## Decision:" $PACKAGE/knowledge/adr/fields.art` prints `7`; `git diff -- $PACKAGE/knowledge/adr/fields.art` shows one added decision, one deleted decision, and two amended clauses only; `npm run lint` from `$PACKAGE` is green.

### Step `5 / 7` — Update `records.md`: types, apply API, recipe, placement

**Description:** Keep the records design's public surface, usage recipe, and placement contract in step with the spec.

**Instructions:**

1. In `$PACKAGE/knowledge/design/records.md`, remove the five `…ByLabel` signatures from the `ArtRecord` type in `## Public API`.
2. Add `replaceRecordSection(record: ArtRecord, section: SectionBlock): ArtRecord;` to the `RecordsDocumentCollection` type, and add `getObscuredFields` and `renameObscuredField` to the export block as function exports, with signatures exactly as the spec names them.
3. Rewrite `### Mutating and Saving Records`: field changes still go through property access and members; **section** changes go through the copy-and-apply flow — take the `record.__section` snapshot, repair it with the helpers, remove a duplicate by editing the copy's `children` directly, call `replaceRecordSection`, and use the returned handle before `save()`. Add an inline content source to the recipe (the four-method object over a markdown string, as the package's own test helpers already do) so a repair can start from a string with no filesystem adapter. State that `__section` returns a snapshot per access.
4. Update the placement paragraph: anchors resolve through the collection's private handle→section bridge instead of reading `anchor.__section`; the foreign-anchor error and its message are unchanged.
5. Update the Record Model note: the proxy serves snapshots; the capsule mutates the live section internally; every apply crosses the collection — the single choke point for a future reactive capsule factory.
6. Fix the pointer lines — the field-members pointer, `### Reserved names`, `## Field Names`, and `## Field and Section Behaviour` — so none of them advertises or narrates label-addressed value access; they point at `fields.md` and the repair section instead.

**Expected outcome:** `records.md`'s public type matches the spec, the recipe runs without a filesystem, and no sentence mentions the by-label members.

**Verify:** `grep -c "ByLabel" $PACKAGE/knowledge/design/records.md` prints `0`; `grep -ci "by-label" $PACKAGE/knowledge/design/records.md` prints `0`; `grep -c "replaceRecordSection" $PACKAGE/knowledge/design/records.md` is at least `2`; `grep -c "getObscuredFields" $PACKAGE/knowledge/design/records.md` is at least `1`; `npm run lint` from `$PACKAGE` is green.

### Step `6 / 7` — Refresh `index.md` and run the history-free audit

**Description:** Keep the knowledge register in step, then prove no by-label trace survives in any of the four files.

**Instructions:**

1. In `$PACKAGE/knowledge/index.md`, refresh the purposes of the `design/fields.md` row and the `adr/fields.art` row so both describe the copy-on-write repair flow and the two helpers — current surface only, no reversal wording.
2. Run the history-free audit over all four files:

   ```bash
   grep -in "by-label\|bylabel\|label-addressed\|never released\|reversed\|replaced by" \
     $PACKAGE/knowledge/design/fields.md \
     $PACKAGE/knowledge/adr/fields.art \
     $PACKAGE/knowledge/design/records.md \
     $PACKAGE/knowledge/index.md
   ```

   The command must print nothing. If a hit is about something else (for example "Removing the indexed field" in the promotion rules), inspect it: legitimate field-promotion wording stays; anything narrating the by-label members goes.

3. Do **not** touch `$PACKAGE/knowledge/overview.md` or `$PACKAGE/README.md` — both belong to `implement-copy-on-write-repair` — and do not touch `$PACKAGE/CHANGELOG.md`, which belongs to `rewrite-unreleased-changelog`.

**Expected outcome:** a reader of `index.md` sees the repair flow in both field-document purposes, and the audit returns no hits.

**Verify:** the audit command prints nothing; `npm run lint` from `$PACKAGE` is green.

### Step `7 / 7` — Verify and commit `spec-copy-on-write-repair`

**Description:** Run the full verification, stage exactly the four knowledge paths, and record the spec.

**Instructions:**

1. Run the **Verifying Step** from `$PACKAGE`: `lint:fix`, `lint`.
2. Run the **Verifying Completion** from `$PROJECT`: `npm run ci` (docs changes still pass through the repo-wide prettier and the turbo pipeline).
3. Confirm the change set is documentation only:

   ```bash
   git status --short
   git diff --stat
   ```

   Only the four knowledge paths may appear — `$PACKAGE/knowledge/design/fields.md`, `$PACKAGE/knowledge/adr/fields.art`, `$PACKAGE/knowledge/design/records.md`, `$PACKAGE/knowledge/index.md` — plus `./instructions/spec-copy-on-write-repair__report.md` once rendered. No `src`, no `tests`, no `package.json`, no `package-lock.json`, no `CHANGELOG.md`, no `README.md`, no `knowledge/overview.md`, no `_roadmap`, no `dist`, nothing under `_backlog/`.

4. Stage the four paths explicitly, file by file:

   ```bash
   git add $PACKAGE/knowledge/design/fields.md
   git add $PACKAGE/knowledge/adr/fields.art
   git add $PACKAGE/knowledge/design/records.md
   git add $PACKAGE/knowledge/index.md
   ```

   Never `git add -A` and never `git add .`.

5. Leave `./instructions/spec-copy-on-write-repair__report.md` **unstaged** — the delegator commits it.
6. Commit from `$PROJECT`.

**Message:**

```text
docs(records): Specify copy-on-write repair and section helpers.

- Turn `__section` into a per-access snapshot and document the repair flow.
- Reverse the by-label members and record the copy-on-write decisions.
```

The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push (`NOPUSH`) and do **not** run `npm version`, `npm publish`, or any release command: this plan ships no version bump and no publish.

---

## Final Verification

**Instructions:**

- Verify the commit exists locally and was **not** pushed (`NOPUSH`).
- Verify only the four knowledge paths were committed: `design/fields.md`, `adr/fields.art`, `design/records.md`, `knowledge/index.md`. No source, test, manifest, lock, changelog, README, overview, backlog, or roadmap file is part of the commit; nothing under `_backlog/1-done/` appears in `git status` at all.
- Verify `## Repairing Obscured Fields` states the full flow, exactly two helpers with section-scoped signatures, the snapshot-is-owned editability (direct `children` removal), `renameObscuredField`'s four gates with validation-before-mutation, and the dead-handle contract.
- Verify the reserved counts: ten member names and nine reachable collision labels, enumerated with no fifth `…ByLabel` label.
- Verify `grep -c "ByLabel"` prints `0` in `fields.md`, `adr/fields.art`, and `records.md`, and the Step 6 audit prints nothing across all four files.
- Verify the ADR keeps seven decisions: six untouched originals plus `Copy-On-Write Repair`, with `Label Repair and By-Label Access` gone.
- Verify `records.md` carries the `replaceRecordSection` type, both helper exports, the inline-content-source recipe, and the placement-bridge paragraph.
- Execute the **Verifying Step** instructions from the Operating Instructions section, and `npm run ci` from `$PROJECT`.
- Render `./instructions/spec-copy-on-write-repair__report.md` and leave it unstaged.
- Report according to the "How to Report Back to the Delegator" instructions.
