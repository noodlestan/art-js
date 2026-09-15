# Instructions: `extract-test-helpers`

**Plan:** `test-coverage`

**Iteration Id:** `extract-test-helpers`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-test-coverage/instructions/extract-test-helpers__report.md`. No separate delegation record is created.
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

Abstract mocking and setup helpers into consistent, colocated helpers so tests stop wiring mocks locally. Helpers live in `src/test/helpers/{topic}/` (e.g. `makeSomethingMock.ts`) and are colocated in the package of the thing they mock.

## Mandatory Reading

- The test files written in `add-minimal-unit-tests` across `$PARSER`, `$PRIMITIVES`, `$SERIALIZER`, `$CONSTRUCTS` — the in-file mocks and setup to extract.
- `$PARSER/src/`, `$PRIMITIVES/src/`, `$SERIALIZER/src/`, `$CONSTRUCTS/src/` — the modules under test, to name helpers after the things they mock.

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

- Create `src/test/helpers/{topic}/` per package with helper primitives (e.g. `makeSomethingMock.ts`, `makeContext.ts`).
- Hoist the helper primitives so helpers are colocated in the package of the thing they mock.
- Consume the helpers in all tests written in `add-minimal-unit-tests`, replacing in-file mocks.

## Steps

### Step 1 of 6 — Review the minimal tests for repeated mocks and setup

1. Review the tests written in `add-minimal-unit-tests` across the 4 packages.
2. Identify repeated in-file mocks and setup blocks that can be hoisted into helpers.

### Step 2 of 6 — Create the helpers directory per package

1. Create `src/test/helpers/{topic}/` in each package where repetition was found.
2. Name helpers after the thing they mock or set up (e.g. `makeSomethingMock.ts`, `makeContext.ts`).

### Step 3 of 6 — Extract the helpers

1. Extract the repeated mocks and setup into the helpers.
2. RULE: helpers are colocated in the package of the thing they mock — do not share helpers across packages.

### Step 4 of 6 — Consume the helpers in the tests

1. Replace the in-file mocks and setup in the minimal tests with the extracted helpers.
2. RULE: no test should keep a locally wired mock that a helper now provides.

### Step 5 of 6 — Commit `extract-test-helpers`

**Policy:** `AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test: Extract shared test helpers per package

- Add src/test/helpers/{topic} with helper primitives per package
- Colocate helpers in the package of the thing they mock
- Consume helpers in the minimal tests, replacing in-file mocks
```

### Step 6 of 6 — Verify

1. Run `npm run test:ci` from each package and record the coverage per package.
2. Run lint from `$PROJECT`:
   ```bash
   npm run lint:fix
   ```

## Final Verification

**Instructions:**

- Verify that `src/test/helpers/{topic}/` exists in each package where repetition was found, with helpers named after the things they mock.
- Verify that helpers are colocated in the package of the thing they mock (no cross-package helpers).
- Verify that the minimal tests consume the helpers instead of wiring mocks locally.
- Verify that no `it.todo()`, `it.skip`, or `it.only` was introduced.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
