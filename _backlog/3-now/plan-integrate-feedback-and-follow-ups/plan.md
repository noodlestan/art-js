# Plan: Integrate Feedback and Follow-Ups

**Id:** `integrate-feedback-and-follow-ups`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Introduce TagReference spec, clean up tag definitions, and remove noisy POC fixtures.

**Description:** Create TagReference spec, simplify tag spec by removing projections prose, fix VocabularyDeclaration syntax reference, and remove noisy `_` fixture files from test suites.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

Create TagReference spec, clean up tag spec projections prose, fix VocabularyDeclaration reference, and remove legacy `_`-prefixed fixture files.

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

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

**Note:** The 2 commits below will be manually executed without instruction files.

| Iteration / Instructions                                                                                    | Status |
| ----------------------------------------------------------------------------------------------------------- | ------ |
| Iteration: Tag Reference Spec `./plan-integrate-feedback-and-follow-ups/instructions/tag-reference-spec.md` | `DONE` |
| Iteration: Fixture Cleanup `./plan-integrate-feedback-and-follow-ups/instructions/fixture-cleanup.md`       | `DONE` |

### Iteration: Tag Reference Spec

**Id:** `tag-reference-spec`

**Status:** `DONE`

**Purpose:** Introduce TagReference spec file, clean up tag spec by removing projection prose, and fix VocabularyDeclaration syntax reference.

**Description:** Create `spec/grammar/constructs/expressions/tag-reference.art` for backticked `#<identifier>` references in instructions. Clean up `spec/grammar/constructs/expressions/tag.art` by removing all "projections" related prose and simplifying tag definitions to target `SectionBlock` and `VocabularyDeclaration`, fixing `<Vocabulary> <Tags>` to `<VocabularyDeclaration> <Tags>`.

**Instructions:** `./plan-integrate-feedback-and-follow-ups/instructions/tag-reference-spec.md`

**Report:** `./plan-integrate-feedback-and-follow-ups/instructions/tag-reference-spec__report.md`

**Changes:**

- Create `spec/grammar/constructs/expressions/tag-reference.art`.
- Edit `spec/grammar/constructs/expressions/tag.art` to remove projections prose and fix VocabularyDeclaration reference.

**Dependencies:**

#### Commits:

| ID                   | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| -------------------- | ------------------------------ | -------- | --------- | ----------- |
| `tag-reference-spec` | $PROJECT / `main`              | `MANUAL` | `8b61ed5` | `COMMITTED` |

##### Commit: `tag-reference-spec`

**Repository:** Art JS

**Message:**

```
spec(art-js): Add TagReference spec and clean up tag definitions

- Create `spec/grammar/constructs/expressions/tag-reference.art`
- Remove projections prose from `spec/grammar/constructs/expressions/tag.art`
- Fix VocabularyDeclaration syntax reference
```

### Iteration: Fixture Cleanup

**Id:** `fixture-cleanup`

**Status:** `DONE`

**Purpose:** Remove noisy POC-era `_`-prefixed fixture files from test suites.

**Description:** Delete the 13 `_`-prefixed fixture files and their JSON snapshots from `libs/constructs/test/fixtures/` to eliminate test suite noise.

**Instructions:** `./plan-integrate-feedback-and-follow-ups/instructions/fixture-cleanup.md`

**Report:** `./plan-integrate-feedback-and-follow-ups/instructions/fixture-cleanup__report.md`

**Changes:**

- Delete `_`-prefixed fixture files and `.json` snapshots from `libs/constructs/test/fixtures/`.

**Dependencies:**

#### Commits:

| ID                | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ----------------- | ------------------------------ | -------- | --------- | ----------- |
| `fixture-cleanup` | $PROJECT / `main`              | `MANUAL` | `3ffe7bf` | `COMMITTED` |

##### Commit: `fixture-cleanup`

**Repository:** Art JS

**Message:**

```
test(art-js): Remove noisy POC-era underscore-prefixed fixtures

- Delete 13 `_`-prefixed fixture files from `libs/constructs/test/fixtures/`
- Delete corresponding `.json` snapshots
```

## Work

### Next

All iterations DONE. Commits `8b61ed5` and `3ffe7bf` tracked.
Execute the 2 MANUAL commits: `tag-reference-spec` then `fixture-cleanup`.

### Blockers

## Coordination

### Not In Scope

- Core parsing rules.

### Evidence

- Updated specification and fixture directories.
- Created `spec/grammar/constructs/expressions/tag-reference.art` with TagReference construct definition.
- Cleaned `spec/grammar/constructs/expressions/tag.art` by removing projections prose and fixing VocabularyDeclaration reference.
- Deleted 26 `_`-prefixed POC-era fixture files and their JSON snapshots from `libs/constructs/test/fixtures/`.

### Decisions

- Remove POC `_` fixtures as they are superseded by numbered incremental fixtures (000–043).

### Follow Ups

- **Feedback:** The Tag rules section in `tag.art` still contains one "per projection" clause: "A Tag determines the inclusion, exclusion, or transformation of the tagged declaration content per projection." It was left in place because the instruction scoped the projections cleanup to the Description only.
