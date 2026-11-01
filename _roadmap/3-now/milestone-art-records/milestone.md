# Milestone: Art records

**ID:** `art-records`

**Status:** `WORKING`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Provide an API to assert the presence of records in a document, extract them as source-bound proxy handles (with fields and full section access), mutate them, and save their document through the record's own source.

**Description:** Build a records library over Art MD documents: extracted records keep as much of the art AST as possible and expose `FieldBlock`/`FieldInline` children as direct properties, with structural access through `record.section`. Records are proxies backed by an injectable capsule; `record.save()` serializes the containing document with the consumer-injected codec and persists it through the bound `ArtContentSource`. v0.0.1 fidelity is structural (whole-document serialization); granular writes and write guards are deferred (MANAGEMENT, 2026-10-19).

## Path Variables

| Variable   | Resolved Path               | Purpose                                                                    |
| ---------- | --------------------------- | -------------------------------------------------------------------------- |
| `$PROJECT` | Provided with prompt        | Where work execution is taking place.                                      |
| `$ART_MD`  | `checkouts/art-md-planning` | Repository: Art MD checkout — codec and source design, constructs, parser. |

## Summary

Consumers create a codec and a records provider, read a file into a per-document collection, extract proxy records, mutate fields and section properties, and save through the record or the collection. Records implement no I/O and no serialization of their own; file discovery and filesystem access live in `@art-lib/fs-records`, codec creation lives in the consumer.

## Source Tasks

- Briefing: `$ART_MD/_backlog/_architect.md` — approach (POC-first, schema-first in TS, mdast substrate).
- Constructs: `$ART_MD/libs/constructs/` — `SectionBlock`, `FieldBlock`, `FieldInline` — the AST shapes the records wrap.
- Parser: `$ART_MD/libs/parser/` — how records are extracted from content.

## Phases

| Index | Name                   | Status    |
| ----- | ---------------------- | --------- |
| #1    | Define record model    | `DONE`    |
| #2    | Extraction API         | `DONE`    |
| #3    | Persist through source | `DONE`    |
| #4    | Proxy field access     | `DONE`    |
| #5    | Align, publish, adopt  | `WORKING` |

### Phase: 1 — Define record model

**Goal:** Define the record representation wrapping `SectionBlock`.

**Description:** A record keeps as much of the art AST as possible while exposing `FieldBlock`/`FieldInline` children as direct properties. One unified `ArtRecord`; `name` is the whole heading text and carries no kind (CEO decision, 2026-10-14); the source is fixed at creation.

**Status:** `DONE`

**Dependencies:**

- Codec and source contracts: `Milestone: Art Codec` at `$ART_MD/_roadmap/1-done/milestone-art-codec/milestone.md` — `@art-md/primitives` (contracts), `@art-md/codec` (implementation)

### Phase: 2 — Extraction API

**Goal:** Provide the API to assert presence of and extract records from a document.

**Description:** `createArtDocumentRecords({ codec, createContentSource })` returns a provider; `read(file)` returns a per-document collection with `assertPresence(name)` and `extract()`. Extraction returns one proxy handle per `SectionBlock`, at any depth, including field-less sections; consumers interpret headings.

**Status:** `DONE`

**Dependencies:**

- None

### Phase: 3 — Persist through source

**Goal:** Save mutations through the record's bound source.

**Description:** `record.save()` and `DocumentRecords.save()` serialize the containing document with the injected codec and persist it through the bound `ArtContentSource` (`writeDocument()`). v0.0.1 fidelity is structural, not byte-identical; granular writes and write guards are deferred (MANAGEMENT, 2026-10-19).

**Status:** `DONE`

**Dependencies:**

- None

### Phase: 4 — Proxy field access

**Goal:** Provide transparent field access via the record proxy.

**Description:** Field properties resolve by exact field name against the section's field children; assignment appends missing fields, `renameField()` preserves position, `delete` removes. Section properties stay reachable through `record.section`. The capsule is the single mutation seam; both factories accept an injectable `capsuleFactory` from v0.0.1, reserving the reactive variant path (v1).

**Status:** `DONE`

**Dependencies:**

- None

### Phase: 5 — Align, publish, adopt

**Goal:** Align use cases with fixtures, publish, and prove Art Work adoption.

**Description:** Execute the remaining plan iterations: use-case/fixture alignment, npm publication, Art Work consumption, consolidation and coverage, knowledge refresh.

**Status:** `WORKING`

**Dependencies:**

- Plan: `_backlog/3-now/plan-create-lib-records/plan.md`

## Items

| Phase | Resource / Record                                                                             | Status     |
| ----- | --------------------------------------------------------------------------------------------- | ---------- |
| 1     | Plan: Design Lib Records `_backlog/1-done/plan-design-lib-records/plan.md`                    | `DONE`     |
| 2–5   | Plan: Create Lib Records `_backlog/3-now/plan-create-lib-records/plan.md`                     | `WORKING`  |
| 5     | Plan: Canonical Record Field Names `_backlog/3-now/plan-canonical-record-field-names/plan.md` | `WORKING`  |
| 5     | Plan: Adopt Codec Construct API `_backlog/3-now/plan-adopt-codec-construct-api/plan.md`       | `PLANNING` |

## Work

### Next

- **Iteration `align-use-cases-api-and-fixtures`** of `_backlog/3-now/plan-create-lib-records/plan.md`: align use cases, public API, design recipes, and integration fixtures. Then publish and adopt in Art Work.

### Blockers

- None. The earlier delegation gate is void: v0.0.1 is implemented and CI-green; remaining work is tracked in the plan iterations.

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

When making changes to the records package or its fixtures:

```bash
npm run test --workspace @art-js/records # unit tests
npm run test # from tests/records — fixture suite
```

## Feedback

- **v0.0.1 fidelity decision (MANAGEMENT, 2026-10-19)** — first cut saves whole documents via codec serialization: structural fidelity, no granular writes, no write guards. Sufficient for Art Work's first consumption; the chain is informed on the records whiteboard.
