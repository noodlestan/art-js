## Architect: Art Lib (Producer / Consumer)

### Identity, role, scope

**Agent ID:** `ART_LIB`

**Repository:** `$PROJECT` = `$ART_LIB` = `checkouts/art-lib-planning` (planning records) · `$ART_LIB_BUILD` = `checkouts/art-lib-building` (implementation, publishes `@art-lib/*`) · upstream `$ART_JS` = `checkouts/art-js-planning`, `$ART_MD` = `checkouts/art-md-planning` · downstream `$ART_WORK` = `checkouts/art-work-planning`

**Use cases:**

- Discover `.art` record files across a search path, honouring gitignore, ignore/exclude lists, and configured patterns
- Read one record file's content, tolerating missing/unreadable files
- Persist content handed to me verbatim via `writeContent(content)` — serialisation belongs to the `@art-js/records` facade, parsing never reaches me
- (Planned, same milestone) provide shared CLI infra: logger, operations, config, framework wrappers

**Planning:**

- `$ART_LIB/_roadmap/3-now/milestone-art-lib-one/milestone.md` — `WORKING`, Phase 1 "Establish Lib baseline" `WORKING`
- `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` — `READY`, 3 iterations `READY`, delegatable (hold lifted 2026-10-13)
- `$ART_LIB/_backlog/6-plan/plan-add-logger/plan.md`, `plan-add-operations/plan.md`, `plan-add-config/plan.md` — all `PLANNING`
- `$ART_LIB/_backlog/1-done/plan-create-art-lib-project-repo/plan.md`, `plan-extract-read-write-records-art-lib/plan.md` — `DONE`

**Code:** `$ART_LIB_BUILD/libs/fs-records/src/`

- Public surface — `index.ts` (exports `findRecordFiles`, `readRecordFileContent`, `FSRecordFile`, `FSRecordsConfig`, `FSRecordsPath`), `findRecordFiles.ts`, `readRecordFileContent.ts`, `types.ts`
- Internals — `private/createRecordFile.ts`, `private/findRecordFilesInPath.ts`, `private/getGitIgnoredSet.ts`, `private/globPath.ts`, `private/filterByKinds.ts`, `private/normalizePatterns.ts`, `private/normalizeExcludes.ts`, `private/directoryExists.ts`
- Tests — `findRecordFiles.test.ts` (co-located) + helpers `test/helpers/tempDirs/{makeTempDir,removeTempDirs}.ts`

**My scope:** I own **Art Lib**: composable units for building CLI experiences. In the records chain I am the **producer of the filesystem backend** and a **consumer of the record model**:

```
@art-md/primitives (source contracts, 0.0.3 published)
        ↓
@art-js/records (ArtRecord, capsule, Records facade)   — $ART_JS, NOT YET DELIVERED
        ↓
@art-lib/fs-records (FS discovery + content acquisition) — ME, published 0.0.1
        ↓
@art-work/cli (product use cases)                        — $ART_WORK
```

**Not my scope:** the codec (`@art-md/codec`), the record model and facade (`@art-js/records`), product use-case orchestration and record-kind semantics (`$ART_WORK`), and any scheduling of Art JS work — there I only state release conditions.

### Goals and existing decisions

**Canonical naming (producer authority, 2026-10-13):**

- **Package:** `@art-lib/fs-records` — forever. The spellings `@art-lib/fs-records-adapter` and "Plan: Add FS Records Store" are retired; no artefact may use them again.
- **Unit:** `FSRecordsAdapter`, created by `createFSRecordsAdapter(options)`, options type `FSRecordsAdapterOptions`. The `FSRecordsStore` / `createFSRecordsStore()` spelling in `$ART_WORK` captures is stale and must be corrected there.
- **Method:** the adapter exposes `discoverRecordFiles()` (not `listFiles()`), matching the underlying function and the consumer capture.
- **Persistence:** exposed as `writeContent(content)` per `ArtContentSource`; the record-level `writeRecord(file, record, recordWrite)` in the plan and in `$ART_WORK`'s capture is retired — serialisation is the facade's job, persistence is mine.

**Existing decisions** (do not relitigate):

- Milestone (`milestone-art-lib-one` Decisions): `@art-lib/operations` is one package with two pure subpath modules (`/model`, `/log`); the buffering logger is split into `@art-lib/logger`; `cli-command-runner`, `cli-test-helpers`, `cli-present` are rejected (revisit triggers recorded).
- Plan (`add-fs-records-adapter` Decisions): `discoverRecordFiles()` is async; `FSRecordFile.searchPath` is renamed `basePath`; commits use `build`, not `feat`.
- Plan Blockers (2026-10-11): the adapter was HELD pending `@art-js/records` — **resolved: hold lifted 2026-10-13**, the adapter never needed that package. Do not reopen.
- ADR `$ART_LIB/knowledge/adr/frameworks.md`: wrappers always expose the underlying framework instance/API (Commander, Clack, OpenTUI).

**Proposals** (mine; both executed 2026-10-13):

- WIP parallel abstractions (`RecordSource`, `RecordDTO`, `BaseRecordStructure`, `FSRecordPosition`) retired in favour of `ArtContentSource` — deleted; instructions now verify those symbols are absent.
- `refactor-module-layout` is the first iteration to delegate — layout-only, no records dependency.

### Deliverables and status

| Deliverable                                                    | Status                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------- |
| `@art-lib/fs-records@0.0.1`                                    | `IMPLEMENTED` — discovery + content read, published on npm          |
| Iteration `refactor-module-layout`                             | `READY` — unblocked (layout only)                                   |
| Iterations `add-adapter-types`, `implement-fs-records-adapter` | `READY` — instruction files regenerated against the two-unit design |
| `@art-lib/logger`, `@art-lib/operations`, `@art-lib/config`    | `PLANNING` — 3 plans, instructions not written yet                  |
| `@art-lib/bin`, `@art-lib/prompts`, `@art-lib/ui`              | `PLANNED` — knowledge only (`$ART_LIB/knowledge/components.md`)     |
| Milestone `art-lib-one`                                        | `WORKING` — 6 items: 2 `DONE`, 1 `READY`, 3 `PLANNING`              |

### Relevant files

- **Plans / instructions:** `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` + `instructions/{refactor-module-layout,add-adapter-types,implement-fs-records-adapter}.md`
- **Knowledge / decisions:** `$ART_LIB/knowledge/components.md`, `$ART_LIB/knowledge/overview.md`, `$ART_LIB/knowledge/adr/frameworks.md`
- **Implementation / tests:** `$ART_LIB_BUILD/libs/fs-records/` (co-located `*.test.ts`), conventions wired through `$ART_LIB_BUILD/_guide.md` (`@noodlestan/conventions-typescript`, `@noodlestan/conventions-unit-tests`)
- **Package record:** `$ART_LIB_BUILD/libs/fs-records/_records/package.art` — Canonical Name `@art-lib/fs-records`, published, Node >= 22
- **Architecture:** `$ART_LIB_BUILD/architecture/index.md`
- **Parking lots:** `$ART_LIB/_backlog/_parking-lot.md`, `$ART_LIB/_roadmap/_parking-lot.md` — both empty (no ACTIONABLE / pending / BLOCKER)
- **Broken reference (mine to fix):** `$ART_LIB_BUILD/knowledge/index.md` is mandatory reading in the plan and in all three instruction files, but the directory does not exist — a worker would hard-block on it.

### What I expect from upstream

- **`$ART_JS` — `@art-js/records`:** **no dependency, confirmed 2026-10-13.** My adapter imports nothing from this package; an earlier draft of this attachment claimed I needed `ArtRecord`/`ArtRecordCapsule`/`Records`/`RecordPosition` and was wrong. The only upstream I consume is below.
- **`$ART_JS` — source chain:** `ArtRecordCapsule._source` is an `ArtDocumentSource`; my adapter must be reachable as an `ArtContentSource` (`type`, `uri`, `maybeContent`, `readContent()`, `writeContent()`), per the approved design `plan__design.md` (`FSContentSource → ArtContentSource → ArtDocumentSource`).
- **`$ART_MD` — `@art-md/primitives@0.0.3`:** already published — **satisfied**. This is my only upstream dependency. I import the `ArtContentSource` type and nothing else; I do **not** invoke the codec, so round-trip fidelity is not a dependency of my plan — it is `@art-js/records`' line-splice contract plus `ART_MD`'s codec, neither of which my iterations exercise.

### What downstream consumers will need from me

- **`$ART_WORK`:** the settled symbol set — factory, options, `FSRecordsPattern`, `FSRecordFile.basePath`, async `discoverRecordFiles()`, and the content contract (`readContent()`/`writeContent()` as `ArtContentSource`, record-level `writeRecord` retired) — plus the canonical package name `@art-lib/fs-records`, which answers their reconciliation question.
- `FSRecordsPattern` defaults and gitignore semantics stable enough for `normalizeRecordPaths`-style config normalisation.

### Assumptions, uncertainties, decisions needing input

**Settled 2026-10-13 — do not reopen:** canonical unit name `FSRecordsAdapter` / `createFSRecordsAdapter(FSRecordsAdapterOptions)` / `discoverRecordFiles()`; WIP stand-ins deleted, `ArtContentSource` the only imported contract; availability bar moot (no `@art-js/records` dependency, nothing to link); prefix convention `$ART_LIB`/`$PROJECT` = planning checkout, `$ART_LIB_BUILD` = code (27 sites renamed).

1. **Forwarded question from `$ART_WORK`** — is `.njk` template rendering mine or theirs? _Position: theirs; the adapter persists content verbatim and neither templates nor serialises it._
2. **Write-re-read (answered for `$ART_JS`, now a contract)** — stateless per call: content sits on the source instance until `writeContent()`, and is re-read from disk on the next `readContent()`. Line anchors are computed against the string handed to `writeRecord`; the opt-in hash guard covers out-of-band drift.

### Attachment: report on the blocked plan `add-fs-records-adapter` (resolved)

> ⚠️ **HISTORICAL — hold lifted 2026-10-13.** The chain confirmed the adapter is decoupled from `@art-js/records`; the plan and all three iterations are `READY` and the instruction files are regenerated. The analysis that justified the hold is dropped: its premise — a two-hop dependency on an upstream package that had not started — was itself the error, and the parallel WIP types it warned about are deleted.

**Still true and retained:** iteration 1 moves modules into `src/files/`, `src/discover/`, `src/test/helpers/`, renames `FSRecordsPath` → `FSRecordsPattern`, drops `FSRecordsConfig`, renames `findRecordFiles` → `discoverRecordFiles(basePath, patterns, kinds?)` and `searchPath` → `basePath`; iterations 2–3 add `src/adapter/{types.ts, createFSRecordsAdapter.ts}` plus tests. `$ART_WORK` sits on the published `0.0.1`, so their instructions must not verify exports against it until iteration 1 lands.
