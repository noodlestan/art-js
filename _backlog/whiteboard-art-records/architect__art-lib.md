## Architect: Art Lib (Producer / Consumer)

### Identity, role, scope

**Agent ID:** `ART_LIB`

**Repository:** `$PROJECT` = `$ART_LIB` = `checkouts/art-lib-planning` (planning records) · `$ART_LIB_BUILD` = `checkouts/art-lib-building` (implementation, publishes `@art-lib/*`) · upstream `$ART_JS` = `checkouts/art-js-planning`, `$ART_MD` = `checkouts/art-md-planning` · downstream `$ART_WORK` = `checkouts/art-work-planning`

**Use cases:**

- Discover `.art` record files across a search path, honouring gitignore, ignore/exclude lists, and configured patterns
- Read one record file's content, tolerating missing/unreadable files
- Parse file content into a record **via `@art-js/records`** (codec + record model live upstream, not here)
- Write a record back to its file (serialise → persist → return the persisted source)
- (Planned, same milestone) provide shared CLI infra: logger, operations, config, framework wrappers

**Planning:**

- `$ART_LIB/_roadmap/3-now/milestone-art-lib-one/milestone.md` — `WORKING`, Phase 1 "Establish Lib baseline" `WORKING`
- `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` — `BLOCKED` (HELD by decision 2026-10-11), 3 iterations `READY`, not delegatable
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
- Plan (`add-fs-records-adapter` Decisions): `discoverRecordFiles()` is async; `writeRecord(file, record, recordWrite)` takes the record to serialise _(superseded 2026-10-13 by the whiteboard content contract: `writeContent(content)`)_; `FSRecordFile.searchPath` is renamed `basePath`; commits use `build`, not `feat`.
- Plan Blockers (2026-10-11): the adapter is HELD — **do not delegate any iteration** until `@art-js/records` exposes `ArtRecord` and the source contracts.
- ADR `$ART_LIB/knowledge/adr/frameworks.md`: wrappers always expose the underlying framework instance/API (Commander, Clack, OpenTUI).

**Proposals** (mine, not yet agreed):

- Retire the WIP parallel abstractions (`RecordSource`, `RecordDTO`, `BaseRecordStructure`, `FSRecordPosition`) in favour of conforming to `ArtContentSource` / `ArtRecord` / `RecordPosition`.
- Execute `refactor-module-layout` ahead of the hold — it is layout-only and touches none of the disputed abstractions.

### Deliverables and status

| Deliverable                                                    | Status                                                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `@art-lib/fs-records@0.0.1`                                    | `IMPLEMENTED` — discovery + content read, published on npm                                  |
| Iteration `refactor-module-layout`                             | `READY` — unblocked (layout only)                                                           |
| Iterations `add-adapter-types`, `implement-fs-records-adapter` | `READY` but HELD — revision against real `@art-js/records` types required before delegation |
| `@art-lib/logger`, `@art-lib/operations`, `@art-lib/config`    | `PLANNING` — 3 plans, instructions not written yet                                          |
| `@art-lib/bin`, `@art-lib/prompts`, `@art-lib/ui`              | `PLANNED` — knowledge only (`$ART_LIB/knowledge/components.md`)                             |
| Milestone `art-lib-one`                                        | `WORKING` — 2 of 6 items `DONE`, 1 `BLOCKED`, 3 `PLANNING`                                  |

### Relevant files

- **Plans / instructions:** `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` + `instructions/{refactor-module-layout,add-adapter-types,implement-fs-records-adapter}.md`
- **Knowledge / decisions:** `$ART_LIB/knowledge/components.md`, `$ART_LIB/knowledge/overview.md`, `$ART_LIB/knowledge/adr/frameworks.md`
- **Implementation / tests:** `$ART_LIB_BUILD/libs/fs-records/` (co-located `*.test.ts`), conventions wired through `$ART_LIB_BUILD/_guide.md` (`@noodlestan/conventions-typescript`, `@noodlestan/conventions-unit-tests`)
- **Package record:** `$ART_LIB_BUILD/libs/fs-records/_records/package.art` — Canonical Name `@art-lib/fs-records`, published, Node >= 22
- **Architecture:** `$ART_LIB_BUILD/architecture/index.md`
- **Parking lots:** `$ART_LIB/_backlog/_parking-lot.md`, `$ART_LIB/_roadmap/_parking-lot.md` — both empty (no ACTIONABLE / pending / BLOCKER)
- **Broken reference (mine to fix):** `$ART_LIB_BUILD/knowledge/index.md` is mandatory reading in the plan and in all three instruction files, but the directory does not exist — a worker would hard-block on it.

### What I expect from upstream

- **`$ART_JS` — `@art-js/records`:** **no dependency, confirmed 2026-10-13.** My adapter imports nothing from this package — the WIP types that duplicated it are deleted and the hold was lifted on that basis. Listed here only because an earlier draft of this attachment claimed I needed `ArtRecord`/`ArtRecordCapsule`/`Records`/`RecordPosition`; I do not. The only upstream I consume is below.
- **`$ART_JS` — source chain:** `ArtRecordCapsule._source` is an `ArtDocumentSource`; my adapter must be reachable as an `ArtContentSource` (`type`, `uri`, `maybeContent`, `readContent()`, `writeContent()`), per the approved design `plan__design.md` (`FSContentSource → ArtContentSource → ArtDocumentSource`).
- **`$ART_MD` — `@art-md/primitives@0.0.3`:** already published — **satisfied**. This is my only upstream dependency. I import the `ArtContentSource` type and nothing else; I do **not** invoke the codec, so round-trip fidelity is not a dependency of my plan — it is `@art-js/records`' line-splice contract plus `ART_MD`'s codec, neither of which my iterations exercise.

### What downstream consumers will need from me

- **`$ART_WORK`:** the settled symbol set — factory, options, `FSRecordsPattern`, `FSRecordFile.basePath`, async `discoverRecordFiles()`, and the content contract (`readContent()`/`writeContent()` as `ArtContentSource`, record-level `writeRecord` retired) — plus a package name they can document.
- Answer to their reconciliation question ("`@art-lib/fs-records` vs `@art-lib/fs-records-adapter` — canonical name?").
- `FSRecordsPattern` defaults and gitignore semantics stable enough for `normalizeRecordPaths`-style config normalisation.

### Assumptions, uncertainties, decisions needing input

1. **~~Canonical unit name~~** — settled by producer authority: `FSRecordsAdapter` / `createFSRecordsAdapter` / `FSRecordsAdapterOptions`, method `discoverRecordFiles()`. _`$ART_WORK` must correct its captures; recorded in the whiteboard parking lot._
2. **~~Type lineage~~** — settled: the WIP stand-ins are deleted; the only imported contract is `ArtContentSource` from `@art-md/primitives@0.0.3`. I import no record-model symbols. _Hold lifted on this basis 2026-10-13._
3. **~~Availability bar~~** — moot: with no `@art-js/records` dependency there is nothing to publish or link. _Closed 2026-10-13._
4. **Prefix convention** — `add-fs-records-adapter` defines `$ART_LIB` = `checkouts/art-lib-building`, while `$ART_WORK` and `$ART_JS` use `$ART_XXX` for their _planning_ checkout. I use `$ART_LIB` (planning) + `$ART_LIB_BUILD` (code) here. _Needs a cross-repo convention decision; my plan will be re-baselined accordingly._
5. **Forwarded question from `$ART_WORK`** — is `.njk` template rendering mine or theirs? _Position: theirs; the adapter persists content verbatim and does not template or serialise it._
6. **Write-re-read (answered for `$ART_JS`)** — the adapter holds no content session: it is stateless per call, holds content on the source instance until `writeContent()`, and re-reads from disk on the next `readContent()`. Line-based `RecordPosition` anchors are therefore computed against the content string handed to `writeRecord`, and the opt-in content-hash guard is what protects a write against out-of-band drift. _Line anchors survive; byte/structural anchors not needed._

### Attachment: report on the blocked plan `add-fs-records-adapter`

> ⚠️ **HISTORICAL — the hold described here was lifted 2026-10-13.** The chain confirmed the adapter is decoupled from `@art-js/records`; the plan and all three iterations are `READY` and the instruction files are regenerated. Retained for the record only. The analysis below was written when the hold was still believed to be justified.

1. **Why it's HELD (worse than one dependency).** The blocker cites release conditions on `@art-js/records`, but that upstream package is not late — it's **unstarted**: `$ART_JS/_backlog/4-next/plan-create-lib-records/plan.md` is `PLANNING`, all 4 iterations `PLANNING`, and its own `Next` says "write instructions, then delegate iteration 1". `libs/records/` is scaffold-only (README + `_guide.md`, no `src/` modules, tests pass vacuously). The hold has at least two hops: Art JS instructions → implement → publish, then my three instructions must be revised. _Superseded: the dependency this reasoning rested on was itself the error — the adapter never needed `@art-js/records`._
2. **What `@art-js/records` must deliver** (approved design, `$ART_JS/_backlog/1-done/plan-design-lib-records/plan__design.md`):

   | Contract                                                                               | Source                                   | My adapter's obligation                          |
   | -------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------ |
   | `ArtRecord` (`kind`, `name`)                                                           | `@art-js/records`                        | replaces my WIP `BaseRecordStructure`            |
   | `ArtRecordCapsule<T>`, `Records<T>`, `extractRecords`, `writeRecord` (content strings) | `@art-js/records`                        | supplies the read/write semantics I wire to disk |
   | `ArtContentSource` / `ArtDocumentSource` / `createArtDocumentSource()`                 | `@art-md/primitives` (published `0.0.3`) | adapter should be an `FSContentSource`           |
   | `RecordPosition` (write-back anchors)                                                  | `@art-js/records` `write-back/types.ts`  | replaces my duplicate `FSRecordPosition`         |

   **Gap:** the approved layering is `FSContentSource → ArtContentSource → ArtDocumentSource → ArtRecordCapsule`, but my plan's WIP types are a _parallel_ abstraction (`RecordSource`/`FSRecordSource`/`RecordDTO`, content passed as a plain `string` to `recordRead`). The plan has no `FSContentSource` at all — only `FSRecordSource.type: 'fs-record'` + a `file://` uri. That is exactly the throwaway-work risk the blocker names.

3. **Source to be modified** (`$ART_LIB_BUILD/libs/fs-records`, published `@art-lib/fs-records@0.0.1`): iteration 1 moves modules into `src/files/`, `src/discover/`, `src/test/helpers/`, renames `FSRecordsPath` → `FSRecordsPattern`, drops `FSRecordsConfig`, renames `findRecordFiles` → `discoverRecordFiles(basePath, patterns, kinds?)` and `searchPath` → `basePath`; iterations 2–3 add `src/adapter/{types.ts, createFSRecordsAdapter.ts}` + tests.
4. **Consumer evidence** (`$ART_WORK/cli/work`, already on `0.0.1`): `loadProjectRecords` / `loadPackageRecords` call `findRecordFiles(config.records, checkoutPath, kinds)`; `readPackageRecord` hydrates via `readRecordFileContent`; the global-install plan moves the CLI to `fsRecords` on `WorkspaceContext` via `createFSRecordsStore(config.data.store)`, gated on my iteration 3 — so my naming drift is their compile-time risk, since their instructions verify my exported symbols at runtime.
