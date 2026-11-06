# Instructions: `implement-label-repair-api`

**Plan:** `label-repair-api`

**Iteration Id:** `implement-label-repair-api`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

RULE: This is a **code iteration**. You may stage ONLY touched paths under `$PACKAGE/src/**`, `$PACKAGE/tests/**`, and `$PROJECT/tests/records/**`, PLUS exactly two docs paths owned by this iteration's plan bullet: `$PACKAGE/knowledge/overview.md` and `$PACKAGE/README.md`. The four contract files remain forbidden — `$PACKAGE/knowledge/design/fields.md`, `$PACKAGE/knowledge/adr/fields.art`, `$PACKAGE/knowledge/design/records.md`, and `$PACKAGE/knowledge/index.md` are the shipped spec: if one looks wrong, REPORT A BLOCKER, never fix it in place. Also forbidden: `CHANGELOG.md`, manifests (`package.json`, `package-lock.json`), and anything under `_backlog/1-done/`. Never `git add -A`, never `git add .`. Your report is rendered to `./instructions/implement-label-repair-api__report.md` and left **unstaged**. Commit policy is `NOPUSH`.

**Precondition:** pin the shipped spec revision. Before touching any file, confirm the spec you implement is the reviewed `f74746f` revision:

```bash
cd $PROJECT
git log -1 --format=%h -- libs/records/knowledge/design/fields.md   # must print f74746f
grep -c "^## Relabeling a Field" libs/records/knowledge/design/fields.md              # must print 1
grep -c "^## Reading and Writing by Label" libs/records/knowledge/design/fields.md    # must print 1
grep -c "relabelField(name: string, label: string)" libs/records/knowledge/design/fields.md # must print 2 — spec section + Public API block
grep -c "getFieldValueByLabel" libs/records/knowledge/design/records.md               # must print at least 1
```

If any check fails — a heading moved, a signature changed, the spec's last commit is no longer `f74746f` — REPORT A BLOCKER with the actual state and STOP: the spec moved again and the planner must re-pin it. Do not implement from a drifted spec.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-label-repair-api__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `implement-label-repair-api`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `implement-label-repair-api`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Ship the label-repair surface exactly as the shipped spec defines it: `relabelField(name, label)` with its validation-before-mutation gates and index-key invariance, the five by-label twins (`setFieldMarkdownByLabel`, `setFieldValueByLabel`, `getFieldMarkdownByLabel`, `getFieldTextByLabel`, `getFieldValueByLabel`) behind an exact-label lookup, the six new handle members added to the reserved set, and the full test coverage — unit, fixture-table, two new in-package fixtures, one external consumer fixture — landed with the source, green at every commit. Commit as `build(records): Add label repair and by-label field access.`

The spec at `$PACKAGE/knowledge/design/fields.md` (pinned `f74746f`) is the contract: every public name comes verbatim from it; internal helpers follow the existing folder and naming conventions.

**Docs refresh (plan bullet 4):** `$PACKAGE/knowledge/overview.md` gains the fixture-map rows for the two new in-package fixtures, and `$PACKAGE/README.md` gains the field-surface additions and the grown reserved-name note (fifteen names, fourteen reachable collision labels). These two docs paths are in scope for this iteration; every other knowledge file stays contract-only.

Commit `implement-label-repair-api` is `NOPUSH`.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript (source you write).

::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — Conventions: Unit Tests (tests you write).

- design: `$PACKAGE/knowledge/design/fields.md` — THE contract, pinned revision: `## Relabeling a Field`, `## Reading and Writing by Label`, `## Public Field API`, `### Reserved names` (fifteen member names, fourteen reachable collision labels).
- design: `$PACKAGE/knowledge/design/records.md` — the `ArtRecord` type your signatures must match exactly.
- design: `$PACKAGE/knowledge/design/integration-tests.md` — fixture anatomy and runner behaviour; read it **before** writing any fixture.
- adr: `$PACKAGE/knowledge/adr/fields.art` — the label-repair decision and the amended clauses you are implementing.
- reference: `$ART_MD/libs/constructs/src/parser/fields/constants.ts` — `FIELD_TEXT_PATTERN`, the codec gate relabel mirrors (it is **not** exported by `@art-md/constructs`; mirror it locally).
- reference: `$ART_MD/libs/constructs/src/parser/constructs/FieldBlock/private/helpers/createFieldBlockFromNode.ts` — stored-label derivation on parse (text before the colon, trimmed).
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

**Purpose:** Validate lint, build, and tests for a package step.

**Instructions:** (From `$PACKAGE/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build # produce dist — required before $PROJECT/tests/records runs
npm run test:unit # vitest over src
npm run test:integration # vitest over tests (fixtures + record-helpers)
```

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

- Step 1 / 7 — Pin the shipped spec and inventory the implementation seam
- Step 2 / 7 — Implement `relabelField` across types, capsule, and proxy
- Step 3 / 7 — Implement the five by-label twins behind an exact-label lookup
- Step 4 / 7 — Extend `RESERVED_FIELD_NAMES` with the six new members
- Step 5 / 7 — Land unit and fixture-table coverage
- Step 6 / 7 — Add fixtures `25-`, `26-`, and external `09-`, refresh `overview.md` and `README.md`
- Step 7 / 7 — Verify, stage the code and test paths, commit `implement-label-repair-api`

## Steps

### Step `1 / 7` — Pin the shipped spec and inventory the implementation seam

**Description:** Confirm the contract you implement and know every file you will touch before changing one.

**Instructions:**

1. Run the precondition block above from `$PROJECT`; record its output in your report. Any mismatch → REPORT A BLOCKER and STOP.
2. Read `$PACKAGE/knowledge/design/fields.md` — `## Relabeling a Field` (signature, address, the three label gates with validation-before-mutation, index effect, shadowed-duplicate behaviour), `## Reading and Writing by Label` (the five signatures, exact-label addressing, `undefined`/throw/never-create miss semantics, unchanged value semantics), `## Public Field API`, `### Reserved names` (fifteen names, fourteen reachable collisions).
3. Read the seams you will change: `$PACKAGE/src/record/types.ts` and `$PACKAGE/src/record/private/types.ts` (the two public shapes), `$PACKAGE/src/record/private/capsule/createRecordCapsule.ts` (all mutation lives here), `$PACKAGE/src/record/private/capsule/createRecordProxy.ts` (descriptors), `$PACKAGE/src/record/private/constants.ts` (`CANONICAL_FIELD_NAME_PATTERN`, `WORD_CHARACTER_PATTERN`, `RESERVED_FIELD_NAMES`), `$PACKAGE/src/record/private/section-field/` (`setSectionField`, `readSectionFieldMarkdown`, `isSectionField`), `$PACKAGE/src/record/private/field-index/createFieldIndex.ts`.
4. Note the codec constraint: `FIELD_TEXT_PATTERN` is not part of `@art-md/constructs`' public exports, so relabel's pattern gate is a local constant in `constants.ts`, commented with its `$ART_MD` source.

**Expected outcome:** a seam inventory (summarised in the report): the files gaining members, the helper to add, the local pattern constant, and the reserved list.

**Verify:** no file changed yet; `git status --short` is empty.

### Step `2 / 7` — Implement `relabelField` across types, capsule, and proxy

**Description:** The stored-label rewrite with the spec's gates; only `field.name` ever changes.

**Instructions:**

1. Add `relabelField(name: string, label: string): void;` to `ArtRecord` in `$PACKAGE/src/record/types.ts` and to `ArtRecordCapsule` in `$PACKAGE/src/record/private/types.ts` — signature verbatim from the spec.
2. Add the local codec-label pattern to `$PACKAGE/src/record/private/constants.ts` (a stored label must be letter-led, letters and spaces only, with no leading or trailing whitespace — the colon-bearing `FIELD_TEXT_PATTERN` of `$ART_MD` minus the colon), commented with the source path.
3. Implement `relabelField` in `createRecordCapsule.ts`, validating **in this order, before any mutation**:
   1. `isReservedFieldName(name)` → `TypeError` — same message style as `renameField`: `Reserved record field name: "${name}"`.
   2. `fieldIndex.get(name)` miss → `Error(\`Field not found: ${name}\`)`— exactly`renameField`'s not-found error.
   3. `WORD_CHARACTER_PATTERN.test(label)` fail → `TypeError: Field label must contain at least one word character` (the spec's verbatim message).
   4. local codec-label pattern fail → `TypeError: Invalid record field label: "${label}"`.
   5. `labelToName(label) !== name` → `TypeError: Field label "${label}" does not match field name "${name}"`.
4. On success set **only** `field.name = label`. Leave `fieldIndex` untouched — the key and the field object are unchanged, so no rebuild is needed; position, tags, and value are untouched by construction (`setSectionField` is not involved).
5. Add the proxy member in `createRecordProxy.ts`: a descriptor and passthrough mirroring `renameField` exactly (`configurable: true`, `value`, **no `enumerable`**), registered in `descriptors`.

**Expected outcome:** `record.relabelField('purpose', 'Purpose')` rewrites the label in place; every rejected call throws before touching the document or the index.

**Verify:** `npm run lint` from `$PACKAGE` is green; the gate order matches the spec's list; nothing under `$PACKAGE/knowledge/` changed.

### Step `3 / 7` — Implement the five by-label twins behind an exact-label lookup

**Description:** Addressing changes; the value paths are the existing ones.

**Instructions:**

1. Add an exact-label lookup helper under `$PACKAGE/src/record/private/section-field/` (folder-conform name, e.g. `findSectionFieldByLabel.ts`): scan `section.children` in document order, skip non-fields with `isSectionField`, return the first construct whose `name === label`, else `undefined`. No `labelToName`, no index, no reserved or grammar check on the argument — the spec puts labels outside both predicates.
2. Implement the five capsule methods in `createRecordCapsule.ts`, all resolving through the helper:
   - `getFieldMarkdownByLabel` → `readSectionFieldMarkdown(context.codec, field)`; `getFieldTextByLabel` → `context.codec.toText(field)`; `getFieldValueByLabel` → `structuredClone(field.children)`; each returns `undefined` when the helper misses.
   - `setFieldMarkdownByLabel` / `setFieldValueByLabel` → helper miss throws `Error(\`Field not found: ${label}\`)`; hit routes through `setSectionField(context.codec, field, value)`—`codec.parse`, automatic form, container rejection, label preservation all inherited; **no index rebuild** (the label does not change) and no creation path exists.
3. Add the five signatures to `ArtRecord` and `ArtRecordCapsule`, verbatim from the spec.
4. Add the five proxy descriptors mirroring the existing accessor/setter descriptors (`configurable: true`, `value`, no `enumerable`).

**Expected outcome:** a shadowed field's value is readable and writable by its stored label while `record.id` keeps returning the first-wins holder; all five `0.2.0` name-addressed methods are byte-for-byte unchanged.

**Verify:** `npm run lint` from `$PACKAGE` is green; `grep -c "ByLabel" $PACKAGE/src/record/types.ts` prints `5`; no label argument passes through `assertFieldName` or `assertNotReservedFieldName`.

### Step `4 / 7` — Extend `RESERVED_FIELD_NAMES` with the six new members

**Description:** New handle members must be reserved or they silently shadow same-named fields.

**Instructions:**

1. Append the six names to `RESERVED_FIELD_NAMES` in `$PACKAGE/src/record/private/constants.ts`, in the spec's order: `relabelField`, `setFieldMarkdownByLabel`, `setFieldValueByLabel`, `getFieldMarkdownByLabel`, `getFieldTextByLabel`, `getFieldValueByLabel` — fifteen entries total.
2. Confirm the fallout is automatic (do not re-implement it): `isReservedFieldName` covers them (proxy get/set/delete guards), and `createFieldIndex` aborts extraction on any label resolving to them.
3. Pin the counts and the collision labels in the existing reserved/promotion test tables: fifteen reserved names; fourteen reachable collision labels — the original eight plus `Relabel Field`, `Set Field Markdown By Label`, `Set Field Value By Label`, `Get Field Markdown By Label`, `Get Field Text By Label`, `Get Field Value By Label` — each aborting with `TypeError: Field label "{label}" resolves to reserved name "{name}"` (`__section` stays unreachable from any label).

**Expected outcome:** a document labelled `**Relabel Field:**` aborts extraction exactly like `**Name:**` does today.

**Verify:** the reserved-count assertions in the test tables print fifteen/fourteen; `npm run lint` from `$PACKAGE` is green.

### Step `5 / 7` — Land unit and fixture-table coverage

**Description:** Every gate, invariant, and miss semantic pinned beside the source, green in the same commit as the code.

**Instructions:**

1. Follow the repository's test layout: fixture-driven tables as sibling `.fixtures.ts` in `$PACKAGE/tests/record-helpers/` (data only) with slim representative tests co-located in `$PACKAGE/src/record/private/`, shared constants in `constants.ts`.
2. Relabel coverage: reserved name; absent name; label without a word character (spec's verbatim message); label outside the codec pattern (digit-led `3A33`, non-ASCII `Ação`, leading/trailing whitespace); label that re-derives a different name; every rejected case asserting the section **and** the index are untouched (snapshot equality); success asserting only `field.name` changed — position, tags, value, and the index key set identical before and after.
3. Index invariance: no promotion on relabel — with `**Purpose:** First` and `**purpose:** Second`, relabel the holder and assert `record.purpose` still reads `First`, `Object.keys` still lists `purpose` once, and the shadowed field keeps its own label.
4. By-label coverage: markdown/text/value hits; all three reads `undefined` on a miss; both writes throwing `Field not found: {label}` on a miss with the children count unchanged (never creates); the `Id`/`ID` pair — name read returns `First`, `getFieldMarkdownByLabel('ID')` reaches `Second`, a by-label write changes only `Second`; form conversion on a by-label write preserving name, tags, and position; label preserved after a value write; container rejection with the spec's verbatim `TypeError: Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline`.
5. Proxy coverage: the six new descriptors behave like `renameField`'s (function on read, non-enumerable, absent from `Object.keys` field names); reserved-name guards throw for all six on read, write, and delete.

**Expected outcome:** each spec bullet of `## Relabeling a Field` and `## Reading and Writing by Label` maps to at least one assertion; record the mapping (spec bullet → test) in your report.

**Verify:** `npm run test:unit` and `npm run test:integration` from `$PACKAGE` are green; coverage stays at or above the package gate (lines 90, functions 90, branches 70, statements 90).

### Step `6 / 7` — Add fixtures `25-`, `26-`, and external `09-`, refresh `overview.md` and `README.md`

**Description:** End-to-end proof through the codec and the FS adapter, in both suites.

**Instructions:**

1. Read `$PACKAGE/knowledge/design/integration-tests.md` first for fixture anatomy (directory per case, `integration.test.ts`, asserts final file state after one save).
2. In-package fixture `25-relabel-field-round-trip` under `$PACKAGE/tests/fixtures/` (next id after `24-rejected-values`): load a record carrying a derived label such as `**Npm Package Deployment:**`, relabel it to the house spelling `NPM Package Deployment`, assert name, position, tags, value, and the index unchanged, save, reload, and assert the new label persisted with the same extracted name; plus a rejected relabel (gate failure) leaving the saved file byte-identical.
3. In-package fixture `26-by-label-field-access` under `$PACKAGE/tests/fixtures/`: the duplicate pair `**Id:** First` / `**ID:** Second` plus a normal field — name-addressed read returns `First`, `getFieldMarkdownByLabel('ID')` reaches `Second`, a by-label write changes only `Second`, miss reads return `undefined`, a miss write throws, and save → reload keeps first-wins with both labels intact.
4. External fixture `09-label-repair-access` under `$PROJECT/tests/records/fixtures/` (next id after `08-field-value-reads`): the consumer-facing path end to end — extract, `relabelField`, all five by-label twins, save, re-read.
5. **Docs refresh (plan bullet 4) — docs-only edits, same green requirement.** In `$PACKAGE/knowledge/overview.md`, add the fixture-map rows for `25-relabel-field-round-trip` and `26-by-label-field-access`, with use-case wording mirroring the existing rows (same columns, same voice; the use-case-to-fixture map lives there). In `$PACKAGE/README.md`, add the field-surface additions (the relabel operation and the five by-label twins) and the grown reserved-name note — fifteen reserved names, fourteen reachable collision labels. These two files are the only knowledge-adjacent paths you may touch; every other knowledge file stays contract-only. Run the **Verifying Step** after them.
6. **RULE: run `npm run build` in `$PACKAGE` before running `$PROJECT/tests/records`** — that suite resolves `@art-js/records` through `dist`; rerun the build if any `src/` change lands after the last one.

**Expected outcome:** three new fixture directories, all green; the external fixture proves the shipped surface, not the private seams.

**Verify:** `npm run test:integration` from `$PACKAGE` lists `25-…` and `26-…` green; `npm run test:integration` from `$PROJECT/tests/records` lists `09-…` green **after** a fresh `$PACKAGE` build.

### Step `7 / 7` — Verify, stage the code and test paths, commit `implement-label-repair-api`

**Description:** Full verification, the staging guard, and the commit.

**Instructions:**

1. Run the **Verifying Step** from `$PACKAGE`: `lint:fix`, `lint`, `build`, `test:unit`, `test:integration`.
2. Run the **Verifying Completion** from `$PROJECT`: `npm run ci`.
3. Confirm the change set respects the guard:

   ```bash
   git status --short
   ```

   Only `$PACKAGE/src/**`, `$PACKAGE/tests/**`, `$PROJECT/tests/records/**`, plus `$PACKAGE/knowledge/overview.md` and `$PACKAGE/README.md`, may appear, and `./instructions/implement-label-repair-api__report.md` once rendered. **No** other `$PACKAGE/knowledge/**` file (`design/fields.md`, `adr/fields.art`, `design/records.md`, `index.md`), no `CHANGELOG.md`, no `package.json`, no `package-lock.json`, nothing under `_backlog/1-done/`.

4. Stage exactly the touched files under the allowed groups — the three path groups plus the two docs paths — enumerated from `git status --short`, file by file. Never `git add -A`, never `git add .`, never a directory that could sweep an out-of-scope path.
5. Leave `./instructions/implement-label-repair-api__report.md` **unstaged** — the delegator commits it.
6. Commit from `$PROJECT`.

**Message:**

```text
build(records): Add label repair and by-label field access.

- Relabel stored labels in place and address field values by stored label.
- Reserve the new handle members and cover both suites with fixtures.
```

The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push (`NOPUSH`) and do **not** run `npm version`, `npm publish`, or any release command: this plan ships no version bump and no publish.

---

## Final Verification

**Instructions:**

- Verify the commit exists locally and was **not** pushed (`NOPUSH`).
- Verify only `$PACKAGE/src/**`, `$PACKAGE/tests/**`, `$PROJECT/tests/records/**`, plus `$PACKAGE/knowledge/overview.md` and `$PACKAGE/README.md`, were committed; `git status` shows no other knowledge file changed (`design/fields.md`, `adr/fields.art`, `design/records.md`, `index.md`), no manifest, changelog, backlog, or roadmap change, and nothing under `_backlog/1-done/`.
- Verify the spec never moved: the precondition greps still pass and `git log -1 --format=%h -- libs/records/knowledge/design/fields.md` still prints `f74746f`.
- Verify `relabelField` validates in the spec's order, rewrites only `field.name`, and leaves the index untouched; the rejected-relabel and index-invariance tests are green.
- Verify all five by-label twins exist with the spec's miss semantics (`undefined` / throw / never create), and no label argument passes through the reserved or grammar predicates.
- Verify `RESERVED_FIELD_NAMES` holds fifteen entries and the fourteen reachable collision labels abort extraction with the exact `TypeError` message.
- Verify fixtures `25-…`, `26-…`, and external `09-…` exist and pass, the external suite ran after a fresh `$PACKAGE` build, and `npm run ci` passes from `$PROJECT`.
- Verify `knowledge/overview.md` and `README.md` are refreshed as specified (fixture-map rows for `25-`/`26-`, field-surface additions and the grown reserved-name note), and no other knowledge file changed.
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Render `./instructions/implement-label-repair-api__report.md` and leave it unstaged.
- Report according to the "How to Report Back to the Delegator" instructions.
