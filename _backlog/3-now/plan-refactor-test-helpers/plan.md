# Plan: Refactor Test Helpers

**Id:** `refactor-test-helpers`

**Status:** `WORKING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Restructure, rename, and reclassify test helpers across all 4 packages to eliminate folder-per-file abuse, unify naming conventions, and capture the resulting conventions.

**Description:** The test helper directories in constructs, parser, and primitives have grown organically with one folder per file, inconsistent naming (`make` prefix vs no prefix, `Mock` suffix vs no suffix), and cross-package duplication. This plan collapses the folder hierarchy, renames helpers by their function (fixture factory vs mock factory), groups mocks under their construct domain, deduplicates primitives mocks, evaluates async import patterns, formats test descriptions, and writes the conventions down.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

Collapse one-folder-per-file helper directories into domain-grouped folders (`constructs/{ConstructName}/`, `primitives/`). Rename all helpers consistently: fixture factories use `make{Construct}Mock`, function mocks use `{functionName}Mock`, context mocks use `{contextName}Mock`. Deduplicate primitives mocks that currently live in the wrong package. Evaluate whether async imports in `vi.mock()` blocks are necessary or can be simplified to static imports. Reformat all test descriptions to use capitalised `WHEN`, `FOR`, or `GIVEN` prefixes. Add spacing conventions between setup, invocation, and assertion blocks. Finally, capture all conventions in `@noodlestan/conventions`.

## Context

### Upstream Work

| Kind      | Path                                                | Role                                                               |
| --------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md` | Defines this plan as part of phase 1 of the Consolidate milestone. |

### Knowledge

- ::READ `libs/constructs/src/test/helpers/` (Knowledge) — Current helper directory to restructure.
- ::READ `libs/parser/src/test/helpers/` (Knowledge) — Parser helpers to rename and align.
- ::READ `libs/primitives/src/test/helpers/` (Knowledge) — Primitives helpers to rename and align.

## Scope

### Out of Scope

- `libs/serializer` — no test helpers exist.
- `libs/bundler`, `libs/program`, `libs/validator` — not part of the 4 packages.
- Changing test logic or coverage targets.
- New features.

### Packages

- Package: Artificial Constructs — `libs/constructs/`
- Package: Artificial Parser — `libs/parser/`
- Package: Artificial Primitives — `libs/primitives/`

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `building`.

## Items:

| Iteration / Instructions                                                                                              | Status  |
| --------------------------------------------------------------------------------------------------------------------- | ------- | --------- |
| Iteration: Rename and Reclassify Helpers `./plan-refactor-test-helpers/instructions/rename-and-reclassify-helpers.md` | `DONE`  | `b9a179d` |
| Iteration: Deduplicate Primitive Helpers `./plan-refactor-test-helpers/instructions/deduplicate-primitive-helpers.md` | `READY` |
| Iteration: Simplify Async Imports `./plan-refactor-test-helpers/instructions/simplify-async-imports.md`               | `READY` |
| Iteration: Format Test Scenarios `./plan-refactor-test-helpers/instructions/format-test-scenarios.md`                 | `READY` |
| Iteration: Write Test Conventions `./plan-refactor-test-helpers/instructions/write-test-conventions.md`               | `READY` |

### Iteration: Rename and Reclassify Helpers

**Id:** `rename-and-reclassify-helpers`

**Status:** `DONE`

**Purpose:** Collapse one-folder-per-file helper directories into domain-grouped folders and rename all helpers by their function (fixture factory vs mock factory).

**Description:** Restructure `src/test/helpers/` in constructs: create `constructs/{ConstructName}/` folders (Document, FieldBlock, FieldInline, NaturalBlock, NaturalExpression, SectionBlock, Tag) and `primitives/` folder. Move all helpers into their domain group. Rename fixture factories to `make{Construct}Mock` (e.g., `makeTag` → `makeTagMock`). Rename function mocks to `{functionName}Mock` (e.g., `makeExtractTagsMock` → `extractTagsMock`). Rename context mock to `documentContextMock`. Add `/** @mocks ... */` or `/** @provides ... */` header comments to every helper.

Key insight: the `make` prefix is reserved for fixture factories (functions that create test data objects). Function mocks and context mocks drop the `make` prefix because they are not "making" something — they are providing a mock implementation. This creates an immediate visual distinction at the call site: `makeTagMock()` produces a `Tag` object, while `extractTagsMock()` produces a mock function.

Update all consumer imports across 30 test files. Delete old helper files and empty directories. Format with prettier. Verify all tests pass.

**Changes:**

- Restructure `libs/constructs/src/test/helpers/` from 16 single-file folders into grouped folders:
  - `constructs/Document/`: `makeDocumentMock.ts`, `documentContextMock.ts`
  - `constructs/FieldBlock/`: `makeFieldBlockMock.ts`, `createFieldBlockFromParagraphMock.ts`, `stripStrongMock.ts`, `isFieldStrongMock.ts`
  - `constructs/FieldInline/`: `makeFieldInlineMock.ts`
  - `constructs/NaturalBlock/`: `makeNaturalBlockMock.ts`
  - `constructs/NaturalExpression/`: `makeNaturalExpressionMock.ts`, `createNaturalExpressionMock.ts`
  - `constructs/SectionBlock/`: `makeSectionBlockMock.ts`, `findTagableMock.ts`
  - `constructs/Tag/`: `makeTagMock.ts`, `extractTagsMock.ts`, `tagToMdastMock.ts`
  - `primitives/`: `nodePositionMock.ts`, `parserVisitContextMock.ts`
  - Root: `rawSliceMock.ts`
- Rename all functions to match new file names.
- Add header comments to every helper.
- Update all imports in 30 `.test.ts` files across constructs package.
- Rename parser helpers: `makeDocument` → `makeDocumentMock`, `makeParserVisitContextMock` → `parserVisitContextMock`.
- Rename primitives helpers: `makeDocument` → `makeDocumentMock`.
- Update parser and primitives consumer imports.
- Delete old helper files and empty directories.
- Format all changed files with prettier.

**Dependencies:**

None.

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ----------------------- | ------------------------------ | -------- | --------- | ----------- |
| `rename-and-reclassify` | $PROJECT / `building`          | `MANUAL` | `b9a179d` | `COMMITTED` |

##### Commit: `rename-and-reclassify`

**Repository:** Art JS

**Message:**

```
test(art-js): Rename and reclassify test helpers.

- Collapse one-folder-per-file into domain-grouped folders.
- Rename fixture factories to make{Construct}Mock.
- Rename function mocks to {functionName}Mock.
- Add @mocks/@provides header comments.
- Update all consumer imports across constructs, parser, primitives.
```

### Iteration: Deduplicate Primitive Helpers

**Id:** `deduplicate-primitive-helpers`

**Status:** `READY`

**Purpose:** Move primitives mocks into the primitives package and deduplicate `makeDocumentMock` across all three packages.

**Description:** The primitives mocks (`nodePositionMock`, `parserVisitContextMock`) currently live in constructs but mock `@art-js/primitives` functions. They should live in `libs/primitives/src/test/helpers/`. The parser package also has its own `parserVisitContextMock` — merge the two into the canonical version in primitives. All three packages define their own `makeDocument`/`makeDocumentMock` — deduplicate by having primitives own the canonical version and have parser/constructs import it. Add missing `sectionDepthMock` if constructs tests need it.

**Changes:**

- Move `nodePositionMock.ts` and `parserVisitContextMock.ts` from constructs to primitives.
- Merge parser's `parserVisitContextMock` into primitives' canonical version.
- Update constructs and parser imports to use primitives' test helpers.
- Deduplicate `makeDocumentMock`: keep primitives version, delete parser and constructs versions, update consumers.
- Add `sectionDepthMock.ts` to primitives if needed by constructs tests.

**Dependencies:**

- Iteration: Rename and Reclassify Helpers.

#### Commits:

| ID                              | Repository / Checkout / Branch | Policy       | Hash | Status     |
| ------------------------------- | ------------------------------ | ------------ | ---- | ---------- |
| `deduplicate-primitive-helpers` | $PROJECT / `building`          | `AUTONOMOUS` | TBD  | `AUTHORED` |

##### Commit: `deduplicate-primitive-helpers`

**Repository:** Art JS

**Message:**

```
test(art-js): Deduplicate primitive test helpers

- Move primitives mocks into primitives package
- Merge parserVisitContextMock variants into canonical version
- Deduplicate makeDocumentMock across packages
- Update all cross-package imports
```

### Iteration: Simplify Async Imports

**Id:** `simplify-async-imports`

**Status:** `READY`

**Purpose:** Evaluate whether async imports in `vi.mock()` blocks are necessary and simplify to static imports where possible.

**Description:** Many test files use `await import('...')` inside `vi.mock()` blocks. In most cases this is unnecessary — `vi.mock()` is hoisted by Vitest and can reference modules directly via static imports at the top of the file. The async import pattern was likely adopted defensively but adds visual noise and suggests dynamic behaviour where none exists.

Key insight: `vi.mock()` is hoisted to the top of the file before imports are evaluated. Static imports work fine inside mock factories because the mock is established before test code runs. The only case where async imports are genuinely needed is when the import path must be computed dynamically or when mocking a module that itself imports the module under test (circular dependency).

Pick a representative sample file (e.g., one that mocks a primitives helper), test with static imports, verify tests still pass, then apply the pattern to all test files that use unnecessary async imports. Document any edge cases where async imports remain necessary.

**Changes:**

- Identify all test files using async imports inside `vi.mock()` blocks.
- Pick a sample file and convert async imports to static imports.
- Run tests to verify the simplification works.
- Apply the pattern to all affected test files.

**Dependencies:**

- Iteration: Rename and Reclassify Helpers.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy   | Hash | Status     |
| ------------------------ | ------------------------------ | -------- | ---- | ---------- |
| `simplify-async-imports` | $PROJECT / `building`          | `MANUAL` | TBD  | `AUTHORED` |

##### Commit: `simplify-async-imports`

**Repository:** Art JS

**Message:**

```
test(art-js): Simplify imports in unit tests

- Convert unnecessary async imports in vi.mock() blocks to static imports
- Verify all tests pass after simplification
```

### Iteration: Format Test Scenarios

**Id:** `format-test-scenarios`

**Status:** `READY`

**Purpose:** Standardise test descriptions and layout across all unit tests.

**Description:** Reformat all test descriptions to use capitalised `WHEN`, `FOR`, or `GIVEN` prefixes. Add empty lines between setup, invocation, and assertion blocks. Ensure consistent spacing and readability.

**Changes:**

- Reword all `it('...')` descriptions to start with `WHEN`, `FOR`, or `GIVEN` in all caps.
- Add empty line between setup code and unit under test invocation.
- Add empty line between unit under test invocation and assertions.
- Format all changed files with prettier.

**Dependencies:**

- Iteration: Rename and Reclassify Helpers.

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy       | Hash | Status     |
| ----------------------- | ------------------------------ | ------------ | ---- | ---------- |
| `format-test-scenarios` | $PROJECT / `building`          | `AUTONOMOUS` | TBD  | `AUTHORED` |

##### Commit: `format-test-scenarios`

**Repository:** Art JS

**Message:**

```
conventions(art-js): Format and reword unit tests

- Reword test descriptions with WHEN/FOR/GIVEN prefixes
- Add spacing between setup, invocation, and assertion blocks
- Format all test files
```

### Iteration: Write Test Conventions

**Id:** `write-test-conventions`

**Status:** `READY`

**Purpose:** Capture all test helper and unit test conventions in `@noodlestan/conventions`.

**Description:** Generate a draft for a new `@noodlestan/conventions-unit-tests` package in `@noodlestan/conventions` for Unit Tests. Capture the naming, grouping, commenting, import, and formatting conventions established in the previous iterations. Use the terse convention format for obvious rules and the verbose format with Avoid/Prefer examples for detailed rules.

**Changes:**

- Generate `@noodlestan/conventions-unit-tests` package draft in `$PROJECT/conventions/`.
- Structure conventions by topic using format:

  ```markdown
  ## Conventions: Unit Tests / {Topic}
  ```

- **Terse conventions** (for obvious rules):

  ```markdown
  - **Convention Name** – terse convention description no more than 200 characters, concrete, no adjectives, no exceptions, use "when" to scope positively, hyper terse code snippet
  ```

  Examples:

  ```markdown
  - **Fixture Factory Naming** – Fixture factories use `make{Construct}Mock`.
  - **Function Mock Naming** – Function mocks use `{functionName}Mock` with no `make` prefix.
  - **Test Description Prefixes** – Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
  ```

- **Verbose conventions** (for detailed rules requiring examples):

  ````markdown
  ## Convention: Unit Tests / {Topic}

  **Summary:** Description of the convention.

  **Avoid:**

  ```ts
  // bad example
  ```
  ````

  **Prefer:**

  ```ts
  // good example
  ```

  ````

  Example:

  ```markdown
  ## Convention: Unit Tests / Block Spacing

  **Summary:** Separate setup, invocation, and assertion blocks with empty lines.

  **Avoid:**

  ```ts
  const mock = makeTagMock();
  const result = processTag(mock);
  expect(result).toBe('test');
  ````

  **Prefer:**

  ```ts
  const mock = makeTagMock();

  const result = processTag(mock);

  expect(result).toBe('test');
  ```

  ```

  ```

- Document all conventions established in previous iterations:
  - Helper grouping by domain (`constructs/{ConstructName}/`, `primitives/`)
  - Fixture factory naming (`make{Construct}Mock`)
  - Function mock naming (`{functionName}Mock`, no `make` prefix)
  - Context mock naming (`{contextName}Mock`)
  - Header comments (`@mocks` for function mocks, `@provides` for fixture factories)
  - Test description format (`WHEN/FOR/GIVEN` in all caps)
  - Block spacing (empty lines between setup, invocation, assertion)
  - Import style preference (static over async where possible)
  - Cross-package mock ownership (primitives mocks live in primitives package)

**Dependencies:**

- Iteration: Format Test Scenarios.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash | Status     |
| ------------------------ | ------------------------------ | ------------ | ---- | ---------- |
| `write-test-conventions` | $PROJECT / `building`          | `AUTONOMOUS` | TBD  | `AUTHORED` |

##### Commit: `write-test-conventions`

**Repository:** Art JS

**Message:**

```
conventions(art-js): Add unit test conventions

- Document helper grouping, naming, and commenting conventions
- Document test description and formatting conventions
```

## Work

### Next

Delegate the next `READY` iteration.

### Blockers

None.

## Coordination

### Not In Scope

- `libs/serializer` — no test helpers.
- `libs/bundler`, `libs/program`, `libs/validator`.
- Changing test logic or coverage targets.
- New features.

### Evidence

- All test helpers grouped under `constructs/{ConstructName}/` or `primitives/`.
- All helpers renamed consistently (fixture factories: `make{Construct}Mock`, mocks: `{functionName}Mock`).
- All helpers have header comments.
- All tests pass after each iteration.
- Lint clean.

### Decisions

- Fixture factories use `make{Construct}Mock` naming.
- Function mocks use `{functionName}Mock` naming (no `make` prefix).
- Context mocks use `{contextName}Mock` naming.
- Mocks for `@art-js/primitives` functions live in `primitives/` package.
- Mocks for `@art-js/constructs` functions live under `constructs/{ConstructName}/`.
- Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
- Empty lines separate setup, invocation, and assertion blocks.

### Follow Ups

- Apply conventions to future test helper additions.
- Review `@noodlestan/conventions` periodically for drift.
