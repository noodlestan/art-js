# Parking Lot: Art JS Roadmap

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## ACTIONABLE

- **Drive the Art Records Whiteboard (owned by `ART_JS`)** — board at `$PROJECT/_backlog/whiteboard-art-records/whiteboard.md`; this project is the highest priority.

## PENDING

- **`@art-md` release** — waiting on the constructs release carrying `delete-kind-from-code`; then bump the pin in instruction 1 and delegate `implement-record-model`.
- **Board maintenance, my next turn** — flip both `@art-md` contracts when `ART_LIB` signs; add `position` to their frozen-member list (the list under-enumerates it).

## BLOCKERS

- **`plan-create-lib-records`** — delegating `implement-record-model` waits on the `@art-md` release above (owner `ART_MD`). Writing and reviewing instructions is not gated.

## Message Board

- `REPORT` from `ART_JS` — _your request: capsule factory injection is a v0.0.1 requirement, not a v1 exploration_. Reflected: `knowledge/design/records.md` ▸ "Capsule factory injection" is now a version-0.0.1 section (factory or unhydrated capsule injected at construction; internal APIs work against the capsule interface; the variant is invisible outside), with a code example.
- `REPORT` from `ART_JS` — _your request: the Facade vs Low-level split reads as a duplicate; one API only — `create...` and what it returns_. Applied: the design doc now documents a single surface — `createRecords`, `createArtRecord`, `createProxyObject`, `createFieldResolver` and what each returns. `assertRecordPresence` / `extractRecords` / `writeRecord` are internal implementation of the facade and are no longer presented as API.
- `REPORT` from `ART_JS` — _your request: the synthetic-section capability is missing an example; convert the section_. Applied: "Creating records" now shows both routes with code — extraction from a document, and `createArtRecord({name, depth, tags, children, ...})` with unknown properties passing through.
- `REPORT` from `ART_JS` — _your request: rewrite the whole design document — good English, docs spirit, flow, code illustrations; paragraphs, short bullets, one idea at a time followed by a sample_. Applied: full rewrite. Every concept section now leads with prose and demonstrates with a runnable-shaped sample (creating, reading, writing fields, writing back, injection, reactive); the contract sections are short paragraphs instead of symbol-heavy bullet dumps.
- `REPORT` from `ART_JS` — _your request: show how `record.depth = 3`, `record.name = "foo"`, and `record.fieldName = value` are different_. Applied: the "Writing fields" section opens with exactly that example and states the three rules: `name` is read-only (the capsule seals it), `depth` is an ordinary block mutation re-rendered on write, fields go through the view only — raw-block field assignment is unsupported and read by nothing.
- `RESPONSE` from `ART_JS` — _your question: does `FieldResolver` guard section properties — an allow list? Or do those reads/writes never reach it, handled earlier — where, at the capsule?_ Section properties never reach the resolver, so no allow-list exists: the view routes `name` to identity (read-only) and section properties (`depth`, `tags`) to the block **before** delegating unknown keys to the resolver; only field names arrive there, which is why the resolver needs no guard. Written into the design doc's "Writing fields" section.
- `REPORT` from `ART_JS` — _your request: overview and design still duplicate — the same sentence in both; SUMMARIZE the overview_. Applied: the overview was rewritten as a summary — the duplicated record-model sentences are gone from it (the design doc owns the canonical wording), responsibilities are one-line statements without contract detail, and only the Use Cases table keeps structure. Dedup verified by comparison pass below.

## Follow-ups

- ~~**Align plan and instruction exports with the one-API surface**~~ — Done 2026-10-16: `plan-create-lib-records/plan.md` and all 4 instruction files now reflect the single `create...` public surface; `assertRecordPresence`/`extractRecords`/`writeRecord` are internal. Awaiting approval with the rest of the uncommitted docs.
