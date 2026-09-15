# Instructions: `abstract-repeated-helpers`

**Plan:** `test-coverage`

**Iteration Id:** `abstract-repeated-helpers`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-test-coverage/instructions/abstract-repeated-helpers__report.md`. No separate delegation record is created.
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

Abstract new helpers from remaining repetition and consume them across all similar unit tests.

## Mandatory Reading

- All test files across `$PARSER`, `$PRIMITIVES`, `$SERIALIZER`, `$CONSTRUCTS` — the tests to review for abstractable helpers.
- The `src/test/helpers/` directories across the 4 packages — the existing helpers and conventions to follow.

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

- Review all tests for abstractable helpers.
- Abstract a new helper if repetition is found (same process and conventions as `extract-test-helpers`).
- Consume the new helper in all similar unit tests.

## Steps

### Step 1 of 5 — Review all tests for abstractable helpers

1. Review all test files across the 4 packages.
2. Identify remaining repetition that is not yet covered by an existing helper.

### Step 2 of 5 — Abstract the new helpers

1. For each repeated pattern, abstract a new helper following the same process and conventions as `extract-test-helpers`: `src/test/helpers/{topic}/`, named after the thing it mocks or sets up, colocated in the package of the thing it mocks.

### Step 3 of 5 — Consume the new helpers

1. Consume the new helpers in all similar unit tests.
2. RULE: no test should keep a repeated setup or mock that a new helper now provides.

### Step 4 of 5 — Commit `abstract-repeated-helpers`

**Policy:** `AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test: Abstract repeated test setup into new helpers

- Abstract new helpers from remaining repetition
- Consume the new helpers in all similar unit tests
```

### Step 5 of 5 — Verify

1. Run `npm run test:ci` from each package and record the coverage per package.
2. Run lint from `$PROJECT`:
   ```bash
   npm run lint:fix
   ```

## Final Verification

**Instructions:**

- Verify that new helpers follow the `src/test/helpers/{topic}/` convention and are colocated in the package of the thing they mock.
- Verify that all similar unit tests consume the new helpers.
- Verify that no `it.todo()`, `it.skip`, or `it.only` was introduced.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
