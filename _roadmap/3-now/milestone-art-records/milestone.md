# Milestone: Art records

**ID:** `art-records`

**Status:** `BLOCKED`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Provide an API to assert the presence of records in an art file's content, extract records from a source file (with fields, examples, etc.), and write them back — exposing `SectionBlock` children of type `FieldBlock`/`FieldInline` as direct fields of the resource.

**Description:** Build a records library that wraps extracted records (representations of `SectionBlock` keeping as much of the art AST data as possible) in a consumer-facing API with accessors, positioning anchors for write-back, and an optional content-hash guard. Works on content strings, not the filesystem.

## Path Variables

| Variable   | Resolved Path               | Purpose                                                                    |
| ---------- | --------------------------- | -------------------------------------------------------------------------- |
| `$PROJECT` | Provided with prompt        | Where work execution is taking place.                                      |
| `$ART_MD`  | `checkouts/art-md-planning` | Repository: Art MD checkout — codec and source design, constructs, parser. |

## Summary

Expose a constructor consumers use to wrap extracted records. The returned API encapsulates the extracted record (`raw()`) plus the metadata needed to write it back. Records are representations of `SectionBlock` that keep as much of the art AST data as possible, but expose the block children of type `FieldBlock` or `FieldInline` as direct fields of the resource. Consider a `ProxyObject` so the object also returns the record fields transparently, with setters routing data to the encapsulated `field.value` and tracking `field.modifiedValue` when modified. Everything carries positioning anchors enough to write back. The API works with content strings (not the filesystem) and returns a hash of the original file alongside the record so the write operation can check before attempting to write back into the file — this behaviour is opt-in (or opt-out), possibly split into separate safe vs unsafe functions.

## Source Tasks

- Briefing: `$ART_MD/_backlog/_architect.md` — approach (POC-first, schema-first in TS, mdast substrate).
- Constructs: `$ART_MD/libs/constructs/` — `SectionBlock`, `FieldBlock`, `FieldInline` — the AST shapes the records wrap.
- Parser: `$ART_MD/libs/parser/` — how records are extracted from content.

## Phases

| Index | Name                | Status     |
| ----- | ------------------- | ---------- |
| #1    | Define record model | `DONE`     |
| #2    | Extraction API      | `PLANNING` |
| #3    | Update Records      | `PLANNING` |
| #4    | Proxy field access  | `PLANNING` |

### Phase: 1 — Define record model

**Goal:** Define the record representation wrapping `SectionBlock`.

**Description:** Define how a record keeps as much of the art AST data as possible while exposing `FieldBlock`/`FieldInline` children as direct fields of the resource, plus the positioning anchors needed for write-back.

**Status:** `DONE`

**Dependencies:**

- Codec and source contracts: `Milestone: Art Codec` at `$ART_MD/_roadmap/1-done/milestone-art-codec/milestone.md` — `@art-md/primitives` (contracts), `@art-md/codec` (implementation)

### Phase: 2 — Extraction API

**Goal:** Provide the API to assert presence of and extract records from content.

**Description:** Provide functions to assert the presence of records in an art file's content and to extract records from a source file along with their fields, examples, etc. The returned records include both the record with its fields and the metadata needed to write back.

**Status:** `PLANNING`

**Dependencies:**

- None

### Phase: 3 — Update Records

**Goal:** Provide write-back with an optional content-hash guard.

**Description:** Return a hash of the original content alongside the record so the write operation can check before attempting to write back into the content. The guard is opt-in (or opt-out); consider separate safe vs unsafe functions. Works with content strings, not the filesystem.

**Status:** `PLANNING`

**Dependencies:**

- None

### Phase: 4 — Proxy field access

**Goal:** Provide transparent field access via a `ProxyObject`.

**Description:** Consider a `ProxyObject` so the object also returns the record fields transparently, with setters routing data to the encapsulated `field.value` and tracking `field.modifiedValue` when modified. Decided on the whiteboard (2026-10-13): `createProxyObject` is an explicit always-available factory — opt-in by construction; `createFieldResolver` ships from this package; `modifiedValue` is records-domain tracking state (does not exist upstream in `@art-md/constructs`).

**Status:** `PLANNING`

**Dependencies:**

- None

## Items

| Phase | Resource / Record                                                          | Status    |
| ----- | -------------------------------------------------------------------------- | --------- |
| 1     | Plan: Design Lib Records `_backlog/1-done/plan-design-lib-records/plan.md` | `DONE`    |
| -     |                                                                            |           |
| 2     | Plan: Create Lib Records `_backlog/4-next/plan-create-lib-records/plan.md` | `BLOCKED` |
| -     |                                                                            |           |

## Work

### Next

- **Instruction hold released (fix plan reviewed 2026-10-14)** — `ART_MD`'s `plan-drop-kind-and-reword-claims` accepted (kind deletion; `Ergonomic Factories API` superseded). **Next: Write Instructions** for Plan: Create Lib Records (5 iterations), mark `READY`; **delegate `implement-record-model` once the constructs release carrying `delete-kind-from-code` is published** (pin bump). Bridge re-baselined: `createArtRecord` parses `Kind: Name` from heading text — `ArtRecord{kind, name}` and consumer APIs unchanged. Plan `BLOCKED` = delegation gate only; both `ART_MD` re-proposed contracts agreed by us, pending `ART_LIB` + `ART_WORK`. `$ART_LIB` decoupled; only `$ART_WORK` adoption depends on this plan going green workspace-linked (npm publish NOT required).

### Blockers

- **Delegation gated on the constructs release carrying `delete-kind-from-code`** (owner `ART_MD`, fix plan `plan-drop-kind-and-reword-claims` reviewed + accepted 2026-10-14; `delete-kind-from-code` lands + `cli/codec-tests` 43/43 + pin bump). Kind deletion dissolves the original cause (serialize cannot drop a non-existent field); Option A stands. Instruction writing NOT gated — specs re-baselined (bridge parses `Kind: Name` from heading text; identity contract unchanged). Agreements outstanding: `ART_LIB` + `ART_WORK` on `ART_MD`'s two re-proposed contracts (we agreed both).

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

- ~~Decide safe vs unsafe write-back functions and the default for the hash guard.~~ Closed on the whiteboard (2026-10-13): `update` = guarded (safe), `serialize` = unguarded (new files).
- ~~Decide whether `ProxyObject` field access is the default or opt-in.~~ Closed on the whiteboard (2026-10-13): `createProxyObject` is an explicit always-available factory — opt-in by construction, no default switching; consumer (`$ART_WORK`) never asked for opt-in.

## Feedback

- **Records whiteboard (2026-10-13, `$WORKSPACE/whiteboard-art-records/whiteboard.md`)** — `@art-js/records` and `@art-lib/fs-records` contracts `AGREED`: line-based anchors stand (adapter stateless, re-reads after `writeContent()`); `writeRecord` is a pure line-splice preserving non-modelled content; canonical names `FSRecordsAdapter`/`createFSRecordsAdapter`; consumers import contracts from `@art-md/primitives` directly. New deliverable: `createFieldResolver` factory (iteration 3). Decoupling verdict (2026-10-13): `$ART_LIB`'s adapter imports only `@art-md/primitives` — its hold is released independently of this milestone; `$ART_WORK` adoption still depends on this plan going green in the workspace (publish not required).
