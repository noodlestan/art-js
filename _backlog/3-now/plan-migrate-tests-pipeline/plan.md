# Plan: Migrate Tests to Pipeline

**Id:** `migrate-tests-pipeline`

**Status:** `WORKING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Migrate the parser and serializer test scripts and fixture suite into `@art-js/pipeline-test-cli` at `cli/pipeline-tests/`, making the test harness a standalone CLI package that depends on both parser and serializer.

**Description:** The test scripts (`test-parser.ts`, `test-serializer.ts`) move from `libs/parser/scripts/` to `cli/pipeline-tests/scripts/`. Fixtures move from `libs/parser/test/fixtures/` to `libs/constructs/test/fixtures/`. Scripts gain a `--path` parameter to locate fixtures. The pipeline-tests package is scaffolded like `cli/bin`. Knowledge files (fixture-tests, roundtrip) move to repo-level `architecture/`. The parser package retains only `parser.md` in its architecture. Stale poc-parse references eliminated.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable              | Resolved Path                  | Purpose                                           |
| --------------------- | ------------------------------ | ------------------------------------------------- |
| `$WORKSPACE`          | Current working directory      | Workspace root directory                          |
| `$PROJECT`            | `$WORKSPACE/checkouts/art-js`  | Repository root for all code changes              |
| `$PACKAGE_PARSER`     | `$PROJECT/libs/parser/`        | Parser package (scripts and fixtures migrate out) |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/libs/constructs/`    | Constructs package (fixtures migrate in)          |
| `$PACKAGE_SERIALIZER` | `$PROJECT/libs/serializer/`    | Serializer package (test dependency)              |
| `$PACKAGE_PIPELINE`   | `$PROJECT/cli/pipeline-tests/` | Pipeline test CLI package (new)                   |

## Summary

Migrate the test suites into `@art-js/pipeline-test-cli` at `cli/pipeline-tests/`, where tests depend on BOTH `@art-js/artificial-parser` and `@art-js/artificial-serializer`. Scripts gain a `--path` parameter for fixture location. Fixtures move to `libs/constructs/test/fixtures/`. Knowledge files move to repo-level `architecture/`. Eliminate stale poc-parse references.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the plan.

### Upstream Work

| Kind      | Path                                                     | Role                                                                              |
| --------- | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Milestone | `_backlog/3-now/milestone-md-art-roundtrip/milestone.md` | Defines this plan as phase 6.                                                     |
| Briefing  | `_backlog/_architect.md`                                 | Approach (POC-first, schema-first in TS, mdast substrate) and milestone sequence. |

### Knowledge

- ::READ `libs/parser/architecture/fixture-tests.md` (Knowledge) — Test infrastructure, fixture anatomy, CLI flags. Relevant for all iterations.
- ::READ `libs/parser/architecture/parser.md` (Knowledge) — Parser design principles. Relevant for migration context.
- ::READ `libs/parser/test/fixtures/` (Knowledge) — Fixture inputs and snapshots being migrated.

## Scope

### Out of Scope

- Out of scope: roundtrip gap closure (whitespace, formatting), addressed in phase 8 (`plan-implement-gaps`).
- Out of scope: archive and publish, addressed in phase 10.

### Packages

- Package: Pipeline Test CLI — `@art-js/pipeline-test-cli` (not published); located at `$PACKAGE_PIPELINE`; depends on parser + serializer.
- Package: Artificial Parser — `@art-js/artificial-parser`; located at `$PACKAGE_PARSER`; scripts and fixtures migrate out.
- Package: Artificial Constructs — `@art-js/artificial-constructs`; located at `$PACKAGE_CONSTRUCTS`; fixtures migrate in.
- Package: Artificial Serializer — `@art-js/artificial-serializer`; located at `$PACKAGE_SERIALIZER`; test dependency.

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`; primary working directory is `$PACKAGE_PIPELINE`.

## Items:

| Iteration / Instructions                                                                                                   | Status  |
| -------------------------------------------------------------------------------------------------------------------------- | ------- |
| Iteration: Make Serializer Tests Mandatory `./plan-migrate-tests-pipeline/instructions/make-serializer-tests-mandatory.md` | `DONE`  |
| Iteration: Scaffold Pipeline Tests Package `./plan-migrate-tests-pipeline/instructions/scaffold-pipeline-tests-package.md` | `READY` |
| Iteration: Migrate Test Scripts `./plan-migrate-tests-pipeline/instructions/migrate-test-scripts.md`                       | `READY` |
| Iteration: Update Knowledge And Guide `./plan-migrate-tests-pipeline/instructions/update-knowledge-and-guide.md`           | `READY` |

### Iteration: Make Serializer Tests Mandatory

**Id:** `make-serializer-tests-mandatory`

**Status:** `DONE`

**Purpose:** Make the serializer test runner exit with failure code when roundtrip diffs are detected.

**Description:** Replace the WIP comment in `test-serializer.ts` with the actual exit code logic, so CI catches serializer roundtrip failures.

**Instructions:** `./plan-migrate-tests-pipeline/instructions/make-serializer-tests-mandatory.md`
**Report:** `./plan-migrate-tests-pipeline/instructions/make-serializer-tests-mandatory__report.md`

**Changes:**

- In `$PACKAGE_PARSER/scripts/test-serializer.ts`, replace the WIP block with `return failed === 0 ? 0 : 2;`.
- Verify `npm run test-serializer` in parser package still passes (all fixtures currently lossless).

#### Commits:

| ID                                | Repository / Checkout / Branch   | Policy       | Hash      | Status      |
| --------------------------------- | -------------------------------- | ------------ | --------- | ----------- |
| `make-serializer-tests-mandatory` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | `e9a21e4` | `COMMITTED` |

##### Commit: `make-serializer-tests-mandatory`

**Repository:** Artificial

**Message:**

```
build(art-md-roundtrip): Make serializer tests mandatory.
```

### Iteration: Scaffold Pipeline Tests Package

**Id:** `scaffold-pipeline-tests-package`

**Status:** `READY`

**Purpose:** Create the `@art-js/pipeline-test-cli` package at `cli/pipeline-tests/` with records, configuration, and repo-level architecture files.

**Description:** Scaffold `cli/pipeline-tests/` following the `cli/bin` pattern. Create `_records/package.art` and `_records/npm-deployment.art`. Create `package.json` with scripts (test, test-parser, test-serializer) and no dependencies. Create tsconfig files. Create repo-level `architecture/` with `art-md-fixture-tests.md` (from `libs/parser/architecture/fixture-tests.md`) and `art-md-roundtrip.md` (from `libs/parser/architecture/index.md`), plus an index. Update `_guide.md` layout and knowledge references.

**Instructions:** `./plan-migrate-tests-pipeline/instructions/scaffold-pipeline-tests-package.md`

**Changes:**

Create ALL of the following files in `cli/pipeline-tests/`, mirroring the `cli/bin` package layout:

- `_guide.md`
- `_records/package.art`
- `_records/npm-deployment.art`
- `.npmignore`
- `.prettierignore`
- `LICENSE-MIT`
- `package.json`
- `README.md`
- `src/index.ts`
- `tsconfig.json`
- `tsconfig.cjs.json`
- `tsconfig.esm.json`

Then modify the following files (vs. copying `cli/bin` as-is):

- `_records/package.art` — set Owner: Project: Art JS, Canonical Name: `@art-js/pipeline-test-cli`, Path: `cli/pipeline-tests/`, no `main` field, scripts inline (test, test-parser, test-serializer), no dependencies.
- `_records/npm-deployment.art` — set Owner: Package: Pipeline Test CLI, Canonical Name: `@art-js/pipeline-test-cli`.
- `package.json` — match `_records/package.art`; scripts: `test`, `test-parser`, `test-serializer`; no dependencies.

Also create repo-level architecture files:

- Create `$PROJECT/architecture/art-md-fixture-tests.md` (moved from `libs/parser/architecture/fixture-tests.md`).
- Create `$PROJECT/architecture/art-md-roundtrip.md` (content from `libs/parser/architecture/index.md`).
- Create `$PROJECT/architecture/index.md` listing the two files.
- Update `libs/parser/architecture/index.md` to list only `parser.md`.
- Update `_guide.md`: add `architecture/` to layout, add pipeline to Projects, add repo architecture to knowledge.
- Run `npm install` from `$PROJECT` root to register the package.

#### Commits:

| ID                                | Repository / Checkout / Branch   | Policy       | Hash  | Status     |
| --------------------------------- | -------------------------------- | ------------ | ----- | ---------- |
| `scaffold-pipeline-tests-package` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `scaffold-pipeline-tests-package`

**Repository:** Artificial

**Message:**

```
build(art-md-roundtrip): Scaffold pipeline-tests package.
```

### Iteration: Migrate Test Scripts

**Id:** `migrate-test-scripts`

**Status:** `WORKING`

**Purpose:** Move test scripts and fixtures from parser to pipeline-tests and constructs packages.

**Description:** Move `test-parser.ts` and `test-serializer.ts` (and their `test/` support directories) from `libs/parser/scripts/` to `cli/pipeline-tests/scripts/`. Move fixtures from `libs/parser/test/fixtures/` to `libs/constructs/test/fixtures/`. Update `FIXTURES_DIR` constant to accept `--path` parameter. Update `package.json` scripts. Verify tests pass from the pipeline-tests package.

**Instructions:** `./plan-migrate-tests-pipeline/instructions/migrate-test-scripts.md`

**Changes:**

- Move `libs/parser/scripts/test-parser.ts` → `cli/pipeline-tests/scripts/test-parser.ts`.
- Move `libs/parser/scripts/test-serializer.ts` → `cli/pipeline-tests/scripts/test-serializer.ts`.
- Move `libs/parser/scripts/test/` → `cli/pipeline-tests/scripts/test/`.
- Move `libs/parser/test/fixtures/` → `libs/constructs/test/fixtures/`.
- Update `FIXTURES_DIR` in `constants.ts` to resolve from `--path` CLI argument or default to `libs/constructs/test/fixtures/`.
- Update `cli/pipeline-tests/package.json` scripts: `test`, `test-parser`, `test-serializer`.
- Remove test scripts from `libs/parser/package.json`.
- Verify `npm run test` passes from `cli/pipeline-tests/`.
- Verify `npm run test` still passes from `libs/parser/` (if it has any remaining tests).

#### Commits:

| ID                     | Repository / Checkout / Branch   | Policy       | Hash  | Status     |
| ---------------------- | -------------------------------- | ------------ | ----- | ---------- |
| `migrate-test-scripts` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `migrate-test-scripts`

**Repository:** Artificial

**Message:**

```
build(art-md-roundtrip): Migrate test scripts to pipeline-tests.
```

### Iteration: Update Knowledge And Guide

**Id:** `update-knowledge-and-guide`

**Status:** `READY`

**Purpose:** Update the repository guide and knowledge references to reflect the migrated test pipeline, and remove stale poc-parse references.

**Description:** Ensure `_guide.md` verifying operating instructions reference the pipeline-tests package. Clean up any remaining stale references to poc-parse or old fixture paths.

**Instructions:** `./plan-migrate-tests-pipeline/instructions/update-knowledge-and-guide.md`

**Changes:**

- Update `_guide.md` "Verifying Step" operating instructions to reference `cli/pipeline-tests/` and `npm run test`.
- Add instruction to read `architecture/art-md-fixture-tests.md` for debugging failed tests.
- Remove any remaining poc-parse references from `_guide.md` and knowledge files.

#### Commits:

| ID                           | Repository / Checkout / Branch   | Policy       | Hash  | Status     |
| ---------------------------- | -------------------------------- | ------------ | ----- | ---------- |
| `update-knowledge-and-guide` | Artificial / `$PROJECT` / `main` | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `update-knowledge-and-guide`

**Repository:** Artificial

**Message:**

```
docs(art-md-roundtrip): Update knowledge and guide.
```

## Work

### Next

Delegate the next `READY` iteration: `scaffold-pipeline-tests-package`.

### Blockers

None.

## Coordination

### Not In Scope

- **Roundtrip gap closure** — Defers to phase 8 (`plan-implement-gaps`).
- **Archive and publish** — Defers to phase 10.

### Evidence

- **42 fixtures pass parser tests** — verified via `npm run test-parser`.
- **42 fixtures lossless roundtrip** — verified via `npm run test-serializer`.
- **Serializer tests mandatory** — `make-serializer-tests-mandatory` DONE; `test-serializer.ts` returns `failed === 0 ? 0 : 2`; 45 fixtures lossless; commit `e9a21e4` pushed.

### Decisions

- **Fixtures in constructs** — Fixtures test construct behavior, so they belong in `libs/constructs/test/fixtures/`.
- **Pipeline-tests as standalone CLI** — Not published, but follows the same scaffold pattern as other CLI packages.
- **`--path` parameter** — Scripts accept `--path` to locate fixtures, defaulting to `libs/constructs/test/fixtures/`.

### Follow Ups

None.
