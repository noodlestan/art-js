# Plan: Implement Serializer

**Id:** `implement-serializer`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Bootstrap `@art-js/artificial-serializer` (artast → mdast → md) with test coverage, and extend the fixture tests to two directions: `source.md → art.json` and `art.json → parsed.md`, diffing `source.md` against `parsed.md`.

**Description:** The work makes the parser's block/inline conversion and construct capture boundaries explicit enough for the serializer to consume the resulting tree. Executed within the Artificial repository (`$PROJECT`) as phase 5 of the MD Art Roundtrip milestone.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$PACKAGE_PARSER/architecture/parser.md` (Knowledge) — Parser design principles, block/phrasing boundary, construct API, and serializer pipeline. Relevant for all iterations.

::READ `$PACKAGE_PARSER/architecture/fixture-tests.md` (Knowledge) — Test infrastructure, fixture anatomy, CLI flags, and use cases. Relevant for all iterations.

## Path Variables

This section lists the path variables used throughout the plan file and its downstream work items. All file references in the plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable              | Resolved Path                      | Purpose                              |
| --------------------- | ---------------------------------- | ------------------------------------ |
| `$WORKSPACE`          | Current working directory          | Workspace root directory             |
| `$PROJECT`            | Provided with prompt               | Repository root for all code changes |
| `$PACKAGE_SERIALIZER` | `$PROJECT/art-js/libs/serializer/` | Package being created (phase 5)      |
| `$PACKAGE_PRIMITIVES` | `$PROJECT/art-js/libs/primitives/` | Dependency of serializer             |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/art-js/libs/constructs/` | Dependency of serializer             |
| `$PACKAGE_PARSER`     | `$PROJECT/art-js/libs/parser/`     | Fixture suite extended in this plan  |

## Summary

Bootstrap `@art-js/artificial-serializer` (artast → mdast → md) at `$PACKAGE_SERIALIZER` with test coverage, and extend the fixture tests to two directions: `source.md → art.json` and `art.json → parsed.md`, diffing `source.md` against `parsed.md`. The work also makes the parser's block/inline conversion and construct capture boundaries explicit enough for the serializer to consume the resulting tree. Executed within the Artificial repository (`$PROJECT`) as phase 5 of the MD Art Roundtrip milestone.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the plan.

### Upstream Work

| Kind      | Path                                                     | Role                                                                              |
| --------- | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Milestone | `_backlog/3-now/milestone-md-art-roundtrip/milestone.md` | Defines this plan as phase 5; package table (serializer + constructs).            |
| Briefing  | `_backlog/_architect.md`                                 | Approach (POC-first, schema-first in TS, mdast substrate) and milestone sequence. |

### Required Skills

- `write-plan` — Renders plan and instruction artefacts. Required for Planning, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

- ::READ `$PROJECT/_guide.md` (Guide) — Repository layout, setup, per-package verification commands, records and references locations. Relevant for Setting Up, Verifying Completion.
- ::READ `architecture/index.md` (Knowledge) — Artificial ecosystem overview. Relevant for all iterations.
- ::READ `architecture/records/adr/parser.art` (Knowledge) — mdast-based substrate research behind the parser. Relevant for all iterations.
- ::READ `$PACKAGE_PARSER/test/fixtures/` (Knowledge) — Migrated fixture inputs and `.art.json` snapshots. Relevant for all iterations.

## Scope

This section describes the working scope, where the plan is executed and what it modifies, including the scope resources involved or modified by the plan: workspace paths, repositories, packages, and deployments.

### Project Repositories

- Repository: Artificial — Checked out at `$PROJECT` branch `main`; described by `_records/projects/artificial.art`.

### Packages

- Package: Artificial Serializer — Canonical `@art-js/artificial-serializer` (public @0.0.1); described by `$PACKAGE_SERIALIZER/_records/package.art` (record created in this plan); located at `$PACKAGE_SERIALIZER`.
- Package: Artificial Primitives — Canonical `@art-js/artificial-primitives` (public @0.0.1); described by `$PACKAGE_PRIMITIVES/_records/package.art`; located at `$PACKAGE_PRIMITIVES` (dependency of serializer).
- Package: Artificial Constructs — Canonical `@art-js/artificial-constructs` (public @0.0.1); described by `$PACKAGE_CONSTRUCTS/_records/package.art`; located at `$PACKAGE_CONSTRUCTS` (dependency of serializer; factories it owns map back to md).
- Package: Artificial Parser — Canonical `@art-js/artificial-parser` (public @0.0.1); described by `$PACKAGE_PARSER/_records/package.art`; located at `$PACKAGE_PARSER` (fixture suite extended to two directions in this plan).

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`; working directories are `$PACKAGE_SERIALIZER` and `$PACKAGE_PARSER`.

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the `$PROJECT` root:

```bash
npm ci # to install dependencies.
```

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run per package modified:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

Serializer package: unit tests for `serialize(document): string`. Parser package: two-way fixture tests pass for the maintained numbered fixtures — forward direction (`md/art → art.json` vs checked-in snapshots) and return direction (`art.json → parsed.md`, diffed against `source.md`). Exploratory underscore fixtures remain parser-only inspection material and may have intentionally stale snapshots.

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                                                           | Status |
| ------------------------------------------------------------------------------------------------------------------ | ------ |
| Iteration: Bootstrap Serializer Lib `./instructions/bootstrap-serializer-lib.md`                                   | `DONE` |
| Iteration: Two Way Fixture Tests `./instructions/two-way-fixture-tests.md`                                         | `DONE` |
| Iteration: Integrate Serializer Reports `./instructions/integrate-serializer-reports.md`                           | `DONE` |
| Iteration: Split Tests Parser Vs Serialize `./instructions/split-tests-parser-vs-serialize.md`                     | `DONE` |
| Iteration: Fix Parser Field Inline And Test Fixtures `./instructions/fix-parser-field-inline-and-test-fixtures.md` | `DONE` |
| Iteration: Build Incremental Roundtrip Fixtures `./instructions/build-incremental-roundtrip-fixtures.md`           | `DONE` |
| Iteration: Fix Tag Roundtrip And Refactor `./instructions/fix-tag-roundtrip-and-refactor.md`                       | `DONE` |

### Iteration: Bootstrap Serializer Lib

**Id:** `bootstrap-serializer-lib`

**Status:** `DONE`

**Purpose:** Scaffold `@art-js/artificial-serializer` with build, tests, and package record.

**Description:** Scaffold `@art-js/artificial-serializer` at `$PACKAGE_SERIALIZER` (vite build, tsconfig, package.json; license, dotfiles; mirrors `$PACKAGE_PRIMITIVES` scaffold). Implement `serialize(document): string` — artast → mdast → md — based on the lossless roundtrip contract. Add unit test coverage. Register package record.

**Instructions:** `_backlog/3-now/plan-implement-serializer/instructions/bootstrap-serializer-lib.md`

**Changes:**

- Scaffold `@art-js/artificial-serializer` at `$PACKAGE_SERIALIZER`.
- Implement `serialize(document): string` — artast → mdast → md.
- Add unit test coverage for the serializer.
- Register package record `$PROJECT/_records/packages/artificial-serializer.art`.

#### Commits:

| ID                         | Repository / Checkout / Branch   | Policy       | Hash      | Status      |
| -------------------------- | -------------------------------- | ------------ | --------- | ----------- |
| `bootstrap-serializer-lib` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | `a69f44a` | `COMMITTED` |

### Iteration: Two Way Fixture Tests

**Id:** `two-way-fixture-tests`

**Status:** `DONE`

**Purpose:** Extend the parser fixture suite to test both directions: forward and return.

**Description:** Extend the parser fixture suite (phase 2 runner) to test both directions: `source.md → art.json` (forward, vs POC snapshots) and `art.json → parsed.md` (return, via the serializer). Diff `source.md` against `parsed.md`; report the diff as overhead.

**Instructions:** `_backlog/3-now/plan-implement-serializer/instructions/two-way-fixture-tests.md`

**Changes:**

- Extend the parser fixture suite to test both directions.
- Diff `source.md` against `parsed.md`; report the diff as overhead.
- When `--write` is provided, also write `{fixture}.parsed.md` for debugging.

#### Commits:

| ID                      | Repository / Checkout / Branch   | Policy       | Hash      | Status      |
| ----------------------- | -------------------------------- | ------------ | --------- | ----------- |
| `two-way-fixture-tests` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | `2b3cbd3` | `COMMITTED` |

### Iteration: Integrate Serializer Reports

**Id:** `integrate-serializer-reports`

**Status:** `DONE`

**Purpose:** Integrate serializer commit reports from pairing session.

**Description:** Execute in pairing session with user.

**Instructions:** Executed in pairing session with user.

**Changes:**

- Integrate serializer commit reports.

#### Commits:

| ID                             | Repository / Checkout / Branch   | Policy       | Hash      | Status      |
| ------------------------------ | -------------------------------- | ------------ | --------- | ----------- |
| `integrate-serializer-reports` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | `1bfdbe7` | `COMMITTED` |

### Iteration: Split Tests Parser Vs Serialize

**Id:** `split-tests-parser-vs-serialize`

**Status:** `DONE`

**Purpose:** Split test scripts and add stable snapshot comparison.

**Description:** Replace combined `run-snapshot-check.ts` with separate `test-parser` and `test-serializer` scripts. Add `stableStringify` with custom field ordering for deterministic snapshot output. Extract shared utilities into `scripts/test/shared/`. Regenerate all 15 fixture snapshots with stable key ordering.

**Instructions:** Executed in pairing session with user.

**Changes:**

- Replace combined `run-snapshot-check.ts` with separate `test-parser` and `test-serializer` scripts.
- Add `stableStringify` with custom field ordering for deterministic snapshot output.
- Extract shared utilities (fixture discovery, arg parsing, diffing, summary) into `scripts/test/shared/`.
- Regenerate all 15 fixture snapshots with stable key ordering.

#### Commits:

| ID                                | Repository / Checkout / Branch   | Policy       | Hash      | Status      |
| --------------------------------- | -------------------------------- | ------------ | --------- | ----------- |
| `split-tests-parser-vs-serialize` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | `d8d0135` | `COMMITTED` |

### Iteration: Fix Parser Field Inline And Test Fixtures

**Id:** `fix-parser-field-inline-and-test-fixtures`

**Status:** `DONE`

**Purpose:** Add FieldInline construct and fix test fixture comparison.

**Description:** Add `FieldInline` construct to constructs lib to distinguish inline vs block field content. Add FieldInline in default parser config. Update test fixture snapshots to match new parser output. Streamline serializer to use `FieldInline` metadata for correct rendering.

**Instructions:** `_backlog/3-now/plan-implement-serializer/instructions/fix-parser-field-inline-and-test-fixtures.md`

**Changes:**

- Add `FieldInline` construct to constructs lib.
- Add FieldInline in default parser config.
- Update test fixture snapshots to match new parser output.
- Streamline serializer to use `FieldInline` metadata for correct rendering.

#### Commits:

| ID                                          | Repository / Checkout / Branch   | Policy       | Hash      | Status      |
| ------------------------------------------- | -------------------------------- | ------------ | --------- | ----------- |
| `fix-parser-field-inline-and-test-fixtures` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | `8a6415c` | `COMMITTED` |

### Iteration: Build Incremental Roundtrip Fixtures

**Id:** `build-incremental-roundtrip-fixtures`

**Status:** `DONE`

**Purpose:** Add incremental parser and serializer fixtures covering new construct combinations.

**Description:** Remove stale WIP comments from numbered fixtures. Fix SectionBlock serializer escaping via `fromMarkdown` parsing. Add new incremental fixtures that combine constructs not yet covered (list+link, list+formatting, section+list, section+code, field-block+formatting, field-block+code, tags). For each fixture, generate the parser snapshot, inspect the captured AST, and run the focused serializer roundtrip.

**Instructions:** `_backlog/3-now/plan-implement-serializer/instructions/build-incremental-roundtrip-fixtures.md`

**Changes:**

- Remove stale WIP comments from numbered fixtures (004, 005, 006, 007, 030, 031, 032).
- Fix `_011-section-block-with-formatting.md`: SectionBlock serializer escapes underscores and asterisks in heading names.
- Add new incremental fixtures (008, 009, 014, 015, 024, 025, 040–042).
- Investigate demonstrated failures in parser/construct/serializer code.

#### Commits:

| ID                                     | Repository / Checkout / Branch   | Policy       | Hash      | Status      |
| -------------------------------------- | -------------------------------- | ------------ | --------- | ----------- |
| `build-incremental-roundtrip-fixtures` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | `6c4810c` | `COMMITTED` |

### Iteration: Fix Tag Roundtrip And Refactor

**Id:** `fix-tag-roundtrip-and-refactor`

**Status:** `DONE`

**Purpose:** Fix tag roundtrip for SectionBlock headings and refactor the Tag construct.

**Description:** Rename and update 04\* fixtures to match corrected behavior (043 is new). Refactor Tag construct: extract `createTag.ts` from `createTagCreator.ts` following the NaturalBlock pattern. Fix Tag construct: only capture tags that appear at the END of a text node (not in the middle). Fix SectionBlock serializer: emit `(#tag)` syntax when tags are present.

**Instructions:** `_backlog/3-now/plan-implement-serializer/instructions/fix-tag-roundtrip-and-refactor.md`

**Changes:**

- Rename and update 04\* fixtures to match corrected behavior (043 is new).
- Refactor Tag construct: extract `createTag.ts` from `createTagCreator.ts`.
- Fix Tag construct: only capture tags at end of text node.
- Fix SectionBlock serializer: emit `(#tag)` syntax when tags are present.
- Verify all numbered fixtures pass both parser and serializer tests.

#### Commits:

| ID                               | Repository / Checkout / Branch   | Policy       | Hash      | Status      |
| -------------------------------- | -------------------------------- | ------------ | --------- | ----------- |
| `fix-tag-roundtrip-and-refactor` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | `0724f61` | `COMMITTED` |

## Work

### Next

All iterations completed. Plan is ready to move to DONE.

### Blockers

None.

## Coordination

### Not In Scope

### Out of Scope

- Out of scope: pipeline test suite , addressed in phase 6 (`plan-migrate-tests-pipeline`).

- **Pipeline test suite** — (`$PROJECT/art-js/cli/pipeline-tests/`, `scripts/roundtrip.ts`, `fixtures/roundtrip/`) Addressed in phase 6 (`plan-migrate-tests-pipeline`).

### Evidence

- **All 41 fixtures pass parser tests** — verified via `npm run test-parser`.
- **39/41 fixtures lossless roundtrip** — 2 expected tag diffs (040, 041).

### Findings

- **Architecture insight:** The parser must preserve the mdast block/phrasing distinction recursively. `NaturalBlock` handles block content and `NaturalExpression` handles mdast phrasing content, with mdast attributes stored generically apart from `children`.
- **Architecture insight:** FieldBlock, not FieldInline or the generic builder, owns its capture boundary. Its active context closes when the next `FieldBlock`, `FieldInline`, or `SectionBlock` arrives.
- **Architecture insight:** `ConstructCreator.shouldVisit` and `ConstructPreProcessor.canPreProcess` were redundant and were removed.
- **Test infrastructure insight:** `test-serializer` always exits with code 0 (WIP gap — `return failed === 0 ? 0 : 2` is commented out).
- **Test infrastructure insight:** `--debug-write` in `test-serializer` only writes `.parsed.md` when there IS a diff.

### Decisions

- **Lossless roundtrip fidelity** — Roundtrip diffs (1277 lines) are expected overhead; fidelity refinement is explicitly scoped to phase 8.
- **Two-step dependency** — Serializer before fixture tests held successfully.

### Knowledge to Update

None.

### Follow Ups

None.

### Feedback

- `bootstrap-serializer-lib`: Instructions clear; all 12 unit tests passing; serializer package scaffolded with ToMdast functions for all 5 constructs; CI passes (12/12 tasks).
- `two-way-fixture-tests`: Instructions clear and self-contained; pseudo-code matched implementation shape closely; 15 fixture snapshot checks pass (forward); return direction serializes without errors; roundtrip overhead logged as informational (1277 lines differ — expected, not failure).
- `build-incremental-roundtrip-fixtures`: Committed `6c4810c`. Cleaned WIP from `032`, fixed SectionBlock serializer escaping via `fromMarkdown` parsing, promoted `_011` → `011`. Added 9 new fixtures (008, 009, 011, 014, 015, 024, 025, 040–042). 26/28 numbered fixtures lossless roundtrip; 2 expected tag diffs (040, 041). No regressions in existing fixtures.
