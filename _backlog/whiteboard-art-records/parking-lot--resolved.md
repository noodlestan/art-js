# Parking Lot: Resolved Items (Art Records Whiteboard)

Archive of resolved feedback and answered questions, moved out of `whiteboard.md` to keep the parking lot actionable. Chronological, newest last.

## Actionable — Feedback (all resolved)

- **ART_JS → ART_LIB** – your attachment is a blocker report, not an intro: fill the Introductions entry; move the blocked-plan analysis to parking lot / follow-ups. _✅ done — intro filled; analysis in `./architect__art-lib.md` + Blockers._
- **ART_JS → ART_LIB** – trim the contract table to the symbols crossing the package boundary (`ArtRecord`, `ArtRecordCapsule`, `Records`, `RecordPosition`, `ArtContentSource`). _✅ accepted — boundary symbols only; internal refactors stay in the attachment._
- **ART_JS → ART_WORK** – pick one verb family for "find records"; drop the CLI-internal `checkouts.path`/template config detail. _✅ done — `discover` = files / `extract` = records; config detail dropped._
- **ART_JS → ALL** – common vocabulary: record = `kind`+`name` section; capsule = record + source; facade = per-document API; adapter = FS discovery/persistence. _All adopted; vocabulary now used throughout._
- **ART_LIB → ART_WORK** – retitle captures to canonical names (`FSRecordsAdapter` / `createFSRecordsAdapter(FSRecordsAdapterOptions)`, `FSRecordsPattern`, `FSRecordFile.basePath`, provider path `plan-add-fs-records-adapter`); absorb `writeContent(content)` (record-level `writeRecord` retired). _✅ accepted and executed by ART_WORK 2026-10-13 — see Actionable — Tasks._
- **ART_LIB → ART_JS** – `ArtContentSource` re-export or direct upstream import? _✅ answered: direct from `@art-md/primitives@0.0.3`; now an `AGREED` contract._
- **ART_WORK → ART_JS** – boundary-symbol rule applies to your intro: underscored capsule internals belong in the attachment. _✅ applied by ART_JS._
- **ART_WORK → ART_LIB** – your `Expectations` restates the availability ask already in Pending; drop it. _✅ applied by ART_LIB._

## Actionable — Tasks (completed)

- **ART_LIB (own)** – fix broken mandatory-reading ref `$ART_LIB_BUILD/knowledge/index.md` in `plan-add-fs-records-adapter` + three instruction files; re-baseline HELD instructions onto agreed types and renames. _Ref fix + blocker refresh done 2026-10-13; type re-baseline waits for `$ART_JS`'s green plan (still open — lives in Blockers)._
- **ART_WORK (own)** – retitle captures to canonical names, replace `writeRecord(file, record, recordWrite)` with `writeContent(content)`, repoint provider plan. _✅ done 2026-10-13 — plan and instruction file retitled; `writeContent(content)` absorbed; `listFiles()`/`readRecord()` replaced by `discoverRecordFiles()`/`readContent()`; provider repointed to `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md`._

## Pending/Questions (all answered)

- **ART_JS → ART_LIB** — re-read behaviour between writes? _ANSWERED: stateless per call, re-read after `writeContent()` — line anchors survive; hash guard covers drift._
- **ART_JS → ART_WORK** — per-document facade enough? _ANSWERED: yes; per-document + own looping; no multi-document collection._
- **ART_JS → ART_WORK** — who owns `FieldResolver` construction? _ANSWERED: factory from `@art-js/records`; field mapping is records-domain._
- **ART_LIB → ART_JS** — availability bar: green workspace plan vs npm publish? Import path? _ANSWERED: workspace-green is enough, publish is a follow-up; contracts straight from `@art-md/primitives`._
- **ART_JS → ALL** — canonical adapter unit name. _RESOLVED: `FSRecordsAdapter` (producer authority); package `@art-lib/fs-records` `AGREED`._
- **ART_WORK → ART_JS** — does write-back leave non-modelled content intact? _ANSWERED: yes — `writeRecord` is line-splice only; byte-identical outside anchors. Contract bullet._
- **ART_WORK → ART_LIB** — sync or async? _ANSWERED: all async — `Promise<FSRecordFile[]>` / `Promise<string>` / `Promise<void>`; no sync path. `AGREED` contract._
- **ART_LIB → ART_WORK** — can the CLI's read path advance against published `0.0.1`? _ANSWERED: not as a split — `0.0.1` carries no adapter, only the pre-rename `findRecordFiles` / `readRecordFileContent`; the gate stays and Step 1/8 verifies the package source. Response written by ART_WORK on the board 2026-10-13._
- **ART_JS → ART_WORK** — confirm the iteration-split challenge and the `$ART_LIB` artefact claim. _ANSWERED: split confirmed from the facade seam — `Records<T>` depends on extract + write-back, not on the proxy; the artefact claim (nothing in `$ART_LIB` depends on `plan-create-lib-records` going green) confirmed as consumer — only my Phase 2 does._

## Actionable — Resolved on 2026-10-13 (ART_LIB's turn)

- **Response** from **ART_MD** to **ART_JS** + **ART_WORK** (contract fixtures) – fixture list confirmed; corpus verified on disk; one count correction (`$ART_WORK/cli/work/_records/package.art` holds **four** same-kind `Package Dependency` records, not five, plus one different-kind `Package` record). Real corpus = `$ART_WORK`'s two record files; three synthetic edge cases from `$ART_JS` owned by `ART_MD`, to be added under `cli/codec-tests`. _Re-counted independently by `ART_LIB` — matches; fixture set stands._
- **Response** from **ART_MD** to **ALL** – all four audit findings closed without contest: finding 1 (`$ART_JS` adds both deps; `$ART_LIB` adds primitives only, no re-export — correct), finding 2 (constructs types used directly; `Field` alias offer withdrawn), finding 3 (`modifiedValue` stays records-domain), finding 4 (`createArtRecord(block): ArtRecord | undefined`). Contracts recorded in `## Contracts` (`### @art-md`) as `AGREED`. _Both re-confirmed by `ART_LIB` 2026-10-13 after independent verification of the `ArtContentSource` shape against my `FSContentSource` and of the fixture count on disk._

## Actionable — Resolved on 2026-10-13 (ART_WORK's turn)

- **Critique** from **ART_WORK** to **ART_LIB** (goal step 3) – contract drift: the `AGREED` layering and content bullets had headlines contradicting the plan's two-unit design (adapter vs `FSContentSource` owning `readContent()`/`writeContent()`); scope/path leaks — the global-install verification line is the CLI's check, not the adapter's, and `$ART_LIB`/`$PROJECT` inverted the chain's path convention. _✅ closed by `ART_LIB`: both bullets rewritten to headline the two-unit design (+`Async` member ownership), verification line removed, `$ART_LIB_BUILD` rename applied (27 sites)._
- **Pending** from **ART_LIB** to **ART_WORK** – record my own plan's verdict in Contracts per producer (step 5's only missing verdict). _✅ answered on the board: `### @art-work` now carries `VERDICT — ADVANCE` with next move (delegate `refactor-config-semantics` when the adapter iterations land in source). Step 5 still needs each architect's confirmation._
