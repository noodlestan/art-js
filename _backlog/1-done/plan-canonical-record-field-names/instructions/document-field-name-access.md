# Instructions: `document-field-name-access`

**Plan:** `canonical-record-field-names`

**Iteration Id:** `document-field-name-access`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/document-field-name-access__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `document-field-name-access`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `document-field-name-access`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Ship one documented access model for `@art-js/records@0.1.0`: the design documents canonical field names end to end (grammar, two guarantees, converters, index, precedence, reserved labels, guards, name-to-name rename) with every example readable as working code; the three settled decisions become ADRs; the overview and README carry the consumer migration note. All prose the plan owns lands here — the `0.1.0` CHANGELOG entry is owned by `prepare-0-1-0-release` and must not be touched. Commit as `docs(records): Document field name access.`

This iteration is documentation-only: `$PACKAGE/knowledge/design/records.md`, `$PACKAGE/knowledge/adr/` (three new files), `$PACKAGE/knowledge/overview.md`, `$PACKAGE/README.md`. No `src/`, no `tests/`.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript.

::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — Conventions: Unit Tests.

- format: `$ART_WORKS/cli/workspace/knowledge/adr/cli.art` — the ADR format your three ADRs follow.
- design: `$PACKAGE/knowledge/design/records.md` — the file you rewrite; its current exact-label wording is the target.
- overview: `$PACKAGE/knowledge/overview.md` — use cases and fixture map to refresh.
- readme: `$PACKAGE/README.md` — examples and migration note to refresh.
- reference: `../plan__pseudo.md` — the converter rules the design's "Field Names" section must state (worked traces, invariants, directions A/B).
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

- Step 1 / 4 — Rewrite the design's access model
- Step 2 / 4 — Extract the three settled decisions as ADRs
- Step 3 / 4 — Refresh the overview and README
- Step 4 / 4 — Commit `document-field-access`

## Steps

### Step `1 / 4` — Rewrite the design's access model

**Goal:** `records.md` describes the shipped behaviour — one access model, no exact-label residue.

**Files:**

- MODIFY `$PACKAGE/knowledge/design/records.md`

**Execution:**

- Add a **Field Names** section containing, in this order:
  1. The canonical grammar — `/^[a-z][a-zA-Z0-9]*$/` — and its role: syntax gate on names **supplied through the API only**.
  2. The two guarantees, never conflated: API-created fields always carry a canonical name; extracted fields carry whatever `labelToName` yields and are never rejected or rewritten retrospectively.
  3. `labelToName` (direction A: one pass, Unicode code points, separators uniformly, first word lowercased, later words capitalised, `TypeError` on no words, **not idempotent, never fed its own output**) and `nameToLabel` (direction B: split before every uppercase, remainder as-is, space-joined) with the rule that only `labelToName(nameToLabel(name)) === name` is required — a stored label does **not** round-trip, by design.
  4. Reserved names via `isReservedFieldName` — reachable collisions are `name`, `save`, `renameField` (labels `Name`, `Save`, `Rename Field` … abort extraction with `TypeError: Field label "{label}" resolves to reserved name "{name}"`); `__`-prefixed **names** are reserved for the API gate, while a `__`-prefixed **label** converts to a non-reserved name and loads normally.
  5. The `name → field` index: built once at extraction in document order, first occurrence wins; every trap is an index lookup (no access scans section fields or converts a label); promotion on removal (delete or rename-vacated name) with the promoted field keeping its own label; mutation guards — reserved throws on read/write/delete, the canonical regexp gates creation only, and the delete cells for handle/miss names report not-removed (surfaced as `TypeError` under a strict-mode `delete`).
  6. Derived-label limitation: new fields are labelled `nameToLabel(name)` — `brandNew` → `Brand New`, `npmPackageDeployment` → `Npm Package Deployment` — a stated limitation, not a bug.
  7. Codec constraint: documents parsed by the Art MD codec only ever carry letter-led labels (`/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`); arbitrary labels (digit-led, non-ASCII) exist only in hand-built sections.
- Rewrite **Field and Section Behaviour** and **Reserved names**: replace every exact-label formulation — including "A field property such as `record.owner` resolves by exact field name" and `renameField()` "changes the field label in place" — with field-name addressing. `renameField(fromName, toName)` is documented name-to-name: four-step validation, relabel via `nameToLabel(toName)`, old spelling forgotten, `fromName` not held to the grammar, `toName` must be canonical and unoccupied.
- Update **every usage example** in the design to canonical field names (`record.repository`, `record.canonicalName`), keeping `record.name`, `record.__section`, and `record.save()` as the handle members they are.

**Expected outcome:** `grep -n "exact" $PACKAGE/knowledge/design/records.md` returns no exact-label access wording; every code example compiles against the shipped `ArtRecord` surface (bracket notation where the key is not a literal identifier).

**Verify:** the **Verifying Step** instructions from the Operating Instructions section (md-only, but keep the suite green).

### Step `2 / 4` — Extract the three settled decisions as ADRs

**Goal:** the decisions outlive the plan: field names, the index, and rename semantics each become an ADR in the format of the exemplar.

**Files:**

- CREATE `$PACKAGE/knowledge/adr/` (directory, if absent) with three ADR files, named and structured after `$ART_WORKS/cli/workspace/knowledge/adr/cli.art` (read it first and follow its status/decision sections exactly).

**Execution:**

- **ADR 1 — Canonical Field Names:** grammar, two guarantees, no label fallback or dual mode, stored labels never rewritten by a value update, derived labels (`brandNew` → `Brand New`), no label escape hatches (`__section` is the only route to non-addressable fields).
- **ADR 2 — The `name → field` Index:** one index built at extraction, first-wins, promotion on removal, no access-path scans, reserved abort at construction, guards from the name-class table.
- **ADR 3 — Rename by Name:** validation order (reserved → not found → canonical → occupied-before-mutation), relabel via `nameToLabel(toName)`, the old spelling forgotten, `fromName` not canonical-gated.
- Status and surrounding fields per the exemplar; decisions written as accepted, with consequences and the migration note (`record.Repository` → `record.repository`) recorded where the exemplar puts it.

**Expected outcome:** three ADR files under `$PACKAGE/knowledge/adr/`, cross-referenced from the design's Field Names section in one line each.

**Verify:** the design references each ADR; prettier is clean over `$PACKAGE`.

### Step `3 / 4` — Refresh the overview and README

**Goal:** the package's front door speaks the new model and tells consumers how to migrate.

**Files:**

- MODIFY `$PACKAGE/knowledge/overview.md` — use cases and fixture map updated to canonical names; the fixture map mentions `18-canonical-name-round-trip`, `19-duplicate-field-names`, `20-reserved-label-throws`.
- MODIFY `$PACKAGE/README.md` — every example converted to canonical field names, plus the migration note: `record.Repository` → `record.repository`, `record['Canonical Name']` → `record.canonicalName`, `renameField` now takes names, and new fields derive their label (`brandNew` → `Brand New`).

**Execution:**

- The Art Works consumer migration stays in the **plan's** Follow Ups — do not add it to package docs (verify the plan Follow Ups entry exists; it does — change nothing).
- The `0.1.0` CHANGELOG section is **not** written here: `git diff -- $PACKAGE/CHANGELOG.md` must be empty at commit time.

**Expected outcome:** README examples are copy-pasteable against `0.1.0` behaviour; overview fixture map matches `tests/fixtures/` on disk.

**Verify:** `npm run ci` from `$PROJECT` is green; CHANGELOG untouched.

### Step `4 / 4` — Commit `document-field-access`

#### Commit: `document-field-access`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
docs(records): Document field name access.

- Add the name grammar, index, and rename decisions as ADRs.
- Rewrite field access examples with canonical names.
- Record the breaking change and the consumer migration note.
```

Stage `knowledge/design/records.md`, the three new ADRs, `knowledge/overview.md`, and `README.md` — and nothing else — then commit from `$PROJECT`. The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit must exist locally and must **not** be pushed.
- Verify `grep -n "exact field name\|exact label" $PACKAGE/knowledge/design/records.md` returns nothing, and that every example in design, overview, and README uses canonical field names.
- Verify the design states the reachable reserved set (`name`, `save`, `renameField`) with the exact extraction error message, and distinguishes reserved **names** from `__`-prefixed **labels**.
- Verify the three ADRs exist under `$PACKAGE/knowledge/adr/`, follow the exemplar's format, and are referenced from the design.
- Verify `git diff -- $PACKAGE/CHANGELOG.md` is empty and `git diff --stat` shows no `src/` or `tests/` file.
- Verify the README carries both migration notes and that the plan's Follow Ups still holds the Art Works migration entry (unchanged).
- Verify the fixture map in the overview matches `ls $PACKAGE/tests/fixtures/` (including `18`/`19`/`20`).
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Report according to the "## How to Report Back to the Delegator" instructions.
