# Plan: Create Lib Records

**ID:** `create-lib-records`

**Status:** `PLANNING`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Implement the `@art-js/records` package from the approved design.

**Description:** Implement, test, and document the records library per `plan__design.md`: the record model wrapping `SectionBlock`, extraction and presence-assertion, write-back with positioning anchors and an opt-in content-hash guard, optional `ProxyObject` field access, and the `Records` facade — in the scaffolded `$PROJECT/libs/records/`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                            | Purpose                                                                      |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory                | Workspace root directory                                                     |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains`             | Domain resources directory                                                   |
| `$PROJECT`   | Provided with prompt                     | Where work execution is taking place.                                        |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md-planning`   | Upstream codec and source contracts (`@art-md/primitives`).                  |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-planning`  | Chain neighbour — FS records adapter (decoupled; no import of this package). |
| `$ART_WORK`  | `$WORKSPACE/checkouts/art-work-planning` | Downstream consumer — CLI records usage.                                     |

## Summary

Implement the records package strictly from the design delivered by the DONE plan `design-lib-records` (spec: `$PROJECT/_backlog/1-done/plan-design-lib-records/plan__design.md`; knowledge: `$PROJECT/knowledge/records.md`). The module dependency chain dictates the sequence: `record` → `capsule` → `extract` + `write-back` → `proxy` + `records` facade → `src/index.ts` exports → documentation once the API is stable. Declare `@art-md/primitives` (published, `0.0.3`) as the package dependency for the contract types and `createArtDocumentSource`.

Iterations 1–4 are delegated code work with self-contained instruction files; iteration 5 is a compact doc sweep carried inlined in this plan.

### Summary of Changes

| File / Area                                  | Change                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `$PROJECT/libs/records/package.json`         | **Updated** — add `@art-md/primitives` and `@art-md/constructs` dependencies.                    |
| `$PROJECT/libs/records/src/record/`          | **Created** — `ArtRecord` identity and the `SectionBlock` bridge.                                |
| `$PROJECT/libs/records/src/capsule/`         | **Created** — `ArtRecordCapsule<T>` transporting identity and its `ArtDocumentSource`.           |
| `$PROJECT/libs/records/src/extract/`         | **Created** — `assertRecordPresence`, `extractRecords` with options.                             |
| `$PROJECT/libs/records/src/write-back/`      | **Created** — anchored `writeRecord` with opt-in content-hash guard.                             |
| `$PROJECT/libs/records/src/proxy/`           | **Created** — `FieldResolver`, `createFieldResolver` (default factory), and `createProxyObject`. |
| `$PROJECT/libs/records/src/records/`         | **Created** — `Records<T>` facade (`assertPresence`, `extract`, `update`, `serialize`).          |
| `$PROJECT/libs/records/src/index.ts`         | **Updated** — public exports per spec (replaces placeholder).                                    |
| `$PROJECT/libs/records/README.md`            | **Updated** — add Usage section shaped after the `esbuild-cli` README.                           |
| `$PROJECT/libs/records/_guide.md`            | **Updated** — replace bundler-adapted prose with records-specific guide.                         |
| `$PROJECT/knowledge/{components,records}.md` | **Updated** — Records status refresh; align records doc with the implementation.                 |

## Context

### Upstream Work

| Kind                  | Path                                                         | Role                                                                        |
| --------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Parking Lot           | `$PROJECT/_backlog/_parking-lot.md`                          | Tracks short-term actionables, pending questions, and blockers.             |
| Architecture Briefing | `$PROJECT/_roadmap/_architect.md`                            | Art JS principles, NFRs, milestones.                                        |
| Milestone             | `$PROJECT/_roadmap/3-now/milestone-art-records/milestone.md` | Coordinates this plan; phases 1–4 map to the iterations below.              |
| Plan (DONE)           | `$PROJECT/_backlog/1-done/plan-design-lib-records/plan.md`   | Approved design: spec `plan__design.md`, findings, decisions, worker notes. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$PROJECT/_backlog/1-done/plan-design-lib-records/plan__design.md` — Full package spec: responsibilities, boundaries, layout tree, and files with type/factory signatures.

::READ `$PROJECT/knowledge/records.md` — Records architecture doc: purpose, responsibilities, principles, dependencies.

::READ `$PROJECT/knowledge/components.md` — Components and relationships; Records status under Core Libraries.

::READ `$PROJECT/_guide.md` — Conventions indexes (TypeScript, Unit Tests) and operating instructions.

## Scope

Implement `@art-js/records` in `$PROJECT/libs/records/` exactly as specified by `plan__design.md`:

1. **Record model** — `ArtRecord` (`kind`, `name`) and the `SectionBlock` bridge; `ArtRecordCapsule<T>` transporting identity and its `ArtDocumentSource`.
2. **Extraction** — `assertRecordPresence` and `extractRecords` returning capsules with fields and examples.
3. **Write-back** — anchored `writeRecord` on content strings with an opt-in content-hash guard (`WriteBackOptions.guard`).
4. **Proxy and facade** — `createProxyObject` delegating unknown properties to `FieldResolver`, setters routing to `field.value` and tracking `field.modifiedValue`; default `createFieldResolver` factory (records own field mapping); `Records` facade (`assertPresence`, `extract`, `update` = guarded, `serialize` = unguarded).
5. **Documentation** — README usage section, records-specific package guide, knowledge status/doc refresh.

The codec contracts consumed here (`ArtCodec`, `ArtContentSource`, `ArtDocumentSource`) are declared in `@art-md/primitives` upstream in `$ART_MD`; no codec implementation work happens in this plan. Downstream adoption stays in `$ART_WORK` (`plan-art-work-cli-global-install`); `$ART_LIB`'s adapter is decoupled from this package — it imports `ArtContentSource` from `@art-md/primitives` only (whiteboard verdict 2026-10-13).

## Execution Context

Implementation is performed in `$PROJECT` on branch `main` via delegation (self-contained instruction files; worker reports land next to the instructions). Iteration 4 may be executed inlined with a chat report.

---

## Unit Tests

Unit tests to create in `$PROJECT/libs/records/` (one suite per module):

- `src/record/` — `ArtRecord` identity: `kind` and `name` present; bridge mapping from `SectionBlock` extracts `kind`/`name`.
- `src/capsule/` — `ArtRecordCapsule`: exposes identity via `_id` before source hydration; exposes the record via `_maybeRecord`/`raw()` after hydration; `_source` is the `ArtDocumentSource`.
- `src/extract/` — presence assertion returns true/false for records present/absent in content; extraction returns capsules with fields and examples.
- `src/write-back/` — write-back lands at the positioning anchors; content-hash guard: safe write refuses when content changed, unsafe write proceeds; **same-kind disambiguation: a file with several records of one kind (e.g. `Package Dependency` ×5, names with spaces/colon, as in `$ART_WORK/cli/work/_records/package.art`) writes back exactly one record and leaves siblings byte-identical**.
- `src/proxy/` — `ProxyObject`: `kind`/`name` returned from record identity; unknown fields resolve through `FieldResolver`; setters route to `field.value` and track `field.modifiedValue`. `createFieldResolver`: resolves `field.value`, tracks `field.modifiedValue` on set.
- `src/records/` — facade round-trip: `extract` → mutate → `update`/`serialize` returns content with the change applied and untouched records preserved.

---

## Items:

| Iteration / Instructions                       | Status     |
| ---------------------------------------------- | ---------- |
| Iteration: Implement Record Model              | `PLANNING` |
| Iteration: Implement Extraction and Write-Back | `PLANNING` |
| Iteration: Implement Proxy and Field Resolver  | `PLANNING` |
| Iteration: Implement Records Facade            | `PLANNING` |
| Iteration: Document Records Usage              | `PLANNING` |

### Iteration: Implement Record Model

**ID:** `implement-record-model`

**Status:** `PLANNING`

**Purpose:** Land the identity and transport foundation every other module builds on.

**Description:** Add the `@art-md/primitives` and `@art-md/constructs` dependencies; implement `src/record/` and `src/capsule/` with unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Add `@art-md/primitives@0.0.3` and `@art-md/constructs@0.0.3` to `$PROJECT/libs/records/package.json` dependencies (`SectionBlock`/`FieldBlock`/`FieldInline` live in constructs, not primitives — `ART_MD` audit finding 1).
- Create `src/record/types.ts` — `ArtRecord` (`kind`, `name`).
- Create `src/record/createArtRecord.ts` — `createArtRecord(block: SectionBlock): ArtRecord | undefined` (returns `undefined` when `kind` is absent). `SectionBlock.kind` is optional upstream; `kind: undefined` means "not a record" — the bridge returns `undefined` for such blocks (audit finding 4), and `Field` is not an upstream type: use `FieldBlock`/`FieldInline` (audit finding 2).
- Create `src/capsule/types.ts` — `ArtRecordCapsule<T>` (`_source`, `_maybeRecord`, `_id`, `raw()`, index signature).
- Create `src/capsule/createArtRecordCapsule.ts` — `createArtRecordCapsule<T>(source, maybeRecord?)`.
- Unit tests for `src/record/` and `src/capsule/` per the Unit Tests section.
- Verify from `$PROJECT/libs/records/`: `npm run lint`, `npm run build`, `npm run test`.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash | Status     |
| ------------------------ | ------------------------------ | ------------ | ---- | ---------- |
| `implement-record-model` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `implement-record-model`

**Message:**

```text
build(create-lib-records): Implement `ArtRecord` and `ArtRecordCapsule` with tests.
```

### Iteration: Implement Extraction and Write-Back

**ID:** `implement-extract-write-back`

**Status:** `PLANNING`

**Purpose:** Deliver the read and write halves of the API — presence assertion, extraction, and guarded write-back.

**Description:** Implement `src/extract/` and `src/write-back/` with unit tests; consumes the record model from iteration 1.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Create `src/extract/types.ts` — `ExtractOptions`.
- Create `src/extract/assertRecordPresence.ts` — `assertRecordPresence(document, kind, name)`.
- Create `src/extract/extractRecords.ts` — `extractRecords(document, options?)` returning capsules with fields and examples.
- Create `src/write-back/types.ts` — `RecordPosition`, `WriteBackOptions` (`guard` opt-in).
- Create `src/write-back/writeRecord.ts` — `writeRecord(content, capsule, options?)` on content strings, not the filesystem.
- Unit tests for `src/extract/` and `src/write-back/` per the Unit Tests section.
- Verify from `$PROJECT/libs/records/`: `npm run lint`, `npm run build`, `npm run test`.

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy       | Hash | Status     |
| ------------------------------ | ------------------------------ | ------------ | ---- | ---------- |
| `implement-extract-write-back` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `implement-extract-write-back`

**Message:**

```text
build(create-lib-records): Implement extraction and guarded write-back with tests.
```

### Iteration: Implement Proxy and Field Resolver

**ID:** `implement-proxy-resolver`

**Status:** `PLANNING`

**Purpose:** Transparent field access — the `ProxyObject` and the default field-mapping resolver it runs on.

**Description:** Implement `src/proxy/` with unit tests; split from the facade per cross-review (proxy + resolver share `FieldResolver`; the facade depends on iteration 2, not on the proxy).

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Create `src/proxy/types.ts` — `FieldResolver`.
- Create `src/proxy/createFieldResolver.ts` — `createFieldResolver(record)` default factory mapping record fields (`field.value`, `field.modifiedValue`); consumers must not hand-roll resolvers (whiteboard contract). `modifiedValue` is records-domain tracking state (ART_MD audit finding 3 — does not exist upstream; mutation stays here).
- Create `src/proxy/createProxyObject.ts` — properties defined on `T` returned from record identity, other accesses through `resolveField`, setters route to `field.value` and track `field.modifiedValue`.
- Unit tests for `src/proxy/` per the Unit Tests section.
- Verify from `$PROJECT/libs/records/`: `npm run lint`, `npm run build`, `npm run test`.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy       | Hash | Status     |
| -------------------------- | ------------------------------ | ------------ | ---- | ---------- |
| `implement-proxy-resolver` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `implement-proxy-resolver`

**Message:**

```text
build(create-lib-records): Implement proxy access and field resolver with tests.
```

### Iteration: Implement Records Facade

**ID:** `implement-records-facade`

**Status:** `PLANNING`

**Purpose:** Complete the public API — the collection-level facade and the exported surface.

**Description:** Implement `src/records/` on top of iteration 2, wire `src/index.ts` per the spec, and cover with unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Create `src/records/types.ts` — `Records<T>` (`assertPresence`, `extract`, `update`, `serialize`).
- Create `src/records/createRecords.ts` — `createRecords<T>(source)`.
- Update `src/index.ts` — public exports exactly as specified in `plan__design.md`, plus `createFieldResolver` (whiteboard addition; `$ART_JS` owns field mapping).
- Unit tests for `src/records/` per the Unit Tests section.
- Verify from `$PROJECT/libs/records/`: `npm run lint`, `npm run build`, `npm run test`.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy       | Hash | Status     |
| -------------------------- | ------------------------------ | ------------ | ---- | ---------- |
| `implement-records-facade` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `implement-records-facade`

**Message:**

```text
build(create-lib-records): Implement Records facade and public exports with tests.
```

### Iteration: Document Records Usage

**ID:** `document-records-usage`

**Status:** `PLANNING`

**Purpose:** Make the finished package consumable and refresh the knowledge that describes it; rides along after the API is stable.

**Description:** README usage section, records-specific package guide, and knowledge status/doc refresh.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

- Update `$PROJECT/libs/records/README.md` — add a `## Usage` section: install; source/codec → `createRecords` → assert/extract/update/serialize examples; API notes — shaped after `$WORKSPACE/checkouts/workspace-tooling/cli/esbuild-cli/README.md` (rationale, Usage with subsections, examples against the real exports).
- Update `$PROJECT/libs/records/_guide.md` — replace bundler-adapted prose with records-specific overview, layout, records management, and operating instructions.
- Update `$PROJECT/knowledge/components.md` — refresh the Records `**Status:**` now that the implementation lands (decide target status when writing instructions; all packages currently read `SCAFFOLD`).
- Update `$PROJECT/knowledge/records.md` — align with the implementation if signatures or module layout deviated from the design.
- Verify from `$PROJECT/libs/records/`: `npm run lint`, `npm run build`, `npm run test`; confirm the README usage snippet matches the exports in `src/index.ts`.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash | Status     |
| ------------------------ | ------------------------------ | ------------ | ---- | ---------- |
| `document-records-usage` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `document-records-usage`

**Message:**

```text
docs(art-js): Records README usage, package guide, and architecture status.
```

---

## Work

### Next

**Write Instructions**: generate self-contained files for `implement-record-model`, `implement-extract-write-back`, `implement-proxy-resolver`, `implement-records-facade`; render the inline instruction block for `document-records-usage`; mark iterations `READY`. Then delegate iteration 1. All cross-project contracts are `AGREED` on the records whiteboard (`$WORKSPACE/whiteboard-art-records/whiteboard.md`) — no open consumer questions block delegation. Note: `$ART_LIB`'s adapter no longer waits on this plan (decoupled — imports only `@art-md/primitives`); only `$ART_WORK`'s adoption depends on this plan going green workspace-linked (npm publish NOT required).

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

---

## Coordination

### Not In Scope

- **FS-specific discovery logic** — Belongs in `$ART_LIB` plan `add-fs-records-adapter`.
- **CLI command implementation** — Belongs in `$ART_WORK` plan `plan-art-work-cli-global-install`.
- **Codec implementation** — `@art-md/codec` stays upstream; only `@art-md/primitives` contracts are consumed.
- **Publishing `@art-js/records`** — release flow belongs to the workspace publish operation, after this plan lands.

### Evidence

- `npm run ci` green in `$PROJECT` with real test suites covering all six `src/` modules (`libs/records` currently passes vacuously — `passWithNoTests`).
- README usage snippet compiles against the exports in `src/index.ts`; `libs/records/_guide.md` describes records, not bundler.

### Findings

- **`ART_MD` audit findings (2026-10-13, whiteboard)** — (1) `SectionBlock`/`FieldBlock`/`FieldInline` live in `@art-md/constructs@0.0.3`, not `primitives` — iteration 1 now adds both deps; (2) no upstream `Field` union — use `FieldBlock`/`FieldInline`; (3) `field.modifiedValue` does not exist upstream — stays records-domain (resolver tracks it); (4) `SectionBlock.kind` is optional — `createArtRecord` returns `undefined` for `kind: undefined` (signature now `ArtRecord | undefined`).
- **`@art-lib/fs-records@0.0.1` exports pre-rename names** (`findRecordFiles`, `FSRecordsConfig`, `FSRecordsPath`, `searchPath`) — verified in source by `ART_LIB`; agreed names land with their iteration 1. No impact on this plan (decoupled), recorded so nobody cites `0.0.1` as carrying the agreed surface.
- **Records whiteboard converged (2026-10-13)** — `$WORKSPACE/whiteboard-art-records/whiteboard.md`: `@art-js/records` + `@art-lib/fs-records` contracts `AGREED`; `FSRecordsAdapter`/`createFSRecordsAdapter` canonical; ART_WORK confirms per-document facade + `discover`/`extract` verb split.
- **`@art-md/primitives@0.0.3` is published on npm** — `libs/records/package.json` currently declares no dependencies; iteration 1 adds it.
- **Execution environment lessons (from the design plan)** — run `npm ci` inside `$PROJECT` if package CI fails (stale `node_modules` bit twice); pre-commit runs repo-wide Prettier, so run `npm run lint:fix` before committing.
- **`libs/records` tests are vacuous today** — scaffold sets `passWithNoTests`; the first test suites here make CI meaningful.

### Decisions

- **Whiteboard contracts `AGREED` (2026-10-13)** — `update` = guarded write over existing content, `serialize` = unguarded for new files; line-based `RecordPosition` stands (adapter re-reads after `writeContent()`, guard covers drift); `writeRecord` is a pure line-splice preserving non-modelled content byte-identically; consumers import `ArtContentSource`/`ArtDocumentSource` straight from `@art-md/primitives` — `index.ts` exports only the package's own symbols.
- **`createFieldResolver` added as a deliverable** — field mapping is records-domain; `$ART_WORK` will not hand-roll resolvers and the adapter must not own mapping. Lands in iteration 3 next to `createProxyObject`.
- **Five iterations follow the module dependency chain** — split per cross-review (`ART_LIB` + `ART_WORK`): the former iteration 3 was three independently testable units in one commit chain; now proxy+resolver (`implement-proxy-resolver`, they share `FieldResolver`) is separate from facade+wiring (`implement-records-facade`, depends on extract+write-back, not the proxy). Phases 2–3 of the milestone still share the extract/write-back iteration; docs ride last when signatures are stable. Thin iteration 1 stays thin — deliberately not padded.
- **Iterations 1–3 use `INSTRUCTIONS_SELF_CONTAINED_FILE`** — multi-file code work needing isolated worker prompts, commit steps, and a report file trail, matching the pattern proven by `design-lib-records`.
- **Iteration 4 uses `INSTRUCTIONS_INLINED_IN_ITERATION`** — a compact four-file doc sweep whose steps fit in this plan; report happens in chat, no instruction file that merely restates its Changes.
- **Hash guard is opt-in** — `WriteBackOptions.guard` defaults off; **ProxyObject delegates unknown properties to `FieldResolver`** — both inherited from the design plan.

### Knowledge to Update

- **`$PROJECT/knowledge/components.md`** — Records status refresh after implementation (iteration 4).
- **`$PROJECT/knowledge/records.md`** — align with the implementation if the design deviated (iteration 4).

### Follow Ups

- ~~**Downstream adoption in `$ART_LIB`** — `add-fs-records-adapter` imports from `@art-js/records` once published.~~ **Void (2026-10-13):** `$ART_LIB`'s adapter is decoupled — it imports `ArtContentSource` from `@art-md/primitives` only and never consumes record-model symbols. No import will happen at publish; only `$ART_WORK` adopts this package.
- **Downstream adoption in `$ART_WORK`** — `plan-art-work-cli-global-install` uses records types in `WorkspaceContext` and record loaders.
- **Components status vocabulary** — decide the post-implementation status (all packages currently read `SCAFFOLD`).
- **Milestone follow-up closed** — safe-vs-unsafe write-back split resolved on the whiteboard (`update`/`serialize`). ~~ProxyObject default-vs-opt-in remains open there~~ **Not an open question** (`ART_WORK` challenge accepted 2026-10-13): nothing about ProxyObject is open in whiteboard Contracts or Pending; the consumer never asked for opt-in and a per-record proxy fits their loop. Recorded as decided: `createProxyObject` is an explicit, always-available factory — opt-in by construction (call it or use the capsule directly), no default switching.

### Feedback

- None yet.
