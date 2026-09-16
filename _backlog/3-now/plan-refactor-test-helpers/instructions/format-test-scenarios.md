# Instructions: `format-test-scenarios`

**Plan:** `refactor-test-helpers`

**Iteration Id:** `format-test-scenarios`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions.

## How to Report Back to the Delegator

1. Summarise whether you are reporting completion or a BLOCKER.
2. Gather evidence of changes made and outcomes achieved, or blocker error details.
3. Use the `render-template` skill with `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `format-test-scenarios__report.md`.
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

Standardise test descriptions and layout across all unit tests.

## Changes

- Reword all `it('...')` descriptions to start with `WHEN`, `FOR`, or `GIVEN` in all caps.
- Add empty line between setup code and unit under test invocation.
- Add empty line between unit under test invocation and assertions.
- Format all changed files with prettier.

## Steps

### Step 1 / 3 — Reword Test Descriptions

Scan all `.test.ts` files in `$PROJECT/libs/constructs/`, `$PROJECT/libs/parser/`, and `$PROJECT/libs/primitives/`.

For each `it('...')` or `it.each(...)()` description:

- If the description does not already start with `WHEN`, `FOR`, or `GIVEN` in all caps, reword it to start with one of these prefixes.
- Ensure the description is clear and concise.

Examples:

- `it('returns true for valid input')` → `it('WHEN given valid input returns true')`
- `it('parses the document correctly')` → `it('WHEN parsing a document returns the correct structure')`
- `it.each(...)('handles %s')` → `it.each(...)('WHEN handling %s')`

### Step 2 / 3 — Add Block Spacing

In each `.test.ts` file, ensure consistent spacing:

- Add an empty line between setup code (mocks, variables) and the unit under test invocation.
- Add an empty line between the unit under test invocation and assertions.

Example:

```ts
const mock = makeTagMock();

const result = processTag(mock);

expect(result).toBe('test');
```

### Step 3 / 3 — Format and Commit

Run prettier on all modified test files.

#### Commit: `format-test-scenarios`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
conventions(art-js): Format and reword unit tests

- Reword test descriptions with WHEN/FOR/GIVEN prefixes
- Add spacing between setup, invocation, and assertion blocks
- Format all test files
```

## Final Verification

- Verify all tests in constructs, parser, and primitives pass.
- Verify no test descriptions were broken or made unclear by rewording.
- Run `npm run ci` or equivalent to ensure lint is clean.
- Report according to the "How to Report Back to the Delegator" instructions.
