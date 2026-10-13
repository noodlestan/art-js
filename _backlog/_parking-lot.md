# Parking Lot: Art JS Roadmap

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## ACTIONABLE

- **Whiteboard owned by `ART_JS`** — board at `$PROJECT/_backlog/whiteboard-art-records/whiteboard.md` (`Owner: ART_JS`); **this project is the highest priority**. Current goal "create-lib-records is ready for implementation": step 1 approved; **step 2 (Write Instructions) on hold per BLOCKER below**. On `ART_MD`'s fix-plan report: unblock plan + milestone, write the 5 instruction files, post review requests per contract area, hand turn.
- **Scope guard for the current goal** — incoming requests judged by: _needed for a successful first implementation of records?_ If not → Follow-ups. Applies to me and to what other architects push in.

## PENDING

- **`ART_MD` fix plan** — drafted codec kind-drop fix plan to be reported via whiteboard parking lot; then iterations tracked ahead of `implement-records-facade`. Iterations 1–3 releaseable early if the user/other architects need them.

## BLOCKERS

- **Codec kind-drop blocks `plan-create-lib-records`** (2026-10-13, owner `ART_MD`) — `@art-md/codec` strips `SectionBlock.kind` on serialize; `serialize(capsule)` on a new file would emit `## Art Work` instead of `## Checkout: Art Work` → contract Y broken on `$ART_WORK`'s clone path. Decision **Option A** (whiteboard): `serialize` reaches `codec.serialize`, single serializer, no hand-rolled emitter. Plan + milestone set `BLOCKED`; iteration `implement-records-facade` `BLOCKED`; all 5 instruction files on hold (one review pass). **Waiting on:** `ART_MD` to report a drafted fix plan via whiteboard parking lot (`Ergonomic Factories API`); fix sequenced ahead of our iteration 4. Iterations 1–3 unaffected — releaseable on request. When the plan is tracked: unblock, Write Instructions, resume whiteboard goal step 2.
