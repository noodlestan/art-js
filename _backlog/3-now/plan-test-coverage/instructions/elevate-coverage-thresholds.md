# Instructions: `elevate-coverage-thresholds`

**Plan:** `test-coverage`

**Iteration Id:** `elevate-coverage-thresholds`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-test-coverage/instructions/elevate-coverage-thresholds__report.md`. No separate delegation record is created.
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

Elevate the vitest coverage thresholds in all 4 packages to the targets: lines 95, functions 100, branches 95, statements 95.

## Mandatory Reading

- `$PARSER/vitest.config.ts`, `$PRIMITIVES/vitest.config.ts`, `$SERIALIZER/vitest.config.ts`, `$CONSTRUCTS/vitest.config.ts` — the configs to elevate.

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

## Changes

- `$PARSER/vitest.config.ts`, `$PRIMITIVES/vitest.config.ts`, `$SERIALIZER/vitest.config.ts`, `$CONSTRUCTS/vitest.config.ts`: elevate thresholds to:

  ```typescript
  lines: 95,
  functions: 100,
  branches: 95,
  statements: 95,
  ```

## Steps

### Step 1 of 4 — Elevate the thresholds in the 4 vitest configs

1. In `$PARSER/vitest.config.ts`, `$PRIMITIVES/vitest.config.ts`, `$SERIALIZER/vitest.config.ts`, and `$CONSTRUCTS/vitest.config.ts`, set the coverage thresholds to:

   ```typescript
   lines: 95,
   functions: 100,
   branches: 95,
   statements: 95,
   ```

### Step 2 of 4 — Confirm the thresholds pass

1. Run `npm run test:ci` from each package.
2. RULE: if a package fails the thresholds, REPORT A BLOCKER — do not lower the thresholds; the gaps should have been closed in `close-coverage-gaps`.

### Step 3 of 4 — Commit `elevate-coverage-thresholds`

**Policy:** `AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test: Elevate vitest coverage thresholds to 95/100/95/95

- Elevate thresholds in parser, primitives, serializer, and constructs vitest configs
```

### Step 4 of 4 — Verify

1. Run `npm run test:ci` from each package and record the coverage per package (must pass the elevated thresholds).
2. Run lint from `$PROJECT`:
   ```bash
   npm run lint:fix
   ```

## Final Verification

**Instructions:**

- Verify that all 4 vitest configs have thresholds `lines: 95, functions: 100, branches: 95, statements: 95`.
- Verify that `npm run test:ci` passes from each package with the elevated thresholds.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
