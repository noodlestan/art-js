# Instructions: `scaffold-pipeline-tests-package`

**Plan:** `migrate-tests-pipeline`

**Iteration Id:** `scaffold-pipeline-tests-package`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-migrate-tests-pipeline/instructions/scaffold-pipeline-tests-package__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `scaffold-pipeline-tests-package`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable            | Resolved Path                  | Purpose                                       |
| ------------------- | ------------------------------ | --------------------------------------------- |
| `$PROJECT`          | `$WORKSPACE/checkouts/art-js`  | project repository root                       |
| `$PACKAGE_PIPELINE` | `$PROJECT/cli/pipeline-tests/` | pipeline test CLI package (new)               |
| `$PACKAGE_BIN`      | `$PROJECT/cli/bin/`            | reference package to mirror for scaffold      |
| `$PACKAGE_PARSER`   | `$PROJECT/libs/parser/`        | parser package (source of architecture files) |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `scaffold-pipeline-tests-package`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create the `@art-js/pipeline-test-cli` package at `cli/pipeline-tests/` mirroring the `cli/bin` package layout, with records, package configuration, and repo-level architecture files, then register it with `npm install`.

## Mandatory Reading

- `$PACKAGE_BIN/_records/package.art` — reference package record to adapt.
- `$PACKAGE_BIN/_records/npm-deployment.art` — reference npm deployment record to adapt.
- `$PACKAGE_BIN/package.json` — reference package configuration.
- `$PACKAGE_PARSER/architecture/fixture-tests.md` — source of `art-md-fixture-tests.md`.
- `$PACKAGE_PARSER/architecture/index.md` — source of `art-md-roundtrip.md`.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Verifying Step

**Instructions:**

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

To learn how to debug failed tests, read `./architecture/art-md-fixture-tests.md`.

---

## Changes

- Step 1 / 3 — Create the full `cli/pipeline-tests/` package layout
- Step 2 / 3 — Create repo-level `architecture/` files and update parser architecture index
- Step 3 / 3 — Commit `scaffold-pipeline-tests-package`

## Steps

### Step `1 / 3` — Create the full `cli/pipeline-tests/` package layout

Create ALL of the following files in `$PACKAGE_PIPELINE`, mirroring the `$PACKAGE_BIN` package layout:

- `_guide.md`
- `_records/package.art`
- `_records/npm-deployment.art`
- `.npmignore`
- `.prettierignore`
- `LICENSE-MIT`
- `package.json`
- `README.md`
- `src/index.ts`
- `tsconfig.json`
- `tsconfig.cjs.json`
- `tsconfig.esm.json`

Copy the files from `$PACKAGE_BIN` as the starting point, then modify the following files (vs. copying `cli/bin` as-is):

- `_records/package.art` — set Owner: Project: Art JS, Canonical Name: `@art-js/pipeline-test-cli`, Path: `cli/pipeline-tests/`, no `main` field, scripts inline (`test`, `test-parser`, `test-serializer`), no dependencies.
- `_records/npm-deployment.art` — set Owner: Package: Pipeline Test CLI, Canonical Name: `@art-js/pipeline-test-cli`.
- `package.json` — match `_records/package.art`; scripts: `test`, `test-parser`, `test-serializer`; no dependencies.

Then, from `$PROJECT` root, run:

```bash
npm install
```

to register the new package.

### Step `2 / 3` — Create repo-level `architecture/` files and update parser architecture index

Create the repo-level architecture files at `$PROJECT/architecture/`:

- Create `$PROJECT/architecture/art-md-fixture-tests.md` — moved from `$PACKAGE_PARSER/architecture/fixture-tests.md` (keep content, update fixture path references to `libs/constructs/test/fixtures/`).
- Create `$PROJECT/architecture/art-md-roundtrip.md` — content derived from `$PACKAGE_PARSER/architecture/index.md` describing the roundtrip pipeline.
- Create `$PROJECT/architecture/index.md` — an index listing the two files (`art-md-fixture-tests.md`, `art-md-roundtrip.md`).

Update `$PACKAGE_PARSER/architecture/index.md` to list only `parser.md` (remove references to the migrated files).

Update `$PROJECT/_guide.md`:

- Add `architecture/` to the `## Repository Layout` section.
- Add `pipeline` to the `## Projects` section.
- Add repo architecture to the knowledge references.

---

#### Commit: `scaffold-pipeline-tests-package`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(art-md-roundtrip): Scaffold pipeline-tests package.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify all 12 files exist in `$PACKAGE_PIPELINE`.
- Verify `_records/package.art` and `package.json` are consistent (no `main` field, inline scripts, no dependencies).
- Verify the package is registered (`npm install` succeeded).
- Verify repo-level `architecture/` files exist and `libs/parser/architecture/index.md` lists only `parser.md`.
- Execute the **Verifying Step** as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
