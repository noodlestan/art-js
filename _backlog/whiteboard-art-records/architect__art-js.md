## Architect: Art JS (Producer)

### Identity, role, scope

**Agent ID:** `ART_JS`.

**Repository:** `$PROJECT` = `$ART_JS` = `checkouts/art-js` (the Art JS checkout; the old `art-js-planning` checkout no longer exists).

**Use cases:**

- Assert the presence of a record (`kind` + `name`) in an Art MD document
- Extract every record of selected kinds from one document into capsules (fields, examples, positioning anchors)
- Read record fields transparently (capsule access or `ProxyObject`), with lazy hydration
- Mutate a record and write it back into content at its anchors, with an opt-in content-hash guard
- Serialise a mutated capsule back to content deterministically (pure string → string; consumer persists)

**Planning:**

- `$ART_JS/_roadmap/3-now/milestone-art-records/milestone.md` (phases 1–4 `DONE`, phase 5 `WORKING`)
- `$ART_JS/_backlog/1-done/plan-create-lib-records/plan.md` (`DELIVERED`)
- `$ART_JS/_backlog/1-done/` — `plan-design-lib-records` (`DONE`), `plan-canonical-record-field-names` (`DELIVERED`, published `0.1.0`), `plan-adopt-codec-construct-api` (`DELIVERED`)

**Code:** `$ART_JS/libs/records/`

- Implemented: `src/record/`, `src/records-document/` (private modules regrouped 2026-11-02), fixtures under `libs/records/tests/fixtures/`, integration suite `$ART_JS/tests/records`
- `package.json` declares `@art-md/primitives@0.0.7`, `@art-md/constructs@0.0.7`, `@art-md/codec@0.0.5` (dev)
- 400+ tests green; root `npm run ci` 8/8 tasks

**My scope:** I own `@art-js/records` — record identity (`ArtRecord`), extraction/presence assertion, anchored write-back with optional hash guard, transparent proxy field access, and the `Records` facade. It is a pure core library over content strings; it never touches the filesystem.

**Not my scope:** FS discovery and persistence (that is `$ART_LIB`'s adapter) and CLI orchestration (that is `$ART_WORKS`). I consume `$ART_MD` contracts (`@art-md/primitives`) and never re-implement the codec.

### Goals and existing decisions

**Goal** (milestone `art-records`): implement the approved design in `$ART_JS/_backlog/1-done/plan-design-lib-records/plan__design.md` — the full spec with file-by-file signatures.

**Existing decisions (in force, inherited from the DONE design plan):**

- Layering: `FSContentSource → ArtContentSource → ArtDocumentSource → ArtRecordCapsule` — records sit on `ArtDocumentSource`, not on files.
- Content-hash guard is **opt-in** (`WriteBackOptions.guard`, default off); safe-vs-unsafe function split still open (milestone follow-up).
- `ProxyObject` delegates unknown properties to a `FieldResolver`; `kind`/`name` come from record identity. Default-vs-opt-in still open (milestone follow-up).
- Contracts come from `@art-md/primitives@0.0.3` (published); no `@art-md/source` package, no codec implementation here.
- Lazy hydration, pull-based: capsule carries `_id` eagerly, hydrates the record on pull.
- Implementation sequence fixed by module dependency chain: `record` → `capsule` → `extract` + `write-back` → `proxy` + `records` facade → exports → docs.

**Execution context:** resolved — all plan iterations ran and committed on `main`; the `building` branch reference was retired with the plan revision.

### Deliverables and status

| Deliverable                 | Status                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Milestone `art-records`     | `WORKING` — phases 1–4 `DONE`, phase 5 `WORKING`                                                                                               |
| Plan `design-lib-records`   | `DONE` — artefacts: knowledge doc, `libs/records/` scaffold, canonical README titles (commits `49fe2d5`, `562c555`, `58bd610`)                 |
| Plan `create-lib-records`   | `DELIVERED` — all iterations `DONE`; `consolidate` landed (`be7b09d`), `@art-js/records@0.2.0` shipped (`66b9549`), plan at `_backlog/1-done/` |
| `knowledge/records.md`      | Written — the model, flow, principles (records-are-source-of-truth, deterministic round-trips, no I/O)                                         |
| Published `@art-js/records` | `0.1.0` published and confirmed (`npm info` → `0.1.0`, 2026-11-03); consumed by `$ART_WORKS` from `b955f3c`                                    |
| Blockers recorded           | None — `$ART_JS/_backlog/_parking-lot.md` is empty                                                                                             |

### Relevant files

- **Design/spec:** `$ART_JS/_backlog/1-done/plan-design-lib-records/plan__design.md` — full package spec (layout + every type and factory signature)
- **Implementation plan:** `$ART_JS/_backlog/3-now/plan-create-lib-records/plan.md` — v0.0.1 iterations committed; tail replanned in session
- **Knowledge:** `$ART_JS/knowledge/records.md` · `$ART_JS/knowledge/components.md` (Records `Status: SCAFFOLD`) · `$ART_JS/knowledge/index.md` · ADRs `$ART_JS/knowledge/adr/compiler.md`, `$ART_JS/knowledge/adr/configuration.md`
- **Briefing:** `$ART_JS/_roadmap/_architect.md` (mostly empty; "Why / Use Cases / Vision / NFRs" listed as missing)
- **Parking lot:** `$ART_JS/_backlog/_parking-lot.md`
- **Code:** `$ART_JS/libs/records/` — `src/` (record + records-document modules), `tests/fixtures/`, `_guide.md`, `README.md`, `package.json`, `vitest.config.ts`

### What I expect from upstream producers

- **`$ART_MD` (`@art-md/primitives`):** stable `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()` at `0.0.3` — I write against the contracts only. `SectionBlock` must expose `kind`/`name` (the bridge assumes they coincide) and `Field`/`FieldBlock`/`FieldInline` shapes for extraction, `field.value` and `field.modifiedValue` for the proxy setters.
- **`$ART_MD` codec:** round-trip fidelity — serialising an untouched `ArtDocument` must reproduce byte-identical content, otherwise my deterministic-write-back promise is unachievable.

### What downstream consumers will need from me

- **`$ART_LIB` adapter:** `ArtRecord` replaces its WIP `BaseRecordStructure`; `RecordPosition` replaces its duplicate `FSRecordPosition`; it implements `ArtContentSource` and calls `extractRecords`/`writeRecord`. ~~Re-read behaviour asked~~ Answered on the whiteboard: stateless per call, re-read after `writeContent()` — line anchors stand.
- **`$ART_WORKS` CLI:** `Records<T>` facade per document (`assertPresence`, `extract`, `update`, `serialize`) for workspace-record discovery/reading/updating; record kinds `checkout`, `repository`, `namespace`, `package`, `project`, `npm-deployment`, `static-app-deployment`.
- **Publishing:** `@art-js/records@0.1.0` and `@art-js/records@0.2.0` are published and importable; `plan-create-lib-records` is `DELIVERED` at `_backlog/1-done/`.

### Assumptions, uncertainties, decisions needing input

1. **`serialize` vs `update`** — ~~resolved on the whiteboard (2026-10-13):~~ `update` = guarded write over existing content (safe), `serialize` = unguarded, for newly created record files. Accepted by `$ART_WORKS`.
2. **Line-based `RecordPosition`** (`startLine`/`endLine?`) — ~~resolved on the whiteboard (2026-10-13):~~ adapter is stateless per call and re-reads after `writeContent()`, so line anchors computed against the given content survive; the opt-in hash guard covers out-of-band drift. `AGREED`.
3. **Granularity of `Records<T>`** — ~~resolved on the whiteboard (2026-10-13):~~ per-document facade confirmed by `$ART_WORKS`; they loop over files; no multi-document collection needed.
4. **Capsule typing** — `ArtRecordCapsule<T>` carries `[fieldName: string]: unknown`, so arbitrary field access is untyped. _Proposal:_ keep as-is for v1 (fields surface via proxy). _Confirm_ consumers don't need `Record<string, Field>` field maps at the type level.
5. **`FieldResolver` has no factory** — ~~resolved on the whiteboard (2026-10-13):~~ `createFieldResolver` ships from `@art-js/records` — field mapping is records-domain, neither consumer hand-rolls a resolver. **New deliverable, absorbed into iteration 3.**
6. **Mixed abstraction levels** — `assertRecordPresence(document: ArtDocument, ...)` and `extractRecords(document, ...)` take a document, while `createRecords(source: ArtDocumentSource)` takes a source and `writeRecord(content: string, ...)` takes content. _Question:_ should the facade hide `ArtDocument`, or is holding all three acceptable?
7. **Name reconciliation** — ~~resolved on the whiteboard (2026-10-13):~~ `FSRecordsAdapter` / `createFSRecordsAdapter(FSRecordsAdapterOptions)` is canonical; `FSRecordsStore` retired. `AGREED` in Contracts; instructions may cite it.
8. **Availability bar** — ~~resolved on the whiteboard (2026-10-13):~~ a green `plan-create-lib-records` inside the workspace is enough to lift `$ART_LIB`'s hold; npm publish is a follow-up. Consumers import `ArtContentSource`/`ArtDocumentSource` straight from `@art-md/primitives@0.0.3` — `@art-js/records` re-exports only its own symbols.
