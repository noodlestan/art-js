# Milestone: Records

**ID:** `records`

**Status:** `DRAFT`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Provide an API to assert the presence of records in an art file's content, extract records from a source file (with fields, examples, etc.), and write them back — exposing `SectionBlock` children of type `FieldBlock`/`FieldInline` as direct fields of the resource.

**Description:** Build a records library that wraps extracted records (representations of `SectionBlock` keeping as much of the art AST data as possible) in a consumer-facing API with accessors, positioning anchors for write-back, and an optional content-hash guard. Works on content strings, not the filesystem.

## Summary

Expose a constructor consumers use to wrap extracted records. The returned API encapsulates the extracted record (`raw()`) plus the metadata needed to write it back. Records are representations of `SectionBlock` that keep as much of the art AST data as possible, but expose the block children of type `FieldBlock` or `FieldInline` as direct fields of the resource. Consider a `ProxyObject` so the object also returns the record fields transparently, with setters routing data to the encapsulated `field.value` and tracking `field.modifiedValue` when modified. Everything carries positioning anchors enough to write back. The API works with content strings (not the filesystem) and returns a hash of the original file alongside the record so the write operation can check before attempting to write back into the file — this behaviour is opt-in (or opt-out), possibly split into separate safe vs unsafe functions.

## Source Tasks

- Briefing: `_backlog/_architect.md` — approach (POC-first, schema-first in TS, mdast substrate).
- Constructs: `libs/constructs/src/constructs/SectionBlock/`, `FieldBlock/`, `FieldInline/` — the AST shapes the records wrap.
- Parser: `libs/parser/` — how records are extracted from content.

## Phases

| Index | Name                      | Status  |
| ----- | ------------------------- | ------- |
| #1    | Define record model       | `DRAFT` |
| #2    | Extraction API            | `DRAFT` |
| #3    | Write-back and hash guard | `DRAFT` |
| #4    | Proxy field access        | `DRAFT` |

### Phase: 1 — Define record model

**Goal:** Define the record representation wrapping `SectionBlock`.

**Description:** Define how a record keeps as much of the art AST data as possible while exposing `FieldBlock`/`FieldInline` children as direct fields of the resource, plus the positioning anchors needed for write-back.

**Status:** `DRAFT`

**Dependencies:**

- Constructs: `libs/constructs/src/constructs/SectionBlock/`

### Phase: 2 — Extraction API

**Goal:** Provide the API to assert presence of and extract records from content.

**Description:** Provide functions to assert the presence of records in an art file's content and to extract records from a source file along with their fields, examples, etc. The returned records include both the record with its fields and the metadata needed to write back.

**Status:** `DRAFT`

**Dependencies:**

- Phase 1 — Define record model

### Phase: 3 — Write-back and hash guard

**Goal:** Provide write-back with an optional content-hash guard.

**Description:** Return a hash of the original file alongside the record so the write operation can check before attempting to write back into the file. The guard is opt-in (or opt-out); consider separate safe vs unsafe functions. Works with content strings, not the filesystem.

**Status:** `DRAFT`

**Dependencies:**

- Phase 1 — Define record model

### Phase: 4 — Proxy field access

**Goal:** Provide transparent field access via a `ProxyObject`.

**Description:** Consider a `ProxyObject` so the object also returns the record fields transparently, with setters routing data to the encapsulated `field.value` and tracking `field.modifiedValue` when modified.

**Status:** `DRAFT`

**Dependencies:**

- Phase 1 — Define record model

## Items

The following items are not yet captured in a work item document.

### Plan: Records API

**Status:** `DRAFT`

**Purpose:** Implement the records extraction and write-back API.

**Description:** Plan the records library: record model wrapping `SectionBlock`, extraction and presence-assertion API, write-back with positioning anchors and an optional content-hash guard, and optional `ProxyObject`-based transparent field access.

**Changes:**

- New records package or module (location TBD — likely `libs/records/`)

**Dependencies:**

- Constructs: `libs/constructs/` — `SectionBlock`, `FieldBlock`, `FieldInline`

## Work

### Next

Define the record model and confirm the package location, then plan the implementation.

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

- Decide safe vs unsafe write-back functions and the default for the hash guard.
- Decide whether `ProxyObject` field access is the default or opt-in.

## Feedback

No sub-agent reports yet.
