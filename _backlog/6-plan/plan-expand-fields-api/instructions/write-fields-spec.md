# Instructions: `write-fields-spec`

**Plan:** `expand-fields-api`

**Iteration Id:** `write-fields-spec`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Precondition:** this iteration restructures an existing knowledge base. Before touching any file, confirm the structure you are about to restructure matches what the plan describes:

```bash
grep -c "^### Decisions" $PACKAGE/knowledge/design/records.md   # must print 2
ls $PACKAGE/knowledge/adr/                                      # canonical-field-names.art, field-name-index.art, rename-field-by-name.art
```

If either check fails (a concurrent session restructured the knowledge in the meantime, or the decisions sections moved), REPORT A BLOCKER with the actual state — do not improvise a different restructure.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/write-fields-spec__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `write-fields-spec`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                | Purpose                                       |
| ------------ | ---------------------------- | --------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                      |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates   |
| `$SKILLS`    | `$WORKSPACE/.agents/skills`  | Art agent modes and skills                    |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes       |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package                 |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout — codec, constructs, fixtures |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `write-fields-spec`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Write `$PACKAGE/knowledge/design/fields.md` — the single specification of the records field API, and the place every API name for the expanded set/read surface lives — then reorganise the knowledge base around it: extract all field content out of `design/records.md`, link the two documents, home the two existing `### Decisions` sections as `knowledge/adr/records.art` and `knowledge/adr/fields.art`, register the new files in `knowledge/index.md`, and rewrite `knowledge/overview.md` so `records` and `fields` are summarised separately with nothing duplicated. Commit as `docs(records): Write the fields spec and restructure record knowledge.`

This is a **specification** iteration: you write documentation, not code. The implementation of the spec is the next iteration (`implement-fields-spec`), which stays `DRAFT` until this spec lands and is reviewed against the plan's Scope. You therefore decide and name the API — the plan deliberately prescribes none.

Commit `write-fields-spec` is `NOPUSH`.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript (for the API signatures you will write into the spec).

::READ `checkouts/art-md/knowledge/design/art-md-fixture-tests.md` — how Art MD fixture tests work; read it **before** exploring any field fixture.

- design: `$PACKAGE/knowledge/design/records.md` — the current design; the source of every field detail you extract.
- knowledge: `$PACKAGE/knowledge/overview.md` — the summary you will rewrite.
- knowledge: `$PACKAGE/knowledge/index.md` — the register you will extend.
- knowledge: `$PACKAGE/knowledge/adr/canonical-field-names.art` — the ADR format your two new ADRs follow, and an example of a field ADR.
- reference: `$ART_MD/libs/primitives/src/codec/types.ts` — the `ArtCodec` surface the spec writes against: `parse`, `serialize`, `create`, `toText`, `getConstructFactory`.
- reference: `$ART_MD/libs/constructs/test/fixtures/025-field-block-with-code.md` and its `.md.json` — a field block whose value is a code span.
- reference: `$ART_MD/libs/constructs/test/fixtures/031-field-inline-with-inline-formatting.md` and its `.md.json` — an inline field with inline formatting.
- reference: `$ART_MD/libs/constructs/test/fixtures/032-field-inline-with-multiple-lines.md` and its `.md.json` — a multi-line inline field.
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

- Step 1 / 6 — Inventory the field content and the Art MD field-form fixtures
- Step 2 / 6 — Write `design/fields.md`, the fields specification
- Step 3 / 6 — Extract field content out of `design/records.md` and link the two documents
- Step 4 / 6 — Home the two `### Decisions` sections as `adr/records.art` and `adr/fields.art`
- Step 5 / 6 — Register the new files in `knowledge/index.md` and rewrite `knowledge/overview.md`
- Step 6 / 6 — Verify and commit `write-fields-spec`

## Steps

### Step `1 / 6` — Inventory the field content and the Art MD field-form fixtures

**Description:** Know exactly what you are extracting and what vocabulary the spec must express before writing a word of it.

**Instructions:**

1. Read `$PACKAGE/knowledge/design/records.md` end to end. Mark every passage that is _field_ content: how fields are read and written today (`codec.toText` reads, `codec.create` writes), the field-name contract (`## Field Names`, its grammar, guarantees, converters, index, codec constraint), `## Field and Section Behaviour`, the field rows of the usage recipes and the public API, and the two `### Decisions` sections. Everything else — provider, collections, placement, persistence, source layout, testing — is _records_ content and stays.
2. Read the three Art MD fixtures (after the fixture-tests design doc) and note, for each, the markdown form and its `.md.json` Art AST: `025` shows a `FieldBlock` whose text is a code span, `031` shows a `FieldInline` carrying inline formatting, `032` shows a `FieldInline` whose children span multiple lines. These three are the field-form vocabulary the spec must be able to express on read and reproduce on write.
3. Read the `ArtCodec` surface in `$ART_MD/libs/primitives/src/codec/types.ts` — the spec's mechanisms are exactly its methods: `parse(markdown) → ParseResult` (`.document`), `serialize(document) → SerializeResult` (`.content`), `create<C>(name, …args)`, `toText(construct)`, `getConstructFactory(name)`.

**Expected outcome:** an inventory (kept in your working notes, summarised in the report) of the field passages to move, the records passages to keep, the three fixture forms, and the codec methods available.

**Verify:** no file changed yet; `git status --short` is empty.

### Step `2 / 6` — Write `design/fields.md`, the fields specification

**Description:** Produce the single specification of the field API. This is where every API name is decided.

**Instructions:**

Create `$PACKAGE/knowledge/design/fields.md` as a design document in the same voice and heading style as `design/records.md`. It must cover **every** item below — this list is the plan's Scope, and the next iteration is verified against it — plus anything else the writing surfaces:

1. **Setting from a string.** A field can be set from a `string`, parsed through `codec.parse`, so markdown forms (code spans, emphasis) survive the round trip.
2. **Setting from an Art AST construct.** A field can be set directly from any Art construct the consumer created — not a freeform typed-value object.
3. **Automatic form.** Block (`FieldBlock`) versus inline (`FieldInline`) is chosen from the value being set; the caller never selects it. State the rule precisely enough to implement.
4. **Proxy setter.** The proxy accepts `string | Construct`; specify what a string becomes (the spec may route it through `codec.create` for the text node, or through `codec.parse` — decide, name it, justify it).
5. **Dedicated set methods.** One method to set a string value and one to set a construct value, named in the spec.
6. **Reading as markdown.** The default proxy accessor returns markdown via `codec.serialize` — a change from today's `codec.toText` text read. Say what changes for existing consumers.
7. **Reading as text.** A dedicated method returning rendered text via `codec.toText`.
8. **Reading raw.** A dedicated method returning the field's Art AST construct — if the API does not already expose it; state it either way.
9. **Field forms.** For each of read and write, tie the behaviour to the three fixture forms (`025` code span in a block, `031` inline formatting, `032` multi-line inline), citing the fixture ids.
10. **Names.** Every method and signature introduced above is named here, consistent with the existing public surface (`$PACKAGE/src/index.ts`, `$PACKAGE/src/api/index.ts`).

Also include, by extraction (Steps 3–4 move it here, do not duplicate it): the field-name contract — canonical grammar, the two guarantees, `labelToName`/`nameToLabel`, reserved names, the `name → field` index, and the codec constraint.

**Expected outcome:** `design/fields.md` reads as the complete field specification; a reviewer can answer "what is the API for X?" from this file alone.

**Verify:** every one of the 10 items above maps to a section of the spec — record the mapping (item → heading) in your report; `npm run lint` from `$PACKAGE` is green.

### Step `3 / 6` — Extract field content out of `design/records.md` and link the two documents

**Description:** Leave `records.md` about the record, document, and provider model only, with fields living in one place.

**Instructions:**

1. Move the field passages inventoried in Step 1 from `$PACKAGE/knowledge/design/records.md` into `design/fields.md`. Whole sections move (`## Field Names`, `## Field and Section Behaviour`); inside mixed sections (usage recipes, public API), move the field-specific rows/subsections and leave a one-line pointer to `design/fields.md` in their place — never leave a restated copy.
2. Add the reverse link: `records.md` references `design/fields.md` where the field surface used to be described, so a reader of either document reaches the other.
3. Delete every duplicated sentence after the move. `records.md` keeps: usage flow at the level of the record, provider/collection semantics, placement, persistence and fidelity, codec boundary, source layout, testing, notes.

**Expected outcome:** no field API detail exists in two files; `records.md` no longer describes how a field is read or written.

**Verify:** `grep -n "toText\|codec.create\|FieldBlock\|FieldInline" $PACKAGE/knowledge/design/records.md` returns only genuine records-model mentions (or nothing); `npm run lint` from `$PACKAGE` is green.

### Step `4 / 6` — Home the two `### Decisions` sections as ADRs

**Description:** Records decisions and field decisions become ADRs in the package's existing format.

**Instructions:**

1. Create `$PACKAGE/knowledge/adr/records.art` from the `### Decisions` section under `## Notes` of `records.md` — the records-level decisions (provider shape, one collection type, unified `ArtRecord`, consumer-injected codec, placement/depth rules, no public capsule surface, whole-document save fidelity). Follow the format of `$PACKAGE/knowledge/adr/canonical-field-names.art`: `# Records - <Title>`, `**Purpose:**`, then per decision `## Decision: …`, `**Status:** Adopted`, `**Context:**`, `**Decision:**`, `**Consequences:**`.
2. Create `$PACKAGE/knowledge/adr/fields.art` from the `### Decisions` section under `## Field Names`. That section today is a pointer list to `adr/canonical-field-names.art`, `adr/field-name-index.art`, and `adr/rename-field-by-name.art` — carry those pointers forward as the field-decision index, and add any field decisions the spec writing surfaces (for example the automatic form rule, if you decide it belongs in an ADR rather than only in the spec).
3. Remove both `### Decisions` sections from `records.md` — their content is now in the ADRs. The `grep -c "^### Decisions" $PACKAGE/knowledge/design/records.md` precondition check must return `0` after this step.

**Expected outcome:** both ADR files exist in the established `.art` format; `records.md` contains no `### Decisions` heading.

**Verify:** `grep -c "^### Decisions" $PACKAGE/knowledge/design/records.md` prints `0`; the two new ADRs render with the same heading structure as `canonical-field-names.art`; `npm run lint` from `$PACKAGE` is green.

### Step `5 / 6` — Register the new files and rewrite the overview

**Description:** Make the restructured knowledge discoverable and the overview a true summary.

**Instructions:**

1. Edit `$PACKAGE/knowledge/index.md`: add `design/fields.md` to the Design Documents table with its purpose, and register the ADRs — the table currently lists none of the three existing ADRs either, so add an ADR row/group covering `adr/canonical-field-names.art`, `adr/field-name-index.art`, `adr/rename-field-by-name.art`, `adr/records.art`, `adr/fields.art`.
2. Rewrite `$PACKAGE/knowledge/overview.md`: its Purpose and Responsibilities must summarise **records** (document-bound handles, extraction, save through source) and **fields** (set from string or construct, read as markdown/text/raw, canonical names) as two clearly separated concerns, each linking to its design document (`design/records.md`, `design/fields.md`). The use-case table keeps its fixture ids; field rows link to the fields spec instead of restating behaviour.

**Expected outcome:** a reader of `index.md` finds every knowledge file; a reader of `overview.md` sees records and fields summarised separately with no duplicated detail.

**Verify:** `grep -n "fields.md" $PACKAGE/knowledge/index.md` finds the new row(s); no sentence appears in both `overview.md` and a design document; `npm run lint` from `$PACKAGE` is green.

### Step `6 / 6` — Verify and commit `write-fields-spec`

**Description:** Run the full verification and record the restructure.

**Instructions:**

1. Run the **Verifying Step** from `$PACKAGE`: `lint:fix`, `lint`.
2. Run the **Verifying Completion** from `$PROJECT`: `npm run ci` (docs changes still pass through the repo-wide prettier and the turbo pipeline).
3. Confirm the change set is documentation only:

   ```bash
   git status --short
   git diff --stat
   ```

   Only `$PACKAGE/knowledge/**` files may appear — no `src`, no `tests`, no `package.json`, no `package-lock.json`, no `CHANGELOG.md`, no `_backlog`, no `_roadmap`, no `dist`.

4. Stage the knowledge paths explicitly (file by file under `$PACKAGE/knowledge/`). Never `git add -A` or `git add .`. Leave `./instructions/write-fields-spec__report.md` **unstaged** — the delegator commits it.
5. Commit from `$PROJECT`.

**Message:**

```text
docs(records): Write the fields spec and restructure record knowledge.

- Extract field content from the records design into design/fields.md.
- Home both decision sections as adr/records and adr/fields.
- Register the new files and reduce the overview to summaries.
```

The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push and do **not** run `npm version`, `npm publish`, or any release command: publishing is a separate, explicit decision.

---

## Final Verification

**Instructions:**

- Verify the commit exists locally and was **not** pushed.
- Verify only `$PACKAGE/knowledge/**` paths were committed: `design/fields.md`, `design/records.md`, `knowledge/index.md`, `knowledge/overview.md`, `knowledge/adr/records.art`, `knowledge/adr/fields.art` (as applicable). No source, test, manifest, lock, changelog, backlog, or roadmap file is part of the commit.
- Verify every Scope API-change item (the 10 items in Step 2) has a home in `design/fields.md` — include the item → section mapping in your report.
- Verify `grep -c "^### Decisions" $PACKAGE/knowledge/design/records.md` prints `0`, and that `records.md` links to `design/fields.md`.
- Verify `knowledge/index.md` lists `design/fields.md` and all five ADRs, and that `overview.md` summarises records and fields separately with no duplicated sentences.
- Verify the field-form examples in the spec cite fixtures `025`, `031`, and `032`.
- Verify `npm run ci` passes from `$PROJECT`.
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Report according to the "How to Report Back to the Delegator" instructions.
