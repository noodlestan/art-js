# Plan: Canonical Record Field Names

**ID:** `canonical-record-field-names`

**Status:** `WORKING`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Has Context File:** `FALSE`

**Skill:** `write-plan`

**Purpose:** Expose `@art-js/records` fields through lowercase camelCase property names, so consumers read `record.canonicalName` instead of each consumer re-implementing label casing, while loaded labels and document structure survive every save.

**Description:** Replaces exact-label proxy access with field-name access in `$PACKAGE`: a `labelToName` grammar, a `nameToLabel` rule for new labels, proxy `get`/`set`/`delete`/`has`/`enumeration` over field names, label-preserving writes, defined collision and reserved-label behaviour, tests, documentation, and the `0.1.0` release. Consumer migration is recorded as a follow-up.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the plan file and its downstream work items. All file references in the plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                | Purpose                                      |
| ------------ | ---------------------------- | -------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                     |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates  |
| `$SKILLS`    | `$WORKSPACE/.agents/skills`  | Art agent modes and skills                   |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes      |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package                |
| `$ART_WORKS` | `checkouts/art-works`        | Consumer checkout (follow-up migration only) |

## Summary

Change `@art-js/records` so record fields resolve through lowercase camelCase field names — `**Canonical Name:**` reads and writes as `record.canonicalName` — keeping `record.name` as the complete heading, preserving loaded labels on save, and applying the same rule to the package's tests and documentation, in scope `$PROJECT`, `$PACKAGE`, `$PACKAGE/_records/npm-deployment.art`, and `$PROJECT/tests/records`, driven by the still-open `Plan: Create Lib Records` and the Art JS parking lot.

## Attachments

This section lists the files attached to this plan.

- `./plan__pseudo.md` (Pseudo) — Pseudo Code: define-field-name-contract.
- `./plan__tests.md` (Tests) — Test Scenarios: define-field-name-contract.

## Scope

Changes are confined to one package and one release; no consumer code changes here. The field name contract is fixed first, then the proxy together with label preservation and every dependent test, then edge cases, then documentation, then the `0.1.0` release preparation for the user to publish. Each iteration lands with the tests it breaks, so every commit is green.

### (Scope) Project: Art JS

**Record:** `$PROJECT/_records/project.art`

**Role:** — Hosts the package, repository conventions, and the backlog this plan lives in.

**Partial:**

- `owner` — Project: Artificials
- `repository` — Repository: Art JS
- `code` — `https://github.com/noodlestan/art-js`

### (Scope) Repository: Art JS

**Record:** `$PROJECT/_records/repository.art`

**Role:** — Monorepo where package source, tests, and backlog live.

**Partial:**

- `remote` — `git@github.com:noodlestan/art-js.git`
- `language` — TypeScript
- `engines` — Node `>= 22`
- `packageManager` — `npm@10.2.3`

### (Scope) Package: Records

**Record:** `$PACKAGE/_records/package.art`

**Role:** — Changes required.

**Partial:**

- `owner` — Project: Art JS
- `path` — `$PACKAGE/`
- `canonicalName` — `@art-js/records`
- `published` — `true`
- `deployment` — NPM Package Deployment: Records

**Changes:**

- Add the canonical field name grammar, the `labelToName` and `nameToLabel` converters, and the full `isReservedFieldName` predicate, as pure helpers with unit tests.

  ```ts
  export type FieldName = string;

  export function isCanonicalFieldName(name: FieldName): boolean;
  export function isReservedFieldName(name: FieldName): boolean;
  export function labelToName(label: string): FieldName;
  export function nameToLabel(name: FieldName): string;
  ```

- Build a proxy-owned `name → field` index at extraction and route every trap through it: no access scans section fields or converts a label. Handle members are unchanged; reserved names throw on read, write, and delete; index hits read and write normally, including extracted names that are not canonical field names; index misses read `undefined` and only a non-canonical miss throws on write.

  ```ts
  export type FieldIndex = ReadonlyMap<FieldName, SectionField>;
  ```

- Preserve loaded labels on ordinary value updates; derive a label from the name only for a newly added field.
- Rename by name: `renameField(fromName, toName)` resolves `fromName` through the index — it need not be canonical, so a field carrying an extracted non-canonical name can still be renamed — validates `toName` against the canonical field name grammar, rejects a `toName` already in the index before mutating, relabels to `nameToLabel(toName)`, and forgets the previous spelling.
- Abort record creation when a label converts to a handle member; extracted names win first occurrence on duplicates, a shadowed duplicate is promoted when the holder of its name is deleted or renamed, and extracted names need not be canonical field names.
- Extend the in-package unit and fixture suites; refresh the design, overview, README, and CHANGELOG.

**Operations:**

- Bump to `0.1.0`; the user publishes after reviewing the release commit.

### (Scope) NPM Package Deployment: Records

**Record:** `$PACKAGE/_records/npm-deployment.art`

**Role:** — Deployment required.

**Partial:**

- `owner` — Package: Records
- `canonicalName` — `@art-js/records`
- `registry` — `https://registry.npmjs.org`
- `access` — `public`

**Operations:**

- Publish `0.1.0` after user review and verify the registry version.

### (Scope) Package: Records Tests

**Record:** `$PROJECT/tests/records/_records/package.art`

**Role:** — Third-party consumer of the changed access surface; its fixtures must not silently keep asserting label access.

**Partial:**

- `owner` — Project: Art JS
- `path` — `$PROJECT/tests/records/`
- `canonicalName` — `@art-js/test-records`
- `published` — `false`

**Changes:**

- Update any fixture that reads or writes fields by exact label to canonical field names, or retire the duplicate case in favour of the in-package fixture.

## Execution Context

Execution occurs from `$WORKSPACE/`; package work is performed in `$PROJECT` on branch `main`, with source under `$PACKAGE/src`, fixtures under `$PACKAGE/tests/fixtures`, and the release version and CHANGELOG prepared in `$PROJECT` for the user to publish after review.

## Upstream Work

- Plan: Create Lib Records – `$PROJECT/_backlog/3-now/plan-create-lib-records/plan.md`
- Parking Lot: Art JS – `$PROJECT/_backlog/_parking-lot.md`
- Whiteboard: Art Records – `$PROJECT/_backlog/whiteboard-art-records/whiteboard.md`

**Supersedes:** This plan owns the `0.1.0` release. The upstream `Iteration: Publish and Consume in Art Works` becomes `Consume in Art Works`: publishing moves here, and the upstream iteration is left to install `0.1.0` and prove the Art Works consumption path after publication. The upstream plan and its Items table are updated when this plan is delegated, not before.

## Required Skills

- `write-plan` – `$SKILLS/write-plan/SKILL.md`
- `english` – `$SKILLS/english/SKILL.md`

## Domains

- Plans – `$DOMAINS/plans/index.md`
- Work – `$DOMAINS/work/index.md`
- Commits – `$DOMAINS/commits/index.md`
- Operations – `$DOMAINS/operations/index.md`
- Packages – `$DOMAINS/packages/index.md`

## Resource Kinds in Scope

- Project – `$DOMAINS/projects/structures/project.art`
- Repository – `$DOMAINS/repositories/structures/repository.art`
- Package – `$DOMAINS/packages/structures/package.art`
- NPM Package Deployment – `$DOMAINS/packages/structures/npm-package-deployment.art`

## Workflows

- Planning Work – `$DOMAINS/work/workflows/planning-work/workflow.art`
- Executing Work – `$DOMAINS/work/workflows/executing-work/workflow.art`
- Deploying – `$DOMAINS/deployments/workflows/deploying/workflow.art`

## Knowledge

- Design: Records – `$PACKAGE/knowledge/design/records.md`
- Overview: Records – `$PACKAGE/knowledge/overview.md`
- Guide: Art JS – `$PROJECT/_guide.md`
- Guide: Records – `$PACKAGE/_guide.md`
- Conventions: TypeScript – `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md`
- Conventions: Unit Tests – `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md`

---

## Items

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration                                        | Status  |
| ------------------------------------------------ | ------- |
| Iteration: Define Field Name Contract            | `DONE`  |
| Iteration: Index Property Access and Labels      | `DONE`  |
| Iteration: Handle Collisions and Reserved Labels | `DONE`  |
| Iteration: Document Field Name Access            | `READY` |
| Iteration: Prepare 0.1.0 Release                 | `READY` |

### Iteration: Define Field Name Contract

**Id:** `define-field-name-contract`

**Status:** `DONE`

**Purpose:** Pin the field name grammar, the two converters, and the reservation predicate as pure, unit-tested functions, so every later behaviour change references one definition.

**Description:** Adds `isCanonicalFieldName`, `labelToName`, and `nameToLabel` under `$PACKAGE/src/record/private`, extends `isReservedFieldName` to the full reserved set, pins the canonical field name grammar as a single regexp, and covers all four with unit tests. The next iteration routes the proxy through them. No proxy or serialization change.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/define-field-name-contract.md`

**Report:** `./instructions/define-field-name-contract__report.md`

**Changes:**

- Add `$PACKAGE/src/record/private/isCanonicalFieldName.ts`: the canonical field name grammar, one regexp — `/^[a-z][a-zA-Z0-9]*$/`. This is a **syntax** test only: it rejects a leading digit, a leading uppercase letter, and any separator character, so `3A33`, `333A`, `010`, `ação`, `Canonical Name`, and `__x` all fail. It does **not** reject reserved names — `name`, `save`, and `renameField` are syntactically valid and pass it. Reservation is the separate `isReservedFieldName`; both apply to an API-supplied name, in that order, and neither subsumes the other.
- Add `$PACKAGE/src/record/private/labelToName.ts`: generate a field name from a stored label, one pass, no iteration. Trim; walk Unicode code points, not UTF-16 code units; split on runs of characters outside `[\p{L}\p{M}\p{N}]`, keeping combining marks with their base letter; split before an uppercase letter when the preceding character is not uppercase; keep consecutive uppercase letters together; lowercase the first word; capitalize the first character of each subsequent word and lowercase its remainder; join without separators. An empty label throws `TypeError`.
- Add `$PACKAGE/src/record/private/nameToLabel.ts`: generate a label from a field name, one pass. Split before every uppercase letter, capitalize each word's first character, keep each word's remainder as-is, join with a single space. It is never applied to a stored label.
- Extend `$PACKAGE/src/record/private/isReservedFieldName.ts` beyond the `__` prefix to also return true for `name`, `save`, `renameField`, `__section`. Those four are proxy own properties, so excluding them from the exposed-name list changes neither `Object.keys` nor `in` — unit tests pin the wider predicate here, the next iteration routes access through it.
- Add `$PACKAGE/src/record/private/*.test.ts` unit tests covering the four families below, and assert that neither converter iterates: each is applied exactly once to its input.

**Two directions, never conflated:**

- **A — existing label → extracted field name.** `labelToName(label)`. The original label is stored verbatim and preserved; no label is generated from the extracted name to reproduce it. `IDField` yields field name `idfield` and stays spelled `IDField`.
- **B — field name → generated label → field name.** `labelToName(nameToLabel(name)) === name`. This is the only round trip the plan requires, and it holds for every name that passes `isCanonicalFieldName`.

`labelToName` is not idempotent and must not be required to be — a field name is never fed back in as a label. `labelToName(labelToName(label)) === labelToName(label)` is not a property to test or enforce.

**Rule table:**

| Direction | Input            | Output          | Rule                                             |
| --------- | ---------------- | --------------- | ------------------------------------------------ |
| A         | `Purpose`        | `purpose`       | one word, lowercased                             |
| A         | `Canonical Name` | `canonicalName` | space separator, camelCased                      |
| A         | `Canonical-Name` | `canonicalName` | hyphen is a separator, same name                 |
| A         | `user_id`        | `userId`        | underscore is a separator                        |
| A         | `a[b]c`          | `aBC`           | brackets are separators                          |
| A         | `f(x)`           | `fX`            | parentheses are separators                       |
| A         | `IDField`        | `idfield`       | uppercase run stays one word; label stays as-is  |
| A         | `NPM Package`    | `npmPackage`    | acronym run collapses into one word              |
| A         | `aB-a`           | `aBA`           | hyphen separates, `B` starts a word              |
| A         | `aBC`            | `aBc`           | `BC` is one uppercase run, lowercased to `Bc`    |
| A         | `3A33`           | `3A33`          | digit-led; not a canonical field name            |
| A         | `333A`           | `333A`          | digit-led; not a canonical field name            |
| A         | `A333`           | `a333`          | letter-led, canonical                            |
| A         | `0-1-0`          | `010`           | digits are word characters, separators collapse  |
| A         | `Ação`           | `ação`          | non-ASCII letters are letters; label stays as-is |
| B         | `userId`         | `User Id`       | space before every uppercase                     |
| B         | `aBA`            | `A B A`         | every uppercase starts a word                    |
| B         | `id`             | `Id`            | single word, capitalized                         |
| B         | `repo2Branch`    | `Repo2 Branch`  | digits stay inside their word                    |

**Test families:**

- `isCanonicalFieldName` against the regexp — accepts `userId`, `aBA`, `id`, `repo2Branch`, `a333`, and also `name` and `save` (syntactically valid, rejected only by reservation); rejects `3A33`, `333A`, `010`, `ação`, `Canonical Name`, `__x`.
- `isReservedFieldName` separately — accepts the same valid names; rejects `name`, `save`, `renameField`, `__section`, and any `__`-prefixed name. Assert both predicates together for `name` and `save`: canonical **and** reserved, so only the combined check rejects them.
- Direction B round trips — `labelToName(nameToLabel(name)) === name` for a table of canonical names, including `aBA` and `aBC`.
- Direction A conversion — the extracted field name for each label in the table, with the original label asserted unchanged, including digit-led and non-ASCII labels whose names are not canonical.

#### Commits:

| ID                       | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------------ | -------------------------------- | -------- | --------- | ----------- |
| `add-field-name-helpers` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `224deb6` | `COMMITTED` |

##### Commit: `add-field-name-helpers`

**Repository:** Art JS

**Message:**

```text
build(records): Add field name helpers.

- Add the canonical field name grammar and the two converters.
- Add the reserved field name predicate.
- Cover the name grammar, generated-label round trips, and extracted names.
```

### Iteration: Index Property Access and Labels

**Id:** `index-property-access-and-labels`

**Status:** `DONE`

**Purpose:** Move every proxy trap onto one name space backed by an index, and keep every loaded label intact, in one behaviour change that leaves the package and every fixture green.

**Description:** Rewires `createRecordProxy` onto a proxy-managed `name → field` index built once at extraction, routes reads, writes and enumeration through it, generates a label only for a new field, converts `renameField` into a name-to-name operation, and lands every dependent test update with the source. No property access scans section fields or converts a label.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/index-property-access-and-labels.md`

**Report:** `./instructions/index-property-access-and-labels__report.md`

**Changes:**

- Build a `name → field` index in `$PACKAGE/src/record/private/createRecordCapsule.ts` (or a private `createFieldIndex.ts`) once when the record is extracted: for each section field in document order, compute `labelToName(field.name)` and register the first occurrence. Later fields whose name is already registered are skipped — they stay in `__section` and are unreachable by name while that holder holds it, until a mutation vacates the name. The index is exposed to the proxy as a read-only view on the capsule and appears in no other API surface.

  ```ts
  export type ArtRecordCapsule = {
    readonly section: RecordSection;
    readonly fields: FieldIndex;
    getName(): string;
    setName(name: string): void;
    getField(name: FieldName): string | undefined;
    setField(name: FieldName, value: unknown): void;
    renameField(fromName: FieldName, toName: FieldName): void;
    deleteField(name: FieldName): boolean;
    fieldNames(): FieldName[];
    save(): Promise<void>;
  };
  ```

- Synchronise the index on every structural mutation: a new field registers its name; `renameField` removes the old name and registers the new one; `delete` removes the name; a value update keeps the entry and the original Markdown label.
- **Promotion:** when an indexed field is removed, scan the remaining section fields in document order and promote the first field whose name matches the vacated name. Update the index accordingly. This applies to `delete` and to the name vacated by a `renameField`; it runs inside the mutation, never on a read or a value update. Removing a field that holds no index entry changes nothing.
- Reads and writes: `get`, `set`, and `delete` resolve through the index. `set` writes through the resolved field's own label; only a canonical name with no index entry appends a field labelled `nameToLabel(name)` and registers it.
- Enumeration: `has`, `ownKeys`, and `getOwnPropertyDescriptor` read the index, so `getExposedFieldNames.ts` becomes a thin view over it — reserved names excluded, first-wins already resolved at build time. `listSectionFieldNames` keeps returning raw labels. `assertFieldName` tests `isReservedFieldName` then `isCanonicalFieldName`.
- `findSectionField.ts` and its callers stop comparing exact labels; lookup goes through the index.
- `renameField(fromName, toName)`: resolve `fromName` through the index — reserved `fromName` throws `TypeError`, an absent one throws `Error('Field not found: {fromName}')`. `fromName` is not held to the canonical grammar, so a field with an extracted non-canonical name can still be repaired or moved onto a canonical name. Validate `toName` with `isCanonicalFieldName`, rejecting `TypeError` — the new name must be canonical. Reject `TypeError` if `toName` already holds an index entry, **before mutating anything**. Then relabel the underlying Markdown field to `nameToLabel(toName)` — the old spelling is forgotten, not preserved — and swap the index entries.

**Name Classes:**

Access is decided by the index and by reservation — **not** by whether the name could be supplied for a new field. The canonical regexp gates only the creation of a field that does not yet exist.

| Name                                                       | `rec[name]` | `rec[name] = v`                    | `delete rec[name]` | `name in rec` | `Object.keys` |
| ---------------------------------------------------------- | ----------- | ---------------------------------- | ------------------ | ------------- | ------------- |
| handle: `name`, `save`, `renameField`, `__section`         | unchanged   | unchanged                          | `false`            | `true`        | —             |
| reserved: `__foo`                                          | `TypeError` | `TypeError`                        | `TypeError`        | `false`       | no            |
| index hit, canonical: `purpose`                            | field text  | replaces the text, keeps the label | `true`             | `true`        | yes           |
| index hit, extracted non-canonical: `3A33`                 | field text  | replaces the text, keeps the label | `true`             | `true`        | yes           |
| index miss, canonical: `brandNew`                          | `undefined` | appends `Brand New`                | `false`            | `false`       | yes           |
| index miss, non-canonical: `Years active`, `CanonicalName` | `undefined` | `TypeError`                        | `TypeError`        | `false`       | no            |

A read is an index lookup, so an extracted name that could never be supplied for a new field — `3A33` from `**3A33:**`, `ação` from `**Ação:**` — reads and writes normally. The regexp is consulted only when a write would create a field, and only then does a non-canonical name throw.

Impact: label-based code stops resolving instead of matching by accident or appending duplicate fields; loaded labels are never rewritten by a value update; property access is an index hit rather than a scan.

- Update the 11 in-package fixtures that read or write fields by label (`04`–`08`, `10`–`13`, `15`, `17`), plus `09-section-depth`: it accesses no field by label, but its persisted-content assertion pins the **generated** label of a canonical-miss write, so `**owner:** foo` becomes `**Owner:** foo`. `03` was audited: it asserts an empty field list and needs no change.
- Update the six `$PROJECT/tests/records` cases that access fields by label (`01`–`06`, covering `Artist`, `Years active`, `Active`, `Album`, `Producer`). In `01-read-document`, invert the case-sensitivity case: `song['artist']` now resolves and `song['Artist']` is `undefined`; add assertions that a field name resolves a loaded label, that `getFieldNames` returns the extracted names, and that a label-based write throws.
- Add a package-record round-trip fixture: load a document with `**Canonical Name:**`, mutate `canonicalName`, save, and assert the label plus all untouched structure survive.
- Add proxy-trap unit tests: one case per row of the name-class table for each trap; index synchronisation after create, rename, delete, and value update; rename collision rejection asserted to leave the record and its index untouched; a rename whose `fromName` is an extracted non-canonical name resolving onto a canonical `toName`; reads, writes, and enumeration driven through the index rather than a scan.
- Add duplicate-promotion tests over a document carrying `**Purpose:** First` and `**purpose:** Second`: extraction reads `First` and enumerates `purpose` once; deleting the holder promotes the second field, so `record.purpose` reads `Second`; renaming the holder to `brandNew` leaves `record.brandNew` reading `First` and `record.purpose` reading `Second`; deleting the _skipped_ duplicate leaves `record.purpose` reading `First`. Assert the promoted field keeps its own label and survives a save.
- Add direction-B round-trip tests for canonical field names, and separate conversion tests asserting that a digit-led or non-ASCII label keeps its original spelling while registering its extracted name — including a name that is not itself canonical.
- Fixtures assert primary behaviour only; unit tests carry the guard, index, and conversion variants.

#### Commits:

| ID                                 | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ---------------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `index-property-access-and-labels` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `05a7a88` | `COMMITTED` |

##### Commit: `index-property-access-and-labels`

**Repository:** Art JS

**Message:**

```text
refactor(records): Resolve record fields through a name index.

- Build a name-to-field index at extraction and route every trap through it.
- Preserve loaded labels and generate labels for new fields.
- Reject non-canonical and reserved names on mutation.
- Convert renameField to name-to-name.
- Align in-package and external fixtures with canonical names.
```

### Iteration: Handle Collisions and Reserved Labels

**Id:** `handle-collisions-and-reserved-labels`

**Status:** `DONE`

**Purpose:** Make duplicate-name and reserved-label records fail deterministically instead of silently shadowing each other or a handle member.

**Description:** Documents first-wins precedence for duplicate extracted names and what promotes a shadowed duplicate, aborts index construction when a label converts to a handle member, adds unit tests plus two fixtures, and re-verifies the mutation guards delivered by `index-property-access-and-labels` without re-implementing them.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/handle-collisions-and-reserved-labels.md`

**Report:** `./instructions/handle-collisions-and-reserved-labels__report.md`

**Changes:**

- Extraction: when two labels convert to the same name, the first occurrence in `section.children` wins the index entry; the later field remains in `__section` and is unreachable by name only while that holder holds it. Document this precedence — it is settled in iteration 2 and only asserted and written down here.
- Promotion: when an indexed field is removed, scan the remaining section fields in document order and promote the first field whose name matches the vacated name, then update the index. The promoted field keeps its own label. Removing a field that holds no index entry changes nothing, and the scan runs inside the mutation — never on a read or a value update. Document this alongside the precedence rule.
- Extraction: when `labelToName(label)` yields `name`, `save`, `renameField`, `__section`, or a `__` prefix, throw `TypeError: Field label "{label}" resolves to reserved name "{name}"` from index construction in `createRecordCapsule` / `createFieldIndex`, so extraction, `addRecord`, and `createRecord` all fail before a handle can shadow the field. Empty sections never collide.
- Mutation guards are not implemented here: the previous iteration delivers them; this iteration asserts the name-class table from the extraction path.
- Add unit tests for both extraction rules, for promotion on delete and on rename, for the no-op case where a shadowed field is removed, and assert the mutation guards delivered by the previous iteration.
- Add fixtures: `19-duplicate-field-names` (duplicate labels, first name wins) and `20-reserved-label-throws` (extraction error) — renumbered from `18`/`19`; `18` is `18-canonical-name-round-trip`.

#### Commits:

| ID                        | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `collisions-and-reserved` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | `84dadcb` | `COMMITTED` |

##### Commit: `collisions-and-reserved`

**Repository:** Art JS

**Message:**

```text
fix(records): Enforce name collisions and reserved labels.

- First occurrence wins on duplicate field names.
- Throw when a label resolves to a handle member.
- Add collision and reserved-label fixtures.
```

### Iteration: Document Field Name Access

**Id:** `document-field-name-access`

**Status:** `READY`

**Purpose:** Ship one documented access model, with the breaking change and the single consumer's migration stated explicitly.

**Description:** Rewrites the field-access and reserved-name sections of the design, updates every example to canonical field names, and refreshes the overview and README. The `0.1.0` CHANGELOG entry is owned by `prepare-0-1-0-release`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/document-field-name-access.md`

**Changes:**

- Add a "Field Names" section to `$PACKAGE/knowledge/design/records.md`: the canonical name regexp, the two guarantees (API-created names canonical, extracted names arbitrary), the `labelToName` and `nameToLabel` rules, the name → generated label → name round trip, the explicit non-requirement that a stored label round-trips, first-wins precedence, reserved labels, mutation guards, and the index.
- Rewrite "Field and Section Behaviour" and "Reserved names" to describe canonical field names and remove exact-label wording.
- Update every usage example in the design to canonical field names; keep `record.name`, `record.__section`, `record.save()`, and document `renameField(fromName, toName)` as name-to-name.
- Extract the settled decisions into `$PACKAGE/knowledge/adr/` following the format of `$ART_WORKS/cli/workspace/knowledge/adr/cli.art`: one ADR for field names, one for the `name → field` index, one for rename semantics.
- Refresh `$PACKAGE/knowledge/overview.md` use cases and `$PACKAGE/README.md` examples, including the migration note `record.Repository` → `record.repository` and `record['Canonical Name']` → `record.canonicalName`. The CHANGELOG is not touched here.
- Add the Art Works migration note to the plan's Follow Ups, not to the package docs.

#### Commits:

| ID                      | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| ----------------------- | -------------------------------- | -------- | ----- | ---------- |
| `document-field-access` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `document-field-access`

**Repository:** Art JS

**Message:**

```text
docs(records): Document field name access.

- Add the name grammar, index, and rename decisions as ADRs.
- Rewrite field access examples with canonical names.
- Record the breaking change and the consumer migration note.
```

### Iteration: Prepare 0.1.0 Release

**Id:** `prepare-0-1-0-release`

**Status:** `READY`

**Purpose:** Hand the user a reviewed, verified `0.1.0` release candidate — version and CHANGELOG already changed — without publishing.

**Description:** Bumps the version, writes the `0.1.0` CHANGELOG section, verifies `$PACKAGE` and `$WORKSPACE`, and commits the release preparation; publishing is the user's manual step after review.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Execute the Changes listed above.

Before you start: run `npm ci` from `$WORKSPACE` and again from `$PROJECT` (Setting Up).

Validate after the edits — from `$PACKAGE`: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:integration`; from `$PROJECT`: `npm run ci`; from `$WORKSPACE`: `npm run ci`.

After executing: commit `release-0-1-0` with the blueprint below from `$PROJECT` — the `pre-commit` hook runs `npm run clean`, `npm run extract`, `npm run ci`; fix any reported failure and retry — then confirm the branch is clean.

STOP: do not publish. Report the release commit to the user for review and publishing; the user publishes `@art-js/records` and the `Confirm publication` follow-up records `npm info @art-js/records version`.

Inlined instructions carry no separate report file — report the outcome in chat.

**Changes:**

- Set the `$PACKAGE/package.json` version to `0.1.0` and write the `$PACKAGE/CHANGELOG.md` `0.1.0` section: breaking field access, canonical field names, label preservation, collision and reserved-label rules, migration note.
- Verify from `$PACKAGE`: `npm run lint`, `npm run build`, `npm run test:unit`, and `npm run test:integration`; then verify from `$PROJECT`: `npm run ci` (prettier plus `turbo run ci`), and from `$WORKSPACE`: `npm run ci` (workspace-wide prettier).
- Commit the version, CHANGELOG, and any leftover doc alignment, and confirm the branch is clean.
- STOP: do not publish; report the release commit to the user for review and publishing.

#### Commits:

| ID              | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| --------------- | -------------------------------- | -------- | ----- | ---------- |
| `release-0-1-0` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `release-0-1-0`

**Repository:** Art JS

**Message:**

```text
release(records): 0.1.0.

- Ship canonical field name access.
- Record the breaking change and migration note.
```

## Work

### Next

Three iterations are `DONE` (`224deb6`, `05a7a88`, `84dadcb`; delegation reports recorded); two remain `READY` — delegate `document-field-name-access` next (instruction file written), then `prepare-0-1-0-release` (inlined instructions), which stops before publishing: the user reviews the release commit, publishes, and records confirmation. Draft any follow-up instruction against the Feedback notes (delete-cell wording, codec field pattern, `dist` rebuild).

### Blockers

- **Missing instruction files** — none: every remaining iteration is delegatable (`handle-collisions-and-reserved-labels` and `document-field-name-access` as files, `prepare-0-1-0-release` inlined). Scope, grammar, index, and rename semantics are fully settled.

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

- **Iterative or converging conversion** — both converters are single-pass. No fixed-point loop, no re-applying `labelToName` to its own output, and no requirement that a stored label survive a label → name → label transformation.
- **Retrospective canonicality** — the canonical grammar never filters extracted fields. A field extracted with a non-canonical name stays loadable, readable, and savable.
- **Per-access conversion** — no trap scans section fields or converts a label outside index construction and the mutation that needs it.
- **Art Works consumer migration** — `$ART_WORKS` reads `recordHandle.Repository` and friends; the code change and its verification belong to a follow-up plan, not this one.
- **Label escape hatches** — no `getField`/`setField`/`fieldLabels` API is added in this plan; `__section` remains the only route to non-addressable fields. A label-writing repair API (`relabelField`, `setFieldValue`, raw by-label accessors) is a follow-up.
- **Lenient or dual-mode lookup** — no label fallback, no `fieldNames` alias option; access is by field name only.
- **Custom labels for new fields** — a new field's label is always `nameToLabel(name)`, so `brandNew` yields `Brand New`.
- **Byte-identical serialization** — the codec's structural fidelity contract is unchanged.
- **Publishing** — the agent never publishes; it prepares the version and CHANGELOG, and the user publishes after review.

### Evidence

- **Commit `84dadcb` (`NOPUSH`)** — reserved-label abort at index construction with the exact `Field label "{label}" resolves to reserved name "{name}"` message, first-wins/promotion/guards pinned from the extraction path, fixtures `19`/`20`; `$PACKAGE` 38 files / 515 tests green, root `npm run ci` 8/8 inside the hook. Report `./instructions/handle-collisions-and-reserved-labels__report.md`.
- **Commit `05a7a88` (`NOPUSH`)** — every trap resolves through the extraction-time `name → field` index; `18-canonical-name-round-trip` proves byte-identical label-preserving saves; `$PACKAGE` 479 tests and `$PROJECT/tests/records` 34 tests green, root `npm run ci` 8/8 inside the hook. Report `./instructions/index-property-access-and-labels__report.md`.
- **Canonical read** — `record.canonicalName` and `record.purpose` return the values of `**Canonical Name:**` and `**Purpose:**` from a real `package.art` fixture.
- **Label preservation** — load, mutate one field, save a real package-record document and diff the output: every untouched label and the structure are identical.
- **Index, not scan** — reading, writing, enumerating, and membership all resolve through the proxy-owned `name → field` index; no trap scans section fields or converts a label.
- **Extracted non-canonical name** — a fixture carrying `**3A33:**` reads back as `record['3A33']` with its label untouched, even though `3A33` is not a canonical field name.
- **Duplicate promotion** — with `**Purpose:** First` and `**purpose:** Second`, `record.purpose` reads `First` and `Object.keys` lists `purpose` once; after `delete record.purpose` it reads `Second`; after `renameField('purpose', 'brandNew')` the record reads `brandNew` → `First` and `purpose` → `Second`.
- **Reservation is a separate predicate** — `name` and `save` pass `isCanonicalFieldName` and are rejected only by `isReservedFieldName`, so the combined `assertFieldName` is what keeps `record.name` and `record.save` reserved.
- **Rename semantics** — `renameField('purpose', 'brandNew')` leaves `**Brand New:**` in the document, the old label gone, the index swapped; `renameField('purpose', 'owner')` throws `TypeError` and changes neither the document nor the index.
- **Guard behaviour** — setting `record.CanonicalName` throws `TypeError`; extracting a record with a `Name` label throws `TypeError: Field label "Name" resolves to reserved name "name"` when the handle is created; `record.name` keeps its handle semantics.
- **Package green** — `npm run ci` succeeds from `$PACKAGE` and from `$WORKSPACE` at every iteration's commit, not only at the end of the plan.
- **Release ready** — version `0.1.0` and the CHANGELOG entry are committed for review; the agent never publishes. After the user publishes, `npm info @art-js/records version` reports `0.1.0`.

### Findings

- **Exact-label access is the whole contract** — `findSectionField`, `getSectionField`, `setSectionField`, and `deleteSectionField` compare `construct.name === name`; the proxy passes the property straight through.
- **Reservation is documentation only** — `isReservedFieldName` rejects only the `__` prefix. Handle members still win because the proxy target owns `name`, `__section`, `renameField`, and `save` and every trap checks it first, so a document field labelled `Name` is silently unreachable rather than rejected.
- **Multiword labels are real** — `**Canonical Name:**` appears in every package and deployment record in `$PROJECT`; `**NPM Package Deployment:**`-style headings exist as resource kinds.
- **The consumer already depends on label access** — `$ART_WORKS/cli/workspace/src/private/resources/checkout/loadCheckoutRecords.ts` reads `.Repository`, `.Location`, `.Branch`; `upsertCheckoutRecord.ts` deletes `.Repository`; `checkoutFields.ts` writes fields by label and through `__section`.
- **`renameField` is today's only label-taking API** — it resolves its source by exact label and stores the target label verbatim, so converting it to field names is itself a breaking change, not just an adaptation.
- **Label assertions are everywhere** — 11 of the 17 in-package fixtures and 6 of the 7 external `$PROJECT/tests/records` cases read or write fields by exact label, and the shared `getFieldNames` helper derives names from `Object.keys(record)`. `09-section-depth` is the twelfth fixture to touch: it reads by name, but pins the generated label of a miss-write. Any behaviour-only iteration is red, so source and dependent tests must land together.
- **Two test suites cover the surface** — 17 in-package fixtures under `$PACKAGE/tests/fixtures` plus the external `$PROJECT/tests/records` package.

### Decisions

The following decisions are candidates for package ADRs:

#### Decision: Canonical Field Names

- Fields are addressed only by lowercase camelCase names: `record.canonicalName`, `record.purpose`; no label fallback, no dual mode.
- A **canonical field name** is anything matching `/^[a-z][a-zA-Z0-9]*$/`. This one regexp is the entire validity test for a name supplied through the API; there is no second, algorithmic test layered on it.
- The grammar is a **syntax** test: it rejects a leading digit or uppercase letter and any separator — `3A33`, `333A`, `010`, `ação`, `Canonical Name`, `__x` fail; `userId`, `aBA`, `id`, `repo2Branch`, `a333` pass.
- Reserved names are rejected by `isReservedFieldName`, not by the grammar. `name`, `save`, and `renameField` are syntactically valid and pass the regexp; both predicates apply to an API-supplied name, and neither subsumes the other.
- Stored labels are never rewritten by a value update; conversion changes addressing only.
- New fields are labelled by `nameToLabel(name)` — `brandNew` → `Brand New`; `npmPackageDeployment` → `Npm Package Deployment`, documented as a limitation of derived labels.
- No escape hatch: no field getter, setter, or label listing; `__section` is the only route to non-addressable fields.

#### Decision: Two Guarantees, Never Conflated

- **API-created fields** always carry a canonical name: the name passed the regexp before the field existed.
- **Extracted fields** carry whatever name `labelToName(label)` yields from an arbitrary existing Markdown label, and that name need not be valid as a new API name. `**3A33:**` extracts name `3A33` and stays spelled `3A33`; it is reachable through the index even though `3A33` could never be supplied as a new name.
- The canonical grammar is a gate on names **supplied through the API**. It is never applied retrospectively as a filter on extracted fields, and an existing field is never rejected or rewritten because its extracted name would fail the grammar.
- Both kinds share one index and one access path.

#### Decision: Extraction Does Not Round-Trip

- `labelToName(label)` runs **once**. The original label is preserved verbatim; `nameToLabel` is never applied back to it, and no label → name → label identity is required.
- `IDField` → name `idfield`, label stays `IDField`. `NPM Package` → name `npmPackage`, label stays `NPM Package`. `Ação` → name `ação`, label stays `Ação`.
- The only round trip the plan requires is **field name → generated label → field name**: `labelToName(nameToLabel(name)) === name`. Verified for `userId` → `User Id` → `userId`, `aBA` → `A B A` → `aBA`, `id` → `Id` → `id`.
- `labelToName` is deliberately **not idempotent** — `aB-a` → `aBA`, and `labelToName('aBA')` is `aBa`. That is correct, not a defect: a field name is never fed back in as a label. Do not test or require `labelToName(labelToName(label)) === labelToName(label)`.

#### Decision: One Single-Pass Grammar

- Split on runs of characters outside `[\p{L}\p{M}\p{N}]`; combining marks stay with their base letter.
- Split before an uppercase letter when the preceding character is not uppercase; consecutive uppercase letters stay together.
- Lowercase the first word; capitalize the first character of each subsequent word and lowercase its remainder; join without separators.
- `nameToLabel` splits before **every** uppercase letter, capitalizes each word's first character, keeps the remainder as-is, joins with a single space.
- Iterate Unicode code points, not UTF-16 code units.
- Punctuation and symbols are separators uniformly — no special-casing of `_`, brackets, braces, slashes, dots, hyphens, or plus signs, and no acronym exceptions beyond the single uppercase-run rule.
- Both converters are one pass. No iterative, converging, or fixed-point conversion.

| Label         | Field name   | Label     | Field name |
| ------------- | ------------ | --------- | ---------- |
| `IDField`     | `idfield`    | `333A`    | `333A`     |
| `NPM Package` | `npmPackage` | `A333`    | `a333`     |
| `aB-a`        | `aBA`        | `0-1-0`   | `010`      |
| `aBC`         | `aBc`        | `Ação`    | `ação`     |
| `3A33`        | `3A33`       | `user_id` | `userId`   |
| `a[b]c`       | `aBC`        | `f(x)`    | `fX`       |

#### Decision: One Index, One Guard, One Enumeration

- The proxy owns a `name → field` index, built once when the record is extracted by converting each stored label in document order, first occurrence winning. It reaches the proxy as `capsule.fields`, a `ReadonlyMap`; nothing outside `$PACKAGE/src/record/private` references it.
- The invariant that governs the index for the record's whole life: **each name maps to the first field in document order that converts to it.** Extraction establishes it; every structural mutation preserves it.
- No property access scans section fields or converts a label. Reads, writes, and enumeration are all index lookups.
- The index stays synchronised on every structural mutation: create registers, rename swaps, delete removes, value update keeps the entry and the original label.
- **A shadowed duplicate is promoted, not lost.** When an indexed field is removed — by `delete`, or by the name vacated in a `renameField` — scan the remaining section fields in document order and promote the first field whose name matches the vacated name, then update the index. With `**Purpose:** First` and `**purpose:** Second`, extraction reads `First` and enumerates `purpose` once; deleting the holder makes `record.purpose` read `Second`; renaming the holder leaves `record.brandNew` reading `First` and `record.purpose` reading `Second`. Removing the _skipped_ duplicate changes nothing. The promoted field keeps its own label and saves intact, and the scan runs inside the mutation — never on a read or a value update.
- `assertFieldName` is the only validation path for an API-supplied name — `isReservedFieldName`, then `isCanonicalFieldName`, throwing `TypeError`. It never runs against an extracted name. The two predicates are independent: `name`, `save`, and `renameField` pass the regexp and are rejected only by reservation, while `__section` and `__foo` fail both.
- `getExposedFieldNames` becomes a thin view over the index; `listSectionFieldNames` keeps returning raw labels.

#### Decision: Reserved, Non-Canonical, and Index Names

Access is decided by the index and by reservation — **not** by whether the name could be supplied for a new field. The canonical regexp gates only the creation of a field that does not yet exist.

| Name                                               | `rec[name]` | `rec[name] = v`                    | `delete rec[name]` | `name in rec` | `Object.keys` |
| -------------------------------------------------- | ----------- | ---------------------------------- | ------------------ | ------------- | ------------- |
| handle: `name`, `save`, `renameField`, `__section` | unchanged   | unchanged                          | `false`            | `true`        | —             |
| reserved: `__foo`                                  | `TypeError` | `TypeError`                        | `TypeError`        | `false`       | no            |
| index hit, canonical: `purpose`                    | field text  | replaces the text, keeps the label | `true`             | `true`        | yes           |
| index hit, extracted non-canonical: `3A33`         | field text  | replaces the text, keeps the label | `true`             | `true`        | yes           |
| index miss, canonical: `brandNew`                  | `undefined` | appends `Brand New`                | `false`            | `false`       | yes           |
| index miss, non-canonical: `Years active`          | `undefined` | `TypeError`                        | `TypeError`        | `false`       | no            |

- Reserved names bypass conversion and keep today's throwing behaviour; a `__` write never reaches the field path.
- A label that converts to a handle member aborts index construction in `createRecordCapsule` / `createFieldIndex` — `TypeError: Field label "{label}" resolves to reserved name "{name}"` — so extraction, `addRecord`, and `createRecord` all fail before a handle can shadow the field.
- An extracted name that is not canonical — `3A33`, `010`, `ação` — reads and writes normally, because the index already holds it. Non-canonicality only ever throws at the point a write would create a field.

#### Decision: Rename by Name

- `renameField(fromName, toName)` operates exclusively on names — no verbatim labels anywhere in this plan's API.
- Validation order, and why each argument is held differently:
  1. Reserved `fromName` or `toName` → `TypeError`.
  2. `fromName` absent from the index → `Error('Field not found: {fromName}')`.
  3. `toName` failing `isCanonicalFieldName` → `TypeError`; the new name must be canonical.
  4. `toName` already holds an index entry → `TypeError`, **checked before any mutation**, so a rejected rename leaves the record and its index untouched.
- `fromName` is deliberately **not** held to the canonical grammar. It only has to be present in the index, exactly like a read, so a field carrying an extracted non-canonical name — `3A33`, `ação` — can be renamed onto a canonical one. `toName` is the only side that must be canonical.
- The field's Markdown label is then replaced by `nameToLabel(toName)` — `renameField('purpose', 'brandNew')` yields `**Brand New:**` — and the index entry is swapped.
- **A rename forgets the previous spelling.** Unlike a value update, which preserves the stored label, a rename deliberately discards it. There is no implicit preservation of the old label; correcting a spelling is a separate future API.

#### Other Decisions

The following decisions are tactical and scoped to this plan only.

- **Release Ownership and Delivery:**
  - Scope `records`; version `0.1.0`, a pre-1.0 minor for a breaking access change.
  - The agent prepares `package.json` and `CHANGELOG.md`, verifies, and commits; the user reviews, publishes, and verifies the registry — the agent never publishes.
  - The CHANGELOG is written only in `prepare-0-1-0-release`; this plan owns the release, and upstream `Iteration: Publish and Consume in Art Works` becomes `Consume in Art Works`.
  - The single consumer is waiting for this surface: no compatibility layer, migration recorded as a follow-up note.
  - Green at every commit: the behaviour change lands with every test it breaks, in `$PACKAGE`, the shared helpers, and `$PROJECT/tests/records`; no iteration defers test repair.

- **Decision: Test Split by Purpose:**
  - Fixtures assert delivered behaviour plus the two new failure cases; unit tests cover every guard variant, collision, index-synchronisation step, and conversion edge.
  - Iteration 2 delivers every mutation guard; iteration 3 adds extraction rules and re-asserts the guards rather than re-implementing them.

### Knowledge to Update

- **`$PACKAGE/knowledge/design/records.md`** — field name grammar, precedence, guards, label derivation, limitations, and rewritten examples.
- **`$PACKAGE/knowledge/adr/*`** — decisions extracted into ADR format as per `$ART_WORKS/cli/workspace/knowledge/adr/cli.art` example.
- **`$PACKAGE/knowledge/overview.md`** — use cases and fixture map for the new field name cases.
- **`$PACKAGE/README.md`** — examples and the migration note for consumers.
- **`$PACKAGE/CHANGELOG.md`** — `0.1.0` breaking entry.

### Follow Ups

- **Art Works migration** — switch `$ART_WORKS` checkout loading from `.Repository`/`.Location`/`.Branch` to `.repository`/`.location`/`.branch`, including the label `delete handle.Repository` in `upsertCheckoutRecord.ts`, and decide whether `checkoutFields.ts` moves off `__section` label writes.
- **Label-writing repair API** — a `relabelField(name, label)` or `setFieldValue(name, value, label?)`, plus raw by-label field accessors, so a validator or linter can correct a persisted label without changing its name — a de-acronymized `**Npm Package Deployment:**`, or a duplicate `**Id:**`/`**ID:**` pair where promotion reaches the second field but only by deleting the first. These are repair tools reached through a specialized delete or rename, not general read/write routes; raw `__section` remains exposed until use cases are better identified.
- **Rewrite the upstream iteration** — in `Plan: Create Lib Records`, rename `Iteration: Publish and Consume in Art Works` to `Consume in Art Works`, drop its publish step, point the install step at `0.1.0`, and retire the superseded `0.0.1` publication claims (duplicated instruction block, `release-first-version` hash, Items table status) when its owning plan is next edited.
- **Acronym-preserving labels** — a label registry or per-field hint, if `Npm Package Deployment`-style degradation proves costly.
- **Collision reporting** — detect duplicate extracted names at load time and report them, so a validator can flag a shadowed field before someone deletes the holder to reach it. Promotion makes every shadowed field reachable again once the holder vacates the name, but nothing surfaces the duplicate until then.
- **Refresh the design's Testing section** — it still describes the retired `run-test.ts` runner and the external-only suite; out of scope for this plan.
- **Drive the release out of the upstream plan** — mark `Iteration: Publish and Update Knowledge` in `Plan: Create Lib Records` against the `0.1.0` outcome; publishing is owned by this plan.
- **Confirm publication** — after the user publishes, check `npm info @art-js/records version` and record the outcome in this plan.

### Feedback

- **Delegation: `index-property-access-and-labels` (2026-11-01)** — COMPLETED as `05a7a88` (`NOPUSH`): every trap resolves through the extraction-time index, promotion and name-to-name rename landed; `$PACKAGE` 35 files / 479 tests + external 7 files / 34 tests green, root `npm run ci` 8/8 inside the hook. Structural deviations, semantics unchanged: mutations rebuild the full index (`createFieldIndex(section)`) rather than a targeted scan, and `getExposedFieldNames` takes the `FieldIndex` directly.
- **Name-class table delete cells** — `delete rec[name] = false` (handle row and canonical-miss row) cannot surface as `false`: a Proxy `deleteProperty` trap returning falsish throws `TypeError` (verified Node 24); the traps return `false` per the rules text and tests pin the observable `TypeError`. Reword those cells as "reports not-removed (surfaced as `TypeError`)" on the next plan edit.
- **Codec field pattern** — the Art MD codec only parses `/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`, so `**3A33:**` and `**Ação:**` never parse as fields from Markdown; digit-led/non-ASCII conversion coverage uses hand-built sections (`createSectionRecord` helper). Do not assume those labels round-trip through the codec in later iterations. Also: `$PROJECT/tests/records` resolves `@art-js/records` through `dist` — run `npm run build` in `$PACKAGE` before its tests.
- **Delegation blocker #1, `index-property-access-and-labels` (2026-11-01)** — the Step 6 audit claim "`09` … neither changes" was wrong: 09's `**owner:** foo` assertion pins the generated label of a canonical-miss write, which Step 2 turns into `**Owner:** foo`. Worker stopped pre-change (correctly). Resolved as option A — 09 joins the modify list for that one assertion (applied by the worker in `05a7a88`); `03` stays untouched. Blocked-run report superseded by the successful run at the same path.
- **Test layout moved after delegation (commit `298fd12`)** — fixture-driven tables now live in `$PACKAGE/tests/record-helpers/` (sibling `.fixtures.ts`, data only) with slim representative tests co-located in `src/record/private/`, and shared regexes extracted to `src/record/private/constants.ts`; `../plan__tests.md` section 1 is superseded. The `index-property-access-and-labels` instructions state the current layout; fold it back into the attachment and the Decisions section when the plan is next edited.
- **Fixture numbering** — iteration `index-property-access-and-labels` takes `18-canonical-name-round-trip`; `handle-collisions-and-reserved-labels` therefore uses `19-duplicate-field-names` and `20-reserved-label-throws`, not `18`/`19`.
- **Delegation: `define-field-name-contract` (2026-10-31)** — worker deviation, semantics unchanged: `@typescript-eslint/no-use-before-define` rejects declarations after `return` or before use, so the instruction snippets' ordering (`capitalize`, helper closures) must place declarations first in later iterations' instructions too.
- **Delegation: `define-field-name-contract` (2026-10-31)** — the mandated repo-wide `lint:fix` normalized pre-existing prettier violations in `$PACKAGE/knowledge/design/records.md` and `$PACKAGE/src/records-document/types.ts`; they stay uncommitted, to be picked up by the next commit that touches them.
- **Delegation validation (2026-10-31)** — `prepare-0-1-0-release` is `INSTRUCTIONS_INLINED_IN_ITERATION` but carries no `**Instructions:**` field; populate the inlined block before that iteration is dequeued.
- **Delegation validation (2026-10-31)** — the `define-field-name-contract` instructions' Mandatory Reading omits `$PACKAGE/knowledge/overview.md`; not needed for the helpers iteration, fold in on next edit.
