# Plan: Label Repair API

**ID:** `label-repair-api`

**Status:** `DRAFT`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Has Context File:** `FALSE`

**Skill:** `write-plan`

**Purpose:** Give `@art-js/records` a label-repair escape hatch: rewrite a stored field label in place without changing the field's name, and read and write field values by their stored label.

**Description:** Stored labels are never rewritten by a value update, `renameField` always writes the derived `nameToLabel` spelling (a rename of `npmPackageDeployment` persists `Npm Package Deployment`), and a field whose stored label is shadowed by an earlier duplicate is reachable only by walking `record.__section`. This plan first extends the fields specification — which owns every field API name — with the relabel semantics and the raw by-label accessors, then implements that spec next to the shipped `0.2.0` surface, in two iterations and two `NOPUSH` commits, with no version bump and no publish.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$PACKAGE/knowledge/design/fields.md` (Design) — The shipped field contract; the spec owns every field API name and is what the first iteration extends.

---

## Path Variables

This section lists the path variables used throughout the plan file and its downstream work items. All file references in the plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                | Purpose                                          |
| ------------ | ---------------------------- | ------------------------------------------------ |
| `$WORKSPACE` | Current working directory    | Workspace root directory                         |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates      |
| `$SKILLS`    | `$WORKSPACE/.agents/skills`  | Art agent modes and skills                       |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes          |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package                    |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout — codec field pattern, read-only |

## Summary

Extend `@art-js/records` with a label-writing repair API — an in-place relabel operation plus raw by-label value accessors — specified first in `$PACKAGE/knowledge/design/fields.md` and then implemented with unit, in-package fixture, and external consumer coverage in `$PACKAGE` and `$PROJECT/tests/records`, taken from the deferred follow-up of `Plan: Canonical Record Field Names` and modelled on the spec-then-implement structure of `Plan: Expand Fields API`, confined to `$PROJECT` on `main` with no version bump and no publish.

## Scope

Changes are confined to one package's source and knowledge and its two test suites, all under `$PROJECT`; Art MD is read-only reference; no deployment, release artefact, or consumer code is touched.

### (Scope) Package: Records

**Record:** `$PACKAGE/_records/package.art`

**Role:** — Changes required: the spec that owns the API names, then the implementation beside it.

**Partial:**

- `owner` — Project: Art JS
- `path` — `$PACKAGE/`
- `canonicalName` — `@art-js/records`
- `published` — `true`
- `deployment` — NPM Package Deployment: Records

**Changes:**

- Iteration `write-label-repair-spec` — extend `$PACKAGE/knowledge/design/fields.md` with the relabel semantics and the by-label accessors (intent first; this is where the names land), amend the no-escape-hatch clauses in `$PACKAGE/knowledge/adr/fields.art`, keep the `ArtRecord` public type and cross-references accurate in `$PACKAGE/knowledge/design/records.md`, and refresh `$PACKAGE/knowledge/index.md`. No `src/` or `tests/` change.
- Iteration `implement-label-repair-api` — implement the reviewed spec under `$PACKAGE/src/record/`: the relabel operation and the by-label value accessors as handle members, the grown reserved-name set, unit tests co-located in `$PACKAGE/src/record/private/` with fixture tables in `$PACKAGE/tests/record-helpers/`, two new fixtures under `$PACKAGE/tests/fixtures/`, and the `$PACKAGE/README.md` plus `$PACKAGE/knowledge/overview.md` refresh.

### (Scope) Package: Records Tests

**Record:** `$PROJECT/tests/records/_records/package.art`

**Role:** — Third-party consumer of the shipped surface; its fixture must exercise label repair through the built package, not only in-package.

**Partial:**

- `owner` — Project: Art JS
- `path` — `$PROJECT/tests/records/`
- `canonicalName` — `@art-js/test-records`
- `published` — `false`

**Changes:**

- Add one fixture case covering the new surface end to end — load, repair a stored label, write a shadowed field's value by label, save, reload — keeping the suite green.

## Execution Context

Execution occurs from `$WORKSPACE/`; package work is performed in `$PROJECT` on branch `main`, with source under `$PACKAGE/src`, fixture tables under `$PACKAGE/tests/record-helpers/`, in-package fixtures under `$PACKAGE/tests/fixtures`, and the consumer suite under `$PROJECT/tests/records`. `$ART_MD` is read-only reference for the codec's field pattern.

## Upstream Work

- Plan: Canonical Record Field Names – `$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md` — origin of this work (Not In Scope → Follow Ups); reference only, never edited.
- Plan: Expand Fields API – `$PROJECT/_backlog/1-done/plan-expand-fields-api/plan.md` — spec-then-implement structure exemplar; reference only.
- Parking Lot: Art JS – `$PROJECT/_backlog/_parking-lot.md` — project short-term tracker.

## Required Skills

- `write-plan` – `$SKILLS/write-plan/SKILL.md`

## Domains

- Plans – `$DOMAINS/plans/index.md`
- Work – `$DOMAINS/work/index.md`
- Commits – `$DOMAINS/commits/index.md`
- Operations – `$DOMAINS/operations/index.md`
- Packages – `$DOMAINS/packages/index.md`

## Resource Kinds in Scope

- Package – `$DOMAINS/packages/structures/package.art`

## Workflows

- Planning Work – `$DOMAINS/work/workflows/planning-work/workflow.art`
- Executing Work – `$DOMAINS/work/workflows/executing-work/workflow.art`

## Knowledge

- Design: Fields – `$PACKAGE/knowledge/design/fields.md` — the shipped field contract this plan extends; owns all field API names.
- Design: Records – `$PACKAGE/knowledge/design/records.md` — Field and Section Behaviour, the name → field index, and the `ArtRecord` public type.
- ADR: Fields – `$PACKAGE/knowledge/adr/fields.art` — canonical-name, index, and rename decisions to amend.
- Plan: Canonical Record Field Names – `$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md` — origin follow-ups; reference only.
- Plan: Expand Fields API – `$PROJECT/_backlog/1-done/plan-expand-fields-api/plan.md` — spec-first exemplar; reference only.
- Guide: Art JS – `$PROJECT/_guide.md` — layout, verification, and commit rules.
- Guide: Records – `$PACKAGE/_guide.md` — package layout and step verification.
- Conventions: TypeScript – `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md`
- Conventions: Unit Tests – `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md`

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                       | Status  |
| ------------------------------------------------------------------------------ | ------- |
| Iteration: Write Label Repair Spec `./instructions/write-label-repair-spec.md` | `DONE`  |
| Iteration: Implement Label Repair API                                          | `DRAFT` |

### Iteration: Write Label Repair Spec

**Id:** `write-label-repair-spec`

**Status:** `DONE`

**Purpose:** Pin the relabel semantics and the raw by-label accessors in `design/fields.md` — the single spec that owns every field API name — before any code changes.

**Description:** Extends the shipped fields spec with the label-repair surface: the relabel contract (in-place stored-label rewrite preserving name, position, tags, and value; validation-before-mutation gates; index invariance; shadowed-duplicate behaviour), the by-label read/write accessors (addressing-only difference; miss behaviour; never creates), and the grown reserved-name set; amends the no-escape-hatch decisions, keeps `records.md`'s public type accurate, and refreshes the knowledge index. No source or test change in this iteration.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/write-label-repair-spec.md`

**Changes:**

- Extend `$PACKAGE/knowledge/design/fields.md` — this is where every name lands:
  - A relabel section stating the intent (rewrite a stored label in place; the field keeps its name, position, tags, and value), the address (by field name through the index, so always the first-wins holder), the gates (reserved or absent name; the label must carry a word character, match the codec's field pattern so a save → reload round-trips it unchanged, and re-derive the field's current name), the index effect (keys unchanged — no rekey, no promotion, first-wins untouched), validation before any mutation, and what happens to shadowed duplicates (nothing — they stay shadowed and are reached by value through the by-label accessors).
  - A by-label access section: raw read/write twins of the five value methods addressed by the exact stored label (first field in document order carrying it); reads return `undefined` on a miss, writes throw on a miss, neither creates a field; value semantics (parse, automatic form, container rejection, label preservation) are inherited unchanged; the shipped `0.2.0` surface (`setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, `renameField`, `delete`) keeps every existing signature.
  - Update the Public Field API block, the Reserved names section (the new members and their collision labels), and the Field Names / Field and Section Behaviour wording that still claims there is no label escape hatch; adjust the Status and Scope lines so the shipped claim keeps covering only the implemented surface.
- Amend `$PACKAGE/knowledge/adr/fields.art`: add the label-repair decision, and amend only the overturned "no label escape hatch" clauses of `Canonical Field Names` and `The name → field Index` to point at it — the adopted decisions stay adopted everywhere else.
- Update `$PACKAGE/knowledge/design/records.md`: the `ArtRecord` public type gains the new members, and the Field Names / Field and Section Behaviour cross-references stay accurate.
- Refresh the document purposes in `$PACKAGE/knowledge/index.md`.
- Read the origin plan's Not In Scope and Follow Ups (`$PROJECT/_backlog/1-done/plan-canonical-record-field-names/plan.md`) for reference only; never edit anything under `_backlog/1-done/`.

**Dependencies:**

- None.

#### Commits:

| ID                        | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `write-label-repair-spec` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `f74746f` | `COMMITTED` |

##### Commit: `write-label-repair-spec`

**Repository:** Art JS

**Message:**

```text
docs(records): Specify label repair and by-label field access.

- Add relabel semantics and by-label accessors to the fields spec.
- Amend the no-escape-hatch decisions and refresh the knowledge index.
```

### Iteration: Implement Label Repair API

**Id:** `implement-label-repair-api`

**Status:** `DRAFT`

**Purpose:** Ship the label-repair surface exactly as the reviewed spec defines it, green at every commit, across the package and both suites.

**Description:** Adds the relabel operation and the by-label value accessors as handle members with the spec's gates, grows the reserved-name set so no new member silently shadows a field, and lands the unit tests, fixture-table cases, two new in-package fixtures, and one external consumer fixture alongside the source — every public name taken verbatim from the reviewed `design/fields.md`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Implement the reviewed spec in `$PACKAGE/src/record/`:
  - The relabel operation on the capsule (`private/capsule/createRecordCapsule.ts`) and the proxy (`private/capsule/createRecordProxy.ts`), with the type additions in `record/types.ts` and `record/private/types.ts`; it validates everything before mutating, then rewrites only `field.name`, leaving position, tags, value, and every index key unchanged.
  - The by-label read/write members routed through the existing value paths (`readSectionFieldMarkdown`, `codec.toText`, `structuredClone`, `setSectionField`) behind an exact-label, first-in-document-order lookup helper under `private/section-field/`; no index rebuild is needed for a value write, because the label does not change.
  - Public names come verbatim from the spec; internal helpers follow the existing folder and naming conventions.
- Extend `RESERVED_FIELD_NAMES` in `$PACKAGE/src/record/private/constants.ts` with every new handle member, so extraction aborts on a label that resolves to one of them instead of silently shadowing a field; pin the new collision labels beside the existing eight.
- Land the tests with the source, green in the same commit:
  - Unit and fixture-table coverage in `$PACKAGE/src/record/private/` and `$PACKAGE/tests/record-helpers/`: relabel gates (reserved name, absent name, label without word characters, label outside the codec pattern, label that re-derives a different name, rejected relabel leaving document and index untouched), index invariance (identical index before and after a relabel; no promotion; holder stays first-wins), by-label access (hit, miss, shadowed duplicate, form conversion, label preservation, container rejection), and the grown reserved set.
  - Two new in-package fixtures under `$PACKAGE/tests/fixtures/` (next ids after `24-rejected-values`) for the relabel round trip and the by-label repair path.
  - One new `$PROJECT/tests/records` fixture exercising the consumer-facing surface end to end; run `npm run build` in `$PACKAGE` first, since that suite resolves `@art-js/records` through `dist`.
- Refresh `$PACKAGE/knowledge/overview.md` (use cases and fixture map) and `$PACKAGE/README.md` (field surface and grown reserved-name note) to match the shipped spec.
- Validate from `$PACKAGE`: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:integration`; then from `$PROJECT`: `npm run ci`. Every iteration commits only green states.

**Dependencies:**

- Iteration: Write Label Repair Spec.

#### Commits:

| ID                           | Repository / Checkout / Branch   | Policy   | Hash    | Status        |
| ---------------------------- | -------------------------------- | -------- | ------- | ------------- |
| `implement-label-repair-api` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `(TBD)` | `PLACEHOLDER` |

##### Commit: `implement-label-repair-api`

**Repository:** Art JS

**Message:**

```text
build(records): Add label repair and by-label field access.

- Relabel stored labels in place and address field values by stored label.
- Reserve the new handle members and cover both suites with fixtures.
```

---

## Work

### Next

`write-label-repair-spec` is **`DONE` as `f74746f`** (4 knowledge paths only, `NOPUSH`, not pushed; delegation report committed with the integration): relabel semantics and the five by-label access twins are specified in `design/fields.md`, the two ADR clauses amended, `records.md`'s `ArtRecord` type and `index.md` refreshed. Next: review the spec against this plan's intent, then author `./instructions/implement-label-repair-api.md` and flip `implement-label-repair-api` to `READY`.

### Blockers

- None — the spec has landed (`f74746f`); `implement-label-repair-api` stays `DRAFT` until the spec passes review and its instruction is written.

---

## Operating Instructions

This section lists the operating instructions relevant to this work item.

| Operation              | Source                                                        | Origin | Overrides | Workflow       | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------- | ------ | --------- | -------------- | ------------------------------------------------------------ |
| Writing Commit Message | `$WORKSPACE/knowledge/conventions/writing-commit-message.art` |        |           | Planning Work  | Write standardized message according to context conventions. |
| Setting Up             | `$WORKSPACE/_guide.md`                                        |        |           | Executing Work | Prepare the execution environment.                           |
| Verifying Step         | `$PACKAGE/_guide.md`                                          |        |           | Executing Work | Validate lint, tests and build for a package step.           |
| Verifying Completion   | `$PROJECT/_guide.md`                                          |        |           | Executing Work | Confirm the work item satisfies its intended outcome.        |

::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` — Commit message conventions.

---

## Coordination

### Not In Scope

- **API names in this plan** — names belong to `design/fields.md`; this plan states intent only. The origin follow-up's `relabelField(name, label)` sketch is a hint, not a prescription.
- **Changing a field's name through relabel** — relabel moves spelling only within the same derived name (`labelToName(newLabel) === name`); name changes stay with `renameField`, and creating a field with a custom label stays out — a new field is always labelled `nameToLabel(name)`.
- **Label-addressed relabel** — relabel is name-addressed and therefore always reaches the first-wins holder; giving a shadowed duplicate its own addressable identity (a rekey) is a follow-up, not this plan.
- **Label enumeration on the handle** — no `fieldLabels`-style listing member; enumeration stays on `Object.keys` for names and `record.__section` for raw labels.
- **Version bump, CHANGELOG, publishing** — release ownership stays outside this plan; the next release carries the surface.
- **Art MD changes** — the codec's field pattern and constructs are read-only reference; the pre-existing digit-bearing-label reload gap is not fixed here.
- **Editing `_backlog/1-done`** — both origin plans are reference-only; nothing under `_backlog/1-done/` is modified.
- **Consumer migration** — no `$ART_WORKS` changes.
- **The other deferred follow-ups** — collision reporting, acronym-preserving labels, and the Art Works migration stay recorded in `Plan: Canonical Record Field Names`.

### Evidence

- None — planning only; no iteration has been executed.

### Findings

- **`renameField` is today's only stored-label writer** — `createRecordCapsule.renameField` sets `field.name = nameToLabel(newName)` and rebuilds the index; it can only ever write the derived spelling, which is exactly the house-spelling gap (`npmPackageDeployment` → `Npm Package Deployment`).
- **The index is re-derived from labels after every structural mutation** — `rebuildFieldIndex()` runs on create, delete, and rename; a stored label that stopped deriving its index key would be silently rekeyed — or dropped into a collision — by the next unrelated mutation. This is the technical basis for the relabel re-derivation gate.
- **The codec decides which labels survive a reload** — `FIELD_TEXT_PATTERN` (`/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`, `$ART_MD/libs/constructs/src/parser/fields/constants.ts`) admits only letter-led labels of letters and spaces; a relabel outside it would vanish on the next parse. Derived labels containing digits (e.g. `A333` from `a333`) already fail it — a pre-existing gap this plan guards against reproducing but does not fix.
- **Handle members shadow fields unless reserved** — the proxy serves target own properties before the field index, so a new member missing from `RESERVED_FIELD_NAMES` (`$PACKAGE/src/record/private/constants.ts`, nine entries today) would make a same-named field silently unreachable, the exact defect the canonical-name plan closed; every new member must join the list and grow the extraction-abort set.
- **Value writes already target a resolved construct** — `setSectionField` receives the field it resolves, so by-label access only replaces the index lookup with an exact-label scan (the old `findSectionField` was retired in the index rework); value semantics are inherited, not re-implemented.
- **Two suites, one build boundary** — in-package fixtures run `01`–`24` under `$PACKAGE/tests/fixtures`, fixture tables live in `$PACKAGE/tests/record-helpers/`, and `$PROJECT/tests/records` (`01`–`08`) resolves `@art-js/records` through `dist`: build the package before running it.

### Decisions

- **Spec first, names later** — `design/fields.md` owns every field API name; iteration 1 writes the semantics and the names into the spec, iteration 2 implements the reviewed spec verbatim (precedent: `Plan: Expand Fields API`).
- **Relabel keeps the name; the label stays coupled to it** — the new label must re-derive the field's current name, so the `name → field` index keys never change: no rekey, no promotion, no first-wins shift, position and tags untouched. Any label that would break the coupling is rejected before mutation, which keeps every later `rebuildFieldIndex()` a no-op for that field.
- **Validate before mutating, like `renameField`** — reserved or absent name first, then the label gates (word characters, codec round-trip, re-derivation); a rejected relabel leaves the document and the index untouched.
- **No canonical grammar on labels** — the grammar keeps gating API-supplied _names_ only; a label's gates are round-trip fidelity and re-derivation, and reservation never applies to a label: a label resolving to a reserved name cannot exist in an indexed record.
- **By-label changes addressing only** — reads return `undefined` on a miss, writes throw on a miss, neither ever creates a field (creation stays name-addressed and label-derived), and the value semantics are byte-for-byte the name-addressed ones.
- **Shadowed duplicates: reached by value, not by name** — relabel always addresses the first-wins holder and never promotes; the by-label accessors reach a shadowed field's value directly (first field carrying that exact label, document order), which serves the upstream `Id`/`ID` repair without deleting the holder.
- **New handle members are reserved** — the reserved set and the extraction-abort set grow with the spec's names; tests pin the new collision labels beside the existing eight.
- **Green at every commit, `NOPUSH`, no release** — each iteration lands with the tests it breaks; verification runs `$PACKAGE` lint/build/tests, then `$PROJECT` `npm run ci`; no version bump, no CHANGELOG, no publish.

### Knowledge to Update

- **`$PACKAGE/knowledge/design/fields.md`** — relabel and by-label sections, the Public Field API block, Reserved names, the Field Names and Field and Section Behaviour wording, and the Status/Scope lines.
- **`$PACKAGE/knowledge/design/records.md`** — the `ArtRecord` public type and the Field Names cross-references.
- **`$PACKAGE/knowledge/adr/fields.art`** — the new label-repair decision and the amended no-escape-hatch clauses.
- **`$PACKAGE/knowledge/index.md`** — refreshed document purposes.
- **`$PACKAGE/knowledge/overview.md`** — use cases and the fixture map for the new fixtures.
- **`$PACKAGE/README.md`** — the field surface and the grown reserved-name note.

### Follow Ups

- **Label-addressed relabel** — if a validator needs to give a shadowed duplicate its own addressable identity (a rekey), design it as a separate operation; not part of this plan.
- **Label enumeration** — a handle-level raw-label listing if walking `__section` proves costly.
- **Codec pattern vs digit-bearing labels** — derived labels containing digits (`a333` → `A333`) do not re-parse as fields; fix in Art MD or gate creation — recorded here because relabel's gate reuses the pattern.
- **Release** — version bump, CHANGELOG, and publish are owned by the next release plan.
- **Inherited follow-ups** — collision reporting, acronym-preserving labels, and the Art Works migration stay in `Plan: Canonical Record Field Names`.

### Feedback

- None — no iteration has been delegated.
