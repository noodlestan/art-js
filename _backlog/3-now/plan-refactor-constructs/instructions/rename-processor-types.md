# Instructions: `rename-processor-types`

**Plan:** `refactor-constructs`

**Iteration Id:** `rename-processor-types`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactor-constructs/instructions/rename-processor-types__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable      | Resolved Path                 | Purpose                              |
| ------------- | ----------------------------- | ------------------------------------ |
| `$WORKSPACE`  | Current working directory     | Workspace root directory             |
| `$PROJECT`    | Provided with prompt          | Repository root for all code changes |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs`    | Constructs package to modify         |
| `$PARSER`     | `$PROJECT/libs/parser`        | Parser package to modify             |
| `$PIPELINE`   | `$PROJECT/cli/pipeline-tests` | Fixture test runner                  |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Rename the detection/creation entry point so the parser entry point is uniformly `processor.captureNode(context, node)`: `ConstructPreProcessor` → `ConstructProcessor`, `preProcess` → `captureNode`, with the parameter order changed to `(context, node)`.

## Mandatory Reading

- `../plan__construct-types-spec.md` — final shape of `construct/types.ts` for reference; execute only the changes prescribed in this iteration.
- `$CONSTRUCTS/src/constructs/types.ts` — the types to rename.
- `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockPreProcessor.ts` — pre-processor to rename.
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.ts` — pre-processor to rename.
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts` — test to rename and update.
- `$CONSTRUCTS/src/constructs/FieldBlock/createFieldBlockParser.ts` — parser factory to update.
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlineParser.ts` — parser factory to update.
- `$PARSER/src/builder.ts` — builder dispatch to update.
- `$CONSTRUCTS/src/index.ts` — exports to update.

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

When making changes to parser, serializer, or constructs packages, execute from `$PIPELINE`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

## Changes

- Rename `ConstructPreProcessor` → `ConstructProcessor` and `preProcess(node, context)` → `captureNode(context, node)` in `$CONSTRUCTS/src/constructs/types.ts`; rename `ConstructParser.preProcessor` → `processor`.
- Rename `createFieldBlockPreProcessor.ts` → `createFieldBlockProcessor.ts` and `createFieldInlinePreProcessor.ts` → `createFieldInlineProcessor.ts` (plus the test file).
- Update `createFieldBlockParser.ts` and `createFieldInlineParser.ts` (`preProcessor:` → `processor:`).
- Update `$PARSER/src/builder.ts` dispatch.
- Update `$CONSTRUCTS/src/index.ts` exports.

## Steps

### Step 1 of 6 — Rename the processor types

1. In `$CONSTRUCTS/src/constructs/types.ts`:
   - Rename `ConstructPreProcessor` → `ConstructProcessor`.
   - Change the method signature from `preProcess(node: MdastNode, context: ParserVisitContext): Construct | null` to `captureNode(context: ParserVisitContext, node: MdastNode): Construct | null`.
   - Rename `ConstructParser.preProcessor` → `processor`.

### Step 2 of 6 — Rename the FieldBlock pre-processor

1. Rename `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockPreProcessor.ts` → `createFieldBlockProcessor.ts` (use `git mv`).
2. In the renamed file:
   - Import `ConstructProcessor` instead of `ConstructPreProcessor`.
   - Return type `ConstructProcessor`.
   - `preProcess(node, context)` → `captureNode(context, node)` — keep the body identical, only swap the parameter order.

### Step 3 of 6 — Rename the FieldInline pre-processor and its test

1. Rename `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.ts` → `createFieldInlineProcessor.ts` (use `git mv`).
2. In the renamed file: import `ConstructProcessor`, return type `ConstructProcessor`, `preProcess(node, context)` → `captureNode(context, node)` — keep the body identical, only swap the parameter order.
3. Rename `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts` → `createFieldInlineProcessor.test.ts` (use `git mv`).
4. In the renamed test: update every `impl.preProcess(paragraph, context)` call to `impl.captureNode(context, paragraph)`.

### Step 4 of 6 — Update parser factories, builder, and exports

1. `$CONSTRUCTS/src/constructs/FieldBlock/createFieldBlockParser.ts`: `preProcessor: createFieldBlockPreProcessor()` → `processor: createFieldBlockProcessor()`.
2. `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlineParser.ts`: `preProcessor: createFieldInlinePreProcessor()` → `processor: createFieldInlineProcessor()`.
3. `$PARSER/src/builder.ts`:
   - `const preProcessor = constructParser.preProcessor;` → `const processor = constructParser.processor;`
   - `const construct = preProcessor?.preProcess(node, currentContext);` → `const construct = processor?.captureNode(currentContext, node);`
4. `$CONSTRUCTS/src/index.ts`: rename the exported type `ConstructPreProcessor` → `ConstructProcessor`.

### Step 5 of 6 — Commit `rename-processor-types`

**Policy:**`AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
refactor(constructs): Rename ConstructPreProcessor to ConstructProcessor

- Rename ConstructPreProcessor to ConstructProcessor and preProcess to captureNode
- Change captureNode parameter order to (context, node)
- Rename createFieldBlockPreProcessor and createFieldInlinePreProcessor files
- Update parser builder dispatch and parser factories
```

### Step 6 of 6 — Verify

1. Run the constructs unit tests from `$CONSTRUCTS`:
   ```bash
   npm run test
   ```
2. Run lint from `$CONSTRUCTS`:
   ```bash
   npm run lint:fix
   ```
3. Run the full pipeline tests from `$PIPELINE`:
   ```bash
   npm run test
   ```
   Expected: all fixtures pass in both `test-parser` and `test-serializer` (roundtrip lossless).

## Final Verification

**Instructions:**

- Verify that `ConstructPreProcessor`, `preProcessor`, and `preProcess` no longer exist anywhere in `$CONSTRUCTS` and `$PARSER`.
- Verify that `createFieldBlockProcessor.ts`, `createFieldInlineProcessor.ts`, and `createFieldInlineProcessor.test.ts` exist and the old file names are gone.
- Verify that `test-parser` and `test-serializer` both pass all fixtures.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
