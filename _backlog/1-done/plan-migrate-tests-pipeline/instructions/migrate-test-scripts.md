# Instructions: `migrate-test-scripts`

**Plan:** `migrate-tests-pipeline`

**Iteration Id:** `migrate-test-scripts`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-migrate-tests-pipeline/instructions/migrate-test-scripts__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `migrate-test-scripts`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable              | Resolved Path                  | Purpose                                    |
| --------------------- | ------------------------------ | ------------------------------------------ |
| `$PROJECT`            | `$WORKSPACE/checkouts/art-js`  | project repository root                    |
| `$PACKAGE_PIPELINE`   | `$PROJECT/cli/pipeline-tests/` | pipeline test CLI package (scripts target) |
| `$PACKAGE_PARSER`     | `$PROJECT/libs/parser/`        | parser package (scripts move out)          |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/libs/constructs/`    | constructs package (fixtures move in)      |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `migrate-test-scripts`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Move the test scripts and fixture suite from the parser package into the pipeline-tests package and constructs package, so the test harness is a standalone CLI that depends on both parser and serializer.

## Mandatory Reading

- `$PACKAGE_PARSER/scripts/test-parser.ts` — parser test runner to move.
- `$PACKAGE_PARSER/scripts/test-serializer.ts` — serializer test runner to move.
- `$PACKAGE_PARSER/scripts/test/constants.ts` — fixture directory constant to update.
- `$PROJECT/architecture/art-md-fixture-tests.md` — test infrastructure and fixture anatomy.

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

- Step 1 / 3 — Move test scripts and support files to `cli/pipeline-tests/`
- Step 2 / 3 — Move fixtures to `libs/constructs/test/fixtures/` and add `--path` parameter
- Step 3 / 3 — Commit `migrate-test-scripts`

## Steps

### Step `1 / 3` — Move test scripts and support files to `cli/pipeline-tests/`

Move the following from `$PACKAGE_PARSER` to `$PACKAGE_PIPELINE`:

- `scripts/test-parser.ts` → `cli/pipeline-tests/scripts/test-parser.ts`
- `scripts/test-serializer.ts` → `cli/pipeline-tests/scripts/test-serializer.ts`
- `scripts/test/` → `cli/pipeline-tests/scripts/test/`

Update `$PACKAGE_PIPELINE/package.json` scripts to reference the moved scripts:

```json
"scripts": {
  "test-parser": "npx tsx scripts/test-parser.ts",
  "test-serializer": "npx tsx scripts/test-serializer.ts",
  "test": "npm run test-parser && npm run test-serializer"
}
```

Remove the `test`, `test-parser`, `test-serializer` scripts from `$PACKAGE_PARSER/package.json`.

### Step `2 / 3` — Move fixtures to `libs/constructs/test/fixtures/` and add `--path` parameter

Move the fixture suite:

- `libs/parser/test/fixtures/` → `libs/constructs/test/fixtures/`

Update `$PACKAGE_PIPELINE/scripts/test/constants.ts` so `FIXTURES_DIR` is resolved from a `--path` CLI argument, defaulting to `libs/constructs/test/fixtures/`.

Ensure `test-parser.ts` and `test-serializer.ts` accept the `--path` argument (parse it from argv) and pass it through to fixture discovery.

Run from `$PACKAGE_PIPELINE`:

```bash
npm run test
```

Confirm all fixtures pass with lossless roundtrip.

---

#### Commit: `migrate-test-scripts`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(art-md-roundtrip): Migrate test scripts to pipeline-tests.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify the scripts and support files are in `$PACKAGE_PIPELINE/scripts/`.
- Verify the fixtures are in `libs/constructs/test/fixtures/`.
- Verify `--path` is wired and `FIXTURES_DIR` defaults to `libs/constructs/test/fixtures/`.
- Verify `npm run test` passes from `$PACKAGE_PIPELINE` with all fixtures lossless.
- Execute the **Verifying Step** as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
