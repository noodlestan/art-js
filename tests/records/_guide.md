# Records Tests

The `@art-js/test-records` package provides integration tests for the record API through the codec and the FS records adapter.

Every design use case is exercised by one fixture case directory: its record files plus a Vitest `integration.test.ts`. Vitest discovers the cases with the `fixtures/**/integration.test.ts` pattern and runs each one independently.

## Recommended Reading

Agents SHOULD scan these files for definitions and resource locations when faced with uncertainty or ambiguity that may result from missing resources.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `README.md` — package readme.

## Package Layout

```
_records/           — package records
src/                — shared test helpers
fixtures/           — one directory per design use case: record files + integration.test.ts
```

## Helpers

Shared helpers live in `src/`; each fixture case owns its `integration.test.ts`.

- `src/constants.ts` — fixture discovery pattern.
- `src/copyFixtureCase.ts`, `src/getFixtureDirectory.ts` — fixture copying and path resolution.
- `src/findRecordByName.ts`, `src/findRecordFileByPath.ts`, `src/getFieldNames.ts` — record and field lookup.
- `src/tempDirs/` — temporary working directory creation and cleanup.

Each case copies its fixture to a temporary directory, configures the codec and the filesystem adapter against the copy, exercises the Records API, and asserts the result; the checked-in fixture files are never modified. Assertions fail by throwing, and Vitest reports the failure.

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
npm run ci # lint and the integration suite
```
