# Plan: Adopt Codec Construct API

**ID:** `adopt-codec-construct-api`

**Status:** `PLANNING`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Has Context File:** `FALSE`

**Skill:** `write-plan`

**Purpose:** Create and read Art MD constructs through the codec instead of three local helper functions, so `@art-js/records` stops carrying a private copy of behaviour the codec now owns.

**Description:** Pins `$PACKAGE` to `@art-md/primitives@0.0.7` and `@art-md/constructs@0.0.7`, adds `@art-md/codec@0.0.5` as a development dependency, deletes `createTextBlock`, `createTextExpression`, and `readText`, and threads the consumer-injected codec through the section-field read and write path and its tests.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the plan file and its downstream work items. All file references in the plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                | Purpose                                     |
| ------------ | ---------------------------- | ------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                    |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Art domains, workflows, routines, templates |
| `$SKILLS`    | `$WORKSPACE/.agents/skills`  | Art agent modes and skills                  |
| `$PROJECT`   | `checkouts/art-js`           | Art JS checkout where the work executes     |
| `$PACKAGE`   | `$PROJECT/libs/records`      | The `@art-js/records` package               |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout that published the codec    |

## Summary

Change `@art-js/records` so its section-field read and write path calls the codec the consumer already injects — `codec.create` for the natural block and expression constructs, `codec.toText` for reading a field — instead of the private `createTextBlock`, `createTextExpression`, and `readText` helpers, and move the package's art-md pins from `0.0.6` to the exact versions published by `Plan: Expose Construct Creation in Codec`: `@art-md/primitives@0.0.7`, `@art-md/constructs@0.0.7`, `@art-md/codec@0.0.5`. Scope is `$PACKAGE`, its tests, and `$PROJECT/package-lock.json`.

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration                                  | Status     |
| ------------------------------------------ | ---------- |
| Iteration: Pin Art MD Dependencies         | `PLANNING` |
| Iteration: Create Constructs Through Codec | `PLANNING` |

### Iteration: Pin Art MD Dependencies

**Id:** `pin-art-md-dependencies`

**Status:** `PLANNING`

**Purpose:** Move `$PACKAGE` onto the exact art-md versions that expose the construct API, so the next iteration can compile against it.

**Description:** Rewrites the two `@art-md` dependency pins and declares the codec package the tests already import. No source file changes.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- In `$PACKAGE/package.json`, set `@art-md/primitives` and `@art-md/constructs` from `0.0.6` to `0.0.7`, and add `@art-md/codec` `0.0.5` to `devDependencies`.
- The codec stays a development dependency: `$PACKAGE` consumes only the `ArtCodec` type, because the instance is supplied by the consumer through `RecordHandleContext` and `RecordsDocumentContext`.
- Run `npm install` from `$PROJECT` and stage `$PROJECT/package-lock.json` with the change.
- Leave `$PACKAGE/CHANGELOG.md` untouched — the next records release, prepared as `0.1.0` by `Plan: Canonical Record Field Names`, carries the pin change.
- Verify `npm run ci` from `$PACKAGE`, then `npm run ci` from `$PROJECT`.

**Dependencies:**

- None.

#### Commits:

| ID                        | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| ------------------------- | -------------------------------- | -------- | ----- | ---------- |
| `pin-art-md-dependencies` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `pin-art-md-dependencies`

**Repository:** Art JS

**Message:**

```text
deps(records): Pin art-md packages.

- Pin `@art-md/primitives` and `@art-md/constructs` to `0.0.7`.
- Add `@art-md/codec` `0.0.5` for the construct API types.
```

### Iteration: Create Constructs Through Codec

**Id:** `create-constructs-through-codec`

**Status:** `PLANNING`

**Purpose:** Delete the three private construct helpers and route the section-field read and write path through the injected codec, with no change in behaviour.

**Description:** Replaces local construct literals with `codec.create` calls and local recursive text reading with `codec.toText`, threading `context.codec` from the capsule into the two field helpers and updating the tests that build a capsule context.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Delete `$PACKAGE/src/record/private/createTextBlock.ts`, `$PACKAGE/src/record/private/createTextExpression.ts`, and `$PACKAGE/src/record/private/readText.ts`.
- Change `$PACKAGE/src/record/private/setSectionField.ts` to take the codec as its first argument: `setSectionField(codec, section, name, value)`. Create the expression with `codec.create<NaturalExpression>('NaturalExpression', { type: 'text', value: text })` and the block with `codec.create<NaturalBlock>('NaturalBlock', { value: text, children: [] })`. Keep the existing `const text = String(value)` coercion and the existing branch order: inline field, block field, appended inline field.
- Change `$PACKAGE/src/record/private/getSectionField.ts` to take the codec as its first argument: `getSectionField(codec, section, name)`, returning `codec.toText(field)`.
- In `$PACKAGE/src/record/private/createRecordCapsule.ts`, pass `context.codec` into both calls. No new plumbing: `RecordHandleContext` already declares `codec: ArtCodec`.
- Update the tests that construct a capsule context: `$PACKAGE/src/record/createRecord.test.ts` passes `codec: {} as never`, which the new path dereferences — supply a real `createArtCodec()` or a stub exposing `create` and `toText`. The integration fixtures under `$PACKAGE/tests/fixtures` already build a real codec and need no change.
- Remove imports that the deletions orphan, and keep `NaturalBlock` and `NaturalExpression` as type-only imports in the field helper.
- Verify `npm run ci` from `$PACKAGE`, then `npm run ci` from `$PROJECT`.

**Dependencies:**

- `Plan: Canonical Record Field Names` iteration `index-property-access-and-labels` — `$PROJECT/_backlog/3-now/plan-canonical-record-field-names/plan.md` rewires `createRecordCapsule` and the field write path, the same functions this iteration edits. It must land first.

#### Commits:

| ID                                | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| --------------------------------- | -------------------------------- | -------- | ----- | ---------- |
| `create-constructs-through-codec` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `create-constructs-through-codec`

**Repository:** Art JS

**Message:**

```text
refactor(records): Create constructs through the codec.

- Delete the local `createTextBlock`, `createTextExpression`, and `readText` helpers.
- Call `codec.create` and `codec.toText` from the section-field read and write path.
```

## Work

### Next

Draft nothing further: both iterations are specified. Write the self-contained instruction files for `pin-art-md-dependencies` and `create-constructs-through-codec`, then delegate `pin-art-md-dependencies` — it is independent of `Plan: Canonical Record Field Names` and can run now. Hold `create-constructs-through-codec` until `index-property-access-and-labels` is `DONE`, and rebase its instructions onto that result before delegating.

### Blockers

- **Write path ownership** — `index-property-access-and-labels` is `READY` and owns the whole write path (`createRecordCapsule`, `setSectionField`) in `$PROJECT/_backlog/3-now/plan-canonical-record-field-names/plan.md`; `create-constructs-through-codec` cannot be delegated until it is `DONE`.

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

- **Publishing `@art-js/records`** — the next release is prepared as `0.1.0` by `Plan: Canonical Record Field Names`; this plan only prepares the pins that release carries.
- **Consumer migration** — `$ART_WORKS` upgrades its records dependency in its own plan.
- **Changes to `@art-md/*`** — the construct API and the exact pins are already published by `Plan: Expose Construct Creation in Codec`.
- **A text reader on constructs** — `readText` does not become an instance method on `NaturalBlock` or `NaturalExpression`; the codec owns `toText`.
- **Mapped-type derivation** — the caller supplies the construct type to `codec.create`; deriving name, generic, and arguments from a mapped type stays a separate follow-up on the Art MD side.
- **Field name grammar, collisions, and rename semantics** — owned by `Plan: Canonical Record Field Names`.
- **Document creation** — no code path in `$PACKAGE` asks the codec for a `Document`; the codec refuses it and this plan never reaches that error.

### Evidence

- **Helpers are gone** — `grep -r "createTextBlock\|createTextExpression\|readText" $PACKAGE/src` returns nothing.
- **Reads still agree** — reading a loaded field fixture returns the same strings as before the change, for a value-bearing field and for a field whose text lives in children.
- **Writes still agree** — setting a field on a fixture and saving the document produces byte-identical Markdown to the pre-change output.
- **Codec is the only source** — the expressions and blocks in newly written fields come from `codec.create`, not from an object literal.
- **Package green** — `npm run ci` succeeds from `$PACKAGE` and from `$PROJECT` at each iteration's commit.
- **Dependency edge** — `npm ls @art-md/codec` from `$PROJECT` resolves `0.0.5` under `@art-js/records`.

### Findings

- **The helpers exist to fill a gap that closed.** `@art-md/constructs` exports its `FACTORIES` list but not its `create*` functions, so consumer packages that need to assemble a construct by hand had to build the literal. `@art-md/codec` exposed neither creation nor text reading until `0.0.4`; `0.0.5` republishes the same API with exact pins.
- **The codec is already injected.** `RecordHandleContext` in `$PACKAGE/src/record/types.ts` and `RecordsDocumentContext` in `$PACKAGE/src/records-document/types.ts` both declare `codec: ArtCodec`, and `createRecord` already passes it to `createArtDocumentSource`. Threading it into two private functions needs no new API.
- **Factory data shapes.** `NaturalBlockFactoryData` requires `value` and `children`; `NaturalExpressionFactoryData` requires `type` and defaults `children` to `[]`. The codec's `create` forwards its data argument to the factory unchanged.
- **`readText` and `codec.toText` agree.** Both return a string `value` when the construct has one, otherwise join the recursive `children` result, otherwise `''`. `codec.toText` additionally tolerates non-object input the same way.
- **The tests already know the codec but the package does not declare it.** Integration fixtures import `createArtCodec` from `@art-md/codec` while `$PACKAGE/package.json` lists only primitives and constructs; the import resolves today through workspace hoisting.
- **One unit test stubs the codec away.** `createRecord.test.ts` passes `codec: {} as never`, which survives today because the capsule only forwards it to the source factory; the new call path dereferences it.

### Decisions

- **Codec as development dependency.** `$PACKAGE` consumes only `ArtCodec` types; the implementation is consumer-supplied. Declaring it as a runtime dependency would force a codec implementation on consumers who bring their own.
- **Exact pins.** The Art MD packages now publish exact internal versions; `$PACKAGE` follows the same rule rather than floating ranges.
- **No new abstraction.** `setSectionField` and `getSectionField` take the codec as their first argument. No wrapper module, no module-level singleton, no change to the capsule's public type.
- **Deletion over deprecation.** The three helpers are private and unpublished; they are removed outright, not re-exported or aliased.
- **Behaviour preservation is the test.** This plan changes who owns the behaviour, not what it produces: identical Markdown, identical read values.
