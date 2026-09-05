# Milestone: Constructs

**ID:** `constructs`

**Status:** `DRAFT`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Implement the next set of artificial constructs — `ResourceBlock`, `ExampleBlock`, `ExampleInline`, `VocabularyDefinition`, `Identifier`, `ContextSymbol` — and register them in the constructs package.

**Description:** Extend the `@art-js/artificial-constructs` package with the block and inline constructs the language spec calls for, following the existing factory pattern (parser + to-mdast + types per construct) and registering them in the open `ConstructMap` registry.

## Summary

The constructs package currently ships `Document`, `FieldBlock`, `FieldInline`, `NaturalBlock`, `NaturalExpression`, `SectionBlock`, and `Tag`. This milestone adds the next tier of constructs — `ResourceBlock`, `ExampleBlock`, `ExampleInline`, `VocabularyDefinition`, `Identifier`, and `ContextSymbol` — each implemented as a parser factory, a to-mdast serializer, and private types, then registered in `BlockConstructMap` / `InlineConstructMap`. Scope and exact construct set to be confirmed against the language spec (`spec/`) during planning.

## Source Tasks

- Briefing: `_backlog/_architect.md` — approach (POC-first, schema-first in TS, mdast substrate) and construct factory pattern.
- Parking Lot: `_backlog/_parking-lot.md` — grammar constructs WIP (`spec/grammar/_wip.md`), `TagReference` WIP.
- Spec: `spec/` — grammar and expression specs defining the constructs.
- Registry: `libs/constructs/src/registry.ts` — open `ConstructMap` to extend.

## Phases

| Index | Name                        | Status  |
| ----- | --------------------------- | ------- |
| #1    | Confirm construct scope     | `DRAFT` |
| #2    | Implement block constructs  | `DRAFT` |
| #3    | Implement inline constructs | `DRAFT` |
| #4    | Register and verify         | `DRAFT` |

### Phase: 1 — Confirm construct scope

**Goal:** Confirm which constructs to implement and their shapes.

**Description:** Cross-check `ResourceBlock`, `ExampleBlock`, `ExampleInline`, `VocabularyDefinition`, `Identifier`, and `ContextSymbol` against the language spec and existing constructs; confirm whether `ResourceBlock` exists (it does not today) and finalise the construct set and their field/child shapes.

**Status:** `DRAFT`

**Dependencies:**

- Spec: `spec/grammar/`, `spec/expressions/`

### Phase: 2 — Implement block constructs

**Goal:** Implement the block-level constructs.

**Description:** Implement `ResourceBlock`, `ExampleBlock`, and `VocabularyDefinition` as parser factories, to-mdast serializers, and private types, following the existing `SectionBlock`/`FieldBlock` pattern.

**Status:** `DRAFT`

**Dependencies:**

- Phase 1 — Confirm construct scope

### Phase: 3 — Implement inline constructs

**Goal:** Implement the inline/expression-level constructs.

**Description:** Implement `ExampleInline`, `Identifier`, and `ContextSymbol` as inline constructs, following the `FieldInline`/`Tag` pattern.

**Status:** `DRAFT`

**Dependencies:**

- Phase 1 — Confirm construct scope

### Phase: 4 — Register and verify

**Goal:** Register the new constructs and verify the roundtrip.

**Description:** Register the new constructs in `BlockConstructMap` / `InlineConstructMap` and verify parser + serializer roundtrip against fixtures.

**Status:** `DRAFT`

**Dependencies:**

- Phase 2 — Implement block constructs
- Phase 3 — Implement inline constructs

## Items

The following items are not yet captured in a work item document.

### Plan: Implement Constructs

**Status:** `DRAFT`

**Purpose:** Implement the next tier of constructs in `@art-js/artificial-constructs`.

**Description:** Plan the implementation of `ResourceBlock`, `ExampleBlock`, `ExampleInline`, `VocabularyDefinition`, `Identifier`, and `ContextSymbol`, with per-construct instructions and fixtures.

**Changes:**

- `libs/constructs/src/constructs/` — new construct directories
- `libs/constructs/src/registry.ts` — extend `ConstructMap`

**Dependencies:**

- Spec: `spec/` — construct definitions

## Work

### Next

Confirm the construct scope against the language spec, then plan the implementation.

### Blockers

None.

## Operating Instructions

### Setting Up

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Verifying Completion

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

## Follow ups

- Confirm whether `ResourceBlock` should alias or extend `SectionBlock`.
- Confirm the full construct set against `spec/grammar/_wip.md`.

## Feedback

No sub-agent reports yet.
