# Instructions: `deduplicate-primitive-helpers`

**Plan:** `refactor-test-helpers`

**Iteration Id:** `deduplicate-primitive-helpers`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions.

## How to Report Back to the Delegator

1. Summarise whether you are reporting completion or a BLOCKER.
2. Gather evidence of changes made and outcomes achieved, or blocker error details.
3. Use the `render-template` skill with `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `deduplicate-primitive-helpers__report.md`.
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

Move primitives mocks into the primitives package and deduplicate `makeDocumentMock` across constructs, parser, and primitives packages.

## Changes

- Move `nodePositionMock.ts` and `parserVisitContextMock.ts` from constructs to primitives.
- Merge parser's `parserVisitContextMock` into primitives' canonical version.
- Update constructs and parser imports to use primitives' test helpers.
- Deduplicate `makeDocumentMock`: keep primitives version, delete parser and constructs versions, update consumers.
- Add `sectionDepthMock.ts` to primitives if needed by constructs tests.

## Steps

### Step 1 / 5 — Move Primitives Mocks to Primitives Package

Move `nodePositionMock.ts` and `parserVisitContextMock.ts` from `$PROJECT/libs/constructs/src/test/helpers/primitives/` to `$PROJECT/libs/primitives/src/test/helpers/`.

If the primitives helpers directory does not exist, create it first.

Update the file contents if needed to ensure they correctly mock `@art-js/primitives` functions.

### Step 2 / 5 — Merge parserVisitContextMock Variants

Compare parser's `parserVisitContextMock.ts` with the version now in primitives.

Merge any unique functionality from the parser version into the primitives version.

Delete the parser version.

Update all imports in parser tests to use the primitives version.

### Step 3 / 5 — Deduplicate makeDocumentMock

Identify all `makeDocumentMock` implementations across the three packages (constructs, parser, primitives).

Keep the canonical version in `$PROJECT/libs/primitives/src/test/helpers/`.

Delete the duplicate versions in constructs and parser.

Update all consumer imports across test files in constructs and parser to import from `@art-js/primitives` test helpers.

### Step 4 / 5 — Add sectionDepthMock If Needed

Check if constructs tests reference a `sectionDepthMock`.

If needed, create `$PROJECT/libs/primitives/src/test/helpers/sectionDepthMock.ts` with the appropriate mock implementation.

Update constructs imports to use it.

### Step 5 / 5 — Commit

#### Commit: `deduplicate-primitive-helpers`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
test(art-js): Deduplicate primitive test helpers

- Move primitives mocks into primitives package
- Merge parserVisitContextMock variants into canonical version
- Deduplicate makeDocumentMock across packages
- Update all cross-package imports
```

## Final Verification

- Verify that all moved files exist in their new locations and old files are deleted.
- Verify that all imports in test files resolve correctly.
- Run tests in all three packages (constructs, parser, primitives) and confirm they pass.
- Run `npm run ci` or equivalent to ensure lint is clean.
- Report according to the "How to Report Back to the Delegator" instructions.
