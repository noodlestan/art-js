# Records Tests

The `@art-js/test-records` package provides integration tests for the record API through the codec and the FS records adapter.

Every design use case is exercised by one fixture case directory: its record files plus a `run-test.ts` exporting `runTest()`. A runner discovers those directories, async imports each `runTest`, runs every case in sequence, and reports pass, duration, and error.

## Recommended Reading

Agents SHOULD scan these files for definitions and resource locations when faced with uncertainty or ambiguity that may result from missing resources.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `README.md` — package readme.

## Package Layout

```
_records/           — package records
src/                — harness: types, helpers, discovery loop, report
scripts/            — CLI entry points
fixtures/           — one directory per design use case: record files + run-test.ts
```

## Harness

Types, helpers, and script parts live in `src/`; `scripts/` only holds entry points.

- `src/types.ts` — `RunTest`, outcome, and report types.
- `src/fixtures.ts` — discovery pattern, fixture case path resolution, temporary working copy.
- `src/assert.ts`, `src/fields.ts` — assertion and record field helpers.
- `src/runFixtureTests.ts` — discover case directories, skip those prefixed with `_`, async import `run-test.ts`, grab the `runTest` export, try/catch each run, sequence all cases.
- `src/printFixtureTestReport.ts` — per-case status and error, skipped cases, then the summary.
- `scripts/test-records.ts` — entry point: run, report, exit code (`0` when all pass, `2` otherwise).

Fixture tests do not catch: they throw and let the runner report (case 09 asserts its expected rejection inline). Running N cases in parallel comes later.

A case directory prefixed with `_` is a known failure: the harness lists it as skipped and never imports it, the same rule the art-md fixture tests apply. Drop the prefix to put the case back in the run.

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/npm-deployment.art`

## Knowledge References

- `../../libs/records/knowledge/design/records.md` — Design: Records, source of the tested use cases.

## Conventions

This package follows strict conventions.

::READ `../../_guide.md` for repository-wide conventions.

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Running Tests

**Instructions:**

Run from this package directory:

```bash
npm run test # run every fixture test case
npm run test -- 07 # run only cases whose directory name contains 07
```

### Operating Instructions: Verifying Step

**Instructions:**

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run build # to produce a full build
```
