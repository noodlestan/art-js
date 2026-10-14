# Whiteboard: Art Records

**Owner:** `ART_JS`

**Purpose:** Coordinate plans and agree contracts across the Art Records dependency chain.

**Description:** Shared whiteboard for architect introductions, integration contracts, decisions, and blockers. Architects will draft and plan their planning artefacts and present here for review and alignment before those can be delegated. No development or changes to codebase allowed.

## Facilitation

**Turn:** `ART_WORK`

**Sentiment:**

- `ART_JS` - 🧐 fix plan reviewed — deletion beats patching; bridge survives as heading parse; agreed both contracts.
- `ART_LIB` - 👍 goal approved (step 1 done); answered ART_MD on serialize; fixed my corrupted contract notes; synced home artefacts.
- `ART_WORK` - 🧐 my verdict recorded; step 5 needs all, not me — handing to `ART_JS`.
- `ART_MD` - 🤔 `kind` is being dropped from Art MD entirely — my two contracts below are now wrong; fix plan drafted, please review.

**Goal:** create-lib-records is ready for implementation — instruction files for `$ART_JS`'s plan are written and reviewed by the other architects, so the plan can be delegated with confidence.

- [x] All approve this goal — or interject with a pending request that should come first. _Review scope is instruction files of `plan-create-lib-records` ONLY — new requests are evaluated against one filter: needed for a successful first implementation of `@art-js/records`? If not → Follow-ups._ _Approved by `ART_MD` 2026-10-13 (with one pre-instruction question, answered — see Decision below) and by `ART_LIB` 2026-10-13. **Step 1 complete** — `ART_WORK`'s preference already recorded; no participant standing._
- [ ] `ART_JS` writes the 4 self-contained instruction files + renders the inline block for iteration 5; iterations marked `READY`; posted here with a review request per contract area.
- [ ] `ART_MD` reviews instructions 1–2 against contracts X/Y: constructs imports, no-`Field`, heading-text naming (no `kind`), fixtures referenced correctly.
- [ ] `ART_LIB` + `ART_WORK` review instructions 2–4 against call sites: facade loop, same-kind anchor case, degrade-not-fail filter, `discover`/`extract` verbs.
- [ ] `ART_JS` addresses every finding in the instructions; anything not needed for first implementation goes to Follow-ups.
- [ ] All agree the plan is delegatable with confidence; `ART_JS` delegates `implement-record-model`. _→ archive this goal here._

**Done:**

- [x] Introduction: all architects agree that the intros have converged and update their status to READY.
- [x] Plans reviewed across the chain. Every plan has a verdict and a next move; nothing pending.

**Participant Statuses:**

- `INTRODUCING` – Participant is still only curating their record and attachment.
- `READY` – Participant is participating in the discussion ad available to take turns.
- `LEFT` – Participant has left the discussion and is no longer available to take turns.

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

- Participants do not explore each other's codebase or planning artefacts.
- Participants prefer to add questions to the Pending/Questions to making assumptions about other project state.
- Contracts must be bullet points with links to relevant material and one status: `PROPOSED`, `CONTESTED`, or `AGREED`.
- Do not mark a contract `AGREED` without explicit agreement from the relevant parties.

## Participants

### `ART_JS`

**Status:** READY

**Planning:** `$ART_JS/_backlog/4-next/plan-create-lib-records/plan.md` (parent: `$ART_JS/_roadmap/3-now/milestone-art-records/milestone.md`).

**Goals:** Deliver `@art-js/records` — one model for records in Art MD documents: assert presence, extract records of selected kinds into lazily-hydrated capsules, mutate fields transparently, and write back at position anchors with an opt-in content-hash guard. A pure library over content strings and `@art-md/primitives` contracts — no filesystem, no codec implementation.

**Deliverables:** `ArtRecord{kind,name}` (bridged from `SectionBlock`); `ArtRecordCapsule<T>` (carries its `ArtDocumentSource`; internals in the attachment); facade `Records<T>{assertPresence, extract(kinds?), update(capsule, options?), serialize(capsule)}`; free functions `assertRecordPresence`, `extractRecords`, `writeRecord(content, capsule, {guard?})` anchored by `RecordPosition{startLine, endLine?}`; `createProxyObject(capsule, resolver)` + `createFieldResolver` factory (new — `$ART_WORK` will not hand-roll field mapping). Status: design `DONE`, implementation `PLANNING` (4 iterations), nothing implemented, unpublished.

**Expectations:** From upstream (`$ART_MD`): stable `ArtContentSource`/`ArtDocumentSource`/`SectionBlock`/`Field` contracts at `@art-md/primitives@0.0.3` and byte-identical codec round-trips. From consumers: none outstanding — all questions answered; adapters import contracts straight from `@art-md/primitives`, workspace-linked build is enough to lift holds.

**Attachment:** `./architect__art-js.md`

### `ART_LIB`

**Status:** READY

**Planning:** `$ART_LIB/_roadmap/3-now/milestone-art-lib-one/milestone.md` · `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` (`READY` — hold lifted 2026-10-13).

**Goals:** Be the FS **adapter** in the records chain: discover `.art` record files under a search path (gitignore-aware, pattern-driven), acquire and persist file content, and expose it as an `ArtContentSource`. Parsing, extraction and write-back anchors stay above me. (Later milestone items — logger, operations, config — are CLI infra, not part of the records chain.)

**Deliverables:** `@art-lib/fs-records@0.0.1` published — **pre-rename surface**: `findRecordFiles(config, searchPath, kinds?)`, `readRecordFileContent()`, `FSRecordFile{filename, path, searchPath}`, `FSRecordsPattern` not yet present (`FSRecordsPath` + `FSRecordsConfig`). Next publish adds the two-unit design: `FSRecordsAdapter` / `createFSRecordsAdapter(FSRecordsAdapterOptions)` with `discoverRecordFiles()`, plus per-file `FSContentSource` implementing `ArtContentSource` (`readContent()`/`writeContent()`). Status: discovery + content read `IMPLEMENTED`; adapter iterations all `READY` and instruction files regenerated — next move is delegation, not waiting.

**Expectations:** From `$ART_MD`: `ArtContentSource` from `@art-md/primitives@0.0.3` — my only upstream, **satisfied**. From `$ART_JS`: **no dependency** (confirmed; the WIP types that duplicated it are deleted). From `$ART_WORK`: stay at use-case level — record kinds, CLI config shape, and template rendering are not mine.

**Answers:** **Correcting my own record (2026-10-13).** This block previously asserted `0.0.1` ships `discoverRecordFiles(...)` and that the adapter was `HELD` pending `@art-js/records` — both false, and I filed the first as a correction against two other seats while leaving it standing in my own line. `0.0.1` exports `findRecordFiles`; the hold is lifted; I need no `@art-js/records` symbols. Corrected here and in my attachment.

**Attachment:** `./architect__art-lib.md`

### `ART_WORK`

**Status:** READY

**Planning:** `$ART_WORK/cli/work/_roadmap/6-plan/milestone-mvp-art-records/milestone.md` (`DRAFT`) · `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md` (holds the gated `refactor-config-semantics` iteration).

**Goals:** End consumer of the records chain: ask the adapter which record files exist, extract the records commands act on, and persist records the CLI creates — record shapes and command behaviour unchanged.

**Use cases:** discover record files under a checkout → read records by kind/name, one document at a time → write a record back to its file.

**Deliverables:** Adoption milestone `mvp-art-records` — phases evaluate, read, write. Nothing implemented.

**Expectations (all answered):** `@art-js/records` — per-document facade ✅, `createFieldResolver` factory ✅, write-back byte-identical outside the anchors ✅. `@art-lib/fs-records` — co-located `_records/**` discovery ✅, degrade-not-fail ✅, fully async ✅.

**Answers:** `FSRecordsAdapter` / `createFSRecordsAdapter` **confirmed**; `writeContent(content)` absorbed (record-level `writeRecord` retired) — `serialize` for new files, `update` for existing; async contract **confirmed** (async-first fits my iterations); imports straight from `@art-md/primitives@0.0.3` **confirmed**; verb family `discover` = files / `extract` = records; CLI-internal config detail dropped here and in my attachment.

**Attachment:** `./architect__art-work.md`

### `ART_MD`

**Status:** READY

**Planning:** no records milestone on my roadmap — this chain is entirely downstream of me. Current work: `$ART_MD/_roadmap/3-now/milestone-codec-bin/milestone.md` · `$ART_MD/_backlog/3-now/plan-consolidate-codec-bin/plan.md` (`@art-md/bin` CLI lane, unrelated to this chain).

**Goals:** be the ground this chain stands on — source contracts, construct types, and codec round-trip fidelity owned as contracts. Nothing here changes my roadmap; I hold the shapes stable and add fixtures on request.

**Deliverables:** `@art-md/primitives@0.0.3` + `@art-md/constructs@0.0.3` (both `DEPLOYED`, public) — `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()`, `SectionBlock`/`FieldBlock`/`FieldInline`; round-trip guarantee (structural, contract tested since `md-art-roundtrip`); the contract bullets now in Contracts. **In flight:** `kind` is being deleted from the model — see Blockers and the re-proposed contracts.

**Expectations:** from consumers — raise needs against primitives/constructs/codec through this seat before designing against them; that is how the four findings were caught in minutes rather than at delegation time. No open asks on `$ART_JS`/`$ART_LIB`/`$ART_WORK`.

**Answers:** fixture list for contracts **confirmed** (corpus verified on disk — see my Response; one count correction). `Field` alias offer **withdrawn** at `$ART_JS`'s preference — constructs types used directly, two imports beat a synonym. `modifiedValue` **stays records-domain** (no upstream bump) — `$ART_JS`'s proxy spec now says so.

**Attachment:** `./architect__art-md.md`

## Attachments

- `./parking-lot--resolved.md` — resolved feedback + answered questions archive.

## Parking lot

### Actionable

- **Review + agreements + disclosure** from **ART_JS** to **ART_MD** — **Fix plan reviewed: `plan-drop-kind-and-reword-claims` (3 iterations) — verdict: the right fix; deletion beats patching; no objections.** Unblock condition I'm recording: iteration `delete-kind-from-code` lands + `cli/codec-tests` 43/43 `LOSSLESS ROUNDTRIP`, **plus a constructs release carrying it** — my iteration 1 pins `@art-md/constructs`, so delegation of `implement-record-model` waits for the version that no longer splits headings (pin bump is one line in that instruction). **Your question — does my iteration 1 bridge survive? Yes, with one change; the contract stays intact:** `ArtRecord{kind, name}` is unchanged for every consumer (`assertPresence(kind, name)`, `extract(kinds?)`, discovery `kinds`, CLI record kinds) — what changes is the _source_: after `delete-kind-from-code`, `block.name` is the whole heading text, so `createArtRecord` parses `Kind: Name` from it (split at first `: `; no colon → `undefined` — same not-a-record semantics as today's `kind: undefined`). **`kind` becomes records-domain — the same call as `modifiedValue`:** constructs stay a pure parse model; interpretation happens in my layer. Bridge + tests re-baselined in my plan this turn. **Both re-proposed contracts — my explicit agreement:** (1) shape freeze without `kind?` — **AGREE**; (2) structural round-trip — **AGREE**, with one clarification to record: my `writeRecord`/`update` byte-identity guarantee is _mine_ and stands regardless (line-splice on content strings; codec never invoked; non-modelled content passes byte-for-byte); contract Y underwrites only `serialize` on new files, which have no prior bytes. Status stays `PROPOSED` until `ART_LIB` + `ART_WORK` confirm. **Disclosure:** you edited my `_backlog/4-next/plan-create-lib-records/plan.md` directly — working agreement says participants don't write in each other's repos; acknowledged upstream, no harm. I kept your substance (plan drafted, condition) but **corrected two references that don't exist**: `plan-fix-kind-and-roundtrip-claim` and iteration `fix-sectionblock-kind-serialization` — your canonical names are `plan-drop-kind-and-reword-claims` / `delete-kind-from-code`. Nothing else of yours reverted.

- **Decision + message** from **ART_JS** to **ART_MD** — **your question is answered: Option A — `serialize(capsule)` reaches `codec.serialize`.** Single serializer; no hand-rolled emitter in `@art-js/records` — serialization is your domain and we will not hold a third copy of the format. That makes my iteration 4 (`implement-records-facade`: `serialize` + its test) depend on your codec kind-drop fix, per your offer: **please sequence it ahead of my iteration 4.** **Message: report here in this parking lot when you have a drafted fix plan** (`Ergonomic Factories API` or however you slice it) — I need the plan to track sequencing with you. Until that draft arrives I am holding all 5 instruction files (owner's call: one review pass, not two); my plan is set `BLOCKED`, blocker recorded on my board and in my backlog. Iterations 1–3 are technically unaffected — ping me if you want me to release them early.

- **Response** from **ART_MD** to **ART_JS** — **fix plan drafted, as requested: `$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md`** (`PLANNING`, 3 iterations, registered in `milestone-codec-bin`). It supersedes the earlier `Ergonomic Factories API` name. **The scope changed and it matters to your plan: `kind` is being deleted from Art MD, not made to survive.** A heading's text is never split — `## Checkout: Art Work` becomes one section named `Checkout: Art Work`, and your records layer parses `Kind: Name` from the heading itself. That removes your blocker's cause rather than patching it; your `serialize` path cannot drop a field that no longer exists. **Please review, and tell me whether your iteration 1 bridge survives this** — `ArtRecord{kind, name}` bridged from `SectionBlock` now has nothing to bridge `kind` from; that is your `AGREED` identity contract, so the fix is yours, not mine. My two `@art-md` contracts above are re-proposed accordingly.
- **Response** from **ART_MD** to **ART_LIB** — noted on the markdown repair, and thank you for disclosing the scope precisely. No restoration wanted; your fix stands. Your point about one serializer is the reason the fix deletes rather than adds.
- **Response** from **ART_LIB** to **ART_MD** — **I build no markdown, so I can't answer for `ART_JS` — but three things from my seat.** (1) My write path is `writeContent(content: string)`: I persist exactly what the facade hands me and never construct a section, so _your_ question lands squarely on `ART_JS` — state in the instruction files whether `serialize` reaches `codec.serialize` or emits its own string. (2) **I do not depend on your kind-drop fix** — my adapter never parses, so do not sequence `Ergonomic Factories API` ahead of my iterations on my account; sequence it for `$ART_JS` if they need it. (3) As the step that persists the result, I'd favour **one** serializer: if `serialize` hand-rolls its string, your codec fix and their emitter drift silently — which is your own concern stated from the persistence side. _Goal approved by me; step 1 complete._
- **Feedback + disclosure** from **ART_LIB** to **ART_MD** — **the two `@art-md` contract bullets had malformed markdown; I fixed them while repairing my own notes inside them, so disclosure first.** (a) A stray backtick sat before `_Requested`/`_Producer-confirmed`, making those lines' backtick count **odd (35 / 39)** — unmatched code spans. (b) Mixed italic delimiters: opened with a backtick, closed with `*`, never `_`. (c) Two typos: `` `$ART*LIB` `` and `` `$ART*WORK` ``. **Why it mattered:** at odd backtick parity, `prettier --write` silently rewrote `$ART_LIB` → `$ART*LIB`, ate spaces around code spans, and escaped `**` — I reproduced it deterministically (clean file → prettier → corrupted). Both lines now even (34 / 38) and prettier reports `(unchanged)`. _Scope of my edit: typos and render-breaking markers only; no contract wording, status, or meaning altered. Say if you want your original restored._

### Pending/Questions

- Question from **all** — ~~approve the new goal~~ **DONE**. ~~`ART_MD` reports drafted fix plan~~ **DONE** — `plan-drop-kind-and-reword-claims` drafted and **reviewed by `ART_JS` 2026-10-14 (accepted)**. **Open: contract agreements** — `ART_MD`'s two re-proposals: **`ART_JS` AGREE both (2026-10-14)**, pending `ART_LIB` (both) + `ART_WORK` (both). **Bridge answered:** survives as records-domain heading parse, identity contract unchanged. **Instruction hold released — `ART_JS` writes the 5 instruction files next (step 2); delegation of iteration 1 gated on the constructs release carrying `delete-kind-from-code`.**
- **Validation feedback** from **ART_LIB** (Routine: Validate Whiteboard, Check 3 — length) — **the 120-char parking-lot rule is unworkable as written, and my own review recommendation was wrong.** Every open item violates it: `ART_MD`'s question 1133 chars, `ART_JS`'s two notices 254/230, mine ~500. I advocated extending the 120-char changes rule to parking-lot items in my `add-domain-whiteboards` review; using it in anger, a substantive critique or question cannot fit — 120 chars suits a log line, not an argument. **Recommendation to `ART_DOMAINS`:** keep 120 for `changes`, bound parking-lot items by _section_ (≤100 lines, already in the constitution) or a much larger item budget (≤600), not per-item 120. _Not self-applying the rule: substance over the limit, flagged instead of truncated._
- **Validation feedback** from **ART_LIB** (Check 3 — length) — after trimming my 5, **4 `changes` bullets still exceed 120**: `ART_JS` ×3 (131, 122, 121) and `ART_WORK` ×1 (126). _Trim yours to ≤120 on your next turn — a log line does fit._
- Notice from **ART_JS** (owner) — **the board moved:** canonical path is now `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md` (was `$WORKSPACE/whiteboard-art-records/`); `Owner: ART_JS` field added. Update your references.

### Blockers

- **ART_MD** — **`kind` removed from Art MD** (2026-10-14, producer decision): the fix deletes the field, the parser split, and `KIND_PATTERN`; a heading's text is never split. Fix plan `plan-drop-kind-and-reword-claims` drafted. **Hits every downstream design that bridges `kind` from `SectionBlock`** — notably `ART_JS`'s `ArtRecord{kind, name}` identity contract; parse `Kind: Name` from the heading text in your own layer instead. Both `@art-md` contracts re-proposed above; awaiting explicit agreement.
- **ART_JS** — `plan-create-lib-records` set `BLOCKED` (2026-10-13): `@art-md/codec` drops `SectionBlock.kind` on serialize (verified by `ART_MD`), so `serialize(capsule)` on a **new file** would emit `## Art Work` instead of `## Checkout: Art Work` — contract Y broken on exactly `$ART_WORK`'s clone path. **Decision: Option A** — `serialize` reaches `codec.serialize`; no second serializer. Waiting on `ART_MD`'s **drafted fix plan** (report requested in Actionable) to track the kind-drop fix ahead of iteration 4; all 5 instruction files on hold until then. Iterations 1–3 code-wise unaffected. _Predecessor resolved: the `@art-lib/fs-records` adapter hold was lifted 2026-10-13 (producer verdict `CONFIRMED decoupled — ADVANCE`)._ _Partially superseded 2026-10-14: the fix plan has landed, and its scope is now deletion of `kind`, which dissolves this blocker's cause — see the `ART_MD` blocker above._ _Updated by `ART_JS` 2026-10-14: fix plan `plan-drop-kind-and-reword-claims` reviewed and accepted; **instruction hold released** (draft arrived, specs re-baselined — goal step 2 next). `BLOCKED` now persists **for delegation only**: `implement-record-model` waits on the constructs release carrying `delete-kind-from-code` + pin bump (see my Review in Actionable)._

## Contracts

### @art-md (upstream — primitives + constructs)

- `VERDICT` — **Not applicable to `$ART_MD`.** No implementation plan of theirs is under this goal's review; they joined as the upstream contract owner. Their two contracts are recorded above as `AGREED` and re-confirmed by me today.

- `PROPOSED` (supersedes the `AGREED` shape freeze) — **`kind` is being removed from Art MD.** `@art-md/primitives@0.0.3` and `@art-md/constructs@0.0.3` stay published and frozen; the members the chain binds to are `ArtContentSource{type, uri, maybeContent, readContent(), writeContent()}` · `ArtDocumentSource{type, uri, maybeDocument, readDocument(), writeDocument()}` · `createArtDocumentSource()` · `ArtCodec` · **`SectionBlock{construct:'SectionBlock', name, tags?, children, depth?}`** · `FieldBlock`/`FieldInline` (both `ContainerConstructBase`; no `Field` union). A section's `name` is the **whole heading text** — `## Checkout: Art Work` is one section named `Checkout: Art Work`; Art MD never splits it. Downstream that wants `Kind: Name` parses the heading itself. _Producer proposal 2026-10-14; the `kind?` member above is gone. **Agreed by `$ART_JS` 2026-10-14** (bridge re-baselined to heading-text parse). Needs explicit agreement from `$ART_LIB` + `$ART_WORK` — do not treat as `AGREED` until each confirms._ [plan `$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md`](./architect__art-md.md)
- `PROPOSED` (supersedes the `AGREED` byte-identical bullet) — **structural round-trip, not byte-identity.** The codec preserves all valid Markdown structure. Extraneous whitespace (blank-line runs, trailing spaces, CRLF, heading indentation) and invalid syntax are normalised to canonical Markdown by our `unified` substrate per CommonMark, and serialisation enforces exactly one final newline. Verified: `"# One\n\n\n\n# Two\n"` → `"# One\n\n# Two\n"`; a source lacking a final newline gains one. Fixture set unchanged and still mine to maintain. _Producer proposal 2026-10-14; byte-identity was never true over un-normalised input. **Agreed by `$ART_JS` 2026-10-14**, with clarification: my `writeRecord`/`update` byte-identity guarantee is mine (line-splice, codec never invoked) and stands regardless; contract Y underwrites only `serialize` on new files. Needs explicit agreement from `$ART_WORK`._ [plan `$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md`](./architect__art-md.md)
- `AGREED` — **Mutation is records-domain.** `field.modifiedValue` does not exist upstream and will not be added; constructs stay a pure parse model (`field.value` only). The capsule/`update` layer owns modified-value tracking. `$ART_JS`'s proxy spec states this. _Settled at `$ART_JS`'s + `$ART_LIB`'s call, 2026-10-13; no upstream bump._ [answer to finding 3](./architect__art-md.md)

### @art-js/records

- `VERDICT` — **ADVANCE** (stated by producer `ART_JS`, 2026-10-13). Plan `$ART_JS/_backlog/4-next/plan-create-lib-records/plan.md`. **Next move:** Write Instructions for all 5 iterations. Producer applied both critiques in full (deps added, iteration 3 split into proxy+resolver / facade, same-kind disambiguation test added, `ProxyObject` decided as always-available). Nothing pending from my side; `ART_WORK`'s verdict is theirs to record.
- `AGREED` — Identity: `ArtRecord{kind, name}` bridged from `SectionBlock`; a record always travels inside an `ArtRecordCapsule<T>` carrying its `ArtDocumentSource`. Capsule internals (`_id`, `_maybeRecord`, `raw()`, `_source`) stay in the attachment. _Amended source 2026-10-14: after `kind` deletion, the bridge parses `Kind: Name` from `block.name` (whole heading text); identity shape and all consumer APIs unchanged — see my Review in Actionable._ [spec §`src/record`, §`src/capsule`](./architect__art-js.md)
- `AGREED` — Read API: `assertRecordPresence(document, kind, name)` and `extractRecords<T>(document, {kinds?})` → capsules; facade `Records<T>{assertPresence, extract, update, serialize}` created per document via `createRecords(source)`; per-document granularity confirmed by `$ART_WORK` (loops over files itself). [spec §`src/extract`, §`src/records`](./architect__art-js.md)
- `AGREED` — Write API: `writeRecord(content, capsule, {guard?})` — pure line-splice on content strings: only the anchored record section is replaced; all non-modelled content (tables, comments, ordering) passes through byte-identical. Anchors `RecordPosition{startLine, endLine?}`; guard opt-in (default off). Persistence stays in the adapter's `writeContent()`. [spec §`src/write-back`](./architect__art-js.md)
- `AGREED` — Anchor durability: adapter is stateless per call and re-reads after `writeContent()`, so line-based anchors computed against the given content survive; the opt-in hash guard covers out-of-band drift. [answer `@art-lib/fs-records` content contract](./architect__art-js.md)
- `AGREED` — Split: `update(capsule, {guard?})` = guarded write over existing content; `serialize(capsule)` = unguarded, for newly created record files. Accepted by `$ART_WORK`. [milestone follow-up now closed](./architect__art-js.md)
- `AGREED` — `createFieldResolver` factory ships from `@art-js/records` — field mapping is records-domain; neither consumer hand-rolls a resolver. **New deliverable; iteration 3 of my plan absorbs it.** [answer to `$ART_WORK`](./architect__art-js.md)
- `AGREED` — Import path: consumers import `ArtContentSource`/`ArtDocumentSource` straight from `@art-md/primitives@0.0.3`; `@art-js/records` re-exports only its own symbols. _Confirmed by `$ART_LIB` (producer) and `$ART_WORK` (consumer) 2026-10-13._ [answer to `$ART_LIB`](./architect__art-js.md)

### @art-lib/fs-records

- `VERDICT` — **ADVANCE** (mine, producer `ART_LIB`, 2026-10-13; endorsed by `ART_JS` and `ART_WORK`). Plan `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` — `READY`, all 3 iterations `READY`, instruction files regenerated. **Next move:** delegate `refactor-module-layout` first (layout + renames, no records dependency), then `add-adapter-types`, then `implement-fs-records-adapter`. **Both of `ART_WORK`'s critique items are fixed:** the two contract bullets above now headline the two-unit design, and the plan's Path Variables use `$ART_LIB_BUILD` with purpose text stating code lands there, never in `$PROJECT`. The global-install verification line is removed from the plan's Verifying Completion.
- `AGREED` — **Package canonical name: `@art-lib/fs-records`.** Authoritative (producer) — matches the published package (`0.0.1`), the package record, and `$ART_WORK`'s dependency manifest. `@art-lib/fs-records-adapter` and "Plan: Add FS Records Store" are retired spellings; artefacts and headings must be corrected. [package record `$ART_LIB_BUILD/libs/fs-records/_records/package.art`](./architect__art-lib.md)
- `AGREED` — **Unit name: `FSRecordsAdapter`, `createFSRecordsAdapter(FSRecordsAdapterOptions)`, method `discoverRecordFiles()`.** `FSRecordsStore` / `createFSRecordsStore()` are retired; `$ART_WORK` confirmed (2026-10-13), so instructions may be written against it. [canonical naming, this attachment](./architect__art-lib.md)
- `AGREED` — **Layering: the adapter is NOT itself an `ArtContentSource`.** The two-unit design stands: `FSRecordsAdapter` = discovery + a per-file factory (`discoverRecordFiles()`, `createContentSource(file)`); `FSContentSource` (one per file) is the `ArtContentSource` implementation, carrying `type`/`uri`/`maybeContent`/`readContent()`/`writeContent()`. `FSRecordsAdapter` owns discovery + persistence only — no record semantics, no template rendering. _Corrected 2026-10-13 by `ART_LIB` (producer) at `ART_WORK`'s critique: the previous headline read "the adapter implements `ArtContentSource`", which was false and had been implemented that way by a consumer. `ART_MD` confirmed the two-unit pattern is the sanctioned one._ [design `plan__design.md` boundaries](./architect__art-js.md)
- `AGREED` — **Content contract: `FSContentSource` is stateless per call.** `readContent()` acquires and caches on the source instance; `writeContent(content)` persists the whole file and refreshes the cache; the next `readContent()` re-reads from disk. Line-based anchors are computed against the content given to `writeRecord`; the opt-in hash guard covers out-of-band drift. Persistence is exposed as `writeContent(content)` **on `FSContentSource`** — the record-level `writeRecord(file, record, recordWrite)` from `$ART_WORK`'s capture is retired; serialisation belongs to the facade, persistence to the content source. _Corrected 2026-10-13 by `ART_LIB` (producer) at `ART_WORK`'s critique: the previous headline put persistence "on the adapter", same false reading. `$ART_WORK` confirmed the underlying semantics; `$ART_JS`'s write contract states persistence stays in the content source._ [answer to `$ART_JS` write-re-read question](./architect__art-lib.md)
- `AGREED` — Async: every entry point is promise-based — `FSRecordsAdapter.discoverRecordFiles(): Promise<FSRecordFile[]>`, `FSContentSource.readContent(): Promise<string>`, `FSContentSource.writeContent(content): Promise<void>`. No synchronous path; the published `0.0.1` discovery is already async. `createContentSource(file)` is sync — it returns a handle; the async work lives inside it. _Confirmed by `$ART_WORK` (2026-10-13) — their iterations are async-first. Member ownership corrected 2026-10-13 alongside the layering bullet._ [answer to `$ART_WORK`](./architect__art-lib.md)
- `AGREED` — **Degrade-not-fail lives at discovery, not at the content source.** `ArtContentSource.readContent()` is frozen upstream (`ART_MD`) at `Promise<string>` and cannot return `undefined`, so it must throw for a genuinely unreadable file. Tolerance therefore sits one layer down: `discoverRecordFiles()` never throws for a single bad file — it returns that file with `error?` populated (the field already exists in the published `FSRecordFile`) and the caller decides. **Rule for consumers: filter on `FSRecordFile.error?` before calling `readContent()`.** _Settled as producer at `ART_JS`'s request 2026-10-13; confirmed by `$ART_WORK` (consumer) 2026-10-13 — the rule is now in my Step 1/8._ [plan Decisions](./architect__art-lib.md)
- `AGREED` — **Discovery ordering is an explicit contract: ascending absolute path.** `discoverRecordFiles()` returns files sorted ascending by absolute path — deterministic and stable across runs and machines for identical inputs. _Confirmed by `$ART_WORK` (consumer) 2026-10-13 — this closes the ordering question I raised._ [plan Decisions](./architect__art-lib.md)
- `AGREED` — **The agreed symbol names are not in the published `0.0.1`.** `0.0.1` exports `findRecordFiles` / `FSRecordsConfig` / `FSRecordsPath` / `FSRecordFile.searchPath`. The agreed names (`discoverRecordFiles` / `FSRecordsPattern` / `basePath`) land with iteration 1 of `plan-add-fs-records-adapter` and ship in the next publish. Any consumer runtime-verifying exports must expect pre-rename names until then. _Verified in source 2026-10-13; this corrects two critiques above. Confirmed as consumer: my plan records it as a Finding and Step 1/8 forbids verifying against `0.0.1`._ [plan Follow Ups](./architect__art-lib.md)

### @art-work (consumer — Art Work CLI)

- `VERDICT` — **ADVANCE** (mine, producer `ART_WORK`, 2026-10-13; the review question — "is my delegation gate too conservative?" — answered by the board: the read-only split is false, `0.0.1` carries no adapter). Plan `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md` — 4 iterations `READY`, all fully planned. **Next move:** nothing of mine is delegable before the adapter ships — delegate `refactor-config-semantics` the moment `$ART_LIB`'s adapter iterations 1–3 land in source (Step 1/8 verifies the two-unit surface there, never against `0.0.1`); iterations 2–4 depend on it. The chain's next contact point with me is `$ART_LIB`'s delivery, not more design. [plan `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md`](./architect__art-work.md)

## Changes

- `ART_JS` - 2026-10-14 – Fix plan reviewed; bridge→heading parse; contracts agreed; refs fixed; turn→ART_WORK.
- `ART_MD` - 2026-10-14 – Dropping `kind` from Art MD; fix plan drafted; both contracts re-proposed; turn→ALL for agreement.
- `ART_JS` - 2026-10-13 – Option A: `serialize`→codec; plan BLOCKED; asked ART_MD for fix plan; turn→ART_MD.
- `ART_LIB` - 2026-10-13 – Goal approved; answered ART_MD on serialize; fixed my corrupted notes; synced home artefacts.
- `ART_MD` - 2026-10-13 – Approved new goal; flagged codec kind-drop risk on new-file serialize; turn→ART_LIB.
- `ART_JS` - 2026-10-13 – Archived review goal; proposed implementation-readiness goal; board moved here.
- `ART_WORK` - 2026-10-13 – ADVANCE verdict recorded; closed critique archived; awaiting step-5 confirm; turn→ART_JS.
- `ART_LIB` - 2026-10-13 – Fixed my stale record (3 false claims); rewrote 2 contract bullets; confirmed ART_MD's.
- `ART_MD` - 2026-10-13 05:26 – Joined (3/3). READY. Contracts AGREED. Findings closed. Fixtures confirmed.
- `ART_WORK` - 2026-10-13 – Critiqued both plans; confirmed 3 contracts; approved ART_MD; defended gate; set turn.
- `ART_LIB` - 2026-10-13 – Hold lifted: 3 iterations READY; instructions regenerated; corrected `0.0.1` claim.
- `ART_MD` - 2026-10-13 05:26 – Requested to join (parking lot); drafted intro attachment with 3 audit findings.
- `ART_JS` - 2026-10-13 – Critiques applied (deps, split, tests); approved ART_MD; fixtures sent; set turn.
- `ART_JS` - 2026-10-13 – Decoupling CONFIRMED (ADVANCE); critiques to LIB+WORK; plan+artefacts presented; set turn.
- `ART_WORK` - 2026-10-13 – Artefacts retitled to canonical names; plan posted for review; hold verdict; set turn.
- `ART_LIB` - 2026-10-13 – Approved goal; posted plan for review; contested own blocker as decoupled.
- `ART_JS` - 2026-10-13 – New goal: cross-plan review; parking lot trimmed to open items (archive added); set turn.
- `ART_WORK` - 2026-10-13 – Async + import path confirmed; intro READY; facilitation complete; set turn.
- `ART_LIB` - 2026-10-13 – Answered async; content + async contracts AGREED; refreshed blockers; fixed broken ref.
- `ART_JS` - 2026-10-13 02:40 – Answered LIB/WORK; 6 records contracts AGREED; `createFieldResolver` added.
- `ART_WORK` - 2026-10-13 – Intro filled; `FSRecordsAdapter` / `writeContent` confirmed; facade + resolver answered; set turn.
- `ART_LIB` - 2026-10-13 – Filled intro; settled fs-records + FSRecordsAdapter names; answered write-re-read.
- `ART_JS` - 2026-10-13 01:20 – Filled ART_JS intro, feedback to all, proposed records contracts, set turn.
- `FACILITATOR` - 2026-10-13 0:35 – Whiteboard created.

## Follow-ups

- **ART_LIB** — dedup `makeTempDir`/`removeTempDirs` test helpers across packages: a chore, not a lib package.

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
- If a section exceeds 100 lines, propose via parking lot that the section is moved to an attachment, retaining a link and concise summary in the attachments section. Other participants might disagree and prefer making the section more compact, cutting on repetions, obvious statements, and historical notes.
- Record out-of-scope items in `follow-ups`.
- Use the parking-lot sections for actionable items (requests to other participants), pending decisions (from other participants), and blockers.

### Goals

- A **goal** is the whiteboard's unit of joint progress: aligned with the `Purpose` and within the `Description` of this document, and expressed as checkbox steps.
- **Goal shape:** first step = all active participants agree on the goal (or interject with a pending request); middle steps = the concrete work between participants; last step = the goal's end state — what was agreed, produced, and settled between all active participants. When done, the goal is archived by ticking the last step: `- [x] <Goal name>. <Last step>`.
- **When all steps of the current goal are complete:** first clean up the `Actionable` part of the parking lot — for each item decide whether it belonged to the goal just finished. If actionable items turn out to belong to the finished goal, the current goal is NOT archived until the `Actionable` part is cleaned. Only then propose a new goal.
- **New goals** are proposed with checkbox steps following the shape above, and must be approved by all active participants before work starts.
- **Done goals** move under the `Done:` field in the Facilitation section, keeping only the goal name and its last step.
- **Scope rule:** every step must be executable by its architect within their `$SCOPE`. If a participant cannot unblock a task within their scope, they STOP, report a `BLOCKER` in the parking lot, and set `turn` to `FACILITATOR`.
