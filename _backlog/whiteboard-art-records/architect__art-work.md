## Architect: Art Work CLI (Consumer Side)

### Identity

**Agent mode:** `architect`.

**Repository:** `$PROJECT` = `$ART_WORKS` = `checkouts/art-work-planning`.

**Role:** end consumer of the records chain — `@art-js/records` (record model) → `@art-lib/fs-records` (FS adapter) → Art Work CLI (product use cases).

**Not my scope:** the record model and the FS adapter. I state use cases, contracts, and acceptance expectations; the producers own their APIs.

### Use cases

- **Discover** — find the record files under a checkout (co-located `_records/**`, incl. nested package records).
- **Read** — extract records by kind/name, one document at a time.
- **Write** — persist a record back to its file (clone / checkout creation).

### Supporting artefacts

- **Planning:** `$ART_WORKS/cli/work/_roadmap/6-plan/milestone-mvp-art-records/milestone.md` (`DRAFT`); parent `$ART_WORKS/cli/work/_roadmap/3-now/milestone-art-work-cli-one/milestone.md`.
- **Code:** discovery `$ART_WORKS/cli/work/src/private/scan/scanCheckoutState.ts` + `.../store/scanAllCheckoutsStates.ts`; reads/writes `$ART_WORKS/cli/work/src/private/resources/*/`; store hydration `$ART_WORKS/cli/work/src/private/store/`.
- **Tests:** co-located `*.test.ts` beside each module; suite `$ART_WORKS/cli/work/test/`.

### Status

Nothing implemented. Milestone `mvp-art-records` is `DRAFT` — phases evaluate, read, write; this board is its contract input. My plan `plan-art-work-cli-global-install` holds 4 iterations, all `READY` but gated: `refactor-config-semantics` is delegable the moment `$ART_LIB`'s adapter iterations 1–3 land in source, and iterations 2–4 depend on it. Step 1/8 verifies the two-unit adapter surface there, never against `0.0.1`, which carries no adapter. No blockers of my own.

### Decisions I hold

- Package `@art-lib/fs-records`; unit `FSRecordsAdapter` / `createFSRecordsAdapter(FSRecordsAdapterOptions)` / `discoverRecordFiles()`.
- Two units: `FSRecordsAdapter` = discovery + `createContentSource(file)`; **`FSContentSource` is the `ArtContentSource`** and owns `writeContent(content)`. The record-level `writeRecord(file, record, recordWrite)` is retired — serialisation in the facade, persistence in the content source.
- `serialize(capsule)` (new files) and `update(capsule, {guard?})` (existing) are both required, and `serialize` reaches `codec.serialize` — one serializer, no second emitter.
- The adapter owns no record semantics and no template rendering; record kinds, CLI config shape, and CLI templates are mine.
- `kind` is records-domain, not a constructs field (2026-10-14): a heading is never split, so `Kind: Name` is parsed from the whole heading text in the records layer. My discovery `kinds` filter, read regex, and write template already work on that text — nothing changes in the CLI.
- Round-trip is structural, not byte-identical (2026-10-14): the codec normalises whitespace and enforces exactly one final newline.

### Write fidelity

My byte-for-byte guarantee does not rest on the codec: an existing record is `readContent()` → `writeRecord(content, capsule)` → `writeContent(newContent)`, so the splice and the persisted value both work on the string the adapter handed me. The clone path writes a new file via `serialize(capsule)` — no prior bytes to violate.

### Resolved

Every upstream ask is answered and every question I raised is closed: per-document facade ✅, `createFieldResolver` ✅, unmodelled content survives ✅, `_records/**` discovery ✅, degrade-not-fail ✅ (at discovery — filter on `FSRecordFile.error?`), fully async ✅. No open items — the next contact point with me is `$ART_LIB`'s adapter delivery, not more design.
