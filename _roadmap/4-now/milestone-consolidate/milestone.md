# Milestone: Consolidate

**ID:** `consolidate`

**Status:** `PLANNING`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Refactor, cleanup, and document the constructs, parser, and serializer packages, then publish v0.0.2 of these.

**Description:** Consolidates the remaining (not-DONE) phases of the MD Art Roundtrip milestone — gap closure, refactoring and test coverage, archive and publish, and knowledge integration — into a single coherent milestone focused on hardening and documenting the `@art-js/artificial-*` packages and releasing v0.0.2.

## Summary

Carry forward the unfinished work split out of the MD Art Roundtrip milestone: close the roundtrip gaps surfaced by the pipeline suite, refactor and harden the parser/serializer/constructs code, archive the POC, integrate learnings back into briefings and guides, and publish v0.0.2 of the constructs, parser, and serializer packages. Each commit keeps the roundtrip contract intact.

## Source Tasks

- Milestone (archived): `_roadmap/3-now/milestone-md-art-roundtrip/milestone.md` — phases 8–11 split out into this milestone.
- Briefing: `_backlog/_architect.md` — approach (POC-first, schema-first in TS, mdast substrate) and milestone sequence.
- Parking Lot: `_backlog/_parking-lot.md` — pending items relevant to roundtrip gaps and constructs.

## Phases

| Index | Name                          | Status      |
| ----- | ----------------------------- | ----------- |
| #1    | Implement gaps                | `PREPARING` |
| #2    | Refactoring and Test Coverage | `PREPARING` |
| #3    | Archive and publish           | `PREPARING` |
| #4    | Integrate knowledge           | `PREPARING` |

### Phase: 1 — Implement gaps

**Goal:** Close the roundtrip gaps surfaced by the pipeline suite, one fixture at a time.

**Description:** Move from the one-liner markdown fixture toward text, lists, sections, and formatting in small fixture files, refining the parser/serializer as gaps surface. Pure-whitespace gap `NaturalBlock`s stay preserved (milestone decision).

**Status:** `PREPARING`

**Dependencies:**

- Plan: `_backlog/6-plan/plan-implement-gaps/plan.md`

### Phase: 2 — Refactoring and Test Coverage

**Goal:** Harden the migrated packages before archive and publish.

**Description:** Refactoring and test coverage across the migrated `@art-js/artificial-*` packages (parser, serializer, constructs, primitives), including the `tryPreProcessors`/`maybeHandleFactory` merge, `createNestedContext` rename/refactor, and unscoped constants cleanup.

**Status:** `PREPARING`

**Dependencies:**

- Plan: `_backlog/6-plan/plan-refactoring-and-test-coverage/plan.md`

### Phase: 3 — Archive and publish

**Goal:** Archive poc-parse and publish v0.0.2 of constructs, parser, and serializer.

**Description:** Archive the `@art-js/poc-parse` package and publish v0.0.2 of the constructs, parser, and serializer packages (superseding the earlier v0.0.1 publish scope).

**Status:** `PREPARING`

**Dependencies:**

- Plan: `_backlog/6-plan/plan-archive-poc-and-publish/plan.md`

### Phase: 4 — Integrate knowledge

**Goal:** Integrate milestone learnings back into briefings, guides, architecture docs, and records.

**Description:** After publish, integrate the knowledge and learnings from milestone execution back into briefings, guides, architecture docs, and records, closing the consolidation.

**Status:** `PREPARING`

**Dependencies:**

- Plan: `_backlog/6-plan/plan-integrate-knowledge/plan.md`

## Items

| Phase | Resource / Record                                                                                | Status      |
| ----- | ------------------------------------------------------------------------------------------------ | ----------- |
| 1     | Plan: Implement Gaps `_backlog/6-plan/plan-implement-gaps/plan.md`                               | `PREPARING` |
| -     |                                                                                                  |             |
| 2     | Plan: Refactoring and Test Coverage `_backlog/6-plan/plan-refactoring-and-test-coverage/plan.md` | `PREPARING` |
| -     |                                                                                                  |             |
| 3     | Plan: Archive and Publish `_backlog/6-plan/plan-archive-poc-and-publish/plan.md`                 | `PREPARING` |
| -     |                                                                                                  |             |
| 4     | Plan: Integrate Knowledge `_backlog/6-plan/plan-integrate-knowledge/plan.md`                     | `PREPARING` |

## Work

### Next

Plan Phase 1 — execute `plan-implement-gaps`: close the roundtrip gaps surfaced by the pipeline suite.

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

- Reactive core (chokidar → signals → memo recompute)
- Template engine research (Nunjucks/Handlebars/Liquid vs `.tart` requirements)
- Precompiled rewrite (install-time compilation + per-project overrides)
- Standalone build of the compile command — `bin/compile`, `architecture/records/adr/compile.art`-backed

## Feedback

No sub-agent reports yet.
