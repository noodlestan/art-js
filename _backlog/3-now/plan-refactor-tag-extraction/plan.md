# Plan: Refactor Tag Extraction

**Id:** `refactor-tag-extraction`

**Status:** `WORKING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Deduplicate ways of extracting tags.

**Description:** Move the responsibility of tagging from the Tag construct to taggable constructs, leaving only helpers, types, and patterns in the Tag constructs folder.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

The Tag construct currently owns tag detection and routing (factory + routing handler + `findTagable`), while SectionBlock duplicates the extraction logic in its own `extractEndTags`. Move tag extraction into a shared `extractTags` helper consumed by taggable constructs (FieldInline first, then NaturalBlock and SectionBlock), and expose `tagToMdast` / `tagsToMdast` serialization helpers so taggables serialize tags back into their own structure. The Tag construct keeps only helpers, types, and patterns — no parser construct, no `ConstructToMdast`.

## Context

### Upstream Work

| Kind      | Path                                                | Role                                                    |
| --------- | --------------------------------------------------- | ------------------------------------------------------- |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md` | Defines this plan as part of the Consolidate milestone. |

### Knowledge

- ::READ `libs/parser/src/builder.ts` (Knowledge) — Parser builder dispatch (`preProcessor` / `factory` loop).
- ::READ `libs/constructs/src/constructs/Tag/` (Knowledge) — Tag construct to strip down to helpers.
- ::READ `libs/constructs/src/constructs/FieldInline/` (Knowledge) — First taggable construct.
- ::READ `libs/constructs/src/constructs/SectionBlock/` (Knowledge) — Current self-tagging to eventually replace.

## Scope

### Out of Scope

- New feature development.
- Parser structural changes (no `builder.ts` changes in iterations 1–2).

### Packages

- Package: Artificial Constructs — `libs/constructs/`
- Package: Artificial Parser — `libs/parser/` (config only)
- Package: Artificial Serializer — `libs/serializer/` (config only)

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                                                  | Status  |
| ------------------------------------------------------------------------------------------------------------------------- | ------- |
| Iteration: Strip Tag Construct to Helpers `./plan-refactor-tag-extraction/instructions/strip-tag-construct-to-helpers.md` | `DONE`  |
| Iteration: Make FieldInline Taggable `./plan-refactor-tag-extraction/instructions/make-field-inline-taggable.md`          | `DONE`  |
| Iteration: Apply Taggable Pattern to NaturalBlock                                                                         | `DRAFT` |
| Iteration: Apply Taggable Pattern to SectionBlock                                                                         | `DRAFT` |

### Iteration: Strip Tag Construct to Helpers

**Id:** `strip-tag-construct-to-helpers`

**Status:** `DONE`

**Purpose:** Remove the Tag parser construct and routing machinery, leaving only the extraction helper, types, and patterns, plus serialization helpers.

**Description:** Delete `createTagParser`, `createTagCreator`, `createTagRoutingHandler`, `createTagToMdast`; add `tagToMdast` / `tagsToMdast` helpers; move `findTagable` to SectionBlock; remove Tag from the default parser and serializer configs; regenerate the 052 snapshot.

**Instructions:** `./plan-refactor-tag-extraction/instructions/strip-tag-construct-to-helpers.md`

**Changes:**

- Delete `libs/constructs/src/constructs/Tag/createTagParser.ts`, `private/createTagCreator.ts`, `private/createTagRoutingHandler.ts`, `private/findTagable.ts`, `createTagToMdast.ts` (+ `createTagToMdast.test.ts`).
- Keep `private/createTag.ts` (extraction helper), `private/types.ts` (Tag type), `private/constants.ts` (TAG_PATTERN).
- Add serialization helpers `tagToMdast(tag)` and `tagsToMdast(tags)` emitting `(#name)` text nodes.
- Move `findTagable` to `SectionBlock/private/findTagable.ts`; update the import in `createSectionBlockHandler.ts`.
- Update `Tag/index.ts` and `libs/constructs/src/index.ts` exports.
- Remove `createTagParser` from `libs/parser/src/config/createDefaultConfig.ts`.
- Remove `createTagToMdast` from `libs/serializer/src/config/createDefaultSerializerConfig.ts`.
- Regenerate fixture 052 snapshot (tags no longer attached anywhere).

**Dependencies:**

None.

#### Commits:

| ID                                     | Repository / Checkout / Branch | Policy     | Hash                  | Status      |
| -------------------------------------- | ------------------------------ | ---------- | --------------------- | ----------- |
| `strip-tag-construct-to-helpers`       | $PROJECT / `main`              | `NOCOMMIT` | merged with `80e8231` | `COMMITTED` |
| `remove-tag-from-default-configs`      | $PROJECT / `main`              | `NOCOMMIT` | `80e8231`             | `COMMITTED` |
| `regenerate-052-snapshot-without-tags` | $PROJECT / `main`              | `NOCOMMIT` | `d1cae57`             | `COMMITTED` |

##### Commit: `strip-tag-construct-to-helpers`

**Repository:** Art JS

**Message:**

```
refactor(constructs): Strip Tag construct to helpers and serialization utilities

- Delete createTagParser, createTagCreator, createTagRoutingHandler, createTagToMdast
- Add tagToMdast and tagsToMdast helpers emitting (#name) text nodes
- Move findTagable to SectionBlock/private and update handler import
- Update Tag and constructs index exports
```

##### Commit: `remove-tag-from-default-configs`

**Repository:** Art JS

**Message:**

```
refactor(art-js): Remove Tag from default parser and serializer configs

- Remove createTagParser from parser createDefaultConfig
- Remove createTagToMdast from serializer createDefaultSerializerConfig
```

##### Commit: `regenerate-052-snapshot-without-tags`

**Repository:** Art JS

**Message:**

```
test(constructs): Regenerate 052 snapshot without tags

- Rename fixture _052 back to 052
- Tags are no longer attached to any construct after Tag parser removal
```

### Iteration: Make FieldInline Taggable

**Id:** `make-field-inline-taggable`

**Status:** `DONE`

**Purpose:** Prove the taggable pattern on FieldInline: the taggable calls `extractTags` on its own text and serializes tags back via `tagsToMdast`.

**Description:** Add 060/061 fixtures; reshape `createTag` into `extractTags(text): { tags, stripped }`; add `tags?: Tag[]` to FieldInline; rewrite `createFieldInlinePreProcessor` to consume `extractTags`; update `createFieldInlineToMdast` to append `tagsToMdast`; update tests.

**Instructions:** `./plan-refactor-tag-extraction/instructions/make-field-inline-taggable.md`

**Changes:**

- Add fixtures `060-tag-at-end-of-field-inline.md(+.json)` and `061-invalid-tag-in-field-inline.md(+.json)`.
- Reshape `Tag/private/createTag.ts` into `extractTags(text: string): { tags: Tag[]; stripped: string }` (pure, trailing-only extraction).
- Add `tags?: Tag[]` to `FieldInline/private/types.ts`.
- Rewrite `createFieldInlinePreProcessor.ts` to consume `extractTags` on the last text child of the field value.
- Update `createFieldInlineToMdast.ts` to append `tagsToMdast(field.tags)` after the children.
- Update `createFieldInlinePreProcessor.test.ts`.

**Dependencies:**

- Iteration: Strip Tag Construct to Helpers.

#### Commits:

| ID                              | Repository / Checkout / Branch | Policy     | Hash      | Status      |
| ------------------------------- | ------------------------------ | ---------- | --------- | ----------- |
| `remove-obsolete-tag-test`      | $PROJECT / `main`              | `NOCOMMIT` | `2736288` | `COMMITTED` |
| `reshape-tag-extraction-helper` | $PROJECT / `main`              | `NOCOMMIT` | `6cb5752` | `COMMITTED` |
| `make-field-inline-taggable`    | $PROJECT / `main`              | `NOCOMMIT` | `be454c6` | `COMMITTED` |

##### Commit: `remove-obsolete-tag-test`

**Repository:** Art JS

**Message:**

```
test(serializer): Remove obsolete Tag test and parser-responsibility tests

- Remove standalone Tag serialization test (tags no longer standalone constructs)
- Remove roundtrip fixture and smoke tests breaching parser test responsibility
- Re-export construct types from registry via export type *
```

##### Commit: `reshape-tag-extraction-helper`

**Repository:** Art JS

**Message:**

```
refactor(constructs): Reshape tag extraction into extractTags helper.

- Rename createTag.ts to extractTags.ts with extractTags(text) returning { tags, stripped }.
- Add createTag factory with TagFactoryData for tag construction.
- Keep trailing-only extraction (no tags in the middle rule).
-  Add extractTags unit tests (no tags, single, multiple, invalid, mixed, trailing whitespace)
```

##### Commit: `make-field-inline-taggable`

**Repository:** Art JS

**Message:**

```
feat(constructs): Make FieldInline taggable.

- Add tags?: Tag[] to FieldInline type.
- Consume extractTags on the last text child in createFieldInlinePreProcessor.
- Append tagsToMdast output in createFieldInlineToMdast.
- Reduce tagsToMdast to a single text node with leading space.
- Add 060/061/062 fixtures and regenerate snapshots.
- Update createFieldInlinePreProcessor tests.
```

### Iteration: Apply Taggable Pattern to NaturalBlock

**Id:** `apply-taggable-pattern-to-natural-block`

**Status:** `DRAFT`

**Purpose:** Apply the taggable pattern to NaturalBlock.

**Description:** Streamline NaturalBlock creation first (NaturalBlock is the default construct and is created in multiple places), then consume `extractTags` on the paragraph text and attach the extracted tags.

**Changes:**

- Streamline NaturalBlock creation paths.
- Consume `extractTags` on the paragraph text; attach `tags` to the NaturalBlock.
- Keep the snippet text unchanged (tags stay in the text; `tags[]` is a derived index).

**Dependencies:**

- Iteration: Strip Tag Construct to Helpers.
- Iteration: Make FieldInline Taggable.

### Iteration: Apply Taggable Pattern to SectionBlock

**Id:** `apply-taggable-pattern-to-section-block`

**Status:** `DRAFT`

**Purpose:** Apply the taggable pattern to SectionBlock.

**Description:** Remove `extractEndTags` from `createSectionBlockCreator`; consume `extractTags` on the heading text; replace the inline `tagSyntax` in `createSectionBlockToMdast` with `tagsToMdast`.

**Changes:**

- Remove `extractEndTags` from `createSectionBlockCreator.ts`; consume `extractTags` for name stripping and tags.
- Replace inline `tagSyntax` in `createSectionBlockToMdast.ts` with `tagsToMdast`.
- Regenerate affected snapshots (040/042/043 tags gain position).

**Dependencies:**

- Iteration: Strip Tag Construct to Helpers.
- Iteration: Make FieldInline Taggable.

## Work

### Next

Delegate iteration `strip-tag-construct-to-helpers` (NOCOMMIT).

### Blockers

None.

## Coordination

### Not In Scope

- New features.
- Parser structural changes.

### Evidence

- All fixtures pass in `test-parser` and `test-serializer`; lint clean.

### Decisions

- The Tag construct exposes helpers (`extractTags`, `tagToMdast`, `tagsToMdast`) and types/patterns only — no parser construct, no `ConstructToMdast` (so tags are never emitted as standalone tree nodes by `artAstToMdast.ts`).
- Taggable constructs own the decision of what text to send to `extractTags` and where to serialize tags back.
- Tag position is fixed inside `extractTags` for now; the caller-side decision (options for `extractTags`) is deferred.

### Follow Ups

- Rename `ConstructPreProcessor` and its `preProcess` method to `captureNode`.
- Eliminate `factory.detect + create`, converting all constructs to the preProcessor / `captureNode` pattern.
