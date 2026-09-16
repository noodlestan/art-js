# Instructions: `simplify-async-imports`

**Plan:** `refactor-test-helpers`

**Iteration Id:** `simplify-async-imports`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions.

## How to Report Back to the Delegator

1. Summarise whether you are reporting completion or a BLOCKER.
2. Gather evidence of changes made and outcomes achieved, or blocker error details.
3. Use the `render-template` skill with `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `simplify-async-imports__report.md`.
4. Generate the response and send it back to the delegator tersely: happy face + up to 3 bullet points.

## Path Variables

| Variable     | Resolved Path               | Purpose                              |
| ------------ | --------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory   | Workspace root directory             |
| `$PROJECT`   | `checkouts/art-js-building` | Repository root for all code changes |

## Working Agreements

1. **This instructions file is self-contained.** Everything you need is in this file.
2. **Your report is mandatory.** The rendered report file carries the full trail.
3. **User interaction is minimal.** Report tersely to the delegator.

## Goals

Evaluate whether async imports in `vi.mock()` blocks are necessary and simplify to static imports where possible.

## Changes

- Identify all test files using async imports inside `vi.mock()` blocks.
- Pick a sample file and convert async imports to static imports.
- Run tests to verify the simplification works.
- Apply the pattern to all affected test files.

## Steps

### Step 1 / 4 — Identify Affected Files

Search for test files (`.test.ts`) across `$PROJECT/libs/constructs/`, `$PROJECT/libs/parser/`, and `$PROJECT/libs/primitives/` that use `await import(...)` inside `vi.mock()` blocks.

Document the list of affected files.

### Step 2 / 4 — Convert Sample File

Pick one representative file (e.g., a test that mocks a primitives helper).

Replace `await import('...')` inside the `vi.mock()` factory with a static `import ... from '...'` at the top of the file.

Ensure the mock factory references the imported values directly.

Run the specific test file to verify it passes.

### Step 3 / 4 — Apply to All Affected Files

Apply the same static import pattern to all identified test files.

For each file:

- Add static imports at the top.
- Replace `await import(...)` in `vi.mock()` with direct references.
- Run the file's tests to verify.

Document any edge cases where async imports remain necessary (e.g., circular dependencies, dynamic paths).

### Step 4 / 4 — Commit

#### Commit: `simplify-async-imports`

**Policy:** MANUAL — Do NOT commit automatically. Report to delegator for review.

**Message:**

```
test(art-js): Simplify imports in unit tests

- Convert unnecessary async imports in vi.mock() blocks to static imports
- Verify all tests pass after simplification
```

## Final Verification

- Verify all tests in constructs, parser, and primitives pass.
- Verify no `await import()` remains inside `vi.mock()` blocks unless documented as necessary.
- Run `npm run ci` or equivalent to ensure lint is clean.
- Report according to the "How to Report Back to the Delegator" instructions.
