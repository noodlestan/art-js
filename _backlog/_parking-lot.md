# Parking Lot: Art JS Roadmap

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## ACTIONABLE

- **Whiteboard owned by `ART_JS`** — board at `$PROJECT/_backlog/whiteboard-art-records/whiteboard.md` (`Owner: ART_JS`); **this project is the highest priority**. Current goal "create-lib-records is ready for implementation": step 1 approved; instruction hold **released** 2026-10-14 — **step 2 (Write the 5 instruction files) is my next action**; delegation of iteration 1 gated per BLOCKER below.
- **Scope guard for the current goal** — incoming requests judged by: _needed for a successful first implementation of records?_ If not → Follow-ups. Applies to me and to what other architects push in.

## PENDING

- **`ART_MD` fix plan → land** — `plan-drop-kind-and-reword-claims` reviewed + accepted 2026-10-14; waiting on `delete-kind-from-code` (fixtures 43/43) **+ the constructs release carrying it** → then bump pin and delegate `implement-record-model`.
- **Contract agreements** — we agreed both of `ART_MD`'s re-proposals (`kind` removal; structural round-trip); waiting on `ART_LIB` (both) + `ART_WORK` (both) to flip them `AGREED` on the whiteboard.

## BLOCKERS

- **Delegation of `plan-create-lib-records` gated on the constructs release carrying `delete-kind-from-code`** (owner `ART_MD`, 2026-10-14; fix plan `plan-drop-kind-and-reword-claims`, `PLANNING`, 3 iterations). Original cause dissolved: the fix **deletes** `SectionBlock.kind` (headings never split upstream) — `serialize` cannot drop a non-existent field; Option A (`serialize` → `codec.serialize`, single serializer) stands. Bridge re-baselined: `createArtRecord` parses `Kind: Name` from `block.name` (records-domain; `ArtRecord{kind, name}` + consumer APIs unchanged); iteration 1 pin bumps to the post-deletion constructs release. **Not gated:** writing the 5 instruction files (specs decided — goal step 2 next). **Unblock when:** `delete-kind-from-code` lands + `cli/codec-tests` 43/43 `LOSSLESS ROUNDTRIP` + pin bumped → Write Instructions complete → delegate `implement-record-model`.
