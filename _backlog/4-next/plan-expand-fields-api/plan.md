# Plan: Expand Fields API

**ID:** `expand-fields-api`

**Status:** `DELIVERED`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Has Context File:** `FALSE`

**Skill:** `write-plan`

**Purpose:** Give `@art-js/records` a field API that can write and read field _forms_ — markdown strings, Art AST constructs, and rendered text — instead of only type-erased text.

**Description:** Today a field read is type-erased through `codec.toText` and a field write always creates a `type: 'text'` expression through `codec.create`, so code spans lose their backticks on write and consumers cannot express or inspect field forms. This plan first writes a fields specification (`design/fields.md`) that names the full API, then implements it: construct-or-string writes with automatic block/inline choice, and reads as markdown, text, or raw Art AST. API names are deliberately owned by the spec, not by this plan.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `checkouts/art-md/knowledge/design/art-md-fixture-tests.md` (Design) — How Art MD fixture tests work; required before exploring the field fixtures under `$ART_MD/libs/constructs/test/fixtures/`.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                                       |
| ------------ | ---------------------------- | --------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                      |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates   |
| `$SKILLS`    | `$WORKSPACE/.agents/skills`  | Art agent modes and skills                    |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes       |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package                 |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout — codec, constructs, fixtures |

## Context

- **How the workspace reads and writes fields today.** A read goes `capsule getField → context.codec.toText(field)` — the codec's text method type-erases the construct, so `` **Location:** `art-works` `` reads back as `art-works` and the backticks are dropped. A write goes `setSectionField / appendSectionField → codec.create('NaturalExpression', { type: 'text', … })` (blocks via `codec.create('NaturalBlock', …)`) — so nothing is ever written back _with_ backticks: the authored form is lost on the first update, and a read cannot tell text from code span.
- **The need for a wider field API.** Consumers need to set fields from a markdown string or directly from an Art AST construct, and to read a field as rendered markdown, as text, or as the raw construct — with block-vs-inline chosen from the value, not by the caller.

## Summary

Write the fields spec (`design/fields.md`) with the knowledge base reorganised around it, then implement the spec's expanded field API in `@art-js/records` — string/construct writes with automatic field form, and markdown/text/raw reads — without a version bump in this plan.

## Scope

Changes are confined to `$PACKAGE` source and `$PACKAGE/knowledge`; Art MD is read-only reference (codec API and fixtures), and no publish happens here.

### (Scope) Package: Records

**Record:** `$PACKAGE/_records/package.art`

**Role:** — Changes required.

**Partial:**

- `owner` — Project: Art JS
- `path` — `$PACKAGE/`
- `canonicalName` — `@art-js/records`
- `published` — `true`

**Changes:**

- Create a separate spec for record fields at `$PACKAGE/knowledge/design/fields.md`. The spec contains all API details for the items below, plus anything else surfaced while writing it. This plan intentionally does **not** prescribe API names — names belong to the spec.
- Restructure the knowledge base around the spec: create `design/fields.md` hosting the field details currently in `design/records.md`; link `design/records.md` → `design/fields.md` and deduplicate every piece of field content out of it; home all decisions — there are **two** `### Decisions` sections in `design/records.md` — to `adr/records` and `adr/fields`; register `design/fields.md` and the new ADRs in `knowledge/index.md`; update `knowledge/overview.md` to summarise `records` and `fields` **separately and clearly**, duplicating neither.
- Implement the spec changes:
  - Expand the field API to allow **setting** a field from a `string` — parsed through `codec.parse` — or directly from Art AST: literally any Art construct, created by the consumer. Not a freeform `TypedFieldValue`.
  - Do not allow choosing between block/inline — the form is chosen automatically from the value being set.
  - The proxy setter accepts `string | Construct`; a string input probably needs `codec.create` to create the text node.
  - Also expose a specific method to set a string value and one to set a construct value.
  - Expand the field API to allow **reading** values as a string, as Art AST nodes, or as parsed markdown.
  - The default proxy accessor uses `codec.serialize` and returns markdown (it currently returns text through `codec.toText`).
  - Also expose a specific method to read a field as text (uses the codec's text method instead of `serialize`).
  - Also expose a specific method to read a field raw — if not already in the API.

## Execution Context

Execution occurs from `$WORKSPACE/`; package work is performed in `$PROJECT` on branch `main`, with source under `$PACKAGE/src/record/private/` and knowledge under `$PACKAGE/knowledge/`. The Art MD fixtures at `$ART_MD/libs/constructs/test/fixtures/` (e.g. `025-field-block-with-code.md` + `.md.json`, `031-field-inline-with-inline-formatting.md` + `.md.json`, `032-field-inline-with-multiple-lines.md` + `.md.json`) are read-only reference for the spec's field-form examples.

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

- Fixture Tests: Art MD – `checkouts/art-md/knowledge/design/art-md-fixture-tests.md` — how fixture tests work, before exploring `$ART_MD/libs/constructs/test/fixtures/`.
- Design: Records – `$PACKAGE/knowledge/design/records.md` — the current field content to extract and deduplicate.
- Overview: Records – `$PACKAGE/knowledge/overview.md`
- Index: Records – `$PACKAGE/knowledge/index.md`
- Guide: Art JS – `$PROJECT/_guide.md`
- Guide: Records – `$PACKAGE/_guide.md`
- Conventions: TypeScript – `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md`
- Conventions: Unit Tests – `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md`

---

## Items

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                   | Status |
| -------------------------------------------------------------------------- | ------ |
| Iteration: Write Fields Spec `./instructions/write-fields-spec.md`         | `DONE` |
| Iteration: Implement Fields Spec `./instructions/implement-fields-spec.md` | `DONE` |

### Iteration: Write Fields Spec

**Id:** `write-fields-spec`

**Status:** `DONE`

**Purpose:** Produce `design/fields.md` — the single specification of the records field API — with the knowledge base reorganised around it.

**Description:** Writes the spec containing all API details for the expanded set/read surface (and anything more surfaced during writing), extracts every field-related detail out of `design/records.md` into it, links the two, homes the two existing `### Decisions` sections to `adr/records` and `adr/fields`, registers the new files in `knowledge/index.md`, and rewrites `knowledge/overview.md` as a summary that keeps `records` and `fields` separate. Explores the Art MD field fixtures for the field-form vocabulary (block with code, inline formatting, multi-line inline).

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Create `$PACKAGE/knowledge/design/fields.md` with the full API specification — every item from the Scope's implementation list, plus everything the spec writing surfaces; this is where API names live.
- Move field content from `$PACKAGE/knowledge/design/records.md` into `fields.md`; link `records → fields`; remove all duplicated content.
- Split the two `### Decisions` sections of `design/records.md` into `knowledge/adr/records.art` and `knowledge/adr/fields.art`.
- Register `design/fields.md` and the new ADRs in `knowledge/index.md`.
- Rewrite `knowledge/overview.md` to summarise `records` and `fields` separately and clearly, without duplicating either.
- Reference the Art MD fixtures named in Execution Context for concrete field-form examples.

#### Commits:

| ID                  | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------- | -------------------------------- | -------- | --------- | ----------- |
| `write-fields-spec` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `ec03d9d` | `COMMITTED` |

##### Commit: `write-fields-spec`

**Repository:** Art JS

**Message:**

```text
docs(records): Write the fields spec and restructure record knowledge.

- Extract field content from the records design into design/fields.md.
- Home both decision sections as adr/records and adr/fields.
- Register the new files and reduce the overview to summaries.
```

### Iteration: Implement Fields Spec

**Id:** `implement-fields-spec`

**Status:** `DONE`

**Purpose:** Ship the expanded field API exactly as the spec defines it.

**Description:** Executes `./instructions/implement-fields-spec.md` against the reviewed `design/fields.md`: string sets parsed through the codec with automatic block/inline form, `setFieldValue` over construct or readonly-array values, the markdown default accessor with `getFieldText`/`getFieldValue` reads, and the five reserved handle members — with the unit tests and both integration suites aligned to the spec. Every API name is owned by the spec, not by this plan.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-fields-spec.md`

**Report:** `./instructions/implement-fields-spec__report.md`

**Changes:**

- Implement every set/read change from the Scope as specified in `design/fields.md`: string (via `codec.parse`) and construct/readonly-array value sets with automatic block/inline selection; proxy setter accepting `string | number | boolean | Construct | readonly Construct[]`; the dedicated `setFieldMarkdown` and `setFieldValue` methods; default proxy read returning markdown via `codec.serialize`; `getFieldText` via `codec.toText`; `getFieldValue` as a deep clone of the field's value.
- The instruction's preconditions pin the reviewed spec revision and BLOCK if the spec moves; anything a later review finds missing still goes back into the spec first.
- Land the implementation with its tests, green at every commit.

#### Commits:

| ID                     | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ---------------------- | -------------------------------- | -------- | --------- | ----------- |
| `implement-fields-api` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `a87a7a4` | `COMMITTED` |

##### Commit: `implement-fields-api`

**Repository:** Art JS

**Message:**

```text
feat(records): Expand the field API with the fields spec.

- Parse string sets through the codec and choose the field form from the value.
- Return markdown from the accessor and add text and value reads.
- Reserve the five new handle members and align both suites with the spec.
```

## Work

### Next

Both iterations are `DONE`: the spec as `ec03d9d` and the implementation as `a87a7a4` (27 files, +1613/−27, `NOPUSH`, hook green; 610 package + 40 consumer tests, coverage 96.1/91.4/97.9/96.1 over the 90/90/70/90 gate). The plan is `DELIVERED`. Immediate next: the **post-ship docs pass** from Follow Ups — flip `design/fields.md`'s `Status:` line and the v0.0.1 field-behaviour text in `records.md` (stale accessor examples included) in one small docs commit — then `Plan: Create Lib Records` proceeds to `0.1.1`, which now carries this API.

### Blockers

- None — both iterations are `DONE`; the post-ship docs pass is tracked under Follow Ups.

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

- **API names in this plan** — names belong to `design/fields.md`; this plan states intent only.
- **Publishing** — no version bump here; `0.1.1` is owned by `Plan: Create Lib Records` iteration `Publish and Update Knowledge`.
- **Art MD changes** — the codec, constructs, and fixtures are read-only reference.
- **Consumer migration** — no `$ART_WORKS` changes; consumers adopt the spec's API when they choose.

### Evidence

- **Commit `a87a7a4` (`NOPUSH`)** — the spec implemented as written: `classifySectionFieldValue` (parse/classify/reject with both verbatim `TypeError`s, scalars coerce, empty array clears), markdown default read via `codec.serialize` + newline strip, `getFieldText` byte-for-byte old accessor, `getFieldValue` deep clone, five reserved handle members (nine entries / eight reachable label collisions). 27 files, +1613/−27; `$PACKAGE` 610 tests at coverage 96.1/91.4/97.9/96.1 (gate 90/90/70/90), `$TESTS` 40 tests, repo `npm run ci` 8/8 in the hook; round-trip Evidence pinned by `21-code-span-round-trip` (7 cases), plus new fixtures `22-automatic-form`, `23-value-set`, `24-rejected-values`, and consumer fixture `08-field-value-reads`. Report: `./instructions/implement-fields-spec__report.md`.
- The spec exists at `design/fields.md` and every item in the Scope's API-change list is covered by it, verifiable section by section.
- `design/records.md` contains no field content or decisions after the restructure; `knowledge/index.md` lists `design/fields.md` and both new ADRs; `knowledge/overview.md` summarises `records` and `fields` separately with no duplicated content.
- Field-form examples in the spec are traced to Art MD fixtures (`025`, `031`, `032` and their `.md.json` Art AST pairs).
- The implemented API passes its tests with `npm run ci` from `$PROJECT`, and a written-back code span round-trips: `` **Location:** `x` `` survives a value update of another field and a typed write re-emits its fence.

### Findings

- **Where the field API is put together:** assembly is `$PACKAGE/src/record/wrapSectionAsRecord.ts` → capsule + proxy at `$PACKAGE/src/record/private/capsule/createRecordCapsule.ts` (read: `getField → context.codec.toText(field)`; write: `setField`) and `$PACKAGE/src/record/private/capsule/createRecordProxy.ts`; field I/O at `$PACKAGE/src/record/private/section-field/{setSectionField,appendSectionField,deleteSectionField,isSectionField}.ts` (already using `codec.create<NaturalExpression>('NaturalExpression', { type: 'text', … })` and `codec.create<NaturalBlock>('NaturalBlock', …)`); index at `$PACKAGE/src/record/private/field-index/`; names at `$PACKAGE/src/record/private/field-name/`.
- **Where it is exposed from:** `$PACKAGE/src/index.ts` (types `ArtRecord`, `RecordContext`, `RecordSection`, then `export * from './api/index.js'`) and `$PACKAGE/src/api/index.ts` (`createRecordsDocument`, `createRecord`).
- **The codec surface available to the spec** (`$ART_MD/libs/primitives/src/codec/types.ts`, `ArtCodec`): `parse(markdown) → ParseResult` (`.document`), `serialize(document) → SerializeResult` (`.content`), `create<C>(name, …args)` (construct factories from `$ART_MD/libs/constructs/src/factories/public.ts`), `toText(construct) → string`, `getConstructFactory(name)`.

### Decisions

- **Spec first, names later.** This plan never prescribes API names; after the spec lands, the plan is checked against the Scope's API-change list before implementation instructions are written. This keeps the plan draft stable while the spec matures.
- **Form is chosen, not requested.** Block vs inline follows the value being set; the caller never selects it.
- **No freeform typed-value object.** Sets come from a string or from an Art AST construct the consumer created.

### Knowledge to Update

- **`$PACKAGE/knowledge/design/fields.md`** — new; hosts all field API details and the spec.
- **`$PACKAGE/knowledge/design/records.md`** — field content extracted, decisions homed, linked to `fields.md`.
- **`$PACKAGE/knowledge/adr/records.art`, `$PACKAGE/knowledge/adr/fields.art`** — new; both existing `### Decisions` sections.
- **`$PACKAGE/knowledge/index.md`** — register `design/fields.md` and the new ADRs.
- **`$PACKAGE/knowledge/overview.md`** — summarise `records` and `fields` separately; no duplication.

### Follow Ups

- **Tagged construct consistency** — all tagged constructs should expose their tags consistently (the raw value read vs `record.__section`); revisit alongside the field API.
- **Post-ship docs pass** — after `implement-fields-spec` lands, flip the `Status:` line of `design/fields.md` and the v0.0.1 field-behaviour text in `records.md` (stale accessor examples included) to the implemented state; a separate small docs commit, outside both iterations.
- The spec exists at `design/fields.md` — further follow-ups accumulate here as the implementation surfaces them.

### Feedback

- **Implementation observation (2026-11-05)** — an empty `FieldInline` (Automatic Form rule 1, the bare label line) serialises as `**Label:**&#x20;` — the codec's own escaping of the empty inline; it re-parses to the same empty `FieldInline` with `children: []`, so the round trip is stable. Asserted structurally in the unit suites; worth one line in the post-ship docs pass.
- No persisted-markdown expectation needed changing: both suites were green against the new implementation on first run.
