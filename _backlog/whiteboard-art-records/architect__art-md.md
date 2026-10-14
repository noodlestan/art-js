## Architect: Art MD (Upstream Producer)

### Identity, role, scope

**Agent ID:** `ART_MD`.

**Repository:** `$PROJECT` = `$ART_MD` = `checkouts/art-md-planning` (planning checkout for the Art MD language: primitives, constructs, parser, serializer, codec CLI).

**Status:** `READY` — seat approved by all participants (2026-10-13).

**Use cases (the part of me this chain touches):**

- Parse Art MD content into a construct tree (`ArtDocument`)
- Serialise a document back to content with structural fidelity (round-trip contract; extraneous whitespace normalised per CommonMark)
- Expose the content/source contracts the chain sits on — `ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()`
- Provide the construct types the record bridge maps from — `SectionBlock`, `FieldBlock`, `FieldInline` (`@art-md/constructs`)

**Planning:** no records milestone on my roadmap — this chain is entirely downstream of me. Current work: `$ART_MD/_roadmap/3-now/milestone-codec-bin/milestone.md` · `$ART_MD/_backlog/3-now/plan-consolidate-codec-bin/plan.md` (CLI lane) · `$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md` (in flight).

**Code:** `$ART_MD/libs/primitives/` · `$ART_MD/libs/constructs/` · `$ART_MD/libs/parser/` · `$ART_MD/libs/serializer/` · `$ART_MD/cli/codec-tests/` (round-trip fixtures) · `$ART_MD/cli/bin/`

**My scope:** the ground this chain stands on — source contracts, construct types, codec round-trip fidelity. I own two contracts on this board: the primitives/constructs **shape freeze** and the **round-trip fidelity** guarantee — both re-proposed 2026-10-14, see Current state.

**Not my scope:** the record model (`@art-js/records`), FS discovery/persistence (`@art-lib/fs-records`), product CLI (`@art-work/cli`). I do not design your APIs, and I will not relitigate anything this board has settled — layering, naming, facade granularity, and write semantics stay exactly where you left them.

### Current state (2026-10-14)

- Seat approved 3/3; audit findings closed; contracts live in `## Contracts` → `### @art-md`.
- **In flight:** `kind` is being deleted from Art MD — a heading's text is never split; `## Checkout: Art Work` is one section named `Checkout: Art Work`. Plan `plan-drop-kind-and-reword-claims` (3 iterations, `PLANNING`, registered in `milestone-codec-bin`), reviewed and accepted by `ART_JS`.
- Both `@art-md` contracts re-proposed accordingly — shape freeze without `kind?`, structural round-trip instead of byte-identity. Agreed by `ART_JS` + `ART_WORK`; **pending `ART_LIB`**.
- No open asks on any seat.

### Existing decisions (in force, mine)

- `@art-md/primitives@0.0.3` and `@art-md/constructs@0.0.3` are **published, public, and frozen for this chain** — no breaking shape changes without this board's notice; additive symbols ship as minor bumps. (The `kind` removal is being processed through this board, not around it.)
- Round-trip fidelity is a **tested contract, not a hope**: milestone `md-art-roundtrip` (DONE, archived 2026-09-05) — parse `.art` → serialize back → zero diffs on the fixture corpus. Claim wording being re-proposed to structural fidelity: all valid Markdown structure preserved; extraneous whitespace normalised per CommonMark; exactly one final newline.
- The sanctioned source layering is `FSContentSource → ArtContentSource → ArtDocumentSource` — an adapter conforming to `ArtContentSource` is the intended extension point (member list under "What downstream consumers can expect from me").

### Deliverables and status

| Deliverable                | Status                                                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `@art-md/primitives@0.0.3` | `DEPLOYED` (public npm) — `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()`, `ArtDocument`, contexts |
| `@art-md/constructs@0.0.3` | `DEPLOYED` (public npm) — `SectionBlock`, `FieldBlock`, `FieldInline`, factories                                                    |
| Round-trip contract        | `DONE` — milestone `md-art-roundtrip`, archived; fixtures under `cli/codec-tests`; claim wording being reworded by the fix plan     |
| `kind` removal             | `PLANNING` — `plan-drop-kind-and-reword-claims`; deletion only, no new fixtures                                                     |

### Audit findings (2026-10-13 — all closed)

Provenance only: (1) constructs types attributed to primitives — contracts now list them under `@art-md/constructs`, and the instruction review checks the constructs import; (2) no `Field` union exists — constructs types used directly, alias offer withdrawn; (3) `field.modifiedValue` — settled records-domain, no upstream bump; (4) `SectionBlock.kind` optional — **superseded**: `kind` is being deleted entirely (2026-10-14), the bridge parses `Kind: Name` from the heading text.

### Relevant files

- **Contracts:** `$ART_MD/libs/primitives/src/source/types.ts` · `$ART_MD/libs/primitives/src/codec/types.ts` · `$ART_MD/libs/constructs/src/factories/constructs/SectionBlock/types.ts`
- **Fix plan:** `$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md`
- **Round-trip evidence:** `$ART_MD/_roadmap/0-archive/2026-09-05-milestone-md-art-roundtrip/milestone.md` · `$ART_MD/cli/codec-tests/`
- **Current planning:** `$ART_MD/_roadmap/3-now/milestone-codec-bin/milestone.md` · `$ART_MD/_backlog/3-now/plan-consolidate-codec-bin/plan.md`

### What I expect from upstream

Not applicable in the usual direction — this chain has no upstream beyond npm/the workspace. What I would like from _you_: raise needs against primitives/constructs/codec through this seat before designing against them; that is exactly how the findings were caught in minutes rather than at delegation time.

### What downstream consumers can expect from me

- **`$ART_JS` — shape freeze (precise member lists, verified):** `ArtContentSource { type, uri, maybeContent, readContent(), writeContent() }` · `ArtDocumentSource { type, uri, maybeDocument, readDocument(), writeDocument() }` · `SectionBlock { construct: 'SectionBlock', name, tags?, children, depth? }` — `name` is the whole heading text, no `kind`. Stable at `0.0.3`; the `kind` removal lands in a release they pin.
- **`$ART_JS` / `$ART_LIB` — round-trip:** serialising an untouched `ArtDocument` reproduces the source with structural fidelity; `ArtCodec` is real and exported. `$ART_WORK`'s fidelity expectation (tables, comments, ordering survive) rides the same contract — and it is only as strong as its fixtures: **name the tricky cases and I will add fixtures**; cheap on my side.
- **`$ART_LIB`:** conforming as an `ArtContentSource` (`type`/`uri`/`maybeContent`/`readContent()`/`writeContent()`) is confirmed as the sanctioned pattern — your proposal matches my contract exactly.
- **Offer (not scope, only on request):** if the anchor question ever needs it, the codec can add position re-derivation on edit as an additive deliverable — asked, not assumed.

### Assumptions, uncertainties, decisions needing input

1. **Freeze discipline** — "no breaking changes to the listed shapes; additive symbols ship as minor bumps with a note here". Flag it if insufficient for plans pinned at `*` intra-workspace.
2. Nothing else open — joining approved 3/3 (2026-10-13), `modifiedValue` settled records-domain, fixture wish-list received and confirmed (`$ART_WORK` corpus + `$ART_JS`'s three synthetic cases); I maintain the set under `cli/codec-tests`.
