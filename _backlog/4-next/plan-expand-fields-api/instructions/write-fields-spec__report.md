# Sub-Agent REPORT (#producer)

**Plan:** `expand-fields-api`

**Iteration Id:** `write-fields-spec`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Anchored on the instruction's Goals — write `$PACKAGE/knowledge/design/fields.md` as the single field-API specification, extract field content out of `design/records.md`, home the two `### Decisions` sections as ADRs, register the new files, and rewrite the overview:

| Goal                                                                                                            | Outcome                                                                                                                       | Evidence                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Write `design/fields.md` — the fields specification owning every API name                                       | Done — 278 lines, same voice/heading style as `records.md`                                                                    | New file; covers all 10 Scope items (mapping below) plus the extracted field-name contract                                              |
| Extract field content out of `design/records.md`, link the two documents                                        | Done — `records.md` lost 121 net lines; 6 pointers to `fields.md` (Scope, usage, Public API, reserved names, 2 stub sections) | `grep -n "toText\|codec.create\|FieldBlock\|FieldInline" records.md` → no matches; `labelToName`/`nameToLabel` only in the stub pointer |
| Home the two `### Decisions` sections as `knowledge/adr/records.art` and `knowledge/adr/fields.art`             | Done — 8 record decisions + field-decision index and 3 new field decisions, in the `canonical-field-names.art` format         | `grep -c "^### Decisions" $PACKAGE/knowledge/design/records.md` → `0`                                                                   |
| Register the new files in `knowledge/index.md`                                                                  | Done — `design/fields.md` row + new Architecture Decision Records table with all 5 ADRs                                       | `grep -n "fields.md" knowledge/index.md` → row 14; rows 21–25 list the ADRs                                                             |
| Rewrite `knowledge/overview.md` so records and fields are summarised separately, nothing duplicated             | Done — `### Records` and `### Fields` responsibility groups; 8 field use-case rows now link to the spec                       | Programmatic sentence-overlap check: 0 overview sentences appear in any design document                                                 |
| Commit `write-fields-spec` as `docs(records): Write the fields spec and restructure record knowledge.` (NOPUSH) | Done — commit `ec03d9d`, pre-commit hook green, not pushed                                                                    | 6 files, 458 insertions, 121 deletions; `git log origin/main..main` shows only this commit                                              |

#### Scope item → section mapping

All 10 Scope items from Step 2 of the instruction, mapped to their home in `design/fields.md`:

| #   | Scope item                                                                                                               | Section in `design/fields.md`                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 1   | Setting from a `string`, parsed through `codec.parse` (markdown survives)                                                | `## Setting Field Values` → `### Setting from a string`                  |
| 2   | Setting from an Art AST construct (any construct, not a typed-value object)                                              | `## Setting Field Values` → `### Setting from an Art AST construct`      |
| 3   | Automatic form — `FieldBlock` vs `FieldInline` chosen from the value                                                     | `## Automatic Form` (4-step decision procedure)                          |
| 4   | Proxy setter accepts `string \| Construct`; string routed through `codec.parse` (decided over `codec.create`, justified) | `## Setting Field Values` → `### The proxy setter`                       |
| 5   | Dedicated set methods                                                                                                    | `## Setting Field Values` → `### setFieldMarkdown and setFieldConstruct` |
| 6   | Reading as markdown via `codec.serialize`; what changes for existing consumers                                           | `## Reading Field Values` → `### Reading as markdown`                    |
| 7   | Reading as text via `codec.toText`                                                                                       | `## Reading Field Values` → `### Reading as text`                        |
| 8   | Reading raw — not previously exposed (only via `__section` walk); stated                                                 | `## Reading Field Values` → `### Reading raw`                            |
| 9   | Field forms tied to fixtures `025`, `031`, `032` (read and write)                                                        | `## Field Forms and Fixtures` (fixture table)                            |
| 10  | Every method/signature named, consistent with the public surface                                                         | `## Public Field API` (+ signatures where introduced)                    |

API names decided by the spec (plan prescribed none): `setFieldMarkdown(name, markdown)`, `setFieldConstruct(name, construct)`, `getFieldMarkdown(name)`, `getFieldText(name)`, `getFieldConstruct(name)`, proxy read = markdown, proxy write = `string | Construct`; string route = `codec.parse`; markdown read = `codec.serialize` over a `Document` wrapping the field's children with the serializer's trailing newline removed; the five new handle members join the reserved set (8 reachable reserved-label collisions).

#### Files changed

- `$PACKAGE/knowledge/design/fields.md` — **new**: the complete field specification — setting (string/construct/proxy/dedicated methods), automatic form rule, reads (markdown/text/raw), fixture forms `025`/`031`/`032`, public field API names, and the extracted field-name contract + field/section behaviour.
- `$PACKAGE/knowledge/design/records.md` — field passages removed (`## Field Names`, `## Field and Section Behaviour`, reserved-names summary, recipe field detail, both `### Decisions`); one-line pointers left in their place; Scope, Public API, and Notes link to `fields.md`.
- `$PACKAGE/knowledge/adr/records.art` — **new**: 8 records decisions (provider shape, one collection type, unified `ArtRecord`, injected codec, placement/depth, read-only depth, no public capsule, whole-document fidelity).
- `$PACKAGE/knowledge/adr/fields.art` — **new**: field-decision index (3 existing ADR pointers) + 3 new decisions (automatic form, strings parse as markdown, markdown/text/raw reads).
- `$PACKAGE/knowledge/index.md` — `design/fields.md` row and an Architecture Decision Records table covering all 5 ADRs.
- `$PACKAGE/knowledge/overview.md` — rewritten: Purpose links both design docs; Responsibilities split into `### Records` / `### Fields`; field use-case rows link to the spec instead of restating behaviour; fixture ids kept.

## Blockers (if any)

None.

## Feedback

Feedback was not requested for this session.

## Verification

**Precondition (before touching files):** `grep -c "^### Decisions" records.md` → `2`; `ls knowledge/adr/` → `canonical-field-names.art`, `field-name-index.art`, `rename-field-by-name.art`; `git status --short` → empty. All passed.

**Setting up:** `npm ci` from `$WORKSPACE` and `$PROJECT` — no `package-lock.json` change, tree stayed clean.

**Step verifications:**

- Step 1 — inventory recorded: field passages (Field Names, Field and Section Behaviour, recipe field ops, Public API reserved-names summary, 2 Decisions sections) vs records passages kept (usage flow, provider/collections, placement, persistence, codec boundary, source layout, testing, notes); fixtures `025`/`031`/`032` `.md.json` ASTs read; `ArtCodec` surface read (`parse`, `serialize`, `create`, `toText`, `getConstructFactory`); read/write behaviour of the three fixtures exercised empirically against `@art-md/codec` to ground the spec's read mechanism and parse classification.
- Step 2 — every Scope item mapped (table above); `npm run lint` from `$PACKAGE` green.
- Step 3 — `grep -n "toText\|codec.create\|FieldBlock\|FieldInline" records.md` → no matches; `grep -c "^### Decisions"` → `0`; 6 `fields.md` links in `records.md`.
- Step 4 — both ADRs use `# Records - <Title>` / `**Purpose:**` / `## Decision: …` / `**Status:** Adopted` / `**Context:**` / `**Decision:**` / `**Consequences:**`, matching `canonical-field-names.art`.
- Step 5 — index row present; sentence-overlap checks: overview↔design docs `0`, records↔fields `0`, fields↔fields ADR `0`, overview↔ADRs `0`.
- Step 6 — `npm run lint:fix` + `npm run lint` from `$PACKAGE` green (prettier, eslint, `tsc --noEmit`); `npm run ci` from `$PROJECT` green (8/8 turbo tasks); change set documentation-only (`git status`/`git diff --stat` showed exactly the six `knowledge/**` paths).

**Final verification:**

- Commit `ec03d9d1fb44ccaceca71fa8ea2899529b083101` exists locally and was **not pushed** (`main` ahead of `origin/main` by 1; commit policy `NOPUSH`).
- Only `$PACKAGE/knowledge/**` paths in the commit: `design/fields.md`, `design/records.md`, `knowledge/index.md`, `knowledge/overview.md`, `knowledge/adr/records.art`, `knowledge/adr/fields.art`. No source, test, manifest, lock, changelog, backlog, or roadmap file.
- `grep -c "^### Decisions" $PACKAGE/knowledge/design/records.md` → `0`; `records.md` links `fields.md` in 6 places.
- `knowledge/index.md` lists `design/fields.md` and all five ADRs; `overview.md` summarises records and fields separately with 0 duplicated sentences.
- Spec cites fixtures `025`, `031`, `032` (6 citations) for both read and write.
- `npm run ci` passes from `$PROJECT` (standalone and again inside the pre-commit hook: `0-clean`, `1-extract`, `2-ci` all green).
- Pre-commit hook ran `npm run clean`, `npm run extract`, `npm run ci` — no failure, no `--no-verify`. No push, no `npm version`, no `npm publish`.
- `./instructions/write-fields-spec__report.md` (this file) left **unstaged** for the delegator to commit.
