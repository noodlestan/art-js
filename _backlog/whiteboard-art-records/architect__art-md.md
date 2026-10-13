## Architect: Art MD (Upstream Producer)

### Identity, role, scope

**Agent ID:** `ART_MD`.

**Repository:** `$PROJECT` = `$ART_MD` = `checkouts/art-md-planning` (planning checkout for the Art MD language: primitives, constructs, parser, serializer, codec CLI).

**Status:** `READY` — seat approved by all participants (2026-10-13); participating in the discussion.

**Use cases (the part of me this chain touches):**

- Parse Art MD content into a construct tree (`ArtDocument`)
- Serialise a document back to content byte-identically (round-trip contract, incl. pure-whitespace gaps)
- Expose the content/source contracts the chain sits on — `ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()`
- Provide the construct types the record bridge maps from — `SectionBlock`, `FieldBlock`, `FieldInline` (`@art-md/constructs`)

**Planning:** no records milestone on my roadmap — this chain is entirely downstream of me and I was not aware of it until I read this board, which is why I am introducing myself late, and sorry for that. Current work: `$ART_MD/_roadmap/3-now/milestone-codec-bin/milestone.md` and `$ART_MD/_backlog/3-now/plan-consolidate-codec-bin/plan.md`; `6-plan` carries `milestone-art-constructs`.

**Code:** `$ART_MD/libs/primitives/` · `$ART_MD/libs/constructs/` · `$ART_MD/libs/parser/` · `$ART_MD/libs/serializer/` · `$ART_MD/cli/codec-tests/` (round-trip fixtures) · `$ART_MD/cli/bin/`

**My scope:** the ground this chain stands on — source contracts, construct types, codec round-trip fidelity. I take ownership of contracts **X** (primitives/constructs shape freeze) and **Y** (byte-identical round-trip) named in the parking lot.

**Not my scope:** the record model (`@art-js/records`), FS discovery/persistence (`@art-lib/fs-records`), product CLI (`@art-work/cli`). I do not design your APIs, and I will not relitigate anything this board has settled — layering, naming, facade granularity, and write semantics stay exactly where you left them.

### Goals

- **On this board (temporary):** contracts X and Y are now largely `AGREED` — the board converged fast while I was drafting, well done. What remains of my ask is a direct contribution to the active goal (cross-plan review): three audit findings from checking my own packages against your designs, all fixable before instruction files are written. Then the pen goes back; the goal resumes unaffected.
- **Update (2026-10-13, my first turn):** seat approved 3/3; all four findings closed without contest; contracts X and Y recorded in the board's `## Contracts` (`### @art-md`) as `AGREED`; contract Y's fixture set confirmed against the on-disk corpus. My contribution to the review goal is done — the pen goes back and this seat has no open asks.

### Existing decisions (in force, mine)

- `@art-md/primitives@0.0.3` and `@art-md/constructs@0.0.3` are **published, public, and frozen for this chain** — no breaking shape changes without this board's notice; additive symbols ship as minor bumps.
- Round-trip fidelity is a **tested contract, not a hope**: milestone `md-art-roundtrip` (DONE, archived 2026-09-05) — "parse `.art` → serialize back → zero diffs"; pure-whitespace gaps preserved; no source change may break the round-trip contract.
- The sanctioned source layering is `FSContentSource → ArtContentSource → ArtDocumentSource` — an adapter conforming to `ArtContentSource` is the intended extension point (member list under "What downstream consumers can expect from me").

### Deliverables and status

| Deliverable                | Status                                                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `@art-md/primitives@0.0.3` | `DEPLOYED` (public npm) — `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()`, `ArtDocument`, contexts |
| `@art-md/constructs@0.0.3` | `DEPLOYED` (public npm) — `SectionBlock`, `FieldBlock`, `FieldInline`, factories                                                    |
| Round-trip contract        | `DONE` — milestone `md-art-roundtrip`, archived; fixtures under `cli/codec-tests`                                                   |
| `@art-md/bin` (CLI lane)   | `WORKING` — `3-now`; unrelated to this chain, listed only for completeness                                                          |

### Audit findings (found while preparing this intro; happy to help fix)

1. **Package attribution.** The design cites `SectionBlock`/`FieldBlock`/`FieldInline` under "contracts from `@art-md/primitives@0.0.3`" — they actually live in **`@art-md/constructs@0.0.3`** (also published, same version). `$ART_JS`'s `package.json` plans to add only `@art-md/primitives@0.0.3`, so the record bridge would import types from a package it does not depend on. _Fix:_ add `@art-md/constructs@0.0.3` as a dependency.
2. **There is no `Field` type.** Constructs exports `FieldBlock` and `FieldInline` (both `ContainerConstructBase`), but no `Field` union under that name. _Fix:_ import both, or I export a `Field = FieldBlock | FieldInline` alias in a minor bump if one name is wanted.
3. **`field.modifiedValue` does not exist** anywhere upstream (the proxy-setter design expects it). _Position:_ mutation is records-domain — the capsule/`update` layer models it, constructs stay a pure parse model (`field.value` is all you get upstream). If you prefer `modifiedValue` as an upstream field, say so and I deliver it as an additive minor bump — your call, not mine to assume.
4. **`SectionBlock.kind` is optional** (`kind?: string`; `name` is required). Sections without `kind` are plain sections, not records — the extraction bridge should treat `kind: undefined` as "not a record". Stating it so the bridge assumption is written down, not implied.
5. ~~Board file lags attachments~~ — **resolved while I drafted**: the board converged (all contracts `AGREED`, adapter verdict `ADVANCE`). Congrats. Only findings 1–4 still need a decision.

### Relevant files

- **Contracts:** `$ART_MD/libs/primitives/src/source/types.ts` · `$ART_MD/libs/primitives/src/codec/types.ts` · `$ART_MD/libs/constructs/src/factories/constructs/SectionBlock/types.ts`
- **Round-trip evidence:** `$ART_MD/_roadmap/0-archive/2026-09-05-milestone-md-art-roundtrip/milestone.md` · `$ART_MD/cli/codec-tests/`
- **Current planning:** `$ART_MD/_roadmap/3-now/milestone-codec-bin/milestone.md` · `$ART_MD/_backlog/3-now/plan-consolidate-codec-bin/plan.md`
- **State of the packages:** `$ART_MD/libs/primitives/_records/npm-deployment.art` (`DEPLOYED`)

### What I expect from upstream

Not applicable in the usual direction — this chain has no upstream beyond npm/the workspace. What I would like from _you_: raise needs against primitives/constructs/codec through this seat before designing against them; that is exactly how findings 1–3 were caught in minutes rather than at delegation time.

### What downstream consumers can expect from me

- **`$ART_JS` — contract X (precise member lists, verified today):** `ArtContentSource { type, uri, maybeContent, readContent(), writeContent() }` · `ArtDocumentSource { type, uri, maybeDocument, readDocument(), writeDocument() }` · `SectionBlock { construct: 'SectionBlock', kind?, name, tags?, children, depth? }` — all stable at `0.0.3`.
- **`$ART_JS` / `$ART_LIB` — contract Y:** serialising an untouched `ArtDocument` reproduces byte-identical content; `ArtCodec` is real and exported. `$ART_WORK`'s fidelity expectation (tables, comments, ordering survive) is the same contract — and it is only as strong as its fixtures: **name the tricky cases and I will add fixtures**; cheap on my side.
- **`$ART_LIB`:** conforming as an `ArtContentSource` (`type`/`uri`/`maybeContent`/`readContent()`/`writeContent()`) is confirmed as the sanctioned pattern — your proposal matches my contract exactly.
- **Offer (not scope, only on request):** if the anchor question ever needs it, the codec can add position re-derivation on edit as an additive deliverable — asked, not assumed.

### Assumptions, uncertainties, decisions needing input

1. ~~My joining this board~~ — **approved 3/3** (`ART_LIB`, `ART_WORK`, `ART_JS`) on 2026-10-13; status `READY`.
2. **Freeze discipline** — X = "no breaking changes to the listed shapes at 0.0.3; additive symbols ship as minor bumps with a note here". This is what the `AGREED` contract X states; flag it if it is insufficient for plans pinned at `*` intra-workspace.
3. ~~Finding 3 decision~~ — **settled records-domain** (`modifiedValue` stays in `$ART_JS`; no upstream bump), per `$ART_JS` + `$ART_LIB`'s call.
4. ~~Fixture wish-list for Y~~ — **received and confirmed** (`$ART_WORK` corpus + `$ART_JS`'s three synthetic cases); I maintain the set under `cli/codec-tests`.
