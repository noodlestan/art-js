# Plan: Refactoring and Test Coverage

**Id:** `refactoring-and-test-coverage`

**Status:** `PREPARING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Refactor and test coverage across migrated `@art-js/artificial-*` packages, hardening the codebase before archive and publish.

**Description:** Execute targeted refactoring across parser, serializer, and constructs packages: merge near-identical preprocessor and factory handlers, rename `createNestedContext` to `createParserContext`, and scope parser constants into `libs/parser/src/mdast/`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

Harden the migrated parser, serializer, and constructs packages by cleaning up duplicated builder logic, renaming context creation, and properly scoping parser constants.

## Context

### Upstream Work

| Kind      | Path                                                | Role                                                       |
| --------- | --------------------------------------------------- | ---------------------------------------------------------- |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md` | Defines this plan as phase 2 of the Consolidate milestone. |

### Knowledge

- ::READ `libs/parser/src/builder.ts` (Knowledge) — Parser builder logic.
- ::READ `libs/parser/src/constants.ts` (Knowledge) — Parser constants.

## Scope

### Out of Scope

- New feature development.

### Packages

- Package: Artificial Parser — `libs/parser/`
- Package: Artificial Constructs — `libs/constructs/`
- Package: Artificial Serializer — `libs/serializer/`

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                                                | Status      |
| ----------------------------------------------------------------------------------------------------------------------- | ----------- |
| Iteration: Merge Preprocessors and Factories `./plan-refactoring-and-test-coverage/instructions/merge-preprocessors.md` | `PREPARING` |
| Iteration: Rename Create Nested Context `./plan-refactoring-and-test-coverage/instructions/rename-context.md`           | `PREPARING` |
| Iteration: Scope Parser Constants `./plan-refactoring-and-test-coverage/instructions/scope-constants.md`                | `PREPARING` |

### Iteration: Merge Preprocessors and Factories

**Id:** `merge-preprocessors-and-factories`

**Status:** `PREPARING`

**Purpose:** Evaluate and merge `tryPreProcessors` and `maybeHandleFactory` in parser builder.

**Description:** In `libs/parser/src/builder.ts`, `tryPreProcessors` and `maybeHandleFactory` perform very similar evaluation steps. Evaluate combining or streamlining them through hook parameters.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/merge-preprocessors.md`

**Changes:**

- Refactor `libs/parser/src/builder.ts` to streamline `tryPreProcessors` and `maybeHandleFactory`.

**Dependencies:**

None.

### Iteration: Rename Create Nested Context

**Id:** `rename-create-nested-context`

**Status:** `PREPARING`

**Purpose:** Rename `createNestedContext()` to `createParserContext` and remove global dependencies.

**Description:** Rename `createNestedContext()` across parser, constructs, and primitives packages to `createParserContext` and eliminate dependency on global state.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/rename-context.md`

**Changes:**

- Rename `createNestedContext` to `createParserContext` across `@art-js/artificial-*` packages.

**Dependencies:**

None.

### Iteration: Scope Parser Constants

**Id:** `scope-parser-constants`

**Status:** `PREPARING`

**Purpose:** Move unscoped parser constants and extract block type check helper.

**Description:** Move `libs/parser/src/constants.ts` to `libs/parser/src/mdast/constants.ts` and extract the `isBlockType` function into `libs/parser/src/mdast/isBlockType.ts`.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/scope-constants.md`

**Changes:**

- Move `libs/parser/src/constants.ts` to `libs/parser/src/mdast/constants.ts`.
- Extract `isBlockType` to `libs/parser/src/mdast/isBlockType.ts`.

**Dependencies:**

None.

## Work

### Next

Delegate instruction `merge-preprocessors`.

### Blockers

None.

## Coordination

### Not In Scope

- New features.

### Evidence

- Refactored parser source code passing all tests and lint checks.

### Decisions

- Keep constant scoping aligned with mdast subdirectory structure.

### Follow Ups

None.
