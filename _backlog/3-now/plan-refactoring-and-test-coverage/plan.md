# Plan: Refactoring and Test Coverage

**Id:** `refactoring-and-test-coverage`

**Status:** `READY`

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

| Iteration / Instructions                                                                                                | Status  |
| ----------------------------------------------------------------------------------------------------------------------- | ------- |
| Iteration: Merge Preprocessors and Factories `./plan-refactoring-and-test-coverage/instructions/merge-preprocessors.md` | `READY` |
| Iteration: Rename Create Nested Context `./plan-refactoring-and-test-coverage/instructions/rename-context.md`           | `READY` |
| Iteration: Scope Parser Constants `./plan-refactoring-and-test-coverage/instructions/scope-constants.md`                | `READY` |

### Iteration: Merge Preprocessors and Factories

**Id:** `merge-preprocessors-and-factories`

**Status:** `READY`

**Purpose:** Evaluate and merge `tryPreProcessors` and `maybeHandleFactory` in parser builder.

**Description:** In `libs/parser/src/builder.ts`, `tryPreProcessors` and `maybeHandleFactory` perform very similar evaluation steps. Evaluate combining or streamlining them through hook parameters.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/merge-preprocessors-and-factories.md`

**Changes:**

- Refactor `libs/parser/src/builder.ts` to streamline `tryPreProcessors` and `maybeHandleFactory`.

**Dependencies:**

None.

#### Commits:

| ID                                  | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ----------------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `merge-preprocessors-and-factories` | $PROJECT / `main`              | `MANUAL` | (TBD) | `AUTHORED` |

##### Commit: `merge-preprocessors-and-factories`

**Repository:** Art JS

**Message:**

```
refactor(art-js): Merge preprocessor and factory dispatch in parser builder

- Unify `tryPreProcessors` and `maybeHandleFactory` into `tryConstructs`
- Remove redundant `getFactory` helper if orphaned
- Preserve evaluation order: pre-processors before factories
```

### Iteration: Rename Create Nested Context

**Id:** `rename-create-nested-context`

**Status:** `READY`

**Purpose:** Rename `createNestedContext()` to `createParserContext` and remove global dependencies.

**Description:** Rename `createNestedContext()` across parser, constructs, and primitives packages to `createParserContext` and eliminate dependency on global state.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/rename-create-nested-context.md`

**Changes:**

- Rename `createNestedContext` to `createParserContext` across `@art-js/artificial-*` packages.

**Dependencies:**

None.

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ------------------------------ | ------------------------------ | ------------ | ----- | ---------- |
| `rename-create-nested-context` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `rename-create-nested-context`

**Repository:** Art JS

**Message:**

```
refactor(art-js): Rename createNestedContext to createParserContext

- Rename function in primitives parser helpers
- Update exports in primitives index files
- Update all imports in parser, constructs, and tests
```

### Iteration: Scope Parser Constants

**Id:** `scope-parser-constants`

**Status:** `READY`

**Purpose:** Move unscoped parser constants and extract block type check helper.

**Description:** Move `libs/parser/src/constants.ts` to `libs/parser/src/mdast/constants.ts` and extract the `isBlockType` function into `libs/parser/src/mdast/isBlockType.ts`.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/scope-constants.md`

**Changes:**

- Move `libs/parser/src/constants.ts` to `libs/parser/src/mdast/constants.ts`.
- Extract `isBlockType` to `libs/parser/src/mdast/isBlockType.ts`.

**Dependencies:**

None.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ------------------------ | ------------------------------ | ------------ | ----- | ---------- |
| `scope-parser-constants` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `scope-parser-constants`

**Repository:** Art JS

**Message:**

```
refactor(art-js): Scope parser constants into mdast subdirectory

- Move BLOCK_TYPES to `src/mdast/constants.ts`
- Extract `isBlockType` into `src/mdast/isBlockType.ts`
- Update builder import
- Remove `src/constants.ts`
```

## Work

### Next

Delegate instruction `merge-preprocessors-and-factories` (MANUAL — stop at commit).

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
