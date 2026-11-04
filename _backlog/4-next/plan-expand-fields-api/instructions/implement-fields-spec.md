# Instructions: `implement-fields-spec`

**Plan:** `expand-fields-api`

**Iteration Id:** `implement-fields-spec`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Preconditions:** the specification is the contract of this iteration. Confirm the contract revision you implement against before touching any file:

```bash
export PACKAGE="${WORKSPACE:-$(pwd)}/checkouts/art-js/libs/records" # Setting Up runs from the workspace root; guards an unset $PACKAGE
grep -q "setFieldValue(name: string, value: Construct | readonly Construct\[\]): void;" $PACKAGE/knowledge/design/fields.md && echo SIG-OK   # must print SIG-OK (methods block + Public API block)
grep -q "Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline" $PACKAGE/knowledge/design/fields.md && echo CONTAINER-OK  # must print CONTAINER-OK
! grep -q "same objects the section holds" $PACKAGE/knowledge/design/fields.md && echo NO-STALE  # must print NO-STALE
```

These pin the reviewed ruling set: **`setFieldValue` takes `Construct | readonly Construct[]`, container constructs (including `Document`) are rejected, and raw reads return a deep clone of the field's value — never live objects.** If any check fails, the spec has moved again: REPORT A BLOCKER with the current text rather than implementing a stale revision.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-fields-spec__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `implement-fields-spec`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                | Purpose                                       |
| ------------ | ---------------------------- | --------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                      |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates   |
| `$SKILLS`    | `$WORKSPACE/.agents/skills`  | Art agent modes and skills                    |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes       |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package                 |
| `$TESTS`     | `$PROJECT/tests/records`     | The `@art-js/test-records` integration suite  |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout — codec, constructs, fixtures |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `implement-fields-spec`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Implement `$PACKAGE/knowledge/design/fields.md` exactly as specified: sets from a `string` (routed through `codec.parse`) or from a construct / readonly array of constructs with **automatic** block/inline form selection, the proxy setter accepting `string | number | boolean | Construct | readonly Construct[]` and delegating to `setFieldMarkdown`/`setFieldValue`, the default accessor returning **markdown** via `codec.serialize`, and the new `getFieldText` (via `codec.toText`) and `getFieldValue` (deep clone of the field's value) reads. Reserve the five new handle-member names, update the unit tests and both integration suites to the spec (read expectations flip from text to markdown where the spec says so; persisted markdown must stay honest), keep the coverage gate green, and commit as `feat(records): Expand the field API with the fields spec.`

Behaviour **changes by design** — this is not a behaviour-preserving refactor. The one invariant that must hold after your change, verbatim from the spec's Evidence: a written-back code span round-trips — `` **Location:** `x` `` survives a value update of another field, and a typed write re-emits its fence.

Commit `implement-fields-spec` is `NOPUSH`.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript.

::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — Conventions: Unit Tests.

- **spec (the contract):** `$PACKAGE/knowledge/design/fields.md` — every behaviour, signature, error message, and fixture tie-in you implement. When this instruction and the spec appear to disagree, the spec wins; REPORT A BLOCKER if the disagreement is unresolvable.
- **decisions:** `$PACKAGE/knowledge/adr/fields.art` — the read model (markdown default, deep clone of the value), the string-set route, the automatic form rule, the merged field-name decisions.
- design: `$PACKAGE/knowledge/design/records.md` — the records model the handle sits on; `ArtRecord` is a member set of this surface.
- reference: `$ART_MD/libs/primitives/src/codec/types.ts` — `ArtCodec`: `parse(markdown) → ParseResult` (`.document`), `serialize(document) → SerializeResult` (`.content`), `create`, `toText`, `getConstructFactory`.
- guide: `$PACKAGE/_guide.md` — package layout, scripts (`lint`, `build`, `test`, `test:ci`), operating instructions.
- guide: `$TESTS/_guide.md` — integration suite layout and operating instructions.
- guide: `$PROJECT/_guide.md` — repository layout, workspaces, and operating instructions.
- guide: `$WORKSPACE/_guide.md` — workspace orientation and operating instructions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root, and again from the `$PROJECT` root — the workspace is not a build root, every project repo builds standalone:

```bash
npm ci # to install dependencies.
```

If `npm ci` changes `$PROJECT/package-lock.json`, revert that file and REPORT A BLOCKER — this iteration changes no dependency.

### Verifying Step

**Purpose:** Validate lint, tests and coverage for a package step.

**Instructions:** (From `$PACKAGE/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run test:ci # to run with coverage — the gate is lines 90, functions 90, branches 70, statements 90
npm run build # to produce a full build
```

From `$PACKAGE` also use the narrower scripts while iterating: `npm run test:unit` and `npm run test:integration`.

### Verifying Completion

**Purpose:** Confirm the work item satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root:

```bash
npm run ci # lint, test and build
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there — or reuse the blueprint message provided at the commit step, which is already authored.

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 9 — Extend the reserved-name contract and the handle types with the five new members
- Step 2 / 9 — Implement content extraction and automatic form in the section-field helpers
- Step 3 / 9 — Implement the capsule set routes and the three reads
- Step 4 / 9 — Expose the five methods on the record proxy
- Step 5 / 9 — Update the unit tests to the spec
- Step 6 / 9 — Update and extend the `$PACKAGE` integration fixtures
- Step 7 / 9 — Update and extend the `$TESTS` integration suite
- Step 8 / 9 — Verify coverage and behaviour against the spec
- Step 9 / 9 — Verify and commit `implement-fields-spec`

## Steps

### Step `1 / 9` — Extend the reserved-name contract and the handle types with the five new members

**Description:** The five new methods are handle members: they appear on `ArtRecord`, on the internal capsule, and in the reserved-name set so no document label can collide with them.

**Instructions:**

1. MODIFY `$PACKAGE/src/record/private/constants.ts` — extend `RESERVED_FIELD_NAMES` with `setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, keeping the existing four (`name`, `save`, `renameField`, `__section`) first — nine entries, matching the spec's **Reserved names** section. Extraction aborts automatically: `createFieldIndex.ts` throws `TypeError: Field label "…" resolves to reserved name "…"` through `isReservedFieldName`, which the spec keeps.
2. MODIFY `$PACKAGE/src/record/types.ts` — add the five signatures to `ArtRecord` exactly as the spec's **Public Field API** block states:

   ```ts
   setFieldMarkdown(name: string, markdown: string): void;
   setFieldValue(name: string, value: Construct | readonly Construct[]): void;
   getFieldMarkdown(name: string): string | undefined;
   getFieldText(name: string): string | undefined;
   getFieldValue(name: string): readonly Construct[] | undefined;
   ```

   Import `Construct` as a type from `@art-md/constructs`. The index signature `[fieldName: string]: unknown` and the existing members stay unchanged.

3. MODIFY `$PACKAGE/src/record/private/types.ts` — extend `ArtRecordCapsule` with the internal counterparts you will implement (the capsule is internal; name them after the handle methods so the mapping is obvious).
4. Do **not** change `$PACKAGE/src/index.ts` or `$PACKAGE/src/api/index.ts`: the new members ride on the already-exported `ArtRecord` type, and no new runtime export exists.

**Expected outcome:** `tsc --noEmit` reports the capsule and proxy missing the new members (you add them in Steps 3–4); the reserved set has nine entries.

**Verify:** `npm run lint` compiles to the expected missing-member errors only.

### Step `2 / 9` — Implement content extraction and automatic form in the section-field helpers

**Description:** Replace the type-erased `String(value)` writes with parse/classify/install, shared by the update path and the append path.

**Instructions:**

1. Rewrite `$PACKAGE/src/record/private/section-field/setSectionField.ts` as the **update** route and rework `$PACKAGE/src/record/private/section-field/appendSectionField.ts` as the **create** route, both driven by the spec's `content(value)` and classification rules (`## Automatic Form`):
   - `string` (and `number`/`boolean`, coerced first with `String(value)`) → `codec.parse(value).document.children`.
   - a single `Construct` → `[value]`, installed as-is without re-encoding through markdown.
   - a readonly array of constructs → its members, in order.
   - Container rejection **before** anything else — as the value, as an array member, or inside parsed string content: a `Document`, `SectionBlock`, `FieldBlock`, or `FieldInline` throws `TypeError: Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline`. There is **no** `Document` unwrapping.
   - Any other input (`null`, `undefined`, a plain object, an array whose members are not all constructs) throws `TypeError: Field value must be a string, number, boolean, or Art AST value`. An empty array is a **legal value**: like an empty string it produces empty content and clears the field to a bare label line, and `getFieldValue` then returns `[]`.
   - Classification: empty content → `FieldInline` with no children; exactly one paragraph `NaturalBlock` → `FieldInline` with the paragraph unwrapped to its expression children; all children are `NaturalExpression` → `FieldInline`; otherwise → `FieldBlock`. In the update route, a classification change converts the field construct **in place**, preserving `name`, `tags`, and `position`, then replaces `children`.
2. The append route builds the same classified field with `name: nameToLabel(name)` and pushes it to `section.children` — it is no longer always `FieldInline`.
3. Factor the shared `content(value)` + classification into one private module under `section-field/` (your naming; it is internal) so update and append cannot drift. Keep `setSectionField(codec, field, value)` and `appendSectionField(codec, section, name, value)` shapes unless the capsule needs a different seam — the capsule is the only consumer (`grep -rn "setSectionField\|appendSectionField" $PACKAGE/src`).

**Expected outcome:** no `String(value)` blanket coercion beyond the documented `number`/`boolean` route; the three spec error messages appear verbatim; writing a fenced-code string to an existing inline field converts it to `FieldBlock` with the fence intact.

**Verify:** `npm run lint` and `npm run test:unit` from `$PACKAGE` (existing failures are expected only where the old behaviour is asserted — fixed in Step 5).

### Step `3 / 9` — Implement the capsule set routes and the three reads

**Description:** Give the capsule the five methods and change its default field read from text to markdown.

**Instructions:**

In `$PACKAGE/src/record/private/capsule/createRecordCapsule.ts`:

1. `getField` returns markdown: serialise a `Document` whose children are the field's children — `context.codec.serialize({ construct: 'Document', children: field.children }).content` — and strip the single trailing newline the serializer emits. Missing name still returns `undefined`.
2. `getFieldMarkdown` is that same read, named; `getFieldText` returns `context.codec.toText(field)` (the v0.0.1 accessor behaviour, byte-for-byte); `getFieldValue` returns a **deep clone of the field's value** — a `readonly Construct[]` of the field's children (`[]` when the field exists but is empty, `undefined` for a missing name). The clone excludes the label and tags: the container stays reachable only through `record.__section`. Mutations to the clone must never touch the document or the index.
3. `setField(name, value)` keeps its dispatch role (existing field → update route, missing → `assertFieldName` then append route) and now delegates the value handling to the shared Step 2 logic; add `setFieldMarkdown(name, markdown)` and `setFieldValue(name, value)` as the two explicit routes the proxy delegates to. Creation still goes through the canonical-grammar gate and the reserved-name throw.
4. `renameField`, `deleteField`, `save`, `getName`/`setName` are untouched.

**Expected outcome:** reading a field with markup returns markdown (`` `x` ``, `_em_` intact); `getFieldText` reproduces the old accessor; `getFieldValue` clones are isolated (`clone[0].children.push(...)` does not move the document's field).

**Verify:** `npm run lint` and `npm run test:unit` from `$PACKAGE`.

### Step `4 / 9` — Expose the five methods on the record proxy

**Description:** The handle members exist as own properties of the proxy target, alongside `name`, `__section`, `renameField`, `save`.

**Instructions:**

1. MODIFY `$PACKAGE/src/record/private/capsule/createRecordProxy.ts` — add value descriptors for the five methods (same pattern as `renameFieldDescriptor`/`saveDescriptor`), each routing to its capsule counterpart. Method calls therefore never hit the field-addressing traps.
2. The traps stay: dynamic field properties still `assertNotReservedFieldName`, and the get trap now yields markdown because `capsule.getField` does. `has`, `ownKeys`, and `getOwnPropertyDescriptor` keep using `capsule.getField` — their value snapshots become markdown consistently.
3. Proxy `set` validates through the capsule routes: a rejected value throws the Step 2 `TypeError`s; the setter returns `true` only on success.

**Expected outcome:** `record.setFieldMarkdown(…)` etc. work on the handle; `typeof record.getFieldValue === 'function'`; a document label resolving to a new member name aborts extraction (Step 1 constants) and addressing one dynamically throws the reserved `TypeError`.

**Verify:** `npm run lint` and `npm run test:unit` from `$PACKAGE`.

### Step `5 / 9` — Update the unit tests to the spec

**Description:** Existing assertions that encoded v0.0.1 behaviour are corrected to the spec; new behaviour gets direct coverage.

**Instructions:**

1. Find every stale assertion with the suites as the driver: run `npm run test` from `$PACKAGE` and reconcile each failure against the spec — a failure is only fixed by changing the **expectation**, never by weakening the implementation.
2. Known correction areas:
   - Reserved-name fixtures: `$PACKAGE/tests/record-helpers/isReservedFieldName.fixtures.ts`, `recordReservedLabel.fixtures.ts`, and `src/record/private/field-name/isReservedFieldName.test.ts` — the reserved set is now nine; the reachable document collisions are eight (`Name`, `Save`, `Rename Field`, `Set Field Markdown`, `Set Field Value`, `Get Field Markdown`, `Get Field Text`, `Get Field Value`).
   - Read expectations: any accessor-style assertion whose value carries markup now expects markdown (`## Reading Field Values` gives the `031` before/after).
   - Coercion: `null`/plain objects/arrays whose members are not all constructs now throw instead of `String(value)`-coercing; `number`/`boolean` still store.
3. Add direct unit coverage for: `content()` classification (all four rules), in-place form conversion preserving `name`/`tags`/`position`, empty string → bare label line, container rejection (value, array member, parsed content), the empty value (`''` and `[]`) clearing to a bare label line, `number`/`boolean` coercion, `setFieldValue` with an array of constructs, deep-clone isolation of `getFieldValue` (and `[]` for an empty field), markdown round-trip (`setFieldMarkdown` → read returns the input modulo parser normalisation), and the trailing-newline strip.

**Expected outcome:** unit suite green; every spec error message is asserted verbatim somewhere.

**Verify:** `npm run lint` and `npm run test:unit` from `$PACKAGE` are green.

### Step `6 / 9` — Update and extend the `$PACKAGE` integration fixtures

**Description:** The fixture suite proves the spec end to end over real documents, including the round-trip Evidence.

**Instructions:**

1. Run `npm run test:integration` from `$PACKAGE`; reconcile every failure against the spec. Classification of changes:
   - **Read assertions on markup-bearing values** flip to markdown form (spec's `Field Forms and Fixtures` table gives exact expected strings for `025`, `031`, `032`).
   - **Persisted-markdown assertions** must stay byte-identical for plain writes — if one changes, stop and analyse: only a genuine write-semantics change (markdown now parsed, form now classified) justifies it. List every changed expectation in your report with the spec clause that justifies it. Never update a fixture to make an implementation bug pass; if a persisted change is unjustified, REPORT A BLOCKER with the diff.
2. Add fixture coverage for what the spec's Evidence demands (next free fixture ids under `$PACKAGE/tests/fixtures/`):
   - code-span round trip: set `` `x` ``-valued field, update **another** field, save — the code span survives; and a typed fenced-code write re-emits its fence (block form).
   - automatic form: a phrasing-only value converts a block field to inline, and a block value appends as `FieldBlock`.
   - value set: a consumer-built `NaturalBlock` (code) installed through `setFieldValue` round-trips; an array of constructs installs in order.
   - rejected inputs: `null` and a `Document`/`SectionBlock` value throw the spec messages through the proxy.

**Expected outcome:** integration green; the round-trip Evidence holds in a committed fixture; every changed expectation justified in the report.

**Verify:** `npm run test:integration` from `$PACKAGE` green; `git diff --stat` shows only source and test paths.

### Step `7 / 9` — Update and extend the `$TESTS` integration suite

**Description:** The consumer-facing suite resolves `@art-js/records` through `$PACKAGE/dist` and must agree with the new reads.

**Instructions:**

1. Rebuild first — `$TESTS` resolves the package through its `dist`:

   ```bash
   npm run build # from $PACKAGE
   ```

2. From `$TESTS`: `npm run lint:fix`, `npm run lint`, `npm run test`. Reconcile failures against the spec exactly as in Step 6 — read expectations flip, persisted expectations stay unless genuinely changed.
3. Extend the suite where it owns coverage the package fixtures do not (fixture ids under `$TESTS/fixtures/`): at minimum a read-path fixture asserting the markdown default and the `getFieldText`/`getFieldValue` methods side by side.

**Expected outcome:** `$TESTS` green against the rebuilt `dist`, with at least one fixture asserting all three reads.

**Verify:** `npm run ci` from `$TESTS` green.

### Step `8 / 9` — Verify coverage and behaviour against the spec

**Description:** Prove the spec is implemented, not approximated, under the real coverage gate.

**Instructions:**

1. From `$PACKAGE`: `npm run lint:fix`, `npm run lint`, `npm run test`, `npm run test:ci` — coverage must pass lines 90 / functions 90 / branches 70 / statements 90 over `src/`. New code is uncovered code: add tests rather than adjusting thresholds.
2. From `$TESTS`: `npm run ci`.
3. From `$PROJECT`: `npm run ci` (repo-wide prettier and turbo).
4. Map every Scope API-change item to code and tests — include this mapping (item → source file → test file) in your report:

   | #   | Scope item                                                                      | Source | Test |
   | --- | ------------------------------------------------------------------------------- | ------ | ---- |
   | 1   | string set via `codec.parse`                                                    |        |      |
   | 2   | value set from construct / readonly array (no typed-value object)               |        |      |
   | 3   | automatic block/inline form                                                     |        |      |
   | 4   | proxy setter `string \| number \| boolean \| Construct \| readonly Construct[]` |        |      |
   | 5   | `setFieldMarkdown` + `setFieldValue`                                            |        |      |
   | 6   | default accessor = markdown via `codec.serialize`                               |        |      |
   | 7   | `getFieldText` via `codec.toText`                                               |        |      |
   | 8   | `getFieldValue` deep clone of the value                                         |        |      |
   | 9   | field forms tie to fixtures `025`/`031`/`032`                                   |        |      |
   | 10  | five names reserved and typed on `ArtRecord`                                    |        |      |

5. Confirm no `codec.create('NaturalExpression', { type: 'text' … })`-style literal write remains in the set path: `grep -rn "type: 'text'" $PACKAGE/src` must return nothing outside fixtures/helpers that legitimately build literals.

**Expected outcome:** all gates green; the mapping is complete; the round-trip Evidence reproduced in the report (paste the passing fixture run).

**Verify:** the three `npm run ci` invocations pass in order: `$PACKAGE`, `$TESTS`, `$PROJECT`.

### Step `9 / 9` — Verify and commit `implement-fields-spec`

**Description:** Run the full verification and record the implementation.

**Instructions:**

1. Re-run the **Verifying Step** from `$PACKAGE` and the **Verifying Completion** from `$PROJECT`.
2. Review the change set:

   ```bash
   git status --short
   git diff --stat
   ```

   - Only `$PACKAGE/src/**` and `$PACKAGE/tests/**` (plus `$TESTS/**` if Step 7 changed it) appear **as your modifications**.
   - **Never** `$PACKAGE/knowledge/**` (its post-ship Status flip is a plan Follow Up, outside this iteration), never `package.json`, `package-lock.json`, `CHANGELOG.md`, `_backlog`, `_roadmap`, `dist`, `node_modules`.

3. Stage the changed paths **explicitly** (file by file, or `git add $PACKAGE/src $PACKAGE/tests $TESTS/src $TESTS/fixtures` once you have confirmed those trees contain only your changes). Never `git add -A` or `git add .`.
4. Check `git diff --cached --name-only` against your change list — it must match your change set exactly.
5. Commit from `$PROJECT`.

**Message:**

```text
feat(records): Expand the field API with the fields spec.

- Parse string sets through the codec and choose the field form from the value.
- Return markdown from the accessor and add text and value reads.
- Reserve the five new handle members and align both suites with the spec.
```

The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push and do **not** run `npm version`, `npm publish`, or any release command: publishing is a separate, explicit decision.

---

## Final Verification

**Instructions:**

- Verify the commit exists locally and was **not** pushed.
- Verify the commit contains only `$PACKAGE/src/**`, `$PACKAGE/tests/**`, and `$TESTS/**` paths — no `knowledge/`, no manifest, no lock, no backlog, no roadmap.
- Verify the Scope mapping (Step 8) is complete: every one of the 10 items has a source file and a test file.
- Verify the spec's five methods exist on the handle, carry the spec's exact signatures on `ArtRecord`, and are in `RESERVED_FIELD_NAMES` (nine entries).
- Verify the default accessor returns markdown: a field set with `` `x` `` reads back `` `x` ``; `getFieldText` on the same field reads `x`.
- Verify `getFieldValue` returns a deep clone of the value (`readonly Construct[]`, `[]` for an empty field, `undefined` for a missing name) — mutating it does not change a subsequent read or the saved document.
- Verify both container messages appear verbatim: `Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline` and `Field value must be a string, number, boolean, or Art AST value`.
- Verify the empty-value rule: `setFieldMarkdown(name, '')` and `setFieldValue(name, [])` each clear the field to a bare label line, and `getFieldValue` on it returns `[]`.
- Verify the round-trip Evidence: the fixture showing `` **Location:** `x` `` surviving an update to another field, and a fenced-code write re-emitting its fence, passes.
- Verify coverage: `npm run test:ci` from `$PACKAGE` passes 90/90/70/90.
- Verify `npm run ci` passes from `$PACKAGE`, from `$TESTS`, and from `$PROJECT` (in that order).
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Report according to the "How to Report Back to the Delegator" instructions.
