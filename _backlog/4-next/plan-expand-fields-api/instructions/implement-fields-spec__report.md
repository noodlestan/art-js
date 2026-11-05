# Sub-Agent REPORT (#producer)

**Plan:** `expand-fields-api`

**Iteration Id:** `implement-fields-spec`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Preconditions pinned the reviewed spec revision before any file was touched (`SIG-OK`, `CONTAINER-OK`, `NO-STALE`), and the implementation follows `$PACKAGE/knowledge/design/fields.md` as the contract.

| Goal (from the instruction)                                                     | Delivered by                                                                                                                                                       |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| String sets routed through `codec.parse`                                        | `$PACKAGE/src/record/private/section-field/classifySectionFieldValue.ts` — `buildParsedContent`; the v0.0.1 `String(value)` blanket coercion is gone               |
| Set from a construct / readonly array of constructs                             | same module — `buildContent` + `buildArrayContent`, container rejection before everything else, empty array legal                                                  |
| Automatic block/inline form selection                                           | `classifyContent` (the four rules) + in-place conversion in `setSectionField.ts` + classified append in `appendSectionField.ts`                                    |
| Proxy setter `string \| number \| boolean \| Construct \| readonly Construct[]` | `createRecordProxy.ts` set trap → `capsule.setField`, value validation in the shared content builder; `number`/`boolean` coerced with `String(value)`              |
| `setFieldMarkdown` + `setFieldValue`                                            | capsule routes + proxy value descriptors + `ArtRecord` signatures                                                                                                  |
| Default accessor = markdown via `codec.serialize`                               | new `readSectionFieldMarkdown.ts` (serialise a `Document` over the field's children, strip the single trailing newline), used by `getField` and `getFieldMarkdown` |
| `getFieldText` via `codec.toText`                                               | capsule — the v0.0.1 accessor behaviour preserved byte-for-byte                                                                                                    |
| `getFieldValue` deep clone of the value                                         | capsule — `structuredClone` of the field's children (`[]` empty, `undefined` missing, label/tags excluded)                                                         |
| Five names reserved and typed on `ArtRecord`                                    | `constants.ts` (`RESERVED_FIELD_NAMES` = nine entries) + `record/types.ts` (exact spec signatures) + `private/types.ts` capsule counterparts                       |
| Unit tests, both integration suites, coverage gate                              | new unit suites, updated reserved/read fixtures, package fixtures `21`–`24`, `$TESTS` fixture `08`, coverage above gate                                            |

#### Files changed

Source (`$PACKAGE/src`, 8 modified / 5 added):

- `src/record/private/constants.ts` — five new reserved handle members (nine entries total).
- `src/record/types.ts` — the five spec signatures on `ArtRecord`, `Construct` type import.
- `src/record/private/types.ts` — capsule counterparts plus `SectionFieldForm` and `ClassifiedSectionFieldValue`.
- `src/record/private/section-field/classifySectionFieldValue.ts` (new) — shared `content(value)` + automatic-form classification, the two verbatim `TypeError`s, `number`/`boolean` coercion.
- `src/record/private/section-field/setSectionField.ts` — update route: classify, then convert the field construct in place (identity, `name`, `tags`, `position` preserved) and replace `children`.
- `src/record/private/section-field/appendSectionField.ts` — create route: appends the classified `FieldInline`/`FieldBlock` (no longer always inline).
- `src/record/private/section-field/readSectionFieldMarkdown.ts` (new) — markdown read with the single-trailing-newline strip.
- `src/record/private/capsule/createRecordCapsule.ts` — markdown default `getField`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, `setFieldMarkdown`, `setFieldValue`.
- `src/record/private/capsule/createRecordProxy.ts` — five value descriptors (same pattern as `renameFieldDescriptor`/`saveDescriptor`); traps unchanged.

Tests (`$PACKAGE`, 4 modified / 3 added / 4 fixture dirs added):

- `src/record/private/section-field/classifySectionFieldValue.test.ts` (new) — all four classification rules, coercion, container rejection (value, array member, parsed `**Y:** v` content), invalid-value cases.
- `src/record/private/section-field/setSectionField.test.ts` (new) — in-place form conversion preserving `name`/`tags`/`position`, empty clear, construct install.
- `src/record/private/capsule/createRecordCapsule.test.ts` (new) — three reads side by side, markdown round-trip without the serializer newline, deep-clone isolation, `[]`/`undefined` reads, proxy rejections, append in block form, handle-member exposure.
- `tests/record-helpers/isReservedFieldName.fixtures.ts`, `src/record/private/field-name/isReservedFieldName.test.ts` — the nine-name reserved set and the eight canonical+reserved names.
- `tests/record-helpers/recordReservedLabel.fixtures.ts` — the five new reachable document collisions (eight in total).
- `tests/record-helpers/recordFieldAccess.fixtures.ts` — handle-member delete cells and `in` checks for the five new members.
- `tests/record-helpers/labelToName.test.ts` — `Field label must contain at least one word character` asserted verbatim.
- `tests/fixtures/21-code-span-round-trip/` (new) — the round-trip Evidence: `` `art-works` `` survives an update of another field; a typed fenced-code write re-emits its fence in block form.
- `tests/fixtures/22-automatic-form/` (new) — phrasing value converts a block field to inline; block value appends as `FieldBlock`.
- `tests/fixtures/23-value-set/` (new) — consumer-built `NaturalBlock` through `setFieldValue` round-trips; an array installs in order.
- `tests/fixtures/24-rejected-values/` (new) — `null` and `Document`/`SectionBlock` values throw the spec messages through the proxy; document stays byte-identical after a rejected write + save.

Consumer suite (`$TESTS`, 1 fixture dir added):

- `tests/records/fixtures/08-field-value-reads/` (new) — markdown default, `getFieldText`, and `getFieldValue` asserted side by side against the rebuilt `dist`, plus label exclusion and persisted markup after save.

Commit:

- `a87a7a4` — `feat(records): Expand the field API with the fields spec.` — 27 files, +1613/−27, created locally, **not pushed** (commit policy `NOPUSH`; branch is ahead of `origin/main`). The `pre-commit` hook (`npm run clean`, `npm run extract`, `npm run ci`) passed. No release command was run.

### Verification

- **Setting Up:** `npm run ci`/`npm ci` from `$WORKSPACE` and `$PROJECT` — neither changed `package.json` or `package-lock.json`.
- **Verifying Step** from `$PACKAGE`: `npm run lint:fix`, `npm run lint`, `npm run test`, `npm run test:ci`, `npm run build` — all green.
- **Coverage gate** (`$PACKAGE`, `npm run test:ci`, 610 tests / 45 files): statements 96.12% (347/361), branches 91.41% (149/163), functions 97.89% (93/95), lines 96.1% (345/359) — gate 90/90/70/90.
- **`npm run ci` in the prescribed order:** `$PACKAGE` green → `$TESTS` green (8 files, 40 tests) → `$PROJECT` green (`Tasks: 8 successful, 8 total`, repo-wide prettier + turbo).
- **Literal-write sweep:** `grep -rn "type: 'text'" $PACKAGE/src` returns only `*.test.ts` fixture/helper builders — no set-path literal write remains.
- **Round-trip Evidence** (passing fixture run, `$PACKAGE`):

```text
 ✓ tests/fixtures/21-code-span-round-trip/integration.test.ts > Case 21 — A written-back code span survives a value update of another field > GIVEN the extracted project record > SHOULD read the location as markdown with its backticks intact 11ms
 ✓ tests/fixtures/21-code-span-round-trip/integration.test.ts > Case 21 — A written-back code span survives a value update of another field > WHEN setting the code span again, updating another field, and saving > SHOULD persist the code span of the untouched field 4ms
 ✓ tests/fixtures/21-code-span-round-trip/integration.test.ts > Case 21 — A written-back code span survives a value update of another field > WHEN setting the code span again, updating another field, and saving > SHOULD persist the updated value of the other field 3ms
 ✓ tests/fixtures/21-code-span-round-trip/integration.test.ts > Case 21 — A written-back code span survives a value update of another field > WHEN setting the code span again, updating another field, and saving > SHOULD still read the code span back as markdown and as text 3ms
 ✓ tests/fixtures/21-code-span-round-trip/integration.test.ts > Case 21 — A written-back code span survives a value update of another field > WHEN writing a typed fenced-code value and saving > SHOULD re-emit the fence in block form 3ms
 ✓ tests/fixtures/21-code-span-round-trip/integration.test.ts > Case 21 — A written-back code span survives a value update of another field > WHEN writing a typed fenced-code value and saving > SHOULD read the fence back as markdown and as text 3ms
 ✓ tests/fixtures/21-code-span-round-trip/integration.test.ts > Case 21 — A written-back code span survives a value update of another field > WHEN writing a typed fenced-code value and saving > SHOULD keep the field in block form 5ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
```

- **Persisted-markdown expectations changed:** none. No pre-existing integration expectation needed updating — both suites were green against the new implementation, so no fixture change required justification.
- **Observation for the planner:** an empty `FieldInline` (Automatic Form rule 1, the bare label line) serialises as `**Label:**&#x20;` — the codec's own escaping of the empty inline; it re-parses to the same empty `FieldInline` with `children: []`, so the round trip is stable. Asserted structurally in the unit suites.
- **Change set review:** `git status --short` / `git diff --cached --name-only` matched the change list exactly — only `$PACKAGE/src/**`, `$PACKAGE/tests/**`, and `$TESTS/fixtures/**`. Never `knowledge/`, `package.json`, `package-lock.json`, `CHANGELOG.md`, `_backlog`, `_roadmap`, `dist`, or `node_modules`. `git add -A`/`git add .` were never used.

### Scope mapping (Step 8)

| #   | Scope item                                                                      | Source                                                                                                                  | Test                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | string set via `codec.parse`                                                    | `$PACKAGE/src/record/private/section-field/classifySectionFieldValue.ts`                                                | `$PACKAGE/src/record/private/section-field/classifySectionFieldValue.test.ts`                                                                                                                                                                                         |
| 2   | value set from construct / readonly array (no typed-value object)               | `$PACKAGE/src/record/private/section-field/classifySectionFieldValue.ts`                                                | `$PACKAGE/src/record/private/capsule/createRecordCapsule.test.ts`; `$PACKAGE/tests/fixtures/23-value-set/`                                                                                                                                                            |
| 3   | automatic block/inline form                                                     | `$PACKAGE/src/record/private/section-field/classifySectionFieldValue.ts`, `setSectionField.ts`, `appendSectionField.ts` | `$PACKAGE/src/record/private/section-field/classifySectionFieldValue.test.ts`, `setSectionField.test.ts`; `$PACKAGE/tests/fixtures/22-automatic-form/`                                                                                                                |
| 4   | proxy setter `string \| number \| boolean \| Construct \| readonly Construct[]` | `$PACKAGE/src/record/private/capsule/createRecordProxy.ts`                                                              | `$PACKAGE/src/record/private/capsule/createRecordCapsule.test.ts`; `$PACKAGE/tests/fixtures/24-rejected-values/`                                                                                                                                                      |
| 5   | `setFieldMarkdown` + `setFieldValue`                                            | `$PACKAGE/src/record/private/capsule/createRecordCapsule.ts`, `createRecordProxy.ts`, `$PACKAGE/src/record/types.ts`    | `$PACKAGE/src/record/private/capsule/createRecordCapsule.test.ts`; `$PACKAGE/tests/fixtures/21-code-span-round-trip/`, `23-value-set/`                                                                                                                                |
| 6   | default accessor = markdown via `codec.serialize`                               | `$PACKAGE/src/record/private/section-field/readSectionFieldMarkdown.ts`, `createRecordCapsule.ts`                       | `$PACKAGE/src/record/private/capsule/createRecordCapsule.test.ts`; `$TESTS/fixtures/08-field-value-reads/`                                                                                                                                                            |
| 7   | `getFieldText` via `codec.toText`                                               | `$PACKAGE/src/record/private/capsule/createRecordCapsule.ts`                                                            | `$PACKAGE/src/record/private/capsule/createRecordCapsule.test.ts`; `$TESTS/fixtures/08-field-value-reads/`                                                                                                                                                            |
| 8   | `getFieldValue` deep clone of the value                                         | `$PACKAGE/src/record/private/capsule/createRecordCapsule.ts`                                                            | `$PACKAGE/src/record/private/capsule/createRecordCapsule.test.ts`; `$TESTS/fixtures/08-field-value-reads/`                                                                                                                                                            |
| 9   | field forms tie to fixtures `025`/`031`/`032`                                   | `$PACKAGE/src/record/private/section-field/classifySectionFieldValue.ts`, `readSectionFieldMarkdown.ts`                 | `$PACKAGE/src/record/private/section-field/classifySectionFieldValue.test.ts` (031/032 strings), `$PACKAGE/tests/fixtures/21-code-span-round-trip/` (025 fence)                                                                                                       |
| 10  | five names reserved and typed on `ArtRecord`                                    | `$PACKAGE/src/record/private/constants.ts`, `$PACKAGE/src/record/types.ts`, `$PACKAGE/src/record/private/types.ts`      | `$PACKAGE/tests/record-helpers/isReservedFieldName.fixtures.ts`, `$PACKAGE/tests/record-helpers/recordReservedLabel.fixtures.ts`, `$PACKAGE/tests/record-helpers/recordFieldAccess.fixtures.ts`, `$PACKAGE/src/record/private/field-name/isReservedFieldName.test.ts` |

## Blockers (if any)

None — the instruction executed end-to-end without blockers.
