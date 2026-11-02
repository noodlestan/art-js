# Instructions: `index-property-access-and-labels`

**Plan:** `canonical-record-field-names`

**Iteration Id:** `index-property-access-and-labels`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/index-property-access-and-labels__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `index-property-access-and-labels`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `index-property-access-and-labels`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Move every proxy trap of `@art-js/records` onto one name space: a `name → field` index built once when the record is extracted, so reads, writes, membership, and enumeration are index lookups — no access scans section fields or converts a label — while every loaded Markdown label survives a value update, duplicates promote on removal, and `renameField` becomes a name-to-name operation. Land every dependent fixture and test update with the source in the same commit, so `$PACKAGE` and `$PROJECT` are green at `refactor(records): Resolve record fields through a name index.`

This is the plan's single behaviour change: label-based access stops resolving instead of matching by accident or appending duplicate fields. Commit `index-property-access-and-labels` is `NOPUSH`.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript.

::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — Conventions: Unit Tests.

- reference: `../plan__pseudo.md` — the converter rules (direction A extraction, direction B round trip) the index conversion tests re-assert.
- reference: `../plan__tests.md` — case derivation, the `it.each` mechanism, and the two forbidden assertions.
  **Superseded layout:** its section 1 describes co-locating fixtures in `src/record/private/`; commit `298fd12` moved the fixture-driven tables to `$PACKAGE/tests/record-helpers/`. Follow the layout stated in Step 6 below — not section 1 — for where test files go.
- design: `$PACKAGE/knowledge/design/records.md` — the exact-label behaviour this iteration replaces.
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

- Step 1 / 7 — Build the `name → field` index at extraction
- Step 2 / 7 — Route reads and writes through the index
- Step 3 / 7 — Synchronise mutations and promote duplicates
- Step 4 / 7 — Convert `renameField` to name-to-name
- Step 5 / 7 — Enumeration and guards through the index
- Step 6 / 7 — Align the in-package fixtures and the external test package
- Step 7 / 7 — Commit `index-property-access-and-labels`

## Steps

### Step `1 / 7` — Build the `name → field` index at extraction

**Goal:** one build-time pass converts each stored label exactly once; no later access converts a label again.

**Files:**

- MODIFY `$PACKAGE/src/record/private/types.ts` — add the index type and expose it on the capsule:

  ```ts
  export type FieldIndex = ReadonlyMap<FieldName, SectionField>;
  ```

  and add `readonly fields: FieldIndex;` to `ArtRecordCapsule`.

- CREATE `$PACKAGE/src/record/private/createFieldIndex.ts`
- CREATE `$PACKAGE/src/record/private/createFieldIndex.test.ts` (slim, co-located — see Step 6 for the split)
- MODIFY `$PACKAGE/src/record/private/createRecordCapsule.ts` — build the index once when the capsule is created, before any trap can run, and expose it as `fields`.

**Execution:**

- `createFieldIndex(section)` walks `section.children` in document order; for each section field it computes `labelToName(field.name)` and registers the **first** occurrence. A later field whose name is already registered is skipped: it stays in `__section`, unreachable by name while that holder holds it, until a mutation vacates the name.
- The index is a `Map` owned by the capsule; the proxy receives only the `ReadonlyMap` view. It appears in no other API surface — no barrel export, no parameter passing outside `$PACKAGE/src/record/private`.
- Both extraction and creation reach the capsule through `wrapSectionAsRecord` (`createRecord` and `createRecordsCollection`), so building inside `createRecordCapsule` is the single build site.
- Reserved-label extraction does **not** throw here — that is iteration `handle-collisions-and-reserved-labels`. A label converting to `name`, `save`, `renameField`, `__section`, or a `__` prefix registers like any other name in this iteration.
- No behaviour changes yet: traps still resolve through the old path; the index is built and read by the new unit tests only.

**Expected outcome:** given a section carrying `**Purpose:** First` and `**purpose:** Second`, the index maps `purpose` → the **First** field, the second field is absent from the index, and `fields` reads back as a `ReadonlyMap` (`instanceof Map`, and mutation attempts through the view throw in strict mode / are not typed).

**Tests:** `$PACKAGE/src/record/private/createFieldIndex.test.ts` — representative cases only (`GIVEN`/`WHEN`/`FOR` titles): first occurrence wins in document order; a skipped duplicate is not indexed; a digit-led label (`**3A33:**`) registers under `3A33`; an empty section yields an empty index. Exhaustive tables belong in `tests/record-helpers/` per Step 6 — none needed at build stage.

**Verify:** `npm run test:unit` and `npm run test:integration` from `$PACKAGE` are green.

### Step `2 / 7` — Route reads and writes through the index

**Goal:** `get`, `set`, and `delete` resolve through the index; the regexp is consulted only when a write creates a field.

**Files:**

- MODIFY `$PACKAGE/src/record/private/createRecordProxy.ts` — the `get`, `set`, and `deleteProperty` traps.
- MODIFY `$PACKAGE/src/record/private/createRecordCapsule.ts` — `getField`/`setField` resolve the field object from `fields` instead of asking a section helper to scan.
- MODIFY `$PACKAGE/src/record/private/assertFieldName.ts` — validate an API-supplied name as `isReservedFieldName` first, then `isCanonicalFieldName`.
- MODIFY `$PACKAGE/src/record/private/getSectionField.ts`, `setSectionField.ts` — take a resolved `SectionField` (or equivalent) instead of comparing `construct.name === name`; the access path never compares labels.
- KEEP `$PACKAGE/src/record/private/listSectionFieldNames.ts` — it keeps returning raw labels and is not part of any access path.

**Execution — the name class table is the specification. Copy it into the tests, one case per cell per trap:**

| Name                                                       | `rec[name]` | `rec[name] = v`                    | `delete rec[name]` | `name in rec` | `Object.keys` |
| ---------------------------------------------------------- | ----------- | ---------------------------------- | ------------------ | ------------- | ------------- |
| handle: `name`, `save`, `renameField`, `__section`         | unchanged   | unchanged                          | `false`            | `true`        | —             |
| reserved: `__foo`                                          | `TypeError` | `TypeError`                        | `TypeError`        | `false`       | no            |
| index hit, canonical: `purpose`                            | field text  | replaces the text, keeps the label | `true`             | `true`        | yes           |
| index hit, extracted non-canonical: `3A33`                 | field text  | replaces the text, keeps the label | `true`             | `true`        | yes           |
| index miss, canonical: `brandNew`                          | `undefined` | appends `Brand New`                | `false`            | `false`       | yes           |
| index miss, non-canonical: `Years active`, `CanonicalName` | `undefined` | `TypeError`                        | `TypeError`        | `false`       | no            |

Rules:

- Handle members are untouched: `Reflect.has(target, property)` wins first in every trap, exactly as today. The target's own properties are `name`, `__section`, `renameField`, `save`.
- A reserved name (`__` prefix) throws `TypeError` on read, write, and delete. Keep `assertFieldName`'s existing message verbatim — `Record field names starting with "__" are reserved` — `$PACKAGE/src/record/createRecord.test.ts` asserts it and must not be edited.
- A read is an index lookup and **never** runs `isCanonicalFieldName`: `record['3A33']` and `record['ação']` return their field text; `record['Years active']` returns `undefined` without throwing.
- `set` on an index hit writes through the resolved field's own children — the Markdown label is never touched. `set` on an index miss appends a `FieldInline` labelled `nameToLabel(name)` (so `brandNew` yields `**Brand New:**`) and registers the name; before appending, gate the name with `assertFieldName` — a non-canonical miss throws `TypeError` with message `Invalid record field name: "${name}"`.
- `delete` on an index hit removes the holder and returns `true` (promotion runs in Step 3); on an index miss returns `false`; a reserved name throws.

**Expected outcome:** every row of the table holds for `get`, `set`, `delete`, `in`, and `Object.keys`; `record.canonicalName` and `record.purpose` read the values of `**Canonical Name:**` and `**Purpose:**` from a real `package.art` fixture; a label-based write such as `record['Canonical Name'] = 'x'` throws `TypeError` and appends nothing.

**Tests:**

- Slim, co-located: `$PACKAGE/src/record/private/createRecordProxy.test.ts` (or extend `createRecord.test.ts` where the behaviour is record-level) for the representative guard cases.
- Fixture-driven, in `$PACKAGE/tests/record-helpers/` with sibling `.fixtures.ts`: the full name-class table per trap, driven through `it.each` with `%s` titles.

**Verify:** `npm run test:unit` and `npm run test:integration` from `$PACKAGE` — the old label-access expectations fail until Step 6; the new unit and record-helper tests must be green.

### Step `3 / 7` — Synchronise mutations and promote duplicates

**Goal:** the index invariant holds for the record's whole life: each name maps to the first field in document order that converts to it.

**Files:**

- MODIFY `$PACKAGE/src/record/private/createRecordCapsule.ts` — `setField`, `deleteField`, and the internal index mutation; promotion scan.
- MODIFY `$PACKAGE/src/record/private/deleteSectionField.ts` — removal by resolved field, not label scan (or fold it into the capsule and delete the file if nothing else imports it).

**Execution:**

- **Create** (canonical miss): append the field, register its name.
- **Value update** (hit): keep the entry and the original Markdown label — never relabel on a value write.
- **Delete** (hit): remove the holder from `section.children`, delete the name from the index, then **promote**: scan the remaining `section.children` in document order and register the first field whose `labelToName(field.name)` equals the vacated name, if any.
- **Promotion also runs for the name vacated by `renameField`** (Step 4). The scan runs inside the mutation only — never on a read, never on a value update.
- Removing something that holds no index entry changes nothing: deleting through `record.__section.children.splice(...)` (a shadowed duplicate) must leave the index and `record.purpose` exactly as they were.
- The promoted field keeps its own label — `**purpose:** Second` stays spelled `Second` — and survives a save.

**Expected outcome — duplicate-promotion scenarios, all asserted:**

- Document with `**Purpose:** First` and `**purpose:** Second`: extraction reads `First`, `Object.keys` lists `purpose` once.
- After `delete record.purpose`: `record.purpose` reads `Second`.
- After `renameField('purpose', 'brandNew')`: `record.brandNew` reads `First` and `record.purpose` reads `Second`.
- After deleting the _skipped_ duplicate directly through `__section`: `record.purpose` still reads `First`.
- After promotion, save and assert the promoted label `**purpose:**` is intact in the written document.

**Tests:** fixture-driven promotion tests in `$PACKAGE/tests/record-helpers/` (markdown document in the test's fixture data), plus index-synchronisation assertions after create, value update, delete, and rename.

**Verify:** `npm run test:unit` and `npm run test:integration` from `$PACKAGE` are green.

### Step `4 / 7` — Convert `renameField` to name-to-name

**Goal:** `renameField(fromName, toName)` operates exclusively on names, validating in a fixed order and mutating nothing when it rejects.

**Files:**

- MODIFY `$PACKAGE/src/record/private/createRecordCapsule.ts` — `renameField`.
- MODIFY `$PACKAGE/src/record/private/renameSectionField.ts` — relabel the resolved field, or fold into the capsule.

**Execution — validation order, each step throwing before any mutation:**

1. `isReservedFieldName(fromName)` or `isReservedFieldName(toName)` → `TypeError` with message `Reserved record field name: "${name}"`.
2. `fromName` absent from the index → `Error` with message `Field not found: ${fromName}` (matches today's wording).
3. `!isCanonicalFieldName(toName)` → `TypeError` with message `Invalid record field name: "${name}"`.
4. `toName` already holds an index entry → `TypeError` with message `Field name already exists: "${toName}"`. This check happens **before any mutation**, so a rejected rename leaves the document and the index untouched.

Then, and only then: set the underlying Markdown field's `name` to `nameToLabel(toName)` — `renameField('purpose', 'brandNew')` leaves `**Brand New:**` and forgets `purpose` — swap the index entries, and promote on the vacated `fromName` (Step 3).

- `fromName` is deliberately **not** held to the canonical grammar: it only has to be present in the index, so a field carrying an extracted non-canonical name (`3A33`, `ação`) can be renamed onto a canonical one. Do not run `isCanonicalFieldName(fromName)`.
- A rename forgets the previous spelling; there is no preservation of the old label.

**Expected outcome:** `renameField('purpose', 'brandNew')` writes `**Brand New:**`, `record.brandNew` reads `First`, `record.purpose` is gone; `renameField('purpose', 'owner')` throws `TypeError` and changes neither the document nor the index; `renameField('3A33', 'repaired')` succeeds from an extracted non-canonical source; every rejection is asserted to leave `record.__section.children` and the enumerated keys byte-identical.

**Tests:** fixture-driven rename tests in `$PACKAGE/tests/record-helpers/` covering the four validation steps in order, the successful relabel, promotion on rename, and untouched-on-rejection.

**Verify:** `npm run test:unit` and `npm run test:integration` from `$PACKAGE` are green.

### Step `5 / 7` — Enumeration and guards through the index

**Goal:** membership and key enumeration read the index; the two predicates stay independent.

**Files:**

- MODIFY `$PACKAGE/src/record/private/createRecordProxy.ts` — `has`, `ownKeys`, `getOwnPropertyDescriptor`.
- MODIFY `$PACKAGE/src/record/private/getExposedFieldNames.ts` — a thin view over the index: reserved names excluded, first-wins already resolved at build time.
- MODIFY `$PACKAGE/src/record/private/findSectionField.ts` and its remaining callers — no exact-label comparison anywhere on an access path.

**Execution:**

- `has`: target own property → `true`; otherwise the index holds the name and it is not reserved → `true`; everything else `false` (`__foo` → `false`, `brandNew` → `false`).
- `ownKeys`: target own keys merged with exposed field names, deduplicated — `Object.keys(record)` lists exactly the non-reserved index names.
- `getOwnPropertyDescriptor`: target descriptor first; otherwise an enumerable/configurable/writable descriptor whose value is the indexed field's text; `undefined` for names outside the index or reserved.
- `assertFieldName` remains the single gate for API-supplied names — reserved first, then canonical — and runs only where a name is supplied, never against an extracted name.
- The proxy must not call `getExposedFieldNames` more than once per trap.

**Expected outcome:** `Object.keys(record)` on a document with `**Purpose:**`, `**Canonical Name:**`, and `**3A33:**` yields `purpose`, `canonicalName`, `3A33` (reserved names absent, `3A33` present because the index holds it); `'purpose' in record` is `true`, `'brandNew' in record` is `false`, `'__foo' in record` is `false`.

**Tests:** `it.each` rows for `in` and `Object.keys` per name class; reserved-exclusion rows for `getExposedFieldNames`; a test pinning `listSectionFieldNames` to raw labels.

**Verify:** `npm run test:unit` and `npm run test:integration` from `$PACKAGE` are green.

### Step `6 / 7` — Align the in-package fixtures and the external test package

**Goal:** every dependent test asserts the new behaviour — source and tests land together, nothing is deferred.

**Files:**

- MODIFY the 11 in-package fixtures under `$PACKAGE/tests/fixtures/` that read or write fields by label: `04-field-read`, `05-write-field`, `06-add-field`, `07-remove-field`, `08-rename-field-in-place`, `10-save-document-collection`, `11-create-new-record`, `12-add-record-to-existing-document`, `13-add-sibling-record`, `15-add-record-under-parent`, `17-batch-save`. `03-read-assert-extract` was audited and does **not** change (it asserts an empty field list on a field-less record).
- MODIFY `$PACKAGE/tests/fixtures/09-section-depth/integration.test.ts` — it does not access fields by label, but its persisted-content assertion pins the **generated** label of a canonical-miss write: keep the write `artist['owner'] = 'foo'` as-is and update the assertion to `**Owner:** foo`. That is its only change.
- MODIFY the six `$PROJECT/tests/records` cases that access fields by label (`01`–`06`, covering `Artist`, `Years active`, `Active`, `Album`, `Producer`) — replace label access with the canonical names (`artist`, `yearsActive`, `active`, `album`, `producer`).
- CREATE `$PACKAGE/tests/fixtures/18-canonical-name-round-trip/`.
- CREATE promotion, conversion, and round-trip assertions in `$PACKAGE/tests/record-helpers/` (fixture data as sibling `.fixtures.ts` files).

**Execution:**

- In `01-read-document`, invert the case-sensitivity case: `song['artist']` now resolves and `song['Artist']` is `undefined`; add assertions that a field name resolves a loaded label, that the external `getFieldNames` helper returns the extracted names, and that a label-based write throws.
- Round-trip fixture `18-canonical-name-round-trip`: load a document with `**Canonical Name:**`, mutate `canonicalName`, save, and assert the label plus all untouched structure survive the write.
- Index-level conversion tests: a digit-led (`**3A33:**`) or non-ASCII (`**Ação:**`) label keeps its original spelling while its extracted name reads and writes normally through the record — including a name that is not itself canonical.
- Direction B re-asserted at the record level for canonical field names (`labelToName(nameToLabel(name)) === name`); the forbidden assertions from `../plan__tests.md` section 3 must not appear.
- **Layout (post `298fd12`):** exhaustive `it.each` tables go in `$PACKAGE/tests/record-helpers/` with their `.fixtures.ts` sibling (data only — no imports, no loops, no assertions); a small representative set stays co-located as `*.test.ts` next to the module in `src/record/private/`; whole-document behaviours go in the numbered `$PACKAGE/tests/fixtures/` directories. Fixtures assert primary behaviour only; the guard, index, and conversion variants live in the record-helper and co-located tests.

**Expected outcome:** every suite green with no `-wip`, skipped, or `.only` tests: `npm run test` from `$PACKAGE`, then `npm run ci` from `$PROJECT`.

**Verify:** `npm run test` from `$PACKAGE` is green; run the **Verifying Step** instructions from the Operating Instructions section.

### Step `7 / 7` — Commit `index-property-access-and-labels`

#### Commit: `index-property-access-and-labels`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
refactor(records): Resolve record fields through a name index.

- Build a name-to-field index at extraction and route every trap through it.
- Preserve loaded labels and generate labels for new fields.
- Reject non-canonical and reserved names on mutation.
- Convert renameField to name-to-name.
- Align in-package and external fixtures with canonical names.
```

Stage every source change, every updated fixture and test, and the new `18-canonical-name-round-trip` fixture, then commit from `$PROJECT`. The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit must exist locally and must **not** be pushed.
- Verify every cell of the name-class table in Step 2 is pinned by a test for each trap (`get`, `set`, `delete`, `in`, `Object.keys`).
- Verify no access path scans section fields or converts a label: index build and mutation promotions are the only call sites of `labelToName` in `$PACKAGE/src/record/private` (besides the converters' own tests). State this in your report with the evidence (grep results).
- Verify label preservation: the `18-canonical-name-round-trip` fixture proves every untouched label and the document structure are byte-identical after a value update.
- Verify all four promotion scenarios from Step 3 are asserted, including that the promoted field keeps its own label across a save.
- Verify the rename validation order from Step 4, that every rejection leaves document and index untouched, and that `renameField` relabels via `nameToLabel(toName)`.
- Verify `$PACKAGE/src/record/createRecord.test.ts` is untouched and its `Record field names starting with "__" are reserved` assertion still passes.
- Verify fixture `03-read-assert-extract` was not modified (`git diff --stat`), and that `09-section-depth`'s only change is the persisted-label assertion (`**Owner:** foo`).
- Verify no helper (`createFieldIndex`, `FieldIndex`, `getExposedFieldNames`, …) is exported from `$PACKAGE/src/index.ts` or `$PACKAGE/src/api/index.ts` — these modules stay private to `record/private`.
- Verify the new test files follow the Step 6 layout: data-only `.fixtures.ts` siblings in `tests/record-helpers/`, `it.each` titles interpolating inputs with `%s`, no mocks or spies.
- Verify neither forbidden assertion appears: no `labelToName(labelToName(x))`, and no `nameToLabel(labelToName(label)) === label` over an extracted label.
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Report according to the "## How to Report Back to the Delegator" instructions.
