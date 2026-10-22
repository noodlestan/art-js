# Plan: Create Lib Records

**ID:** `create-lib-records`

**Status:** `WORKING`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Deliver `@art-js/records` v0.0.1 — source-bound record proxies over Art MD documents — through implementation, integration tests, publication, and downstream adoption in Art Work.

**Description:** The package is implemented in `$PROJECT/libs/records` (provider `createArtDocumentRecords({ codec, createContentSource })` with `read(file) → { assertPresence, extract, save }`, and `createArtRecord({ codec, contentSource })`; records are proxies whose `save()` writes their document through the bound source) and exercised end to end by the fixture harness in `$PROJECT/tests/records`. Remaining work: finish the Vitest fixture migration, publish, adopt in Art Work, consolidate coverage, and refresh knowledge.

Design authority and full API/usage reference: `$PROJECT/libs/records/knowledge/design/records.md` and `$PROJECT/libs/records/knowledge/overview.md` (the overview carries the use-case-to-fixture table and its WIP alignment list). Do not re-plan from this document's prose alone — the knowledge docs hold the contracts, shapes, and recipes.

## Summary

| Deliverable                                        | Where                                                                                              |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Records package (provider, record handle, capsule) | `$PROJECT/libs/records`                                                                            |
| Integration fixtures (one directory per use case)  | `$PROJECT/tests/records/fixtures`                                                                  |
| Design + overview (API, recipes, use-case map)     | `$PROJECT/libs/records/knowledge/design/records.md`, `$PROJECT/libs/records/knowledge/overview.md` |
| Published package for Art Work                     | npm `@art-js/records`                                                                              |

## Items

| Iteration                                     | Status    |
| --------------------------------------------- | --------- |
| Iteration: Prototype and Integration Tests    | `DONE`    |
| Iteration: Apply Noodlestan Conventions       | `DONE`    |
| Iteration: Align Use Cases, API, and Fixtures | `DONE`    |
| Iteration: Convert Fixture Tests to Vitest    | `WORKING` |
| Iteration: Publish and Consume in Art Work    | `READY`   |
| Iteration: Consolidate                        | `READY`   |
| Iteration: Publish and Update Knowledge       | `READY`   |

### Iteration: Prototype and Integration Tests

**ID:** `prototype-and-integration-tests`

**Status:** `DONE`

**Purpose:** Land the working records package and its integration fixture harness as the v0.0.1 baseline.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

1. Deliver the current `$PROJECT/libs/records` implementation (public `document-records/` and `record/` modules, `src/private/` internals, `@art-md/primitives@0.0.5` + `@art-md/constructs@0.0.5` deps) and the `$PROJECT/tests/records` fixture harness with all fixture cases, matching `$PROJECT/libs/records/knowledge/design/records.md`.
2. Verify from each package: `npm run lint`, `npm run build`, `npm run test` (unit) and `npm run test` (fixtures); then commit per the blueprint below.

#### Commits:

| ID                  | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ------------------- | ------------------------------ | -------- | --------- | ----------- |
| `prototype`         | Art JS / `$PROJECT` / `main`   | `MANUAL` | `d79803d` | `COMMITTED` |
| `integration-tests` | Art JS / `$PROJECT` / `main`   | `MANUAL` | `1279c1d` | `COMMITTED` |

##### Commit: `prototype`

**Message:**

```text
build(records): Add source-bound records API.
```

##### Commit: `integration-tests`

**Message:**

```text
test(records): Add integration tests.
```

### Iteration: Apply Noodlestan Conventions

**ID:** `apply-noodlestan-conventions`

**Status:** `DONE`

**Purpose:** Apply the repository's conventions to the records implementation and integration test package.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

1. Apply the relevant Noodlestan conventions to `$PROJECT/libs/records` and `$PROJECT/tests/records`.
2. Verify both packages with their lint, build, unit, and integration test commands; commit each changeset per the blueprints below.

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ------------------------------ | ------------------------------ | -------- | --------- | ----------- |
| `records-conventions`          | Art JS / `$PROJECT` / `main`   | `MANUAL` | `6efabf1` | `COMMITTED` |
| `integration-test-conventions` | Art JS / `$PROJECT` / `main`   | `MANUAL` | `5588fec` | `COMMITTED` |

##### Commit: `records-conventions`

**Message:**

```text
conventions(typescript): Apply noodlestan conventions.
```

##### Commit: `integration-test-conventions`

**Message:**

```text
conventions(typescript): Apply noodlestan conventions to integration tests.
```

### Iteration: Align Use Cases, API, and Fixtures

**ID:** `align-use-cases-api-and-fixtures`

**Status:** `DONE`

**Purpose:** Align the use cases, public API, design recipes, and integration fixtures.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

1. Execute the WIP alignment list in `$PROJECT/libs/records/knowledge/overview.md`; ensure fixtures, API routes, and design recipes agree with the implemented exports.
2. Verify: the intended fixture set passes and the design matches `src/index.ts`; then commit.

#### Commits:

| ID      | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ------- | ------------------------------ | -------- | --------- | ----------- |
| `align` | Art JS / `$PROJECT` / `main`   | `MANUAL` | `b309967` | `COMMITTED` |

##### Commit: `align`

**Message:**

```text
build(records): Align Use Cases, API, and Fixtures.
```

### Iteration: Convert Fixture Tests to Vitest

**ID:** `convert-fixture-tests-to-vitest`

**Status:** `WORKING`

**Purpose:** Replace the bespoke fixture runner with Vitest, one case at a time, until every fixture case is a Vitest test.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

1. Port the remaining `run-test.ts` cases to `integration-test.ts` Vitest cases; once no case uses the script runner, remove `scripts/test-records.ts`, the `test-records` script, and the dual-runner wording from the knowledge docs.
2. Verify: `npm run test-vitest` covers every fixture case green; then commit.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy   | Hash    | Status     |
| ---------------------- | ------------------------------ | -------- | ------- | ---------- |
| `fixture-tests-vitest` | Art JS / `$PROJECT` / `main`   | `MANUAL` | `(TBD)` | `AUTHORED` |

##### Commit: `fixture-tests-vitest`

**Message:**

```text
test(records): Convert fixture tests to vitest.

- Add `vitest.config.ts` and split `test`, `test-vitest`, and `test-records` scripts.
- Port `05-write-field` and `08-rename-field-in-place`; extract temp-dir and discovery helpers.
- Update integration-test design and use-case overview for the two-runner migration.
```

### Iteration: Publish and Consume in Art Work

**ID:** `publish-and-consume-in-art-work`

**Status:** `READY`

**Purpose:** Make `@art-js/records` installable and prove the Art Work consumption path.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

1. Publish `@art-js/records@0.0.1` to npm following the workspace publish operation, then confirm `$ART_WORK` can install it and that its Step 7 record-extraction dependency resolves (unblocks `plan-art-work-cli-global-install`).
2. Verify: `npm info @art-js/records` resolves; record the publication and any Art Work findings in this plan; then commit.

### Iteration: Consolidate

**ID:** `consolidate`

**Status:** `READY`

**Purpose:** Stabilise the delivered surface: fixes, cleanup, and test coverage.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

1. Apply fixes and changes surfaced by alignment and Art Work adoption; raise the `libs/records` vitest coverage thresholds back up to the package convention once the fixture and unit suites cover the consolidated behaviour.
2. Verify: `npm run lint`, `npm run build`, `npm run test` green with the raised thresholds; then commit.

### Iteration: Publish and Update Knowledge

**ID:** `publish-and-update-knowledge`

**Status:** `READY`

**Purpose:** Ship the consolidated package and leave the knowledge docs describing the shipped state.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

1. Publish the consolidated version of `@art-js/records` to npm, then refresh `$PROJECT/libs/records/knowledge/design/records.md`, `$PROJECT/libs/records/knowledge/overview.md`, and `$PROJECT/knowledge/components.md` so statuses, fixture ids, and API reflect what shipped; clear the WIP alignment list items that are done.
2. Verify: docs match `src/index.ts` exports and the fixture set; then commit.

---

## Coordination

### Not In Scope

- **Reactive record variants** — v1; the `capsuleFactory` seam is the reserved path.
- **Granular writes and write guards** — deferred (MANAGEMENT, 2026-10-19); whole-document serialization is the v0.0.1 contract.
- **CLI command implementation** — belongs to `$ART_WORK` plan `plan-art-work-cli-global-install`.
- **FS discovery/content implementation** — belongs to `$ART_LIB` (delivered: `@art-lib/fs-records@0.0.2`).

```

```
