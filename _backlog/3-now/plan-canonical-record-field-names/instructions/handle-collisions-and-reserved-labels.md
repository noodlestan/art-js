# Instructions: `handle-collisions-and-reserved-labels`

**Plan:** `canonical-record-field-names`

**Iteration Id:** `handle-collisions-and-reserved-labels`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/handle-collisions-and-reserved-labels__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `handle-collisions-and-reserved-labels`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                                 |
| ------------ | ------------------------- | --------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory                |
| `$PROJECT`   | `checkouts/art-js`        | Art JS checkout where the work executes |
| `$PACKAGE`   | `$PROJECT/libs/records`   | The `@art-js/records` package           |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `handle-collisions-and-reserved-labels`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Make collisions deterministic: a document label that converts to a handle-member name aborts record creation with a `TypeError` naming the label and the reserved name, and duplicate extracted names have one written, pinned contract — first occurrence in document order wins, promotion on removal brings the shadowed duplicate back with its own label. The precedence and promotion mechanics already exist from `index-property-access-and-labels`; this iteration asserts them from the extraction path, pins them with two new fixtures, and adds **no** new mutation logic. Commit as `fix(records): Enforce name collisions and reserved labels.`

This iteration touches only `$PACKAGE` — source guard, unit tests, record-helper suites, and fixtures `19`/`20`. No `$PROJECT/tests/records` changes, no `knowledge/**` prose (that is iteration `document-field-name-access`): here the rules are written down as exhaustive tests and fixtures.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript.

::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — Conventions: Unit Tests.

- reference: `../plan__pseudo.md` — the converter rules; specifically why a `__`-prefixed **label** converts to a non-reserved name (`__foo` → `foo`), which shapes the abort's reachable set below.
- reference: `../plan__tests.md` — case derivation, the `it.each` mechanism, and the two forbidden assertions. Its section 1 layout is superseded: fixture-driven tables live in `$PACKAGE/tests/record-helpers/`, slim tests co-located in `src/record/private/`.
- design: `$PACKAGE/knowledge/design/records.md` — current (stale) description of exact-label access; you do NOT modify it here.
- guide: `$PACKAGE/_guide.md` — package layout and operating instructions.
- guide: `$PROJECT/_guide.md` — repository layout and operating instructions.

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

### Verifying Step

**Purpose:** Validate lint, tests and build for a package step.

**Instructions:** (From `$PACKAGE/_guide.md`)

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run build # to produce a full build
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

- Step 1 / 4 — Abort index construction on reserved-converting labels
- Step 2 / 4 — Pin first-wins precedence and promotion from the extraction path
- Step 3 / 4 — Add the duplicate-name and reserved-label fixtures
- Step 4 / 4 — Commit `collisions-and-reserved`

## Steps

### Step `1 / 4` — Abort index construction on reserved-converting labels

**Goal:** a label that converts to a reserved name kills record creation before a handle member can shadow the field.

**Files:**

- MODIFY `$PACKAGE/src/record/private/createFieldIndex.ts` — the single index-construction site (capsule creation **and** the mutation rebuilds call it).
- MODIFY `$PACKAGE/src/record/private/createFieldIndex.test.ts` — slim co-located cases.

**Execution:**

- Inside `createFieldIndex`, after computing `name = labelToName(field.name)` for a section field, throw when `isReservedFieldName(name)`:

  ```ts
  throw new TypeError(`Field label "${field.name}" resolves to reserved name "${name}"`);
  ```

- Use `isReservedFieldName` as the test — do not hand-list `name`, `save`, `renameField`, `__section`, or the `__` prefix. The message format is pinned verbatim by the plan and by the fixture in Step 3.
- **Reachable set — assert this precisely:** `labelToName` can only ever produce `name`, `save`, or `renameField` as reserved outputs, from labels such as `Name`, `NAME`, `name`, `Save`, `Rename Field`, or `RenameField`. A `__`-prefixed **label** converts to a non-reserved name (`__section` → `section`, `__foo` → `foo`), so it never throws — the `__section` and `__` members of the predicate are defensive uniformity, not reachable collisions. Positive rows trigger; `__`-label rows assert NO throw and normal registration.
- Because the rebuilds (create, delete, rename) run the same constructor, a live record can only rebuild over labels it could already hold — additions are gated by `assertFieldName`, so no new reserved label can appear. One slim test pins the deterministic edge: hand-inserting a `FieldInline` named `Name` through `record.__section.children` and then deleting any field makes the rebuild throw the same `TypeError`.
- Empty sections never collide: `createFieldIndex` over a section with no fields returns an empty index without throwing — keep/extend the existing slim case.

**Expected outcome:** extracting a record from a document carrying `**Name:** x` throws `TypeError: Field label "Name" resolves to reserved name "name"`; the same document's `Save`/`Rename Field` labels throw for `save`/`renameField`; `__section`-labelled documents load fine (registered as `section`).

**Tests:** slim co-located cases for the positives, the `__`-negatives, and the empty section; exhaustive label families (`Name`/`NAME`/`name`/`Save`/`Rename Field`/…) as data-only `.fixtures.ts` tables in `$PACKAGE/tests/record-helpers/` per the Step 2 layout convention.

**Verify:** `npm run test:unit` and `npm run test:integration` from `$PACKAGE` are green.

### Step `2 / 4` — Pin first-wins precedence and promotion from the extraction path

**Goal:** the collision contract — settled in `index-property-access-and-labels` — is now asserted from records **extracted from documents**, not only from hand-built sections, and the mutation guards are re-verified from that path without being re-implemented.

**Files:**

- MODIFY `$PACKAGE/tests/record-helpers/recordFieldPromotion.test.ts` (or a sibling `recordFieldCollisions.fixtures.ts` + suite, same layout) — add extraction-path rows.
- MODIFY `$PACKAGE/tests/record-helpers/recordFieldAccess.test.ts` — re-assert the name-class guards from an extracted record.
- MODIFY `$PACKAGE/tests/helpers/records/extractTestRecord.ts` / `createSectionRecord.ts` only if a small shared helper is genuinely needed.

**Execution — all assertions, no behaviour change:**

- Precedence: for a document with `**Purpose:** First` and `**purpose:** Second`, the extracted record reads `First`, `Object.keys(record)` lists `purpose` once, and `record.__section` still holds both fields.
- Promotion on delete: `delete record.purpose` promotes `Second` — same label `**purpose:**`, and the name survives a save.
- Promotion on rename: `renameField('purpose', 'brandNew')` leaves `record.brandNew` → `First` and `record.purpose` → `Second`.
- No-op removal: removing the shadowed duplicate directly through `record.__section.children.splice(...)` leaves the index and `record.purpose` reading `First`.
- Guards from extraction-built records: reserved `get`/`set`/`delete` throw `TypeError`; canonical miss write appends `nameToLabel(name)`; non-canonical miss write throws `TypeError`; rename collision rejection leaves document and keys byte-identical. These reuse the landed helpers — do not copy fixture tables that already exist in `recordFieldAccess.test.ts`; add the extraction-path variant only.

**Expected outcome:** every collision and guard cell above is pinned by an `it.each` row or a named case with `%s`-interpolated titles; no source file changes (`git diff --stat` on `$PACKAGE/src` is empty for this step).

**Verify:** `npm run test:unit` and `npm run test:integration` from `$PACKAGE` are green.

### Step `3 / 4` — Add the duplicate-name and reserved-label fixtures

**Goal:** the two rules reach the numbered fixture suite, exercised through codec-parsed documents.

**Files:**

- CREATE `$PACKAGE/tests/fixtures/19-duplicate-field-names/` (`_records/…` + `integration.test.ts`)
- CREATE `$PACKAGE/tests/fixtures/20-reserved-label-throws/` (`_records/…` + `integration.test.ts`)

(These numbers supersede the plan's original `18`/`19`: `18-canonical-name-round-trip` took `18` — see plan Feedback.)

**Execution:**

- `19-duplicate-field-names` — a document carrying `**Purpose:** First` and `**purpose:** Second` (both letter-led, so the codec parses them). Assert: extraction reads `First`; `getFieldNames`/`Object.keys` enumerate `purpose` once; deleting the holder promotes `Second` with its own `**purpose:**` label; saving keeps the promoted label. Follow the existing fixture harness (`copyFixtureCase`, adapter mock, `findRecordByName`) as the neighbouring fixtures do.
- `20-reserved-label-throws` — a document carrying a `**Name:**` field. Assert the read/extract path throws `TypeError` with the exact message `Field label "Name" resolves to reserved name "name"`, and that no partial record escapes. Model the throwing-path assertions on how `14`/`16` assert their throws.

**Expected outcome:** `npm run test` from `$PACKAGE` is green with the two new fixtures; the codec constraint holds — every label in these fixtures is letter-led (`/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`); no digit-led or non-ASCII labels appear in codec fixtures.

**Verify:** the **Verifying Step** instructions from the Operating Instructions section.

### Step `4 / 4` — Commit `collisions-and-reserved`

#### Commit: `collisions-and-reserved`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
fix(records): Enforce name collisions and reserved labels.

- First occurrence wins on duplicate field names.
- Throw when a label resolves to a handle member.
- Add collision and reserved-label fixtures.
```

Stage the guard change in `createFieldIndex.ts`, every new and modified test, helper, and fixture, then commit from `$PROJECT`. The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit must exist locally and must **not** be pushed.
- Verify the abort message is exactly `Field label "{label}" resolves to reserved name "{name}"` and is pinned by `19`/`20`-style assertions and the record-helper tables.
- Verify the reachable-set split is asserted: `Name`/`NAME`/`Save`/`Rename Field` throw; `__section`- and `__foo`-labelled documents load and register (`section`, `foo`).
- Verify precedence, promotion (delete and rename), and the shadowed-removal no-op are pinned from an extracted record, and that the promoted label survives a save.
- Verify the mutation guards from `index-property-access-and-labels` are re-asserted, not re-implemented: `git diff --stat` on `$PACKAGE/src` shows only `createFieldIndex.ts` (plus its slim test).
- Verify fixtures `18-canonical-name-round-trip` and `09-section-depth` are untouched (`git diff --stat`).
- Verify no `knowledge/**` file was modified — prose is iteration `document-field-name-access`.
- Verify the new tests follow the layout: data-only `.fixtures.ts` in `tests/record-helpers/`, `it.each` titles interpolating inputs with `%s`, no mocks or spies, dot-notation disables only on literal bracket keys.
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Report according to the "## How to Report Back to the Delegator" instructions.
