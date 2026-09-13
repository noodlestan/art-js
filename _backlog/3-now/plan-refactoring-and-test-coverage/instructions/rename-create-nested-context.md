# Instructions: `rename-create-nested-context`

**Plan:** `refactoring-and-test-coverage`

**Iteration Id:** `rename-create-nested-context`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactoring-and-test-coverage/instructions/rename-create-nested-context__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable      | Resolved Path              | Purpose                              |
| ------------- | -------------------------- | ------------------------------------ |
| `$WORKSPACE`  | Current working directory  | Workspace root directory             |
| `$PROJECT`    | Provided with prompt       | Repository root for all code changes |
| `$PRIMITIVES` | `$PROJECT/libs/primitives` | Primitives package (rename source)   |
| `$PARSER`     | `$PROJECT/libs/parser`     | Parser package (consumes rename)     |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs` | Constructs package (consumes rename) |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Rename `createNestedContext` to `createParserContext` across the `@art-js/artificial-*` packages to better reflect its role as the parser's context factory. Do NOT touch the `poc-parse` package (read-only migration source).

## Mandatory Reading

- `$PRIMITIVES/src/parser/helpers/createNestedContext.ts` — the function to rename.
- `$PRIMITIVES/src/parser/helpers/index.ts` — re-exports.
- `$PRIMITIVES/src/parser/index.ts` — public API exports.

## Changes

- Rename the function `createNestedContext` → `createParserContext` in `$PRIMITIVES/src/parser/helpers/createNestedContext.ts`.
- Update re-exports in `$PRIMITIVES/src/parser/helpers/index.ts`.
- Update public API exports in `$PRIMITIVES/src/parser/index.ts`.
- Update all imports across `$PARSER`, `$CONSTRUCTS`, and test files.
- Do NOT modify `$PROJECT/cli/poc-parse/**` (read-only migration source).

## Steps

### Step 1 of 3 — Rename in primitives

1. Rename the function in `$PRIMITIVES/src/parser/helpers/createNestedContext.ts`:
   - Change `export function createNestedContext(` to `export function createParserContext(`.
2. Update `$PRIMITIVES/src/parser/helpers/index.ts`:
   - Change `export { createNestedContext, getSectionMap }` to `export { createParserContext, getSectionMap }`.
3. Update `$PRIMITIVES/src/parser/index.ts`:
   - Change `export { createNestedContext, getSectionMap, sectionDepth }` to `export { createParserContext, getSectionMap, sectionDepth }`.

### Step 2 of 3 — Update consumers

Update all imports across these files (search for `createNestedContext`):

1. `$PARSER/src/private/createDocumentContext.ts`
2. `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts`
3. `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts`
4. `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts`

Replace every occurrence of `createNestedContext` with `createParserContext` in both import statements and call expressions.

### Step 3 of 3 — Verify

1. Run tests across affected packages:
   ```bash
   cd $PROJECT && npm run ci
   ```
2. Confirm no remaining references to `createNestedContext` outside `cli/poc-parse`:
   ```bash
   grep -rn "createNestedContext" $PROJECT/libs --include="*.ts"
   ```
   Expected: no matches in `libs/`.

## Final Verification

**Instructions:**

- Verify that `npm run ci` passes across all packages.
- Verify that `grep -rn "createNestedContext" $PROJECT/libs --include="*.ts"` returns no matches.
- Stage all changes.
- Commit autonomously with message:

  ```
  refactor(art-js): Rename createNestedContext to createParserContext

  - Rename function in primitives parser helpers
  - Update exports in primitives index files
  - Update all imports in parser, constructs, and tests
  ```

- Push and report back.
