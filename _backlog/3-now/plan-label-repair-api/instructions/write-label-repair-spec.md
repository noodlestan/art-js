# Instructions: `write-label-repair-spec`

**Plan:** `label-repair-api`

**Iteration Id:** `write-label-repair-spec`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

RULE: This iteration is **documentation-only**. The ONLY paths you may stage are the four knowledge files: `$PACKAGE/knowledge/design/fields.md`, `$PACKAGE/knowledge/adr/fields.art`, `$PACKAGE/knowledge/design/records.md`, `$PACKAGE/knowledge/index.md`. Never `git add -A`, never `git add .`. Nothing under `$PROJECT/_backlog/1-done/` is ever edited — the origin plans are reference only. `knowledge/overview.md` and `README.md` belong to `implement-label-repair-api` and stay untouched here.

**Precondition:** this iteration extends an existing, shipped spec. Before touching any file, confirm the structure you are extending matches what the plan describes:

```bash
grep -c "## Public Field API" $PACKAGE/knowledge/design/fields.md          # must print 1
grep -c "no per-name accessor" $PACKAGE/knowledge/design/fields.md        # must print 1 (a claim you replace)
grep -c "There is no label escape hatch" $PACKAGE/knowledge/adr/fields.art # must print 1 (a clause you amend)
grep -c "no access path scans section fields" $PACKAGE/knowledge/adr/fields.art # must print 1 (a clause you qualify)
test -f $PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md && echo origin-ok
```

If any check fails (a section moved, a claim was already amended, the origin plan is missing), REPORT A BLOCKER with the actual state — do not improvise a different edit.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/write-label-repair-spec__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `write-label-repair-spec`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                | Purpose                                          |
| ------------ | ---------------------------- | ------------------------------------------------ |
| `$WORKSPACE` | Current working directory    | Workspace root directory                         |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates      |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes          |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package                    |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout — codec field pattern, read-only |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `write-label-repair-spec`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Write the label-repair surface into `$PACKAGE/knowledge/design/fields.md` — the single specification of the records field API, and the place every field API name lives: a relabel section (rewrite a stored label in place while keeping the field's name, position, tags, and value, with its gates and index invariance) and a raw by-label access section (read/write field values by stored label, coexisting with the shipped `0.2.0` surface); then align the rest of the knowledge — the Public Field API block, the reserved-name set, the claims that there is no label escape hatch, the two overturned ADR clauses, the `ArtRecord` public type, and the knowledge index. Commit as `docs(records): Specify label repair and by-label field access.`

This is a **specification** iteration: you write documentation, not code. The plan states intent only — you name every API, following Conventions: TypeScript. The implementation of the spec is the next iteration (`implement-label-repair-api`), which stays `DRAFT` until this spec lands.

Commit `write-label-repair-spec` is `NOPUSH`.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript (for the API signatures you write into the spec).

- design: `$PACKAGE/knowledge/design/fields.md` — the shipped spec you extend; read it end to end before writing.
- design: `$PACKAGE/knowledge/design/records.md` — the `ArtRecord` public type and the pointer sections you keep accurate.
- adr: `$PACKAGE/knowledge/adr/fields.art` — the field decisions; two clauses are amended here.
- reference: `$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md` — Not In Scope ("Label escape hatches") and Follow Ups ("Label-writing repair API"): the origin of this work. **Reference only — never edit anything under `_backlog/1-done/`.**
- reference: `$PROJECT/_backlog/1-done/plan-expand-fields-api/plan.md` — the spec-first precedent: intent in the plan, names in the spec.
- reference: `$ART_MD/libs/constructs/src/parser/fields/constants.ts` — `FIELD_TEXT_PATTERN`, the codec gate the relabel section specifies.
- reference: `$ART_MD/libs/constructs/src/parser/constructs/FieldBlock/private/helpers/createFieldBlockFromNode.ts` — how a stored label is derived on parse (text before the colon, trimmed), which is the round-trip the relabel gate guarantees.
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

- Step 1 / 7 — Read the origin follow-ups and inventory the spec's no-escape-hatch claims
- Step 2 / 7 — Write the relabel section into `design/fields.md`
- Step 3 / 7 — Write the raw by-label access section into `design/fields.md`
- Step 4 / 7 — Update the spec's Public Field API, Reserved names, wording, and Status/Scope
- Step 5 / 7 — Amend `adr/fields.art`
- Step 6 / 7 — Update `records.md` and refresh `index.md`
- Step 7 / 7 — Verify and commit `write-label-repair-spec`

## Steps

### Step `1 / 7` — Read the origin follow-ups and inventory the spec's no-escape-hatch claims

**Description:** Know exactly which claims the label-repair surface overturns and which clauses you amend, before writing a word.

**Instructions:**

1. Read `$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md` — Not In Scope entry "Label escape hatches" and the Follow Ups entry "Label-writing repair API". That follow-up is the intent you are turning into a spec: a relabel operation that corrects a persisted label without changing the field's name, plus raw by-label field accessors. Reference only: never edit this file or anything else under `_backlog/1-done/`.
2. Read `$PACKAGE/knowledge/design/fields.md` end to end and mark every passage the new surface overturns or extends: the Reading Field Values intro (label and container "reachable only by walking `record.__section`"), Reading raw ("there is no per-name accessor for it"), the Field Names intro ("The stored label itself is never rewritten by a value update"), the Field and Section Behaviour rename sentence, the Public Field API block, Reserved names (nine member names, eight reachable collision labels), the Status and Scope lines, and the closing Decisions pointer.
3. Read `$PACKAGE/knowledge/adr/fields.art` and mark the two clauses to amend: in `Canonical Field Names`, "There is no label escape hatch — the raw section is the only route to non-addressable fields."; in `The name → field Index`, "Every access resolves through the index — no access path scans section fields or converts a label."
4. Read `$PACKAGE/knowledge/design/records.md` — the `ArtRecord` type in `## Public API` and the pointer sections (`### Reserved names`, `## Field Names`, `## Field and Section Behaviour`).
5. Read the codec gate: `FIELD_TEXT_PATTERN` in `$ART_MD/libs/constructs/src/parser/fields/constants.ts` and the label derivation in `createFieldBlockFromNode.ts` (text before the colon, trimmed). Together they define the round trip a relabelled label must survive: save, reload, re-extract, same field, same name.

**Expected outcome:** an inventory (kept in your working notes, summarised in the report) of the claims to replace, the clauses to amend, the public type to extend, and the codec round-trip the relabel gate must guarantee.

**Verify:** no file changed yet; `git status --short` is empty.

### Step `2 / 7` — Write the relabel section into `design/fields.md`

**Description:** Specify the relabel operation — the plan states the intent; this section decides and names it.

**Instructions:**

Add a relabel section to `$PACKAGE/knowledge/design/fields.md` (heading in the spec's own style, placed with the other write operations). It must state all of the following:

1. **Intent.** A stored label is rewritten in place while the field keeps its name, its position in `section.children`, its tags, and its value — the repair counterpart to `renameField`, which can only ever write the derived `nameToLabel` spelling (the house-spelling gap: `npmPackageDeployment` persists as `Npm Package Deployment`).
2. **Address.** The operation takes a field name and resolves it through the `name → field` index, so it always operates on the first-wins holder; a shadowed duplicate is not addressable by it.
3. **Validation before mutation**, in order: a reserved name → `TypeError`; an absent name → the not-found error `renameField` already uses; then the label gates — the label must contain at least one word character, must re-parse as a field under `FIELD_TEXT_PATTERN` (letter-led, letters and spaces only, no leading/trailing whitespace, so save → reload keeps the field and its spelling), and must re-derive the field's current name (`labelToName(label) === name`). A rejected relabel leaves the document and the index untouched.
4. **Index effect.** Only `field.name` changes; every index key stays identical — no rekey, no promotion, no first-wins shift; position, tags, and value are untouched. State why the re-derivation gate exists: the capsule rebuilds the index from labels after every structural mutation, so a label that stopped deriving its key would be silently rekeyed by the next unrelated mutation.
5. **No grammar, no reservation on labels.** The canonical grammar keeps gating API-supplied names only; reservation never applies to a label, because a label resolving to a reserved name cannot exist in an indexed record.
6. **Shadowed duplicates.** Relabel never promotes and never reaches them; the holder may end up sharing the identical label with a shadowed field — first-wins and the reload still hold; their values are reached through the by-label accessors of the next section.
7. **Composition.** `renameField` followed by relabel yields a custom spelling for a renamed field; the gate is exactly what makes an arbitrary spelling safe to persist.

**Expected outcome:** a reviewer can answer "what does relabel do, what does it reject, and what does it do to the index?" from this file alone.

**Verify:** `npm run lint` from `$PACKAGE` is green; the three label gates and "index keys unchanged" are stated verbatim enough to test against.

### Step `3 / 7` — Write the raw by-label access section into `design/fields.md`

**Description:** Specify the by-label accessors — addressing changes, value semantics do not.

**Instructions:**

Add a raw by-label access section to `$PACKAGE/knowledge/design/fields.md`. It must state all of the following:

1. **Twins.** Each of the five value methods — `setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue` — gains a label-addressed counterpart; every new method is named here, following Conventions: TypeScript. This section is where the names land; the plan prescribes none.
2. **Addressing.** The argument is the exact stored label; the lookup scans `section.children` in document order and takes the first field carrying that label — no `labelToName` conversion, no index involvement, so a field whose label is shadowed by an earlier duplicate is reachable.
3. **Reads.** Label-addressed markdown, text, and value reads; `undefined` when no field carries the label; the value read stays a deep clone.
4. **Writes.** Label-addressed markdown and value writes; they **throw** when no field carries the label; they **never create** a field (creation stays name-addressed with the derived label); a value write never changes the stored label.
5. **Value semantics unchanged.** `codec.parse`, the automatic block/inline form, container rejection, and form conversion preserving name, tags, and position are exactly the name-addressed behaviours — addressing is the only difference; a value write needs no index rebuild because the label does not change.
6. **Coexistence with the `0.2.0` surface.** `setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, `renameField`, and `delete` keep every existing signature and behaviour; the proxy accessor and setter routes are untouched; the new members are additions only.

**Expected outcome:** a reviewer can answer "how do I read or write a field whose label is shadowed, and does that change any value behaviour?" from this file alone.

**Verify:** `npm run lint` from `$PACKAGE` is green; all five twins are named; the miss semantics (`undefined` for reads, throw for writes, never create) are stated.

### Step `4 / 7` — Update the spec's Public Field API, Reserved names, wording, and Status/Scope

**Description:** Make the rest of the spec consistent with the two new sections.

**Instructions:**

1. **Public Field API block.** Add every new signature introduced in Steps 2–3, in the block's existing style, so the block remains "every name the spec introduces, in one place".
2. **Reserved names.** Every new handle member joins the reserved set (a member missing from it would silently shadow a same-named field — the defect the canonical-name plan closed). List the new member names, recompute the reachable collision labels (`labelToName` semantics: each word capitalised, space-joined — a member `relabelField` collides with the label `Relabel Field`), and state the new counts of reserved names and reachable collision labels beside the existing eight. Extraction aborts on the new collision labels exactly as it does today.
3. **Replace the no-escape-hatch claims.** In Reading Field Values and Reading raw, replace "reachable only by walking `record.__section`" / "there is no per-name accessor for it" with the accurate statement: values are addressable by name and by stored label; the field **container** and label enumeration remain reachable only through `record.__section`.
4. **Field Names and Field and Section Behaviour.** Value updates still never rewrite a stored label; rename and relabel are now the two operations that rewrite one — update the rename sentence accordingly and cross-reference the new sections.
5. **Status and Scope lines.** The shipped claim keeps covering only the implemented surface: mark the label-repair additions as specified here and landing with `implement-label-repair-api`.
6. **Closing Decisions pointer.** Include label repair alongside naming, index resolution, rename, form selection, the string-write route, and the read model.

**Expected outcome:** no sentence in `fields.md` denies the surface the same file now specifies.

**Verify:** `grep -c "no per-name accessor" $PACKAGE/knowledge/design/fields.md` prints `0`; the Public Field API block contains every new signature; `npm run lint` from `$PACKAGE` is green.

### Step `5 / 7` — Amend `adr/fields.art`

**Description:** Record the decision and fix only the two clauses it overturns.

**Instructions:**

1. Add the label-repair decision to `$PACKAGE/knowledge/adr/fields.art`, in the file's established format (`## Decision: …`, `**Status:** Adopted`, one `**Decision:**` paragraph): relabel keeps the field's name with the three label gates and index-key invariance; by-label access changes addressing only (reads `undefined` on a miss, writes throw, never creates); every new handle member is reserved, so the extraction-abort set grows; the names are owned by `design/fields.md` (spec first); and the boundary — no label-addressed rekey of a shadowed duplicate — stays out of the plan, because a divergent label would be rekeyed by the next index rebuild and belongs with promotion and collision reporting.
2. Amend `Canonical Field Names`: replace "There is no label escape hatch — the raw section is the only route to non-addressable fields." with wording that points at the new decision — the escape hatch is relabel plus by-label value access; `record.__section` remains the only route to the field container and to label enumeration.
3. Amend `The name → field Index`: qualify "Every access resolves through the index — no access path scans section fields or converts a label" — name-addressed access resolves through the index; the by-label accessors scan section fields for an exact stored label without converting it; no access path converts a label at access time.
4. Touch nothing else: every other adopted decision stays byte-identical.

**Expected outcome:** the ADR records the new decision and no longer contains a claim the shipped spec contradicts.

**Verify:** `grep -c "There is no label escape hatch" $PACKAGE/knowledge/adr/fields.art` prints `0`; `grep -c "no access path scans section fields" $PACKAGE/knowledge/adr/fields.art` prints `0`; `git diff -- $PACKAGE/knowledge/adr/fields.art` shows only the appended decision and the two amended passages; `npm run lint` from `$PACKAGE` is green.

### Step `6 / 7` — Update `records.md` and refresh `index.md`

**Description:** Keep the records design's public type and the knowledge register in step with the spec.

**Instructions:**

1. In `$PACKAGE/knowledge/design/records.md`, add the new members to the `ArtRecord` type in `## Public API`, with signatures exactly as the spec names them; then check the field-members pointer line and the `### Reserved names`, `## Field Names`, and `## Field and Section Behaviour` pointers — update their wording only where it now understates the surface (they already point at `fields.md`; do not restate field behaviour in `records.md`).
2. In `$PACKAGE/knowledge/index.md`, refresh the purposes of the `design/fields.md` row and the `adr/fields.art` row so both mention label repair and by-label access.
3. Do **not** touch `$PACKAGE/knowledge/overview.md` or `$PACKAGE/README.md` — both belong to `implement-label-repair-api`.

**Expected outcome:** `records.md`'s public type matches the spec; a reader of `index.md` sees label repair in the purposes of both field documents.

**Verify:** `grep -n "relabel\|by-label" $PACKAGE/knowledge/design/records.md $PACKAGE/knowledge/index.md` finds the updates; `npm run lint` from `$PACKAGE` is green.

### Step `7 / 7` — Verify and commit `write-label-repair-spec`

**Description:** Run the full verification, stage exactly the four knowledge paths, and record the spec.

**Instructions:**

1. Run the **Verifying Step** from `$PACKAGE`: `lint:fix`, `lint`.
2. Run the **Verifying Completion** from `$PROJECT`: `npm run ci` (docs changes still pass through the repo-wide prettier and the turbo pipeline).
3. Confirm the change set is documentation only:

   ```bash
   git status --short
   git diff --stat
   ```

   Only the four knowledge paths may appear — `$PACKAGE/knowledge/design/fields.md`, `$PACKAGE/knowledge/adr/fields.art`, `$PACKAGE/knowledge/design/records.md`, `$PACKAGE/knowledge/index.md` — plus `./instructions/write-label-repair-spec__report.md` once rendered. No `src`, no `tests`, no `package.json`, no `package-lock.json`, no `CHANGELOG.md`, no `README.md`, no `knowledge/overview.md`, no `_roadmap`, no `dist`, nothing under `_backlog/1-done/`.

4. Stage the four paths explicitly, file by file:

   ```bash
   git add $PACKAGE/knowledge/design/fields.md
   git add $PACKAGE/knowledge/adr/fields.art
   git add $PACKAGE/knowledge/design/records.md
   git add $PACKAGE/knowledge/index.md
   ```

   Never `git add -A` and never `git add .`.

5. Leave `./instructions/write-label-repair-spec__report.md` **unstaged** — the delegator commits it.
6. Commit from `$PROJECT`.

**Message:**

```text
docs(records): Specify label repair and by-label field access.

- Add relabel semantics and by-label accessors to the fields spec.
- Amend the no-escape-hatch decisions and refresh the knowledge index.
```

The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push (`NOPUSH`) and do **not** run `npm version`, `npm publish`, or any release command: this plan ships no version bump and no publish.

---

## Final Verification

**Instructions:**

- Verify the commit exists locally and was **not** pushed (`NOPUSH`).
- Verify only the four knowledge paths were committed: `design/fields.md`, `adr/fields.art`, `design/records.md`, `knowledge/index.md`. No source, test, manifest, lock, changelog, README, overview, backlog, or roadmap file is part of the commit; nothing under `_backlog/1-done/` appears in `git status` at all.
- Verify the relabel section states intent, address, the three label gates with validation-before-mutation, index-key invariance (no rekey, no promotion), and shadowed-duplicate behaviour.
- Verify the by-label section names all five twins, the miss semantics (`undefined` / throw / never create), and unchanged `0.2.0` signatures.
- Verify `grep -c "no per-name accessor" $PACKAGE/knowledge/design/fields.md` prints `0`, and `grep -c "There is no label escape hatch" $PACKAGE/knowledge/adr/fields.art` prints `0`.
- Verify the Public Field API block carries every new signature and Reserved names lists the new members with their recomputed collision labels and counts.
- Verify `records.md`'s `ArtRecord` type matches the spec and `index.md` mentions label repair in both refreshed purposes.
- Execute the **Verifying Step** instructions from the Operating Instructions section, and `npm run ci` from `$PROJECT`.
- Render `./instructions/write-label-repair-spec__report.md` and leave it unstaged.
- Report according to the "How to Report Back to the Delegator" instructions.
