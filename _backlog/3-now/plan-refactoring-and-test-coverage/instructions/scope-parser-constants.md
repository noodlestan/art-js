# Instructions: `scope-parser-constants`

**Plan:** `refactoring-and-test-coverage`

**Iteration Id:** `scope-parser-constants`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactoring-and-test-coverage/instructions/scope-parser-constants__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |
| `$PARSER`    | `$PROJECT/libs/parser`    | Parser package to refactor           |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: happy face and up to 3 bullet points.

## Goals

Move parser constants from the package root into the `mdast/` subdirectory and extract `isBlockType` into its own module, aligning file structure with the domain model.

## Mandatory Reading

- `$PARSER/src/constants.ts` — the constants file to move.
- `$PARSER/src/builder.ts` — imports `isBlockType` from `./constants`.

## Changes

- Create `$PARSER/src/mdast/constants.ts` containing `BLOCK_TYPES`.
- Create `$PARSER/src/mdast/isBlockType.ts` exporting the `isBlockType` function.
- Delete `$PARSER/src/constants.ts`.
- Update `$PARSER/src/builder.ts` to import from `./mdast/isBlockType`.

## Steps

### Step 1 of 3 — Create scoped files

1. Create `$PARSER/src/mdast/` directory if it does not exist.
2. Create `$PARSER/src/mdast/constants.ts`:
   ```typescript
   export const BLOCK_TYPES = new Set([
     'paragraph',
     'code',
     'list',
     'blockquote',
     'table',
     'thematicBreak',
     'html',
     'definition',
   ]);
   ```
3. Create `$PARSER/src/mdast/isBlockType.ts`:

   ```typescript
   import { BLOCK_TYPES } from './constants';

   export function isBlockType(type: string): boolean {
     return BLOCK_TYPES.has(type);
   }
   ```

### Step 2 of 3 — Update imports and remove old file

1. Update `$PARSER/src/builder.ts`:
   - Change `import { isBlockType } from './constants';` to `import { isBlockType } from './mdast/isBlockType';`.
2. Delete `$PARSER/src/constants.ts`.

### Step 3 of 3 — Verify

1. Run parser tests:
   ```bash
   cd $PARSER && npm run test
   ```
2. Run pipeline tests:
   ```bash
   cd $PROJECT/cli/pipeline-tests && npm run test
   ```
3. Run lint:
   ```bash
   cd $PARSER && npm run lint
   ```
4. Confirm `$PARSER/src/constants.ts` no longer exists.

## Final Verification

**Instructions:**

- Verify that all tests pass (parser + pipeline).
- Verify that lint passes.
- Verify that `$PARSER/src/constants.ts` is deleted and `$PARSER/src/mdast/constants.ts` and `$PARSER/src/mdast/isBlockType.ts` exist.
- Stage all changes.
- Commit autonomously with message:

  ```
  refactor(art-js): Scope parser constants into mdast subdirectory

  - Move BLOCK_TYPES to `src/mdast/constants.ts`
  - Extract `isBlockType` into `src/mdast/isBlockType.ts`
  - Update builder import
  - Remove `src/constants.ts`
  ```

- Push and report back.
