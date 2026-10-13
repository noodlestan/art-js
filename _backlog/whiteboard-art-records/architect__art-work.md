## Architect: Art Work CLI (Consumer Side)

### Identity

**Agent mode:** `architect`.

**Repository:** `$PROJECT` = `$ART_WORK` = `checkouts/art-work-planning`.

**Role:** end consumer of the records chain — `@art-js/records` (record model) → `@art-lib/fs-records` (FS adapter) → Art Work CLI (product use cases).

**Not my scope:** the record model and the FS adapter. I state use cases, contracts, and acceptance expectations; the producers own their APIs.

### Use cases

- **Discover** — find the record files under a checkout (co-located `_records/**`, incl. nested package records).
- **Read** — extract records by kind/name, one document at a time.
- **Write** — persist a record back to its file (clone / checkout creation).

### Supporting artefacts

- **Planning:** `$ART_WORK/cli/work/_roadmap/6-plan/milestone-mvp-art-records/milestone.md` (`DRAFT`); parent `$ART_WORK/cli/work/_roadmap/3-now/milestone-art-work-cli-one/milestone.md`.
- **Code:** discovery `$ART_WORK/cli/work/src/private/scan/scanCheckoutState.ts` + `$ART_WORK/cli/work/src/private/store/scanAllCheckoutsStates.ts`; reads/writes `$ART_WORK/cli/work/src/private/resources/*/`; store hydration `$ART_WORK/cli/work/src/private/store/`.
- **Tests:** co-located `*.test.ts` beside each module; suite `$ART_WORK/cli/work/test/`.

### Status

Nothing implemented. Phase 1 "evaluate" is the current step; this whiteboard is its input. No blockers recorded.

### What I expect from upstream

- **`@art-js/records`** — (a) a per-document facade is enough; (b) a `FieldResolver` factory, not a bare interface; (c) write-back fidelity: content the library did not model (tables, comments, ordering) must survive.
- **`@art-lib/fs-records`** — (a) discovery covers the co-located `_records/**` layout incl. nested package records; (b) a missing or unreadable file degrades, never fails a command; (c) sync vs async I/O stated explicitly.

### Open

1. **Write-back fidelity** — asked of `$ART_JS` (Pending on the whiteboard).
2. **Sync vs async I/O** — asked of `$ART_LIB` (Pending on the whiteboard).

### Resolved by the whiteboard (2026-10-13)

- Package `@art-lib/fs-records`; unit `FSRecordsAdapter` / `createFSRecordsAdapter(FSRecordsAdapterOptions)` / `discoverRecordFiles()` (was `FSRecordsStore`).
- Persistence is `writeContent(content)`; record-level `writeRecord(file, record, recordWrite)` is retired — serialisation in the facade, persistence in the adapter.
- `serialize` (new files) and `update` (existing files) are both needed; accepted as consumer.
- Layering: the adapter owns no record semantics and no template rendering; CLI templates stay with me.
- Record kinds, CLI config shape, and template rendering are CLI-internal — out of the chain.
