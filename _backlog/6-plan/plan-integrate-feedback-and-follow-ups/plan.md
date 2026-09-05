# Plan: Integrate Feedback and Follow-Ups

**Id:** `integrate-feedback-and-follow-ups`

**Status:** `PREPARING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Integrate feedback and follow-ups from completed plans into knowledge and spec, introduce TagReference spec, and clean up noisy POC fixtures.

**Description:** Scan completed plans for feedback and follow-ups, introduce TagReference spec, simplify tag definitions by removing projections prose, fix VocabularyDeclaration syntax, and remove noisy `_` fixture files from test suites.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

Consolidate actionable feedback and follow-ups from completed backlog plans, clean up legacy fixture files, and finalize tag and reference specifications.

## Context

### Upstream Work

| Kind      | Path                                                | Role                                                       |
| --------- | --------------------------------------------------- | ---------------------------------------------------------- |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md` | Defines this plan as phase 1 of the Consolidate milestone. |

### Knowledge

- ::READ `spec/grammar/constructs/expressions/tag.art` (Knowledge) — Tag construct spec.
- ::READ `spec/grammar/constructs/inline/vocabulary-declaration.art` (Knowledge) — VocabularyDeclaration spec.
- ::READ `spec/grammar/constructs/expressions/identifier.art` (Knowledge) — Identifier spec.
- ::READ `libs/constructs/test/fixtures/` (Knowledge) — Construct test fixtures.

## Scope

### Out of Scope

- Core parser/serializer logic changes (handled in subsequent refactoring plans).

### Packages

- Package: Artificial Spec — `spec/`
- Package: Artificial Constructs — `libs/constructs/`

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                                                   | Status      |
| -------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Iteration: Integrate Feedback and Follow-Ups `./plan-integrate-feedback-and-follow-ups/instructions/integrate-feedback.md` | `PREPARING` |
| Iteration: Tag Reference Spec `./plan-integrate-feedback-and-follow-ups/instructions/tag-reference-spec.md`                | `PREPARING` |
| Iteration: Fixture Cleanup `./plan-integrate-feedback-and-follow-ups/instructions/fixture-cleanup.md`                      | `PREPARING` |

### Iteration: Integrate Feedback and Follow-Ups

**Id:** `integrate-feedback`

**Status:** `PREPARING`

**Purpose:** Apply feedback from previous iterations.

**Instructions:** `./plan-integrate-feedback-and-follow-ups/instructions/integrate-feedback.md`

**Notes for planner:**

Scan completed plans in `_backlog/1-done` for feedback and follow-ups, deduplicate, discard already implemented items, and convert remaining items to one of:

- candidates for changes made with a commit in this iteration (tiny changes).
- candidates for changes made with a separate iteration in this plan (small changes).
- candidates for a new plan in this milestone phase (big changes).
- entries backlog parking lot (items to address in an already existing follow up plan).
- entries roadmap parking lot (future scope).

**Dependencies:**

None.

### Iteration: Tag Reference Spec

**Id:** `tag-reference-spec`

**Status:** `PREPARING`

**Purpose:** Introduce TagReference spec file, clean up tag spec by removing projection prose, and fix VocabularyDeclaration syntax reference.

**Description:** Create `spec/grammar/constructs/expressions/tag-reference.art` for backticked `#<identifier>` references in instructions. Clean up `spec/grammar/constructs/expressions/tag.art` by removing all "projections" related prose and simplifying tag definitions to target `SectionBlock` and `VocabularyDeclaration`, fixing `<Vocabulary> <Tags>` to `<VocabularyDeclaration> <Tags>`.

**Instructions:** `./plan-integrate-feedback-and-follow-ups/instructions/tag-reference-spec.md`

**Changes:**

- Create `spec/grammar/constructs/expressions/tag-reference.art`.
- Edit `spec/grammar/constructs/expressions/tag.art` to remove projections prose and fix VocabularyDeclaration reference.

**Dependencies:**

None.

### Iteration: Fixture Cleanup

**Id:** `fixture-cleanup`

**Status:** `PREPARING`

**Purpose:** Remove noisy POC-era `_`-prefixed fixture files from test suites.

**Description:** Delete the 13 `_`-prefixed fixture files and their JSON snapshots from `libs/constructs/test/fixtures/` to eliminate test suite noise.

**Instructions:** `./plan-integrate-feedback-and-follow-ups/instructions/fixture-cleanup.md`

**Changes:**

- Delete `_`-prefixed fixture files and `.json` snapshots from `libs/constructs/test/fixtures/`.

**Dependencies:**

None.

## Work

### Next

Delegate instruction `integrate-feedback`.

### Blockers

None.

## Coordination

### Not In Scope

- Core parsing rules.

### Evidence

- Updated specification and fixture directories.

### Decisions

- Remove POC `_` fixtures as they are superseded by numbered incremental fixtures (000–043).

### Follow Ups

None.
