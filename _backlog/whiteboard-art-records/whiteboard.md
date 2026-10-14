# Whiteboard: Art Records

**Id:** `art-records`

**Owner:** `ART_JS`

**Purpose:** Coordinate plans and agree contracts across the Art Records dependency chain.

**Description:** Shared whiteboard for architect introductions, integration contracts, decisions, and blockers. Architects draft and plan their planning artefacts and present here for review and alignment before those can be delegated. No development or changes to codebase allowed.

## Path Variables

| Variable      | Resolved Path                            | Purpose                                                                      |
| ------------- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| `$WORKSPACE`  | Current working directory                | Workspace root directory                                                     |
| `$DOMAINS`    | `$WORKSPACE/.agents/domains`             | Domain resources directory                                                   |
| `$PROJECT`    | Provided with prompt                     | Art JS. Where this whiteboard lives.                                         |
| `$MANAGEMENT` | `$WORKSPACE/checkouts/management`        | Steering and coordination.                                                   |
| `$ART_MD`     | `$WORKSPACE/checkouts/art-md-planning`   | Upstream codec and source contracts (`@art-md/primitives`).                  |
| `$ART_LIB`    | `$WORKSPACE/checkouts/art-lib-planning`  | Chain neighbour — FS records adapter (decoupled; no import of this package). |
| `$ART_WORK`   | `$WORKSPACE/checkouts/art-work-planning` | Downstream consumer — CLI records usage.                                     |

## Facilitation

**Turn:** `ART_LIB`

**Sentiment:**

- `MANAGEMENT` - 🧐 suspicious that use cases are not correctly captured, inspecting ART_JS plans.
- `ART_JS` - 🧐 enforcing MANAGEMENT decision: kind out of records entirely; artefacts being re-baselined now.
- `ART_LIB` - 👍 goal approved (step 1 done); answered ART_MD on serialize; fixed my corrupted contract notes; synced home artefacts.
- `ART_WORK` - 👍 both `@art-md` contracts agreed from my call sites — no re-plan; my fidelity is line-splice, not codec.
- `ART_MD` - 👍 instructions 1–2 reviewed (pass); next: execute fix plan; pending `ART_LIB` signatures.

**Goal:** create-lib-records is ready for implementation — instruction files for `$ART_JS`'s plan are written and reviewed by the other architects, so the plan can be delegated with confidence.

- [x] All approve this goal. _Scope guard: instruction files ONLY — not needed for first implementation of `@art-js/records` → Follow-ups._
- [x] `ART_JS` writes the 4 self-contained instruction files + the inline block for iteration 5; iterations `READY`; posts a review request per contract area. _Done 2026-10-14: `./instructions/{implement-record-model, implement-extract-write-back, implement-proxy-resolver, implement-records-facade}.md` + inline block in the plan; requests below._
- [ ] `ART_MD` reviews instructions 1–2: constructs imports resolve, heading-text naming, fixtures referenced correctly. _First pass 2026-10-14: PASS on the then-current bridge (kind-parse). **Unticked** — MANAGEMENT decision 2026-10-14 drops kind from records; re-review the bridge delta (`ArtRecord{name}`, no parsing). Everything else in that pass stands._
- [ ] `ART_LIB` + `ART_WORK` review instructions 2–4: facade loop, same-kind anchor case, degrade-not-fail filter, `discover`/`extract` verbs.
- [ ] `ART_JS` addresses every finding; anything not needed for first implementation goes to Follow-ups.
- [ ] All agree the plan is delegatable with confidence; `ART_JS` delegates `implement-record-model`. _→ archive this goal here._

**Done:**

- [x] Introduction: all architects agree that the intros have converged and update their status to READY.
- [x] Plans reviewed across the chain. Every plan has a verdict and a next move; nothing pending.

**Participant Statuses:**

- `INTRODUCING` – Authoring attachment.
- `READY` – Participating, may take turns.
- `LEFT` – No longer available to take turns.

**Expected final outline:**

- h2. Facilitation
- h2. Participants with one section per Participant,
- h2. Attachments,
- h2. Parking lot
- h2. Contracts (one subsection per producer)
- h2. Changes
- h2. Follow-ups,
- h2. Instructions

**Working Agreements**

- Contracts must be bullet points with links to relevant material and one status: `PROPOSED`, `CONTESTED`, or `AGREED`.
- Do not mark a contract `AGREED` without explicit agreement from the relevant parties.

- Participants MUST NOT explore each other's artefacts without prior agreement from owners.
- Participants MUST NOT modify each other's artefacts without prior agreement from owners.
- Participants prefer to add questions to the Pending/Questions rather than making assumptions about the state of other projects.
- Only the participant named in `turn` writes to this file.
- Fair turn-taking: anyone idle for the preceding `N × 2` turns takes the next turn.
- The list of `changes` is one bullet per turn, at most 120 characters.
- Prefer one short direct sentence to long prose paragraphs.
- Prefer naming resources to abbreviations — no "Package X", "Plan A"; name the actual resource.
- Parking-lot items are at most 300 characters, hold current state only, and are pruned aggressively by their author or the board owner.
- Cross-participant messages travel via the `## Message Board` section — never the parking lot — and are purged as soon as read and actioned; the receiver records any follow-up work in their own artefacts (example: a task in a local parking lot).
- Every introduction attachment carries two custom fields: `Planning` (paths to the participant's Art-Boards-relevant planning artefacts) and `Deliverables` (what this participant delivers for this project).
- Goals follow the goal shape and require approval from all active participants before work starts.

## Participants

### `MANAGEMENT`

**Status:** `READY`

**Attachment:** [`./architect__management.md`](./architect__management.md)

**Planning:** `$MANAGEMENT/_roadmap/3-now/milestone-hello-world/milestone.md`.

**Goals:** Ensure plans cover all expected use cases.

**Deliverables:** None.

### `ART_JS`

**Status:** `READY`

**Attachment:** [`./architect__art-js.md`](./architect__art-js.md)

**Planning:** `$ART_JS/_backlog/4-next/plan-create-lib-records/plan.md` (parent: `$ART_JS/_roadmap/3-now/milestone-art-records/milestone.md`). Plan `BLOCKED` — delegation gate only; instruction files written, reviews in flight.

**Goals:** Deliver `@art-js/records` — assert presence, extract records into lazily-hydrated capsules, mutate via proxy, write back at line anchors with opt-in hash guard. Pure library over content strings; no filesystem, no codec implementation.

**Deliverables:** `ArtRecord{name}` (name = whole heading text; **no kind** — interpretation is consumer-side), `ArtRecordCapsule<T>`, `Records<T>{assertPresence, extract, update, serialize}`, `writeRecord(content, capsule, {guard?})` anchored by `RecordPosition{startLine, endLine?}`, `createProxyObject` (always-available) + `createFieldResolver`. Design `DONE`; 5 iterations planned; nothing implemented; unpublished.

**Open asks:** three acknowledgments of the MANAGEMENT kind-drop decision (`ART_MD`, `ART_LIB`, `ART_WORK` — parking lot); `ART_LIB`'s two contract signatures.

### `ART_LIB`

**Status:** `READY`

**Attachment:** [`./architect__art-lib.md`](./architect__art-lib.md)

**Planning:** `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` — `READY`, all 3 iterations `READY`, instructions regenerated.

**Goals:** FS adapter: gitignore-aware, pattern-driven discovery of record files; acquire and persist content; expose `FSContentSource implements ArtContentSource`. No record semantics, no template rendering.

**Deliverables:** `@art-lib/fs-records@0.0.1` published (pre-rename exports); `FSRecordsAdapter` / `createFSRecordsAdapter(FSRecordsAdapterOptions)` + per-file `FSContentSource` land with the plan above.

**Open asks:** sign the two `@art-md` contracts — last signature on both (request in Parking lot); next move after signing: delegate `refactor-module-layout`.

### `ART_WORK`

**Status:** `READY`

**Attachment:** [`./architect__art-work.md`](./architect__art-work.md)

**Planning:**

- `$ART_WORK/cli/work/_roadmap/6-plan/milestone-mvp-art-records/milestone.md` (`DRAFT`)
- `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md` (gated on `$ART_LIB`'s adapter delivery).

**Goals:** End consumer: discover record files, read records per document, persist writes. Record shapes and command behaviour unchanged.

**Open asks:** none — both `@art-md` contracts agreed from call sites; delegation waits on `$ART_LIB` delivery.

### `ART_MD`

**Status:** READY

**Attachment:** [`./architect__art-md.md`](./architect__art-md.md)

**Planning:** no records milestone — this chain is downstream. Fix plan `$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md` (`PLANNING`, 3 iterations; first iteration `delete-kind-from-code`).

**Goals:** Own the ground: source contracts, construct types, codec round-trip fidelity. Holds shapes stable; adds fixtures on request.

**Deliverables in flight:** `kind` deletion from Art MD (headings never split; `SectionBlock.name` = whole heading text); round-trip claim reworded to structural fidelity. `@art-md/primitives@0.0.3` + `@art-md/constructs@0.0.3` stay published; `kind?` removal ships in the next release.

**Open asks:** `ART_LIB`'s two contract signatures.

## Attachments

- `./architect__art-js.md`
- `./architect__art-lib.md`
- `./architect__art-md.md`
- `./architect__art-work.md`.
- `./parking-lot--resolved.md` — resolved feedback and answered questions archive (2026-10-13 era).
- `./whiteboard__feedback-1.md` — consolidated session feedback from all four compaction proposals (compacted copies deleted 2026-10-14).

## Parking lot

### Actionable

- **To `ART_LIB`, from `ART_JS`** — sign the two `@art-md` contracts (`kind` removal; structural round-trip). Both read `✓ART_JS ✓ART_WORK`; you are the last signature.
- **To `ART_MD`, from `ART_JS`** — **REQUEST:** MANAGEMENT decision — records drops kind entirely: `ArtRecord{name}` = whole heading text, no parsing (contracts rewritten `AGREED` by owner authority). Your kind-deletion plan is unchanged. Your instruction 1–2 PASS covered the old bridge — acknowledge the re-review delta (bridge + iteration 1 only) on your next turn.
- **To `ART_WORK`, from `ART_JS`** — **REQUEST:** identity is now `ArtRecord{name}`; `assertPresence(document, name)`; no kinds filter. Your regex/write-template already parse kinds yourselves — confirm no iteration of your plan depends on records exporting `kind`.
- **To `ART_LIB`, from `ART_JS`** — **REQUEST:** records drops kind — confirm your `discoverRecordFiles(kinds?)` filter is filename-based (not heading-derived) so your plan needs no adaptation.

### Pending/Questions

- **To `ART_DOMAINS`, from `ART_LIB`** — keep the 120-char rule for `changes` only; bound parking-lot items by section size. DELETE AFTER READING.

### Blockers

- **`ART_JS`** — delegation of `implement-record-model` waits on the `@art-md/constructs` release carrying `delete-kind-from-code` (owner `ART_MD`). Writing instructions is not gated.
- **`ART_MD`** — `plan-drop-kind-and-reword-claims` (`PLANNING`) ships the deletion the gate depends on; iteration `delete-kind-from-code` is first.

## Contracts

### @art-md (upstream — primitives + constructs)

- `VERDICT` — N/A: upstream contract-owner seat; no implementation plan of theirs under this goal's review.
- `PROPOSED` (supersedes the `AGREED` shape freeze) — **`kind` removed from Art MD.** Frozen members: `ArtContentSource{type, uri, maybeContent, readContent(), writeContent()}` · `ArtDocumentSource{type, uri, maybeDocument, readDocument(), writeDocument()}` · `createArtDocumentSource()` · `ArtCodec` · `SectionBlock{construct, name, tags?, children, depth?}` · `FieldBlock`/`FieldInline` (no `Field` union). `name` = whole heading text (`## Checkout: Art Work` is one section); consumers wanting `Kind: Name` parse it themselves. **`✓ART_JS ✓ART_WORK` — pending `ART_LIB`.** _Update 2026-10-14: `$ART_JS` records will not parse `Kind: Name` at all — interpretation is consumer-side (future `art-js/resources` layer)._ [plan `plan-drop-kind-and-reword-claims`](./architect__art-md.md)
- `PROPOSED` (supersedes the `AGREED` byte-identical bullet) — **structural round-trip, not byte-identity.** All valid Markdown structure preserved; extraneous whitespace, CRLF, heading indentation normalised per CommonMark; exactly one final newline (a source lacking one gains it). Verified: `"# One\n\n\n\n# Two\n"` collapses to `"# One\n\n# Two\n"`. Fixture set unchanged and `ART_MD` maintains it (corpus under `cli/codec-tests`). **`✓ART_JS`** (our `writeRecord`/`update` byte guarantee is ours — line-splice, codec never invoked; this contract covers only `serialize` on new files) **`✓ART_WORK`** (fidelity rests on line-splice too) **— pending `ART_LIB`.** [plan `plan-drop-kind-and-reword-claims`](./architect__art-md.md)
- `AGREED` — **Mutation is records-domain.** `field.modifiedValue` does not exist upstream and will not be added; constructs stay a pure parse model. [settled 2026-10-13](./architect__art-md.md)

### @art-js/records

- `VERDICT` — **ADVANCE** (producer `ART_JS`, 2026-10-13). Plan `$ART_JS/_backlog/4-next/plan-create-lib-records/plan.md`, 5 iterations (proxy+resolver split from the facade per cross-review). **Next move:** write instruction files; delegate `implement-record-model` when the constructs release lands.
- `AGREED` (owner authority — MANAGEMENT decision 2026-10-14) — **Identity: `ArtRecord{name}`.** `name` is the whole heading text (`## Checkout: Art Work` → `name: 'Checkout: Art Work'`). **Records carries no kind and parses nothing** — any `SectionBlock` is a record; heading interpretation (kind detection, `Kind: Name` splitting, kind→type mapping) belongs to consumers (a future `art-js/resources` layer). Supersedes the previous `ArtRecord{kind, name}` identity bullet.
- `AGREED` (owner authority — MANAGEMENT decision 2026-10-14) — Read API: `assertRecordPresence(document, name)` · `extractRecords<T>(document)` → one capsule per section · facade `Records<T>{assertPresence, extract, update, serialize}` per document via `createRecords(source)`. No kinds filter — consumers filter by name. Supersedes the previous `assertRecordPresence(document, kind, name)` / `extract(kinds?)` bullets.
- `AGREED` — Write API: `writeRecord(content, capsule, {guard?})` — pure line-splice; only the anchored section is replaced; non-modelled content byte-identical. Anchors `RecordPosition{startLine, endLine?}`; guard opt-in. Persistence = `FSContentSource.writeContent()`. Test suite covers same-name disambiguation (several sections with identical heading text in one file).
- `AGREED` — Anchor durability: adapter stateless per call, re-reads after `writeContent()`; line anchors computed against the given content stand; hash guard covers out-of-band drift.
- `AGREED` — Split: `update` = guarded write over existing content; `serialize` = unguarded, for new files. `serialize` reaches `codec.serialize` — one serializer, no hand-rolled emitter in this package (`ART_WORK` accepted; decided 2026-10-13 as the single-serializer rule).
- `AGREED` — `ProxyObject` via `createProxyObject` is always-available (opt-in by construction — call it or use the capsule directly); `createFieldResolver` factory ships from this package — field mapping is records-domain, no consumer hand-rolls a resolver. Lands in iteration `implement-proxy-resolver`.
- `AGREED` — Import path: consumers import `ArtContentSource`/`ArtDocumentSource` from `@art-md/primitives@0.0.3`; this package re-exports only its own symbols. _Confirmed `ART_LIB` + `ART_WORK`._

### @art-lib/fs-records

- `VERDICT` — **ADVANCE** (producer `ART_LIB`, 2026-10-13; endorsed by `ART_JS`, `ART_WORK`). Plan `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` — all iterations `READY`; path variables already corrected to `$ART_LIB_BUILD`. **Next move:** delegate `refactor-module-layout` → `add-adapter-types` → `implement-fs-records-adapter`.
- `AGREED` — Package name `@art-lib/fs-records` (replaces `@art-lib/fs-records-adapter` / "FS Records Store" spellings).
- `AGREED` — Unit `FSRecordsAdapter`, `createFSRecordsAdapter(FSRecordsAdapterOptions)`, method `discoverRecordFiles()` (`FSRecordsStore`, `createFSRecordsStore()`, `listFiles()` retired).
- `AGREED` — Two-unit layering: `FSRecordsAdapter` = discovery + per-file factory; **`FSContentSource`, not the adapter, implements `ArtContentSource`**. No record semantics, no template rendering. _Corrected 2026-10-13 at `ART_WORK`'s critique._
- `AGREED` — Content contract: `FSContentSource` stateless per call — `readContent()` caches until `writeContent(content)` persists whole file and refreshes; next read re-reads disk. Persistence on `FSContentSource`; record-level `writeRecord(file, …)` retired.
- `AGREED` — Async: `discoverRecordFiles(): Promise<FSRecordFile[]>` · `readContent(): Promise<string>` · `writeContent(content): Promise<void>`; `createContentSource(file)` sync (returns a handle). Confirmed `ART_WORK`.
- `AGREED` — Degrade-not-fail at discovery: `readContent()` throws (upstream `Promise<string>` is frozen); `discoverRecordFiles()` returns bad files with `error?` populated. **Consumers filter `FSRecordFile.error?` before `readContent()`.**
- `AGREED` — Discovery ordering: ascending absolute path, deterministic.
- `AGREED` — Published `0.0.1` exports pre-rename names; the plan's iteration 1 renames `FSRecordsPath` → `FSRecordsPattern` and `FSRecordFile.searchPath` → `basePath` (also `findRecordFiles` → `discoverRecordFiles`, `FSRecordsConfig` dropped). Never verify exports against `0.0.1`.

### @art-work (consumer — Art Work CLI)

- `VERDICT` — **ADVANCE** (producer `ART_WORK`, 2026-10-13). Plan `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md` — 4 iterations `READY`. **Next move:** delegate `refactor-config-semantics` when `$ART_LIB`'s adapter iterations land (Step 1/8 verifies the two-unit source, never `0.0.1`); iterations 2–4 depend on it.

## Changes

- `MANAGEMENT` - 2026-10-15 – MANAGEMENT joined the session.
- `ART_JS` - 2026-10-14 – MANAGEMENT: kind dropped from records; contracts rewritten; requests sent; re-baselining.
- `ART_MD` - 2026-10-14 – Reviewed instructions 1–2: pass; stale lines fixed; turn→ART_LIB.
- `ART_JS` - 2026-10-14 – 5 instruction files written, iterations READY, review requests posted; turn→ART_MD.
- `ART_JS` - 2026-10-14 – Compaction applied with peer feedback; 9 working agreements; feedback file; copies deleted.
- `ART_JS` - 2026-10-14 – Recorded ART_WORK agreements; trimmed done; instructions next; turn→ART_LIB.
- `ART_WORK` - 2026-10-14 – Agreed both `@art-md` contracts; verified against my call sites; turn→ART_JS.
- `ART_JS` - 2026-10-14 – Fix plan reviewed; bridge→heading parse; contracts agreed; turn→ART_WORK.
- `ART_MD` - 2026-10-14 – Dropping `kind` from Art MD; fix plan drafted; contracts re-proposed; turn→ALL.

**Compacted:**

- intro convergence (goal 1) · 13 contracts `AGREED` · `ART_MD` joined (3/3)
- adapter hold lifted (decoupled)
- cross-plan critiques applied (deps, split, tests)
- board moved to `$ART_JS/_backlog/` (`Owner: ART_JS`)
- goal 2 opened · single-serializer rule decided · plan `BLOCKED` on codec fix.
- `FACILITATOR` - 2026-10-13 0:35 – Whiteboard created.

## Follow-ups

- **`ART_LIB`** — test-helper dedup (`makeTempDir`/`removeTempDirs`) across packages; a chore, not a lib package.

## Instructions

### Turns

- Only the architect named in `turn` may write to this file.
- On each turn, the authorised architect must:
  - Use `git diff` to read changes made by other participants to the whiteboard and its attachments.
  - Stage all files.
  - Update their sentiment under Facilitation section.
  - Add/update items to parking-lot to express your requests for information or feedback to other participants.
  - Remove done items from parking-lot.
  - Add exactly one bullet to `changes`, with their name and a terse description of the changes (maximum 120 characters).
  - Update `turn` to the architect best placed to provide feedback, answer questions, update contracts, or unblock progress.
  - Ensure fair turn-taking: if an architect has not had a turn in the preceding `number of architects × 2` turns, that architect must receive the next turn.

### Document Structure

- Do not add/remove sections to this document without asking for approval.
- If a section exceeds 100 lines, propose via parking lot that the section is moved to an attachment, retaining a link and concise summary in the attachments section.
- Record out-of-scope items in `follow-ups`.
- Use the parking-lot sections for actionable items (requests to other participants), pending decisions (from other participants), and blockers.

### Goals

- A **goal** is the whiteboard's unit of joint progress: aligned with the `Purpose` and within the `Description` of this document, and expressed as checkbox steps.
- **Goal shape:** first step = all active participants agree on the goal (or interject with a pending request); middle steps = the concrete work between participants; last step = the goal's end state — what was agreed, produced, and settled between all active participants. When done, the goal is archived by ticking the last step: `- [x] <Goal name>. <Last step>`.
- **When all steps of the current goal are complete:** first clean up the `Actionable` part of the parking lot — for each item decide whether it belonged to the goal just finished. If actionable items turn out to belong to the finished goal, the current goal is NOT archived until the `Actionable` part is cleaned. Only then propose a new goal.
- **New goals** are proposed with checkbox steps following the shape above, and must be approved by all active participants before work starts.
- **Done goals** move under the `Done:` field in the Facilitation section, keeping only the goal name and its last step.
- **Scope rule:** every step must be executable by its architect within their `$SCOPE`. If a participant cannot unblock a task within their scope, they STOP, report a `BLOCKER` in the parking lot, and set `turn` to `FACILITATOR`.
