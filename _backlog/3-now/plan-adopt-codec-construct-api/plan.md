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
| `$TESTS`     | `$PROJECT/tests/records`     | The `@art-js/test-records` harness          |
| `$ART_MD`    | `checkouts/art-md`           | Art MD checkout that published the codec    |

## Summary

Change `@art-js/records` so its section-field read and write path calls the codec the consumer already injects — `codec.create` for the natural block and expression constructs, `codec.toText` for reading a field — instead of the private `createTextBlock`, `createTextExpression`, and `readText` helpers, and move the package's art-md pins from `0.0.6` to the exact versions published by `Plan: Expose Construct Creation in Codec`: `@art-md/primitives@0.0.7`, `@art-md/constructs@0.0.7`, `@art-md/codec@0.0.5`. Scope is `$PACKAGE`, `$TESTS`, and `$PROJECT/package-lock.json`.

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration                                  | Status     |
| ------------------------------------------ | ---------- |
| Iteration: Pin Art MD Dependencies         | `PLANNING` |
| Iteration: Create Constructs Through Codec | `PLANNING` |

### Iteration: Pin Art MD Dependencies

**Id:** `pin-art-md-dependencies`

**Status:** `READY`

**Purpose:** Move `$PACKAGE` onto the exact art-md versions that expose the construct API, so the next iteration can compile against it.

**Description:** Rewrites the `@art-md` dependency pins in both workspace packages, declares the codec package the fixtures already import, and refreshes the lock. No source file changes.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/pin-art-md-dependencies.md`

**Changes:**

- In `$PACKAGE/package.json`, set `@art-md/primitives` and `@art-md/constructs` from `0.0.6` to `0.0.7`, and add `@art-md/codec` `0.0.5` to `devDependencies`.
- The codec is a development dependency because this package's integration fixtures import the value `createArtCodec`; the library source imports only the `ArtCodec` type, which it takes from `@art-md/primitives`, and the instance itself is supplied by the consumer through `RecordHandleContext` and `RecordsDocumentContext`.
- In `$TESTS/package.json`, set `@art-md/codec` from `0.0.3` to `0.0.5` and `@art-md/primitives` from `0.0.6` to `0.0.7`. Do not add `@art-md/constructs` — the package never imports it, and `codec@0.0.5` already pins `constructs@0.0.7`. Leave `@art-js/records` at `*`: it is the internal workspace edge and is re-pinned by the release iteration.
- Both edges move in one commit. `$PACKAGE` resolves `createArtCodec` today by climbing into `$PROJECT/node_modules/@art-md/codec`, which exists at `0.0.3` only because `$TESTS` asks for that version; bumping one edge leaves two codecs and two primitives in the tree, and install order decides which version each package resolves.
- Run `npm install` from `$PROJECT` and stage `$PROJECT/package-lock.json`. Expect `@art-md/parser` and `@art-md/serializer` to move `0.0.4` to `0.0.6` transitively, because `codec@0.0.5` pins them exactly.
- Leave `$PACKAGE/CHANGELOG.md` untouched — the next records release, prepared as `0.1.0` by `Plan: Canonical Record Field Names`, carries the pin change.
- Verify `npm run ci` from `$PACKAGE`, then `npm run ci` from `$PROJECT`.

**Dependencies:**

- None.

#### Commits:

| ID                        | Repository / Checkout / Branch   | Policy   | Hash  | Status  |
| ------------------------- | -------------------------------- | -------- | ----- | ------- |
| `pin-art-md-dependencies` | `$PROJECT` / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `READY` |

##### Commit: `pin-art-md-dependencies`

**Repository:** Art JS

**Message:**

```text
deps(records): Pin art-md packages.

- Pin `@art-md/primitives` and `@art-md/constructs` to `0.0.7`.
- Add `@art-md/codec` `0.0.5` for the construct API the fixtures import.
- Move `@art-js/test-records` onto the same pins.
```

### Iteration: Create Constructs Through Codec

**Id:** `create-constructs-through-codec`

**Status:** `PLANNING`

**Purpose:** Delete the three private construct helpers and route the section-field read and write path through the injected codec, with no change in behaviour.

**Description:** Replaces the local construct literals in the three field helpers with `codec.create` calls and the local recursive text reader with `codec.toText`, threading `context.codec` from the capsule into every call site and updating the tests that build a capsule context.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/create-constructs-through-codec.md`

**Changes:**

- Delete `$PACKAGE/src/record/private/createTextBlock.ts`, `$PACKAGE/src/record/private/createTextExpression.ts`, and `$PACKAGE/src/record/private/readText.ts`.
- Change `$PACKAGE/src/record/private/setSectionField.ts` to `setSectionField(codec, field, value)`, where `field` is the `SectionField` its caller already resolved. Create the expression with `codec.create<NaturalExpression>('NaturalExpression', { type: 'text', value: text })` and the block with `codec.create<NaturalBlock>('NaturalBlock', { value: text, children: [] })`. Keep the `const text = String(value)` coercion and the existing inline/block branch.
- Change `$PACKAGE/src/record/private/getSectionField.ts` to `getSectionField(codec, field)`, returning `codec.toText(field)`.
- Change `$PACKAGE/src/record/private/appendSectionField.ts` to `appendSectionField(codec, section, name, value)` and create its expression through the codec. Its `FieldInline` wrapper stays an object literal — this plan replaces the three helpers, not every construct literal in the package.
- In `$PACKAGE/src/record/private/createRecordCapsule.ts`, pass `context.codec` at the three call sites: the `getField` read, the `setField` update, and the `setField` append. The codec is not yet on the internal contexts: `RecordHandleContext` and `RecordsCollectionContext` must each gain `readonly codec: ArtCodec`, populated in `createRecord.ts`, `createRecordsDocument.ts`, and `createRecordsCollection.ts`. `RecordContext` and `RecordsDocumentContext` already carry it; no public type changes.
- Update the tests that construct a capsule context: `$PACKAGE/src/record/createRecord.test.ts` and `$PACKAGE/src/record/private/createRecordProxy.test.ts` pass `codec: {} as never`, which the new path dereferences — supply a real `createArtCodec()` or a stub exposing `create` and `toText`. The `$PACKAGE/tests/helpers/records/createSectionRecord.ts` helper builds a handle context too and needs a codec. The integration fixtures under `$PACKAGE/tests/fixtures` already build a real codec and need no change.
- Remove imports the deletions orphan, and keep `NaturalBlock` and `NaturalExpression` as type-only imports in the field helpers.
- Verify `npm run ci` from `$PACKAGE`, then `npm run ci` from `$PROJECT`.

**Dependencies:**

- Iteration: Pin Art MD Dependencies — this iteration compiles against `@art-md/codec@0.0.5` and `@art-md/primitives@0.0.7`, and the codec is not yet a declared dependency of `$PACKAGE`. Do not delegate until `pin-art-md-dependencies` is committed.
- `Plan: Canonical Record Field Names` iteration `index-property-access-and-labels` rewired `createRecordCapsule` and the field helpers before this iteration was written, landing as `05a7a88`; this iteration is written against that result.

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

`pin-art-md-dependencies` is `READY` with its instruction file and can be delegated now: it touches only the two manifests and the lock, so it cannot collide with the records source. `create-constructs-through-codec` is `PLANNING` with its instruction file authored against the post-`05a7a88` helpers — `setSectionField(field, value)`, `getSectionField(field)`, and `appendSectionField(section, name, value)` — and the internal handles the codec still has to reach; delegate it once the pin commit has landed.

### Blockers

- None — the write-path blocker closed when `index-property-access-and-labels` landed as `05a7a88`.

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
- **`@art-lib/fs-records` republish** — its `@art-md/primitives: 0.0.6` pin is fixed in the art-lib project, not here, and is recorded as a follow-up.
- **`@art-js/test-records` publishing** — the package is a workspace test harness with no registry entry; it is never published.
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
- **One copy of each package** — `npm ls @art-md/codec @art-md/primitives --all` from `$PROJECT` resolves a single `codec@0.0.5` used by both `@art-js/records` and `@art-js/test-records`, and `primitives@0.0.7` everywhere except the documented residual.
- **Residual stays contained** — the nested `primitives@0.0.6` under `@art-lib/fs-records` is the only duplicate left in the tree, and no workspace package resolves through it.

### Findings

- **The helpers exist to fill a gap that closed.** `@art-md/constructs` exports its `FACTORIES` list but not its `create*` functions, so consumer packages that need to assemble a construct by hand had to build the literal. `@art-md/codec` exposed neither creation nor text reading until `0.0.4`; `0.0.5` republishes the same API with exact pins.
- **The codec is already injected.** `RecordHandleContext` in `$PACKAGE/src/record/types.ts` and `RecordsDocumentContext` in `$PACKAGE/src/records-document/types.ts` both declare `codec: ArtCodec`, and `createRecord` already passes it to `createArtDocumentSource`. Threading it into two private functions needs no new API.
- **Factory data shapes.** `NaturalBlockFactoryData` requires `value` and `children`; `NaturalExpressionFactoryData` requires `type` and defaults `children` to `[]`. The codec's `create` forwards its data argument to the factory unchanged.
- **`readText` and `codec.toText` agree.** Both return a string `value` when the construct has one, otherwise join the recursive `children` result, otherwise `''`. `codec.toText` additionally tolerates non-object input the same way.
- **The tests already know the codec but the package does not declare it.** Integration fixtures import `createArtCodec` from `@art-md/codec` while `$PACKAGE/package.json` lists only primitives and constructs; the import resolves today through workspace hoisting.
- **`$PACKAGE` resolves the codec by accident.** `@art-js/records` declares no `@art-md/codec`, yet its fixtures import `createArtCodec`; Node climbs `libs/records/tests/fixtures/*/node_modules` → `libs/records/node_modules` (no codec) → `$PROJECT/node_modules/@art-md/codec`, which holds `0.0.3` only because `@art-js/test-records` declares that version. The dependency works, but it is undeclared and its version is chosen by another package.
- **Hoisting splits `primitives`.** The published art-md packages declare `@art-md/primitives: "*"`, so npm hoists one version that satisfies every `*` range (`0.0.5`) and nests the exact `0.0.6` demanded by `libs/records` and `tests/records`. Moving both workspace edges to `0.0.7` collapses the split.
- **`@art-lib/fs-records@0.0.3` pins `@art-md/primitives: 0.0.6`.** An external dependency of `@art-js/test-records`, it keeps a nested `0.0.6` after the bump. Harmless in the direction values flow (`0.0.7` is assignable to `0.0.6`) and unfixable in this repository.
- **The published package already lags its manifest.** `@art-js/records@0.0.1` on npm declares `0.0.5` pins while the working tree said `0.0.6` before this change; `0.1.0` will be the first release to ship pins matching the source.
- **`05a7a88` reshaped the helpers under this plan.** `setSectionField` and `getSectionField` now take a resolved `SectionField` instead of a section and a name, the append path moved into a new `appendSectionField.ts`, and the capsule resolves fields through a name index. There are three call sites to thread, not two, and no append branch remains inside `setSectionField`.
- **One unit test stubs the codec away.** `createRecord.test.ts` passes `codec: {} as never`, which survives today because the capsule only forwards it to the source factory; the new call path dereferences it.

### Decisions

- **Codec as development dependency.** `$PACKAGE` consumes only `ArtCodec` types; the implementation is consumer-supplied. Declaring it as a runtime dependency would force a codec implementation on consumers who bring their own.
- **Both edges move together.** `@art-js/records` and `@art-js/test-records` are bumped in one commit; bumping one leaves npm free to hoist either version, and which one lands is decided by install order rather than by intent.
- **`@art-js/records` stays `*` in `@art-js/test-records`.** It is the internal workspace edge; pinning it now would only need re-pinning at `0.1.0`.
- **Exact pins.** The Art MD packages now publish exact internal versions; `$PACKAGE` follows the same rule rather than floating ranges.
- **No new abstraction.** `setSectionField` and `getSectionField` take the codec as their first argument. No wrapper module, no module-level singleton, no change to the capsule's public type.
- **Deletion over deprecation.** The three helpers are private and unpublished; they are removed outright, not re-exported or aliased.
- **Behaviour preservation is the test.** This plan changes who owns the behaviour, not what it produces: identical Markdown, identical read values.
