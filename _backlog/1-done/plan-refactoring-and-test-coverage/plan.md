# Plan: Refactoring and Test Coverage

**Id:** `refactoring-and-test-coverage`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Refactor and test coverage across migrated `@art-js/artificial-*` packages, hardening the codebase before archive and publish.

**Description:** Execute targeted refactoring across parser, serializer, and constructs packages: merge near-identical preprocessor and factory handlers, refactor `VisitContext` into `ParserVisitContext` with clarified semantics and eliminated global state, rename `.value` to `.children` in field constructs, and scope parser constants into `libs/parser/src/mdast/`.

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

| Iteration / Instructions                                                                                                | Status |
| ----------------------------------------------------------------------------------------------------------------------- | ------ |
| Iteration: Merge Preprocessors and Factories `./plan-refactoring-and-test-coverage/instructions/merge-preprocessors.md` | `DONE` |
| Iteration: Refactor Visit Context `./plan-refactoring-and-test-coverage/instructions/refactor-visit-context.md`         | `DONE` |
| Iteration: Scope Parser Constants `./plan-refactoring-and-test-coverage/instructions/scope-constants.md`                | `DONE` |

### Iteration: Merge Preprocessors and Factories

**Id:** `merge-preprocessors-and-factories`

**Status:** `DONE`

**Purpose:** Evaluate and merge `tryPreProcessors` and `maybeHandleFactory` in parser builder.

**Description:** In `libs/parser/src/builder.ts`, `tryPreProcessors` and `maybeHandleFactory` perform very similar evaluation steps. Evaluate combining or streamlining them through hook parameters.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/merge-preprocessors-and-factories.md`

**Changes:**

- Refactor `libs/parser/src/builder.ts` to streamline `tryPreProcessors` and `maybeHandleFactory`.

**Dependencies:**

None.

#### Commits:

| ID                                  | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ----------------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `merge-preprocessors-and-factories` | $PROJECT / `main`              | `MANUAL` | `b2159cf` | `COMMITTED` |

##### Commit: `merge-preprocessors-and-factories`

**Repository:** Art JS

**Message:**

```
refactor(art-js): Merge preprocessor and factory dispatch in parser builder

- Unify `tryPreProcessors` and `maybeHandleFactory` into `tryConstructs`
- Remove redundant `getFactory` helper if orphaned
- Preserve evaluation order: pre-processors before factories
```

### Iteration: Refactor Visit Context

**Id:** `refactor-visit-context`

**Status:** `DONE`

**Purpose:** Rename context type, factory, and methods to clarify semantics. Eliminate global state dependencies.

**Description:** Rename `VisitContext` to `ParserVisitContext` and `createNestedContext()` to `createParserVisitContext` across parser, constructs, and primitives packages. Rename `source` to `markdown`, replace `capturing()` with `readonly construct: ConstructBase`, eliminate `getSectionMap` global state, and update `findTagable` to traverse context parents. Change the factory signature to accept `construct: ConstructBase` instead of `structure: string`, requiring `builder.ts` and `createDocumentContext` to pass construct instances. Rename `.value` to `.children` in `FieldBlock` and `FieldInline` constructs.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/refactor-visit-context.md`

**Changes:**

- Rename `VisitContext` → `ParserVisitContext` in `libs/primitives/src/parser/types.ts` and all consumers.
- Rename `createNestedContext` → `createParserVisitContext` and the factory file.
- Rename `source` → `markdown` in the context type and all consumers.
- Replace `capturing(): string | undefined` with `readonly construct: ConstructBase`.
- Eliminate `getSectionMap` global state; update `findTagable` to traverse `parent()` chain evaluating `current.construct.construct === 'SectionBlock'`.
- Change factory signature to accept `construct: ConstructBase` instead of `structure: string`; remove `section` parameter.
- Refactor `builder.ts` to instantiate `ArtDocument` at the top and pass it to `createDocumentContext`.
- Rename `.value` → `.children` in `FieldBlock` and `FieldInline` types, handlers, creators, serializers, and tests.
- Deduplicate helpers: position copy, rawSlice, and consolidate construct factories.

**Dependencies:**

None.

#### Commits:

| ID                                   | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------------------------ | ------------------------------ | ------------ | --------- | ----------- |
| `refactor-visit-context-rename`      | $PROJECT / `main`              | `AUTONOMOUS` | `e9939af` | `COMMITTED` |
| `refactor-constructs-align-children` | $PROJECT / `main`              | `MANUAL`     | `bb5f477` | `COMMITTED` |
| `simplify-parser-visit-context-api`  | $PROJECT / `main`              | `AUTONOMOUS` | `f4b8e3f` | `COMMITTED` |
| `remove-gap-flushing`                | $PROJECT / `main`              | `AUTONOMOUS` | `0d52bf9` | `COMMITTED` |
| `init-document-with-position`        | $PROJECT / `main`              | `AUTONOMOUS` | `8f23183` | `COMMITTED` |
| `deduplicate-helpers`                | $PROJECT / `main`              | `AUTONOMOUS` | `487cb9d` | `COMMITTED` |

##### Commit: `refactor-visit-context-rename`

**Repository:** Art JS

**Message:**

```
refactor(art-js): Rename VisitContext to ParserVisitContext and eliminate global sectionMap

- Rename VisitContext → ParserVisitContext in primitives types
- Rename createNestedContext → createParserVisitContext in factory and file
- Rename source → markdown in context type and consumers
- Replace capturing() with readonly construct: ConstructBase
- Eliminate getSectionMap export and global WeakMap
- Update findTagable to traverse parent() chain instead of sectionMap
- Update all imports across parser, constructs, and tests
```

##### Commit: `refactor-constructs-align-children`

**Repository:** Art JS

**Message:**

```
refactor(constructs): Rename .value to .children to align field constructs with others

- Rename FieldBlock.value → children in type, handler, creator, and serializer
- Rename FieldInline.value → children in type, pre-processor, and serializer
- Update artAstToMdast to use .children for FieldBlock traversal
- Update tests and regenerate fixtures
```

##### Commit: `simplify-parser-visit-context-api`

**Repository:** Art JS

**Message:**

```
refactor(parser): Simplify ParserVisitContext API and introduce ContainerConstructBase

- Add ContainerConstructBase with mandatory children array.
- Remove targetArray, target(), lastEnd, and mutable markdown from context API.
- Rename push to captureChildConstruct and beforeRecord to onBeforeConstruct.
- Add ContainerConstructBase with mandatory children; update all container constructs to extend it.
- Update builder, handlers, and createDocumentContext to use simplified API.
- Regenerate snapshots for mandatory children field.
```

**Changes:**

- Introduce `ContainerConstructBase` interface extending `ConstructBase` with mandatory `children: ConstructBase[]`.
- Update `createParserVisitContext` factory signature to accept `ContainerConstructBase` instead of `ConstructBase`, removing the `targetArray` parameter entirely.
- Replace `ctx.push(record)` with `ctx.captureChildConstruct(child)`.
- Replace `ctx.beforeRecord(record)` with `ctx.onBeforeConstruct(construct)`.
- Remove `ctx.target()` method; the target array is now always `construct.children`.
- Remove `ctx.lastEnd` from the context interface; position tracking moved to local variables in `builder.ts`.
- Make `ctx.markdown` readonly.
- Rename `BeforeRecord` type to `OnBeforeRecord`.
- Update `NaturalBlock` and `NaturalExpression` types to extend `ContainerConstructBase` with mandatory `children`.
- Update `ArtDocument`, `SectionBlock`, `FieldBlock`, and `FieldInline` to use `ContainerConstructBase`.
- Update `createNaturalBlock` and `createNaturalExpression` to always populate `children`.
- Update `builder.ts`, `createDocumentContext`, and all handlers to use the simplified API.
- Regenerate all parser test snapshots to include mandatory `children` field on container constructs.

##### Commit: `remove-gap-flushing`

**Repository:** Art JS

**Message:**

```
refactor(parser): Remove gap flushing and position tracking from builder.

- Delete flushGap module and remove all flushGap calls.
- Remove lastEnd tracking and updateLastEnd helper.
- Remove explicit any cast on mdast tree visit.
- Regenerate snapshots for mandatory children field.
```

**Changes:**

- Delete `libs/parser/src/private/flushGap.ts` module.
- Remove all `flushGap` calls from `builder.ts` in both `handleNaturalBlock` and `dispatch`.
- Remove `lastEnd` point tracking and `updateLastEnd` helper from `builder.ts`.
- Remove `Point` import from `builder.ts`.
- Remove explicit `any` cast on `visit(tree as any, ...)`; use `visit(tree, ...)` directly.

##### Commit: `init-document-with-position`

**Repository:** Art JS

**Message:**

```
refactor(parser): Add createDocument with position from root (updated fixture snapshots); Rename all "record" to "construct".

- Add createDocument with position from root.
- Rename all instances of "record" (private vars and params only) to "construct".
- Regenerate snapshots with document children field.
```

##### Commit: `deduplicate-helpers`

**Repository:** Art JS

**Message:**

```
refactor(parser): Deduplicate helpers and consolidate construct factories.

- Deduplicate position copy: unify cleanPosition and nodePosition into nodePosition helper in primitives.
- Move createDocument factory from builder.ts to constructs lib.
- Deduplicate rawSlice: consolidate parser version into constructs helper and delete parser copy.
- Rename record to construct in all handler signatures and local variables.
```

### Iteration: Scope Parser Constants

**Id:** `scope-parser-constants`

**Status:** `DONE`

**Purpose:** Move unscoped parser constants and extract block type check helper.

**Description:** Move `libs/parser/src/constants.ts` to `libs/parser/src/mdast/constants.ts` and extract the `isBlockType` function into `libs/parser/src/mdast/isBlockType.ts`.

**Instructions:** `./plan-refactoring-and-test-coverage/instructions/scope-constants.md`

**Changes:**

- Move `libs/parser/src/constants.ts` to `libs/parser/src/mdast/constants.ts`.
- Extract `isBlockType` to `libs/parser/src/mdast/isBlockType.ts`.

**Dependencies:**

None.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash       | Status      |
| ------------------------ | ------------------------------ | ------------ | ---------- | ----------- |
| `scope-parser-constants` | $PROJECT / `main`              | `AUTONOMOUS` | `9c28e1ac` | `COMMITTED` |

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

- Execute `deduplicate-helpers` (AUTONOMOUS).

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
