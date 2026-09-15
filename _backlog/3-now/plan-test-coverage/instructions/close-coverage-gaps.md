# Instructions: `close-coverage-gaps`

**Plan:** `test-coverage`

**Iteration Id:** `close-coverage-gaps`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-test-coverage/instructions/close-coverage-gaps__report.md`. No separate delegation record is created.
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

Measure coverage against the targets and add tests to close the remaining gaps. Targets: lines 95, functions 100, branches 95, statements 95.

## Mandatory Reading

- All test files and `src/test/helpers/` across `$PARSER`, `$PRIMITIVES`, `$SERIALIZER`, `$CONSTRUCTS` — the tests and helpers to extend.
- `$PARSER/src/`, `$PRIMITIVES/src/`, `$SERIALIZER/src/`, `$CONSTRUCTS/src/` — the modules under test, to identify uncovered lines, functions, and branches.

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

- Measure coverage against the targets: lines 95, functions 100, branches 95, statements 95.
- Add tests to cover the gaps.

## Steps

### Step 1 of 5 — Measure coverage against the targets

1. Run `npm run test:ci` from each package.
2. Compare the reported coverage (lines, functions, branches, statements) against the targets: lines 95, functions 100, branches 95, statements 95.
3. Record the gaps per package in your report.

### Step 2 of 5 — Add tests to cover the gaps

1. Add tests to cover the uncovered lines, functions, and branches, using the existing helpers.
2. RULE: do not write `it.todo()` — either write the test, or leave a comment if the test is not yet possible to write for some reason: `// WIP test also "{scenario}"`.

### Step 3 of 5 — Re-measure until the targets are met

1. Re-run `npm run test:ci` from each package.
2. Repeat Step 2 until each package meets the targets: lines 95, functions 100, branches 95, statements 95.

### Step 4 of 5 — Commit `close-coverage-gaps`

**Policy:** `AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test: Close coverage gaps toward 95/100/95/95 targets

- Measure coverage per package against the targets
- Add tests to cover the remaining gaps
```

### Step 5 of 5 — Verify

1. Run `npm run test:ci` from each package and record the final coverage per package (must meet the targets).
2. Run lint from `$PROJECT`:
   ```bash
   npm run lint:fix
   ```

## Final Verification

**Instructions:**

- Verify that each package meets the targets: lines 95, functions 100, branches 95, statements 95.
- Verify that no `it.todo()`, `it.skip`, or `it.only` was introduced.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
