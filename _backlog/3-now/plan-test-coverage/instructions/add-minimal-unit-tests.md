# Instructions: `add-minimal-unit-tests`

**Plan:** `test-coverage`

**Iteration Id:** `add-minimal-unit-tests`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-test-coverage/instructions/add-minimal-unit-tests__report.md`. No separate delegation record is created.
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

Establish a minimal unit test baseline across all 4 packages — happy path plus the most obvious exception path where one exists — with all dependencies mocked in-file. Do not chase the coverage targets yet; measure and record the current coverage per package as the baseline.

## Mandatory Reading

- `$PARSER/src/` — parser modules to cover (`builder.ts`, `mdast/`, `private/`, `config/`).
- `$PRIMITIVES/src/` — primitives modules to cover (`point.ts`, `constructs.ts`, `parser/helpers/`).
- `$SERIALIZER/src/` — serializer modules to cover (`serializer.ts`, `artAstToMdast.ts`, `config/`).
- `$CONSTRUCTS/src/` — constructs modules to cover (factories, processors, integrators, node-based factories, helpers).
- `$PARSER/vitest.config.ts`, `$PRIMITIVES/vitest.config.ts`, `$SERIALIZER/vitest.config.ts`, `$CONSTRUCTS/vitest.config.ts` — current coverage thresholds.

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

- parser: minimal tests for `builder.ts`, `mdast/isBlockType.ts`, `mdast/constants.ts`, `private/createDocumentContext.ts`, `config/createDefaultConfig.ts`, `config/types.ts`.
- primitives: minimal tests for `point.ts`, `constructs.ts`, `parser/helpers/nodePosition.ts`, `parser/helpers/createParserVisitContext.ts`, `parser/helpers/sectionDepth.ts`.
- serializer: minimal tests for `serializer.ts`, `artAstToMdast.ts`, `config/createDefaultSerializerConfig.ts`, `config/types.ts` (extend the existing `serializer.test.ts` where needed).
- constructs: minimal tests for all construct factories, processors, integrators, node-based factories, and helpers (`extractTags`, `rawSlice`, etc.); keep and extend the 6 existing test files.
- All dependencies mocked in-file with whatever it takes to isolate the module under test from its dependencies.
- Measure and record coverage per package as the baseline; do NOT attempt to reach the targets yet.

## Steps

### Step 1 of 7 — Measure and record the baseline

1. From each package (`$PARSER`, `$PRIMITIVES`, `$SERIALIZER`, `$CONSTRUCTS`), run `npm run test:ci` and record the current coverage (lines, functions, branches, statements) in your report.

### Step 2 of 7 — Add minimal tests to parser

1. Add minimal unit tests for every module in `$PARSER/src/` (excluding `src/index.ts`): `builder.ts`, `mdast/isBlockType.ts`, `mdast/constants.ts`, `private/createDocumentContext.ts`, `config/createDefaultConfig.ts`, `config/types.ts`.
2. Each test covers the happy path and the most obvious exception path where one exists.
3. Mock all dependencies in-file to isolate the module under test.

### Step 3 of 7 — Add minimal tests to primitives

1. Add minimal unit tests for every module in `$PRIMITIVES/src/` (excluding `src/index.ts`): `point.ts`, `constructs.ts`, `parser/helpers/nodePosition.ts`, `parser/helpers/createParserVisitContext.ts`, `parser/helpers/sectionDepth.ts`.
2. Same conventions as Step 2.

### Step 4 of 7 — Add minimal tests to serializer

1. Add minimal unit tests for `serializer.ts`, `artAstToMdast.ts`, `config/createDefaultSerializerConfig.ts`, `config/types.ts`; extend the existing `serializer.test.ts` where needed.
2. Same conventions as Step 2.

### Step 5 of 7 — Add minimal tests to constructs

1. Add minimal unit tests for all construct factories, processors, integrators, node-based factories, and helpers (`extractTags`, `rawSlice`, etc.); keep and extend the 6 existing test files.
2. Same conventions as Step 2.

### Step 6 of 7 — Commit `add-minimal-unit-tests`

**Policy:** `AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test: Add minimal unit test coverage to parser, primitives, serializer, constructs

- Add happy-path and obvious-exception tests for every module in the 4 packages
- Mock all dependencies in-file to isolate each module under test
- Record per-package coverage baseline without chasing targets yet
```

### Step 7 of 7 — Verify

1. Run `npm run test:ci` from each package and record the new coverage per package.
2. Run lint from `$PROJECT`:
   ```bash
   npm run lint:fix
   ```
3. Report the baseline and the new coverage per package.

## Final Verification

**Instructions:**

- Verify that every module in `src/` (excluding `src/index.ts`) of the 4 packages has a minimal unit test file.
- Verify that each test file mocks all dependencies in-file to isolate the module under test.
- Verify that no `it.todo()`, `it.skip`, or `it.only` was introduced.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
