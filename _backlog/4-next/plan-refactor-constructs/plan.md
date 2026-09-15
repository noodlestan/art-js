# Plan: Refactor Constructs

**Id:** `refactor-constructs`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Simplify and normalize the constructs API.

**Description:** Give constructs a single parser entry point (processor + integrator) and a separate "factory from data" entry point (`ConstructFactory`), and rename serializer types for consistency.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

The constructs API currently mixes three entry points: `ConstructPreProcessor` (`preProcess`), `ConstructCreator` (`factory.detect + create`), and `ConstructHandler` (`handle`), plus a serializer type keyed by a `construct` discriminator. Normalize this into a single parser entry point — `ConstructProcessor.captureNode` for detection/creation and `ConstructIntegrator.integrate` for context integration — and a separate "factory from data" entry point — `ConstructFactory.fromData` — exposed via `ConstructParser.factory`. Rename `ConstructToMdast` to `ConstructSerializer` with a `readonly name` discriminator, add `readonly name` to `ConstructParser`, and give Tag and Document their own `ConstructParser`s. Each iteration keeps the roundtrip contract intact.

## Context

### Upstream Work

| Kind      | Path                                                | Role                                                       |
| --------- | --------------------------------------------------- | ---------------------------------------------------------- |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md` | Defines this plan as phase 1 of the Consolidate milestone. |

### Knowledge

- ::READ `libs/constructs/src/constructs/types.ts` (Knowledge) — Construct API types to reshape.
- ::READ `libs/parser/src/builder.ts` (Knowledge) — Parser builder dispatch (processor / integrator loop).
- ::READ `libs/serializer/src/artAstToMdast.ts` (Knowledge) — Serializer registry keyed by serializer name.
- ::READ `libs/constructs/src/constructs/` (Knowledge) — All construct implementations (Tag, Document, NaturalBlock, NaturalExpression, SectionBlock, FieldBlock, FieldInline).

## Scope

### Out of Scope

- New feature development.
- Parser behavior changes (roundtrip contract preserved).
- POC (`cli/poc-parse/`) — self-contained package scheduled for archiving in `plan-archive-poc-and-publish`; its local `ConstructPreProcessor` / `ConstructHandler` types are untouched.

### Packages

- Package: Artificial Constructs — `libs/constructs/`
- Package: Artificial Parser — `libs/parser/`
- Package: Artificial Serializer — `libs/serializer/`

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                                          | Status  |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| Iteration: Rename Serializer Types `./plan-refactor-constructs/instructions/rename-serializer-types.md`           | `READY` |
| Iteration: Rename Processor Types `./plan-refactor-constructs/instructions/rename-processor-types.md`             | `READY` |
| Iteration: Rename Integrator Types `./plan-refactor-constructs/instructions/rename-integrator-types.md`           | `READY` |
| Iteration: Eliminate ConstructCreator `./plan-refactor-constructs/instructions/eliminate-construct-creator.md`    | `READY` |
| Iteration: Introduce ConstructFactory `./plan-refactor-constructs/instructions/introduce-construct-factory.md`    | `READY` |
| Iteration: Add Tag and Document Parsers `./plan-refactor-constructs/instructions/add-tag-and-document-parsers.md` | `READY` |

### Iteration: Rename Serializer Types

**Id:** `rename-serializer-types`

**Status:** `READY`

**Purpose:** Rename the serializer types and their discriminator so serializers are identified by `name` like every other construct API surface.

**Description:** Rename `ConstructToMdast` to `ConstructSerializer` and `ConstructToMdastFactory` to `ConstructSerializerFactory`, and rename the `construct` discriminator to `readonly name` across all serializer factories, the serializer config, and the serializer registry.

**Instructions:** `./plan-refactor-constructs/instructions/rename-serializer-types.md`

**Changes:**

- `libs/constructs/src/constructs/types.ts`: rename `ConstructToMdast` → `ConstructSerializer` and `ConstructToMdastFactory` → `ConstructSerializerFactory`; change `construct: string` → `readonly name: string`.
- All 6 serializer factories (`createDocumentToMdast`, `createNaturalBlockToMdast`, `createNaturalExpressionToMdast`, `createFieldBlockToMdast`, `createFieldInlineToMdast`, `createSectionBlockToMdast`): `construct: 'X'` → `name: 'X'`; return type `ConstructSerializer`.
- `libs/serializer/src/config/types.ts`: `ConstructToMdastFactory` → `ConstructSerializerFactory`.
- `libs/serializer/src/artAstToMdast.ts`: registry key `impl.construct` → `impl.name`; type import `ConstructSerializer`.
- `libs/constructs/src/index.ts`: export renames.

**Dependencies:**

None.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy     | Hash  | Status     |
| ------------------------- | ------------------------------ | ---------- | ----- | ---------- |
| `rename-serializer-types` | $PROJECT / `main`              | `NOCOMMIT` | (TBD) | `AUTHORED` |

##### Commit: `rename-serializer-types`

**Repository:** Art JS

**Message:**

```
refactor(constructs): Rename ConstructToMdast to ConstructSerializer

- Rename ConstructToMdast to ConstructSerializer and ConstructToMdastFactory to ConstructSerializerFactory
- Rename the construct discriminator to readonly name in all serializer factories
- Update serializer config types and artAstToMdast registry key
- Update constructs index exports
```

### Iteration: Rename Processor Types

**Id:** `rename-processor-types`

**Status:** `READY`

**Purpose:** Rename the detection/creation entry point so the parser entry point is uniformly `processor.captureNode(context, node)`.

**Description:** Rename `ConstructPreProcessor` to `ConstructProcessor` and its `preProcess` method to `captureNode`, changing the parameter order to `(context, node)`. Rename the FieldBlock and FieldInline pre-processor files and update the parser builder dispatch.

**Instructions:** `./plan-refactor-constructs/instructions/rename-processor-types.md`

**Changes:**

- `libs/constructs/src/constructs/types.ts`: rename `ConstructPreProcessor` → `ConstructProcessor`; `preProcess(node, context)` → `captureNode(context, node)`; `ConstructParser.preProcessor` → `processor`.
- `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockPreProcessor.ts` → rename file to `createFieldBlockProcessor.ts`; `preProcess(node, context)` → `captureNode(context, node)`.
- `libs/constructs/src/constructs/FieldInline/createFieldInlinePreProcessor.ts` → rename file to `createFieldInlineProcessor.ts`; same method rename.
- `libs/constructs/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts` → rename file to `createFieldInlineProcessor.test.ts`; update `impl.preProcess(paragraph, context)` calls to `impl.captureNode(context, paragraph)`.
- `createFieldBlockParser.ts`, `createFieldInlineParser.ts`: `preProcessor:` → `processor:`.
- `libs/parser/src/builder.ts`: `preProcessor?.preProcess(node, currentContext)` → `processor?.captureNode(currentContext, node)`.
- `libs/constructs/src/index.ts`: export renames.

**Dependencies:**

None.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy     | Hash  | Status     |
| ------------------------ | ------------------------------ | ---------- | ----- | ---------- |
| `rename-processor-types` | $PROJECT / `main`              | `NOCOMMIT` | (TBD) | `AUTHORED` |

##### Commit: `rename-processor-types`

**Repository:** Art JS

**Message:**

```
refactor(constructs): Rename ConstructPreProcessor to ConstructProcessor

- Rename ConstructPreProcessor to ConstructProcessor and preProcess to captureNode
- Change captureNode parameter order to (context, node)
- Rename createFieldBlockPreProcessor and createFieldInlinePreProcessor files
- Update parser builder dispatch and parser factories
```

### Iteration: Rename Integrator Types

**Id:** `rename-integrator-types`

**Status:** `READY`

**Purpose:** Rename the context-integration entry point so the parser entry point is uniformly `integrator.integrate(context, node, construct)`.

**Description:** Rename `ConstructHandler` to `ConstructIntegrator` and its `handle` method to `integrate`, changing the parameter order to `(context, node, construct)`. Rename the SectionBlock and FieldBlock handler files and update the parser builder dispatch.

**Instructions:** `./plan-refactor-constructs/instructions/rename-integrator-types.md`

**Changes:**

- `libs/constructs/src/constructs/types.ts`: rename `ConstructHandler` → `ConstructIntegrator`; `handle(construct, node, context)` → `integrate(context, node, construct)`; `ConstructParser.handler` → `integrator`.
- `libs/constructs/src/constructs/SectionBlock/private/createSectionBlockHandler.ts` → rename file to `createSectionBlockIntegrator.ts`; `handle(construct, node, context)` → `integrate(context, node, construct)`.
- `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockHandler.ts` → rename file to `createFieldBlockIntegrator.ts`; same method rename.
- `createSectionBlockParser.ts`, `createFieldBlockParser.ts`: `handler:` → `integrator:`.
- `libs/parser/src/builder.ts`: `HandleResult.handler` → `integrator`; `handler.handle(construct, node, currentContext)` → `integrator.integrate(currentContext, node, construct)`; import `ConstructIntegrator`.
- `libs/constructs/src/index.ts`: export renames.

**Dependencies:**

None.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy     | Hash  | Status     |
| ------------------------- | ------------------------------ | ---------- | ----- | ---------- |
| `rename-integrator-types` | $PROJECT / `main`              | `NOCOMMIT` | (TBD) | `AUTHORED` |

##### Commit: `rename-integrator-types`

**Repository:** Art JS

**Message:**

```
refactor(constructs): Rename ConstructHandler to ConstructIntegrator

- Rename ConstructHandler to ConstructIntegrator and handle to integrate
- Change integrate parameter order to (context, node, construct)
- Rename createSectionBlockHandler and createFieldBlockHandler files
- Update parser builder dispatch and parser factories
```

### Iteration: Eliminate ConstructCreator

**Id:** `eliminate-construct-creator`

**Status:** `READY`

**Purpose:** Eliminate the `factory.detect + create` entry point by converting NaturalBlock and SectionBlock to the processor (`captureNode`) pattern, leaving a single parser entry point.

**Description:** Convert NaturalBlock and SectionBlock from `ConstructCreator` to `ConstructProcessor`, extract `createSectionBlock` from the SectionBlock creator, remove the factory branch from the parser builder, and delete the `ConstructCreator` interface and creator files.

**Instructions:** `./plan-refactor-constructs/instructions/eliminate-construct-creator.md`

**Changes:**

- `libs/constructs/src/constructs/types.ts`: delete the `ConstructCreator` interface.
- NaturalBlock: replace `private/createNaturalBlockCreator.ts` with `private/createNaturalBlockProcessor.ts` — `captureNode(context, node)` returns `createNaturalBlock(node, context)` (detect was always true). Update `createNaturalBlockParser.ts` to `processor: createNaturalBlockProcessor()`.
- SectionBlock: replace `private/createSectionBlockCreator.ts` with `private/createSectionBlockProcessor.ts` — extract `createSectionBlock(node, context)` (the current `create` body) and `captureNode(context, node)` returns `node.type === 'heading' ? createSectionBlock(node as Heading, context) : null`. Update `createSectionBlockParser.ts` to `processor: createSectionBlockProcessor()`.
- `libs/parser/src/builder.ts`: remove the `factory.detect/create` branch from `tryConstructs`; keep the index-0 guard so the default construct is not consulted in the loop (`if (i === 0) continue;`); `handleNaturalBlock` uses `defaultConstruct.processor.captureNode(currentContext, node)`.
- Delete `createNaturalBlockCreator.ts` and `createSectionBlockCreator.ts`.
- `libs/constructs/src/index.ts`: export renames.

**Dependencies:**

- Iteration: Rename Processor Types.
- Iteration: Rename Integrator Types.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy     | Hash  | Status     |
| ----------------------------- | ------------------------------ | ---------- | ----- | ---------- |
| `eliminate-construct-creator` | $PROJECT / `main`              | `NOCOMMIT` | (TBD) | `AUTHORED` |

##### Commit: `eliminate-construct-creator`

**Repository:** Art JS

**Message:**

```
refactor(constructs): Eliminate ConstructCreator in favor of processors

- Convert NaturalBlock and SectionBlock from factory detect/create to processor captureNode
- Extract createSectionBlock from the SectionBlock creator
- Remove the factory branch from the parser builder
- Delete ConstructCreator interface and creator files
```

### Iteration: Introduce ConstructFactory

**Id:** `introduce-construct-factory`

**Status:** `READY`

**Purpose:** Introduce the "factory from data" entry point — `ConstructFactory.fromData` — exposed via `ConstructParser.factory`, and add `readonly name` to `ConstructParser`.

**Description:** Add the `ConstructFactory` interface, change `ConstructParser.factory` to it, add `create{Name}FromData` factories to all constructs following the Tag example (`createTag` + `TagFactoryData`), expose them via the facades, and add `readonly name` to `ConstructParser` with names set in all facades.

**Instructions:** `./plan-refactor-constructs/instructions/introduce-construct-factory.md`

**Changes:**

- `libs/constructs/src/constructs/types.ts`: add `ConstructFactory` with `fromData(data: unknown): Construct`; change `ConstructParser.factory` type to `ConstructFactory`; add `readonly name: string` to `ConstructParser`.
- Add `fromData` factories per construct following the Tag example — `create{Name}FromData(data: {Name}FactoryData)` with `export interface {Name}FactoryData` declared just above each factory. `{Name}FactoryData` members mirror the construct's own fields (minus `construct`/`position`), may be based on the construct type, and may be optional with defaults when convenient:
  - Tag: `createTag(tagData: TagFactoryData)` — the canonical example, reused as-is.
  - Document: `createDocumentFromData(data: DocumentFactoryData)`.
  - NaturalBlock: `createNaturalBlockFromData(data: NaturalBlockFactoryData)`.
  - NaturalExpression: `createNaturalExpressionFromData(data: NaturalExpressionFactoryData)`.
  - SectionBlock: `createSectionBlockFromData(data: SectionBlockFactoryData)`.
  - FieldBlock: `createFieldBlockFromData(data: FieldBlockFactoryData)`.
  - FieldInline: `createFieldInlineFromData(data: FieldInlineFactoryData)`.
- For complex constructs, the worker may first extract a node-based factory (`create{Name}FromNode`, e.g. the existing `createFieldBlockFromParagraph`) from the current object-literal creation, but that node-based factory is internal and NOT exposed; the exposed entry point is `create{Name}FromData`.
- The goal is to replace all `const something: ConstructType = {...}` object literals with small factory functions exposed in `ConstructParser.factory`.
- Update facades: each `create*Parser` sets `name: '<Construct>'` and `factory: { fromData: data => create{Name}FromData(data as {Name}FactoryData) }` (Tag: `createTag`).
- `libs/constructs/src/index.ts`: export the new factories.

**Dependencies:**

- Iteration: Eliminate ConstructCreator.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy     | Hash  | Status     |
| ----------------------------- | ------------------------------ | ---------- | ----- | ---------- |
| `introduce-construct-factory` | $PROJECT / `main`              | `NOCOMMIT` | (TBD) | `AUTHORED` |

##### Commit: `introduce-construct-factory`

**Repository:** Art JS

**Message:**

```
feat(constructs): Introduce ConstructFactory fromData entry point

- Add ConstructFactory interface with fromData(data)
- Add fromData factories for Document, NaturalBlock, NaturalExpression, SectionBlock, FieldBlock, FieldInline
- Expose factories via ConstructParser.factory in all facades
- Add readonly name to ConstructParser and set names in facades
```

### Iteration: Add Tag and Document Parsers

**Id:** `add-tag-and-document-parsers`

**Status:** `READY`

**Purpose:** Give Tag and Document their own `ConstructParser`s so every construct exposes the factory entry point uniformly.

**Description:** Add `createTagParser` and `createDocumentParser` exposing the `fromData` factories, and update the constructs index exports. These parsers are NOT registered in the parser default config — Tag is extracted by taggables and Document is the parse root.

**Instructions:** `./plan-refactor-constructs/instructions/add-tag-and-document-parsers.md`

**Changes:**

- `libs/constructs/src/constructs/Tag/createTagParser.ts` — `{ name: 'Tag', factory: { fromData: data => createTag(data as TagFactoryData) } }`.
- `libs/constructs/src/constructs/Document/createDocumentParser.ts` — `{ name: 'Document', factory: { fromData: data => createDocumentFromData(data as DocumentFactoryData) } }`.
- `libs/constructs/src/index.ts`: export `createTagParser` and `createDocumentParser`.

**Dependencies:**

- Iteration: Introduce ConstructFactory.

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy     | Hash  | Status     |
| ------------------------------ | ------------------------------ | ---------- | ----- | ---------- |
| `add-tag-and-document-parsers` | $PROJECT / `main`              | `NOCOMMIT` | (TBD) | `AUTHORED` |

##### Commit: `add-tag-and-document-parsers`

**Repository:** Art JS

**Message:**

```
feat(constructs): Add parsers for Tag and Document

- Add createTagParser exposing createTag as ConstructFactory
- Add createDocumentParser exposing createDocumentFromData as ConstructFactory
- Update constructs index exports
```

## Work

### Next

Delegate the next `READY` instruction.

### Blockers

None.

## Coordination

### Not In Scope

- New features.
- Parser behavior changes.
- POC (`cli/poc-parse/`) — scheduled for archiving.

### Evidence

- All parser/serializer pipeline tests pass after each iteration; lint clean.

### Decisions

- `ConstructParser.factory` becomes `ConstructFactory` (`fromData`) — parser detection is exclusively via `processor.captureNode`; `factory` is the programmatic "from data" entry point.
- `ConstructHandler` is renamed to `ConstructIntegrator`; the `ConstructParser` member is `integrator` (the expected-shape `handler?: ConstructHandler` is a leftover from the scope).
- `ConstructParser.name` and `ConstructSerializer.name` are `readonly` for consistency.
- `fromData` factories follow the Tag example: `create{Name}FromData(data: {Name}FactoryData)` with `{Name}FactoryData` declared just above; members mirror the construct's fields, may be based on the construct type, and may be optional with defaults when convenient. Node-based creation (`create{Name}FromNode`, e.g. `createFieldBlockFromParagraph`) stays internal and is not exposed. The goal is to replace `const something: ConstructType = {...}` literals with factory functions exposed in `ConstructParser.factory`.
- NaturalBlock remains the default construct handled outside the `tryConstructs` loop; its processor is consulted only in `handleNaturalBlock` so inline nodes are never captured by it.
- Tag and Document parsers are not registered in the parser default config.

### Follow Ups

- Draft the Test Coverage plan `_backlog/4-next/plan-test-coverage/plan.md`.
- Reconcile milestone `consolidate` Items table (stale plan paths/statuses).
