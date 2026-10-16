# Plan: Create Lib Records

**ID:** `create-lib-records`

**Status:** `BLOCKED`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Implement the `@art-js/records` package from the approved design.

**Description:** Implement, test, and document the records library per `knowledge/design/records.md`: a record IS a `SectionBlock`, extraction and presence-assertion, write-back with field-level positioning anchors and an opt-in content-hash guard, transparent field access through `createProxyObject`/`createFieldResolver`, injectable capsule factories, and the `Records` facade — in the scaffolded `$PROJECT/libs/records/`.

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

Implement the records package from the current design (`$PROJECT/knowledge/design/records.md`) and overview (`$PROJECT/knowledge/overview-records.md`). The module dependency chain dictates the sequence: `record` → `capsule` (factory included) → `extract` + `write-back` → `proxy` → `records` facade → `src/index.ts` exports → documentation once the API is stable. Declare `@art-md/primitives` (published, `0.0.3`) as the package dependency for the contract types and `createArtDocumentSource`.

Iterations 1–4 are delegated code work with self-contained instruction files; iteration 5 is a compact doc sweep carried inlined in this plan.

### Summary of Changes

| File / Area                                  | Change                                                                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `$PROJECT/libs/records/package.json`         | **Updated** — add `@art-md/primitives` and `@art-md/constructs` dependencies.                                                         |
| `$PROJECT/libs/records/src/record/`          | **Created** — `ArtRecord` identity and synthetic `SectionBlock` factory.                                                              |
| `$PROJECT/libs/records/src/capsule/`         | **Created** — `ArtRecordCapsule<T>`, capsule factory, and injectable factory seam.                                                    |
| `$PROJECT/libs/records/src/extract/`         | **Created** — `assertRecordPresence`, `extractRecords` (internal modules used by the facade).                                         |
| `$PROJECT/libs/records/src/write-back/`      | **Created** — field-level `writeRecord` with opt-in content-hash guard.                                                               |
| `$PROJECT/libs/records/src/proxy/`           | **Created** — `FieldResolver` (`resolveField`, `setField`, `renameField`, `deleteField`), `createFieldResolver`, `createProxyObject`. |
| `$PROJECT/libs/records/src/records/`         | **Created** — `Records<T>` facade (`assertPresence`, `extract`, `update`, `serialize`) with optional `capsuleFactory`.                |
| `$PROJECT/libs/records/src/index.ts`         | **Updated** — public exports per spec (replaces placeholder).                                                                         |
| `$PROJECT/libs/records/README.md`            | **Updated** — add Usage section shaped after the `esbuild-cli` README.                                                                |
| `$PROJECT/libs/records/_guide.md`            | **Updated** — replace bundler-adapted prose with records-specific guide.                                                              |
| `$PROJECT/knowledge/{components,records}.md` | **Updated** — Records status refresh; align records doc with the implementation.                                                      |

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

::READ `$PROJECT/knowledge/design/records.md` — Full design: public API with examples, internal contracts, decomposition.

::READ `$PROJECT/knowledge/overview-records.md` — Records overview: purpose, use cases, responsibilities, dependencies.

::READ `$PROJECT/knowledge/components.md` — Components and relationships; Records status under Core Libraries.

::READ `$PROJECT/_guide.md` — Conventions indexes (TypeScript, Unit Tests) and operating instructions.

## Scope

Implement `@art-js/records` in `$PROJECT/libs/records/` exactly as specified by `knowledge/design/records.md`:

1. **Record model** — `ArtRecord{name}` (`name` = whole heading text; **no kind** — CEO decision 2026-10-14); `createArtRecord(input)` builds a `SectionBlock`-shaped record from a synthetic section (name, depth, tags, children, unknown properties pass through). A record IS the section.
2. **Capsule** — `ArtRecordCapsule<T>` transporting identity and its `ArtDocumentSource`; an injectable `capsuleFactory` so internal APIs work against the capsule interface while external APIs stay variant-agnostic.
3. **Extraction** — internal `assertRecordPresence` and `extractRecords` returning capsules with fields and examples; consumed by the facade.
4. **Write-back** — internal field-level `writeRecord` on content strings with an opt-in content-hash guard (`WriteBackOptions.guard`); preserves field order, interleaved content, and section properties.
5. **Proxy and facade** — `FieldResolver` (`resolveField`, `setField`, `renameField`, `deleteField`); `createProxyObject` routes `name` (read-only), section properties (`depth`, `tags`) directly to the block, and fields to the resolver; `Records` facade (`assertPresence`, `extract`, `update` = guarded, `serialize` = unguarded) accepts an optional `capsuleFactory`.
6. **Documentation** — README usage section, records-specific package guide, knowledge status/doc refresh.

The codec contracts consumed here (`ArtCodec`, `ArtContentSource`, `ArtDocumentSource`) are declared in `@art-md/primitives` upstream in `$ART_MD`; no codec implementation work happens in this plan. Design authority is `$PROJECT/knowledge/design/records.md`; overview is `$PROJECT/knowledge/overview-records.md`. Downstream adoption stays in `$ART_WORK` (`plan-art-work-cli-global-install`); `$ART_LIB`'s adapter is decoupled from this package — it imports `ArtContentSource` from `@art-md/primitives` only (whiteboard verdict 2026-10-13).

## Execution Context

Implementation is performed in `$PROJECT` on branch `main` via delegation (self-contained instruction files; worker reports land next to the instructions). Iteration 4 may be executed inlined with a chat report.

---

## Unit Tests

Unit tests to create in `$PROJECT/libs/records/` (one suite per module):

- `src/record/` — `ArtRecord{name}` identity: `createArtRecord(block)` returns `{name: block.name}` (whole heading text) verbatim; `createArtRecord({name, depth, tags, children})` builds a `SectionBlock`-shaped record; unknown properties pass through.
- `src/capsule/` — `ArtRecordCapsule`: exposes identity via `_id` before source hydration; exposes the record via `_maybeRecord`/`raw()` after hydration; `_source` is the `ArtDocumentSource`; capsule factory produces capsules and accepts an existing record.
- `src/extract/` — presence assertion returns true/false for records present/absent in content; extraction returns one capsule per section, any depth, including field-less sections; no filtering.
- `src/write-back/` — write-back edits only the lines a mutation owns; content-hash guard: safe write refuses when content changed, unsafe write proceeds; same-name disambiguation writes back exactly one record and leaves siblings byte-identical; field order, interleaved content, and section properties preserved; new fields appended at section end; `depth` mutation re-renders the heading line.
- `src/proxy/` — `ProxyObject`: `name` returned from identity and is read-only; `depth`/`tags` read from/write to the block; fields resolve through `FieldResolver`; `setField` updates value and tracks `modifiedValue`; `renameField` preserves field order; `deleteField` removes lines. `createFieldResolver`: resolves current value, sets value + `modifiedValue`, renames, deletes.
- `src/records/` — facade round-trip: `extract` → mutate → `update`/`serialize` returns content with the change applied and untouched records preserved; `createRecords` accepts an optional `capsuleFactory`; `serialize` on a new file emits `## Checkout: Art Work` verbatim via `codec.serialize` (Option A, no fallback emitter; gate = constructs release carrying `delete-kind-from-code`).

---

## Items:

| Iteration / Instructions                       | Status  |
| ---------------------------------------------- | ------- |
| Iteration: Implement Record Model              | `READY` |
| Iteration: Implement Extraction and Write-Back | `READY` |
| Iteration: Implement Proxy and Field Resolver  | `READY` |
| Iteration: Implement Records Facade            | `READY` |
| Iteration: Document Records Usage              | `READY` |

### Iteration: Implement Record Model

**ID:** `implement-record-model`

**Status:** `READY`

**Purpose:** Land the identity and transport foundation every other module builds on.

**Description:** Add the `@art-md/primitives` and `@art-md/constructs` dependencies; implement `src/record/` (identity + synthetic factory) and `src/capsule/` (capsule + injectable factory) with unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-record-model.md`

**Changes:**

- Add `@art-md/primitives@0.0.3` and `@art-md/constructs` to `$PROJECT/libs/records/package.json` dependencies — **constructs pin bumped to the release carrying `delete-kind-from-code`** (see Blockers; `SectionBlock`/`FieldBlock`/`FieldInline` live in constructs, not primitives — `ART_MD` audit finding 1).
- Create `src/record/types.ts` — `ArtRecord{name: string}` (`name` = whole heading text).
- Create `src/record/createArtRecord.ts` — `createArtRecord(input: SectionInput): ArtRecord` where `SectionInput` is the full section shape (`name` required; `depth`, `tags`, `children`, and unknown properties pass through). **No parsing, no filtering, no kind** (CEO decision 2026-10-14).
- Create `src/capsule/types.ts` — `ArtRecordCapsule<T>` (`_source`, `_maybeRecord`, `_id`, `raw()`, index signature).
- Create `src/capsule/createArtRecordCapsule.ts` — `createArtRecordCapsule<T>(source, maybeRecord?)`.
- Create `src/capsule/createCapsuleFactory.ts` — `createCapsuleFactory(source, options?)` producing capsules; accepts an optional injected factory/unhydrated capsule for variant support (v0.0.1 requirement).
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

**Status:** `READY`

**Purpose:** Deliver the read and write halves of the API — presence assertion, extraction, and guarded write-back.

**Description:** Implement `src/extract/` and `src/write-back/` with unit tests; consumes the record model and capsule factory from iteration 1. These functions are internal building blocks of the facade and are **not exported** from `src/index.ts`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-extract-write-back.md`

**Changes:**

- Create `src/extract/assertRecordPresence.ts` — `assertRecordPresence(document, name)` (exact heading-text match).
- Create `src/extract/extractRecords.ts` — `extractRecords(document, factory)` returning one capsule per section, with fields and examples.
- Create `src/write-back/types.ts` — `RecordPosition` (line/column/offset ranges), `WriteBackOptions` (`guard` opt-in).
- Create `src/write-back/writeRecord.ts` — `writeRecord(content, capsule, options?)` on content strings, not the filesystem; field-level line splicing.
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

**Status:** `READY`

**Purpose:** Transparent field access — the `ProxyObject` and the default field-mapping resolver it runs on.

**Description:** Implement `src/proxy/` with unit tests; split from the facade per cross-review (proxy + resolver share `FieldResolver`; the facade depends on iteration 2, not on the proxy).

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-proxy-resolver.md`

**Changes:**

- Create `src/proxy/types.ts` — `FieldResolver` with `resolveField`, `setField`, `renameField`, `deleteField`.
- Create `src/proxy/createFieldResolver.ts` — `createFieldResolver(record)` default factory mapping record fields (`field.value`, `field.modifiedValue`); consumers must not hand-roll resolvers (whiteboard contract). `modifiedValue` is records-domain tracking state (ART_MD audit finding 3 — does not exist upstream; mutation stays here).
- Create `src/proxy/createProxyObject.ts` — `name` returned from identity (read-only); `depth`/`tags` read from/write to the block; all other accesses go through the resolver. The proxy is explicit — callers opt in by calling it.
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

**Status:** `READY`

**Purpose:** Complete the public API — the collection-level facade and the exported surface.

**Description:** Implement `src/records/` on top of iteration 2, wire `src/index.ts` per the current design, and cover with unit tests. **Option A applies:** `serialize` reaches `codec.serialize` — no hand-rolled emitter, ever (see Decisions). Its new-file test asserts the heading survives verbatim (`## Checkout: Art Work`) — against the constructs release carrying `delete-kind-from-code` (shared plan-level gate, see Blockers). If that release has not landed when everything else is done, report `BLOCKER`; do not write a fallback serializer.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-records-facade.md`

**Changes:**

- Create `src/records/types.ts` — `Records<T>` (`assertPresence`, `extract`, `update`, `serialize`).
- Create `src/records/createRecords.ts` — `createRecords<T>(source, options?: { capsuleFactory? })`.
- Update `src/index.ts` — public exports: types (`ArtRecord`, `ArtRecordCapsule`, `Records`, `RecordPosition`, `WriteBackOptions`, `FieldResolver`) and factories (`createArtRecord`, `createRecords`, `createFieldResolver`, `createProxyObject`). **Do not export** `assertRecordPresence`, `extractRecords`, `writeRecord`, `createArtRecordCapsule`, or `createCapsuleFactory` — they are internal.
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

**Status:** `READY`

**Purpose:** Make the finished package consumable and refresh the knowledge that describes it; rides along after the API is stable.

**Description:** README usage section, records-specific package guide, and knowledge status/doc refresh.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:** (inlined — the Changes below are the complete instructions; report completion in chat, no instruction file.)

::switch `agent-worker` — switch to the agent-worker agent mode before you start changing files. Self-contained rule applies: everything you need is this iteration plus its knowledge links; if a link under Mandatory Reading (plan's Knowledge section) is unreadable, REPORT A BLOCKER and STOP. Report back terse: happy face + up to 3 bullet points; the trail lives in the commit.

**Mandatory Reading:** `$PROJECT/_guide.md` · `$PROJECT/knowledge/overview-records.md` · `$PROJECT/knowledge/design/records.md` · README shaped after `$WORKSPACE/checkouts/workspace-tooling/cli/esbuild-cli/README.md`.

**Gate:** run only after `implement-records-facade` is complete (the README snippet must match real exports).

**Changes:**

- Update `$PROJECT/libs/records/README.md` — add a `## Usage` section: install; source/codec → `createRecords` → assert/extract/update/serialize examples; API notes — shaped after `$WORKSPACE/checkouts/workspace-tooling/cli/esbuild-cli/README.md` (rationale, Usage with subsections, examples against the real exports).
- Update `$PROJECT/libs/records/_guide.md` — replace bundler-adapted prose with records-specific overview, layout, records management, and operating instructions.
- Update `$PROJECT/knowledge/components.md` — refresh the Records `**Status:**` now that the implementation lands (decide target status when writing instructions; all packages currently read `SCAFFOLD`).
- Update `$PROJECT/knowledge/overview-records.md` and `$PROJECT/knowledge/design/records.md` — align with the implementation if signatures or module layout deviated.
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

**Next:** Instruction files updated (2026-10-16) to match the single-API design: public surface is `createRecords`, `createArtRecord`, `createFieldResolver`, `createProxyObject`; `assertRecordPresence`/`extractRecords`/`writeRecord` are internal. Capsule factory injection is a v0.0.1 requirement. All 5 iterations `READY`. **Posted on the whiteboard for review (goal steps 3–4):** `ART_MD` reviews instructions 1–2; `ART_LIB` + `ART_WORK` review instructions 2–4. After findings are addressed: delegate `implement-record-model` once the constructs release carrying `delete-kind-from-code` is available (GATE inside instruction 1). Board contracts: `AGREED` except `ART_MD`'s two re-proposals (`kind` removal; structural round-trip) — `✓ART_JS ✓ART_WORK`, pending `ART_LIB`.

### Blockers

- **Delegation of `implement-record-model` gated on the constructs release carrying `delete-kind-from-code`** (owner `ART_MD`; fix plan `$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md`, `PLANNING`, 3 iterations, reviewed + accepted by us 2026-10-14). The fix **deletes** `SectionBlock.kind` (heading text is never split upstream), which dissolves this blocker's original cause — `serialize` cannot drop a field that no longer exists; Option A (`serialize` reaches `codec.serialize`) stands. **Gate:** against today's `@art-md/constructs@0.0.3` the bridge would see split names and fail, so iteration 1 waits for the release where `block.name` is the whole heading text. Unblock when: `delete-kind-from-code` lands + `cli/codec-tests` 43/43 `LOSSLESS ROUNDTRIP` + pin bumped to that release (one line in instruction 1). **Instruction writing is NOT gated** (specs decided 2026-10-14). _Disclosure: `ART_MD` edited this file's `Next`/`Blockers` directly on 2026-10-14 (working-agreement break, acknowledged upstream); their substance kept, but two references they cited don't exist — `plan-fix-kind-and-roundtrip-claim` and iteration `fix-sectionblock-kind-serialization` — corrected here to the canonical `plan-drop-kind-and-reword-claims` / `delete-kind-from-code` (verified in `$ART_MD/_backlog/3-now/`)._

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

- **`kind` is being deleted from Art MD — fix plan drafted, reviewed, accepted (ART_MD, 2026-10-14)** — `plan-drop-kind-and-reword-claims` (`$ART_MD/_backlog/3-now/`, `PLANNING`, 3 iterations): parser stops splitting headings, `SectionBlock.kind` and `KIND_PATTERN` deleted, round-trip claim reworded to structural fidelity. Evidence: `## Module: Greeting` → `## Greeting` under `test-serializer`; 42/43 fixtures lossless, only kind fails. _Correction: `ART_MD`'s direct edit to this file cited `plan-fix-kind-and-roundtrip-claim` + iteration `fix-sectionblock-kind-serialization` — neither exists; canonical names verified on disk and used above._
- **`ART_MD` audit findings (2026-10-13, whiteboard)** — (1) `SectionBlock`/`FieldBlock`/`FieldInline` live in `@art-md/constructs@0.0.3`, not `primitives` — iteration 1 now adds both deps; (2) no upstream `Field` union — use `FieldBlock`/`FieldInline`; (3) `field.modifiedValue` does not exist upstream — stays records-domain (resolver tracks it); (4) heading shapes vary — superseded 2026-10-14 by the CEO kind-drop: `createArtRecord(block): ArtRecord` = `{name: block.name}`, no parsing.
- **`@art-lib/fs-records@0.0.1` exports pre-rename names** (`findRecordFiles`, `FSRecordsConfig`, `FSRecordsPath`, `searchPath`) — verified in source by `ART_LIB`; agreed names land with their iteration 1. No impact on this plan (decoupled), recorded so nobody cites `0.0.1` as carrying the agreed surface.
- **Records whiteboard converged (2026-10-13)** — `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md` (moved from workspace root): `@art-js/records` + `@art-lib/fs-records` contracts `AGREED`; `FSRecordsAdapter`/`createFSRecordsAdapter` canonical; ART_WORK confirms per-document facade + `discover`/`extract` verb split.
- **`@art-md/primitives@0.0.3` is published on npm** — `libs/records/package.json` currently declares no dependencies; iteration 1 adds it.
- **Execution environment lessons (from the design plan)** — run `npm ci` inside `$PROJECT` if package CI fails (stale `node_modules` bit twice); pre-commit runs repo-wide Prettier, so run `npm run lint:fix` before committing.
- **`libs/records` tests are vacuous today** — scaffold sets `passWithNoTests`; the first test suites here make CI meaningful.

### Decisions

- **CEO decision (2026-10-14): drop all mentions of kind from records.** `ArtRecord{name}` — `name` is the whole heading text; records performs **no parsing and no filtering**; every `SectionBlock` is a record. Kind detection, `Kind: Name` splitting, and kind→type mapping belong to consumers (a future `art-js/resources` layer). Whiteboard identity + read API bullets rewritten `AGREED` by owner authority. Acks requested from `ART_MD`/`ART_LIB`/`ART_WORK` (parking lot). Design refreshed 2026-10-16: a record IS the `SectionBlock`; `createArtRecord(input)` accepts the full section shape; the public surface is the `create...` factories (`createRecords`, `createArtRecord`, `createFieldResolver`, `createProxyObject`); `assertRecordPresence`/`extractRecords`/`writeRecord` are internal.

- **API surface refined (2026-10-16): one `create...` surface.** `assertRecordPresence`, `extractRecords`, and `writeRecord` remain as internal modules used by the facade but are **not exported** from `src/index.ts`. This removes the facade/low-level duplication and matches MANAGEMENT's "one API" requirement. Capsule factory injection is a v0.0.1 requirement (`createRecords(source, { capsuleFactory? })`), keeping the reactive variant path hidden behind the same seam.
- **Both `ART_MD` re-proposed contracts agreed (whiteboard, 2026-10-14)** — (1) shape freeze without `kind?`: `SectionBlock.name` is the whole heading text; (2) structural round-trip, not byte-identity: our `writeRecord`/`update` byte guarantee is _ours_ (line-splice on content strings; codec never invoked; non-modelled content passes byte-for-byte) and stands regardless; contract Y underwrites only `serialize` on new files. Statuses stay `PROPOSED` until `ART_LIB` + `ART_WORK` confirm.
- **Option A for `serialize` (whiteboard, 2026-10-13): `serialize(capsule)` reaches `codec.serialize` — single serializer, no hand-rolled emitter.** ART_MD's question on new-file markdown answered definitively: serialization is `@art-md`'s domain and `records` will not hold a second copy of the format (drift risk `ART_LIB` argued from the persistence side). Consequence: iteration `implement-records-facade` is gated on ART_MD's codec kind-drop fix (sequenced ahead per their offer); the iteration's test suite must include the heading-verbatim case (new file emits `## Checkout: Art Work` exactly). If the fix slips, report `BLOCKER` → `turn: FACILITATOR` — do not hand-roll.
- **Whiteboard contracts `AGREED` (2026-10-13)** — `update` = guarded write over existing content, `serialize` = unguarded for new files; line-based `RecordPosition` stands (adapter re-reads after `writeContent()`, guard covers drift); `writeRecord` is a pure line-splice preserving non-modelled content byte-identically; consumers import `ArtContentSource`/`ArtDocumentSource` straight from `@art-md/primitives` — `index.ts` exports only the package's own symbols.
- **`createFieldResolver` added as a deliverable** — field mapping is records-domain; `$ART_WORK` will not hand-roll resolvers and the adapter must not own mapping. Lands in iteration 3 next to `createProxyObject`.
- **Five iterations follow the module dependency chain** — split per cross-review (`ART_LIB` + `ART_WORK`): the former iteration 3 was three independently testable units in one commit chain; now proxy+resolver (`implement-proxy-resolver`, they share `FieldResolver`) is separate from facade+wiring (`implement-records-facade`, depends on extract+write-back, not the proxy). Phases 2–3 of the milestone still share the extract/write-back iteration; docs ride last when signatures are stable. Thin iteration 1 stays thin — deliberately not padded.
- **Iterations 1–3 use `INSTRUCTIONS_SELF_CONTAINED_FILE`** — multi-file code work needing isolated worker prompts, commit steps, and a report file trail, matching the pattern proven by `design-lib-records`.
- **Iteration 4 uses `INSTRUCTIONS_INLINED_IN_ITERATION`** — a compact four-file doc sweep whose steps fit in this plan; report happens in chat, no instruction file that merely restates its Changes.
- **Hash guard is opt-in** — `WriteBackOptions.guard` defaults off; **ProxyObject delegates unknown properties to `FieldResolver`** — both inherited from the design plan.

### Knowledge to Update

- **`$PROJECT/knowledge/components.md`** — Records status refresh after implementation (iteration 5).
- **`$PROJECT/knowledge/overview-records.md`** and **`$PROJECT/knowledge/design/records.md`** — align with the implementation if signatures or module layout deviated (iteration 5).

### Follow Ups

- ~~**Downstream adoption in `$ART_LIB`** — `add-fs-records-adapter` imports from `@art-js/records` once published.~~ **Void (2026-10-13):** `$ART_LIB`'s adapter is decoupled — it imports `ArtContentSource` from `@art-md/primitives` only and never consumes record-model symbols. No import will happen at publish; only `$ART_WORK` adopts this package.
- **Downstream adoption in `$ART_WORK`** — `plan-art-work-cli-global-install` uses records types in `WorkspaceContext` and record loaders.
- **Components status vocabulary** — decide the post-implementation status (all packages currently read `SCAFFOLD`).
- **Milestone follow-up closed** — safe-vs-unsafe write-back split resolved on the whiteboard (`update`/`serialize`). ~~ProxyObject default-vs-opt-in remains open there~~ **Not an open question** (`ART_WORK` challenge accepted 2026-10-13): nothing about ProxyObject is open in whiteboard Contracts or Pending; the consumer never asked for opt-in and a per-record proxy fits their loop. Recorded as decided: `createProxyObject` is an explicit, always-available factory — opt-in by construction (call it or use the capsule directly), no default switching.

### Feedback

- None yet.
