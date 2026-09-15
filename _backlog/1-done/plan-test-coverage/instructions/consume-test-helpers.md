# Instructions: `consume-test-helpers`

**Plan:** `test-coverage`

**Iteration Id:** `consume-test-helpers`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-test-coverage/instructions/consume-test-helpers__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable      | Resolved Path              | Purpose                              |
| ------------- | -------------------------- | ------------------------------------ |
| `$WORKSPACE`  | Current working directory  | Workspace root directory             |
| `$PROJECT`    | Provided with prompt       | Repository root for all code changes |
| `$PARSER`     | `$PROJECT/libs/parser`     | Parser package to test               |
| `$PRIMITIVES` | `$PROJECT/libs/primitives` | Primitives package to test           |
| `$SERIALIZER` | `$PROJECT/libs/serializer` | Serializer package to test           |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs` | Constructs package to test           |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Reduce repetition by consuming existing helpers in tests that still wire setup and mocking locally.

## Mandatory Reading

- All test files across `$PARSER`, `$PRIMITIVES`, `$SERIALIZER`, `$CONSTRUCTS` — the tests to review for locally wired setup and mocking.
- The `src/test/helpers/` directories across the 4 packages — the existing helpers to consume.

## Operating Instructions

### Setting Up

Run from the `$PROJECT` root:

```bash
npm run ci # to verify there are no pre-existing failures.
```

### Verifying Completion

Run from the `$PROJECT` root:

```bash
npm run lint:fix # autofix formatting issues
npm run lint # report remaining issues
npm run workspace sanity # to check git status across all repos
```

### Verifying Step

Run the unit tests with coverage from each package (`$PARSER`, `$PRIMITIVES`, `$SERIALIZER`, `$CONSTRUCTS`):

```bash
npm run test:ci # vitest run --coverage
```

## Coverage Guidance

- Measure the coverage against the target but do not attempt to reach it on the first steps. Each step adds more tests, but this does not mean the coverage rate increases — it might actually decrease at some point. If verification fails on coverage thresholds, update the relevant `vitest.config.ts` file(s) to lower the threshold so verification passes.
- Do not write tests with `it.todo()` — either write the test, or leave a comment if the test is not yet possible to write for some reason: `// WIP test also "{scenario}"`.
- `it.skip` and `it.only` are also forbidden.

## Changes

- Review all tests for locally wired setup and mocking that could use existing test helpers.
- Consume existing helpers to reduce repetition.

## Steps

### Step 1 of 4 — Review all tests for locally wired setup and mocking

1. Review all test files across the 4 packages.
2. Identify locally wired setup and mocking that an existing helper already provides.

### Step 2 of 4 — Consume the existing helpers

1. Replace the locally wired setup and mocking with the existing helpers.
2. RULE: no test should keep a locally wired mock or setup that an existing helper provides.

### Step 3 of 4 — Commit `consume-test-helpers`

**Policy:** `AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test: Consume shared helpers to reduce test repetition

- Replace locally wired setup and mocking with existing test helpers
- Reduce repetition across the unit test suite
```

### Step 4 of 4 — Verify

1. Run `npm run test:ci` from each package and record the coverage per package.
2. Run lint from `$PROJECT`:
   ```bash
   npm run lint:fix
   ```

## Final Verification

**Instructions:**

- Verify that no test keeps a locally wired mock or setup that an existing helper provides.
- Verify that no `it.todo()`, `it.skip`, or `it.only` was introduced.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
