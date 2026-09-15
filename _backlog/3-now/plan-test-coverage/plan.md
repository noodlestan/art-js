# Plan: Test Coverage

**Id:** `test-coverage`

**Status:** `WORKING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Add full coverage with unit tests to the parser, primitives, serializer, and constructs packages.

**Description:** Add unit tests and test helpers to all 4 packages, and elevate the vitest coverage thresholds.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

The 4 packages currently have partial unit test coverage: 7 test files total (6 in constructs, 1 in serializer) and none in parser or primitives. Build coverage incrementally — measure against the targets but do not attempt to reach them on the first steps; each step adds more tests. First establish a minimal baseline (happy path + most obvious exception path, all dependencies mocked in-file), then extract consistent test helpers colocated in each package (`src/test/helpers/{topic}/`), deepen coverage with more cases, align tests to a common setup/lock => execute => assert pattern, reduce repetition by consuming and abstracting helpers, close the remaining coverage gaps against the targets (lines 95, functions 100, branches 95, statements 95), and finally elevate the vitest thresholds in all 4 packages.

## Context

### Upstream Work

| Kind      | Path                                                | Role                                                       |
| --------- | --------------------------------------------------- | ---------------------------------------------------------- |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md` | Defines this plan as phase 1 of the Consolidate milestone. |

### Knowledge

- ::READ `libs/parser/src/` (Knowledge) — Parser modules to cover (builder, mdast helpers, config, context).
- ::READ `libs/primitives/src/` (Knowledge) — Primitives modules to cover (point, constructs, parser helpers).
- ::READ `libs/serializer/src/` (Knowledge) — Serializer modules to cover (serializer, artAstToMdast, config).
- ::READ `libs/constructs/src/` (Knowledge) — Constructs modules to cover (factories, processors, integrators, node-based factories, helpers).
- ::READ `libs/parser/vitest.config.ts`, `libs/primitives/vitest.config.ts`, `libs/serializer/vitest.config.ts`, `libs/constructs/vitest.config.ts` (Knowledge) — Current coverage thresholds to elevate.

## Scope

### Out of Scope

- `libs/bundler`, `libs/program`, `libs/validator` — not part of the 4 packages.
- POC (`cli/poc-parse/`) — self-contained package scheduled for archiving in `plan-archive-poc-and-publish`.
- Fixture-based pipeline tests (`cli/pipeline-tests/`) — already covered by the pipeline suite.
- New features.

### Packages

- Package: Artificial Constructs — `libs/constructs/`
- Package: Artificial Parser — `libs/parser/`
- Package: Artificial Serializer — `libs/serializer/`
- Package: Artificial Primitives — `libs/primitives/`

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                                  | Status  |
| --------------------------------------------------------------------------------------------------------- | ------- | --------- |
| Iteration: Add Minimal Unit Tests `./plan-test-coverage/instructions/add-minimal-unit-tests.md`           | `DONE`  |
| Iteration: Extract Test Helpers `./plan-test-coverage/instructions/extract-test-helpers.md`               | `DONE`  | `48cdf2e` |
| Iteration: Deepen Test Coverage `./plan-test-coverage/instructions/deepen-test-coverage.md`               | `DONE`  | `a65a024` |
| Iteration: Align Test Patterns `./plan-test-coverage/instructions/align-test-patterns.md`                 | `DONE`  | `8b07ab3` |
| Iteration: Consume Test Helpers `./plan-test-coverage/instructions/consume-test-helpers.md`               | `DONE`  | `35e4ed5` |
| Iteration: Abstract Repeated Helpers `./plan-test-coverage/instructions/abstract-repeated-helpers.md`     | `DONE`  | `af3dadd` |
| Iteration: Close Coverage Gaps `./plan-test-coverage/instructions/close-coverage-gaps.md`                 | `DONE`  | `8fe0d26` |
| Iteration: Elevate Coverage Thresholds `./plan-test-coverage/instructions/elevate-coverage-thresholds.md` | `READY` |

### Iteration: Add Minimal Unit Tests

**Id:** `add-minimal-unit-tests`

**Status:** `DONE`

**Purpose:** Establish a minimal unit test baseline across all 4 packages — happy path plus the most obvious exception path where one exists — with all dependencies mocked in-file.

**Description:** Add minimal unit tests for every module in `src/` (excluding `src/index.ts`) in parser, primitives, serializer, and constructs. Each test file mocks all dependencies in-file to isolate the module under test. Do not chase the coverage targets yet — measure and record the current coverage per package as the baseline.

**Instructions:** `./plan-test-coverage/instructions/add-minimal-unit-tests.md`

**Report:** `./plan-test-coverage/instructions/add-minimal-unit-tests__report.md`

**Changes:**

- parser: minimal tests for `builder.ts`, `mdast/isBlockType.ts`, `mdast/constants.ts`, `private/createDocumentContext.ts`, `config/createDefaultConfig.ts`, `config/types.ts`.
- primitives: minimal tests for `point.ts`, `constructs.ts`, `parser/helpers/nodePosition.ts`, `parser/helpers/createParserVisitContext.ts`, `parser/helpers/sectionDepth.ts`.
- serializer: minimal tests for `serializer.ts`, `artAstToMdast.ts`, `config/createDefaultSerializerConfig.ts`, `config/types.ts` (extend the existing `serializer.test.ts` where needed).
- constructs: minimal tests for all construct factories, processors, integrators, node-based factories, and helpers (`extractTags`, `rawSlice`, etc.); keep and extend the 6 existing test files.
- All dependencies mocked in-file with whatever it takes to isolate the module under test from its dependencies.
- Measure and record coverage per package as the baseline; do NOT attempt to reach the targets yet.

**Dependencies:**

None.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash    | Status      |
| ------------------------ | ------------------------------ | ------------ | ------- | ----------- |
| `add-minimal-unit-tests` | $PROJECT / `main`              | `AUTONOMOUS` | 8889992 | `COMMITTED` |

##### Commit: `add-minimal-unit-tests`

**Repository:** Art JS

**Message:**

```
test: Add minimal unit test coverage to parser, primitives, serializer, constructs

- Add happy-path and obvious-exception tests for every module in the 4 packages
- Mock all dependencies in-file to isolate each module under test
- Record per-package coverage baseline without chasing targets yet
```

### Iteration: Extract Test Helpers

**Id:** `extract-test-helpers`

**Status:** `WORKING`

**Purpose:** Abstract mocking and setup helpers into consistent, colocated helpers so tests stop wiring mocks locally.

**Description:** Extract the in-file mocks and setup from the minimal tests into `src/test/helpers/{topic}/` (e.g. `makeSomethingMock.ts`), colocated in the package of the thing they mock. Consume the helpers in the tests written in the previous iteration.

**Instructions:** `./plan-test-coverage/instructions/extract-test-helpers.md`

**Changes:**

- Create `src/test/helpers/{topic}/` per package with helper primitives (e.g. `makeSomethingMock.ts`, `makeContext.ts`).
- Hoist the helper primitives so helpers are colocated in the package of the thing they mock.
- Consume the helpers in all tests written in `add-minimal-unit-tests`, replacing in-file mocks.

**Dependencies:**

- Iteration: Add Minimal Unit Tests.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ---------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `extract-test-helpers` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `extract-test-helpers`

**Repository:** Art JS

**Message:**

```
test: Extract shared test helpers per package

- Add src/test/helpers/{topic} with helper primitives per package
- Colocate helpers in the package of the thing they mock
- Consume helpers in the minimal tests, replacing in-file mocks
```

### Iteration: Deepen Test Coverage

**Id:** `deepen-test-coverage`

**Status:** `DONE`

**Purpose:** Add more test cases using the existing helpers, covering more branches and exception paths, and extract more helpers when a pattern is found.

**Description:** Extend the minimal tests with additional cases — edge cases, branch variants, exception paths — using the helpers from the previous iteration. When a repeated pattern is found, extract a new helper following the same conventions.

**Instructions:** `./plan-test-coverage/instructions/deepen-test-coverage.md`

**Changes:**

- Add more cases to existing tests using existing helpers.
- Extract more helpers when a pattern is found (same conventions as `extract-test-helpers`).
- Cover exception paths, edge cases, and branch variants.

**Dependencies:**

- Iteration: Extract Test Helpers.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ---------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `deepen-test-coverage` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `deepen-test-coverage`

**Repository:** Art JS

**Message:**

```
test: Deepen unit test coverage with more cases

- Add edge cases, branch variants, and exception paths using existing helpers
- Extract more helpers when a repeated pattern is found
```

### Iteration: Align Test Patterns

**Id:** `align-test-patterns`

**Status:** `READY`

**Purpose:** Align all tests to a common setup/lock => execute => assert pattern so the suite reads consistently.

**Description:** Review all tests for patterns in setup/lock => execute => assert. Identify patterns and make tests more similar by aligning setup steps, semantics, variable names, mock content, assertion order and detail.

**Instructions:** `./plan-test-coverage/instructions/align-test-patterns.md`

**Changes:**

- Review all tests for setup/lock => execute => assert patterns.
- Align setup steps, semantics, variable names, mock content, assertion order and detail across tests.

**Dependencies:**

- Iteration: Deepen Test Coverage.

#### Commits:

| ID                    | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| --------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `align-test-patterns` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `align-test-patterns`

**Repository:** Art JS

**Message:**

```
test: Align unit tests to common setup-execute-assert patterns

- Identify setup/lock => execute => assert patterns across the suite
- Align setup steps, semantics, variable names, mock content, and assertion order
```

### Iteration: Consume Test Helpers

**Id:** `consume-test-helpers`

**Status:** `READY`

**Purpose:** Reduce repetition by consuming existing helpers in tests that still wire setup and mocking locally.

**Description:** Review all tests for locally wired setup and mocking that could use existing test helpers, and consume the helpers to reduce repetition.

**Instructions:** `./plan-test-coverage/instructions/consume-test-helpers.md`

**Changes:**

- Review all tests for locally wired setup and mocking that could use existing test helpers.
- Consume existing helpers to reduce repetition.

**Dependencies:**

- Iteration: Extract Test Helpers.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ---------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `consume-test-helpers` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `consume-test-helpers`

**Repository:** Art JS

**Message:**

```
test: Consume shared helpers to reduce test repetition

- Replace locally wired setup and mocking with existing test helpers
- Reduce repetition across the unit test suite
```

### Iteration: Abstract Repeated Helpers

**Id:** `abstract-repeated-helpers`

**Status:** `DONE`

**Purpose:** Abstract new helpers from remaining repetition and consume them across all similar unit tests.

**Description:** Review all tests for abstractable helpers. If repetition is found, abstract a new helper following the same process and conventions as `extract-test-helpers`, and consume it in all similar unit tests.

**Instructions:** `./plan-test-coverage/instructions/abstract-repeated-helpers.md`

**Changes:**

- Review all tests for abstractable helpers.
- Abstract a new helper if repetition is found (same process and conventions as `extract-test-helpers`).
- Consume the new helper in all similar unit tests.

**Dependencies:**

- Iteration: Consume Test Helpers.

#### Commits:

| ID                          | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| --------------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `abstract-repeated-helpers` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `abstract-repeated-helpers`

**Repository:** Art JS

**Message:**

```
test: Abstract repeated test setup into new helpers

- Abstract new helpers from remaining repetition
- Consume the new helpers in all similar unit tests
```

### Iteration: Close Coverage Gaps

**Id:** `close-coverage-gaps`

**Status:** `DONE`

**Purpose:** Measure coverage against the targets and add tests to close the remaining gaps.

**Description:** Run coverage per package, compare against the targets (lines 95, functions 100, branches 95, statements 95), and add tests to cover the gaps.

**Instructions:** `./plan-test-coverage/instructions/close-coverage-gaps.md`

**Changes:**

- Measure coverage against the targets: lines 95, functions 100, branches 95, statements 95.
- Add tests to cover the gaps.

**Dependencies:**

- Iteration: Abstract Repeated Helpers.

#### Commits:

| ID                    | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| --------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `close-coverage-gaps` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `close-coverage-gaps`

**Repository:** Art JS

**Message:**

```
test: Close coverage gaps toward 95/100/95/95 targets

- Measure coverage per package against the targets
- Add tests to cover the remaining gaps
```

### Iteration: Elevate Coverage Thresholds

**Id:** `elevate-coverage-thresholds`

**Status:** `WORKING`

**Purpose:** Elevate the vitest coverage thresholds in all 4 packages to the targets.

**Description:** Elevate coverage thresholds in `libs/parser/vitest.config.ts`, `libs/primitives/vitest.config.ts`, `libs/serializer/vitest.config.ts`, and `libs/constructs/vitest.config.ts` to lines 95, functions 100, branches 95, statements 95.

**Instructions:** `./plan-test-coverage/instructions/elevate-coverage-thresholds.md`

**Changes:**

- `libs/parser/vitest.config.ts`, `libs/primitives/vitest.config.ts`, `libs/serializer/vitest.config.ts`, `libs/constructs/vitest.config.ts`: elevate thresholds to:

  ```typescript
  lines: 95,
  functions: 100,
  branches: 95,
  statements: 95,
  ```

**Dependencies:**

- Iteration: Close Coverage Gaps.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ----------------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `elevate-coverage-thresholds` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `elevate-coverage-thresholds`

**Repository:** Art JS

**Message:**

```
test: Elevate vitest coverage thresholds to 95/100/95/95

- Elevate thresholds in parser, primitives, serializer, and constructs vitest configs
```

## Work

### Next

Delegate the next `READY` instruction.

### Blockers

None.

## Coordination

### Not In Scope

- `libs/bundler`, `libs/program`, `libs/validator`.
- POC (`cli/poc-parse/`) — scheduled for archiving.
- Fixture-based pipeline tests (`cli/pipeline-tests/`).
- New features.

### Evidence

- Coverage reports per package meet the targets (lines 95, functions 100, branches 95, statements 95) after `close-coverage-gaps`.
- Thresholds elevated in all 4 vitest configs in `elevate-coverage-thresholds`; `npm run ci` passes.
- Lint clean.

### Decisions

- The 4 packages are parser, primitives, serializer, and constructs; the "4 vitest configs" are `libs/parser/vitest.config.ts`, `libs/primitives/vitest.config.ts`, `libs/serializer/vitest.config.ts`, and `libs/constructs/vitest.config.ts` (`libs/bundler`, `libs/program`, `libs/validator` are out of scope).
- Coverage is built incrementally: minimal baseline first, then helpers, then deepening, alignment, repetition reduction, gap closure, and finally threshold elevation — thresholds are only elevated once the targets are met.
- Test helpers live in `src/test/helpers/{topic}/` colocated in the package of the thing they mock (e.g. `makeSomethingMock.ts`).
- All dependencies are mocked (in-file or via helpers) to isolate each module under test.
- `src/index.ts` is excluded from coverage in all 4 packages (already the case in the vitest configs).

### Follow Ups

- Update the milestone `consolidate` Items table status for this plan as it progresses.
- Reconcile milestone `consolidate` Items table (stale plan paths/statuses).
