# Instructions: `make-serializer-tests-mandatory`

**Plan:** `migrate-tests-pipeline`

**Iteration Id:** `make-serializer-tests-mandatory`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-migrate-tests-pipeline/instructions/make-serializer-tests-mandatory__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `make-serializer-tests-mandatory`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable         | Resolved Path                 | Purpose                                        |
| ---------------- | ----------------------------- | ---------------------------------------------- |
| `$PROJECT`       | `$WORKSPACE/checkouts/art-js` | project repository root                        |
| `$PACKAGE_PARSER`| `$PROJECT/libs/parser/`       | parser package (contains `scripts/test-serializer.ts`) |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `make-serializer-tests-mandatory`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Make the serializer test runner exit with a failure code when the roundtrip comparison detects a diff, so CI fails on serializer regressions instead of silently passing.

## Mandatory Reading

- `$PACKAGE_PARSER/scripts/test-serializer.ts` — the serializer test runner to modify.

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

- In `$PACKAGE_PARSER/scripts/test-serializer.ts`, replace the WIP block (`// WIP: uncomment when all fixtures pass.` / `// return failed === 0 ? 0 : 2;` / `return 0;`) with the real exit logic: `return failed === 0 ? 0 : 2;`.
- Verify `npm run test-serializer` in the parser package still passes (all fixtures currently lossless).

- Step 1 / 2 — Replace WIP exit code in `test-serializer.ts`
- Step 2 / 2 — Commit `make-serializer-tests-mandatory`

## Steps

### Step `1 / 2` — Replace WIP exit code in `test-serializer.ts`

Open `$PACKAGE_PARSER/scripts/test-serializer.ts` and locate the WIP block at the end of the run function:

```ts
	// WIP: uncomment when all fixtures pass.
	// return failed === 0 ? 0 : 2;
	return 0;
```

Replace those three lines with:

```ts
	return failed === 0 ? 0 : 2;
```

Verify the change compiles and the serializer runner now returns exit code `2` on failure and `0` on success.

---

#### Commit: `make-serializer-tests-mandatory`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(art-md-roundtrip): Make serializer tests mandatory.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that the WIP comment is removed and `test-serializer.ts` now returns `failed === 0 ? 0 : 2`.
- Verify `npm run test-serializer` in the parser package passes with all fixtures lossless.
- Execute the **Verifying Step** as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
