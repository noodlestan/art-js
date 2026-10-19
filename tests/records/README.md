# Records Tests

> Integration tests for the record API through the codec and the FS records adapter.

Provides fixture-driven integration tests for the `@art-js/records` use cases defined in the Records design: setup, discovery, reading, extraction, field and section mutation, record creation, and saving.

This package is part of the [Art JS](https://github.com/noodlestan/art-js) project.

## Development

Make sure you read the [Art JS README](../../README.md) first.

### Scripts

- `npm run test` — runs every fixture test case through the records harness
- `npm run test -- 07` — runs only the cases whose directory name contains `07`

Case directories prefixed with `_` are known failures: the harness reports them as skipped and never imports them (the same rule the art-md fixture tests apply). Unprefix a case to put it back in the run.

### Fixtures

Fixtures live under `fixtures/`, one directory per design use case. Each case holds the record files its scenario needs and a `run-test.ts` exporting `runTest()`, which wires the config, codec, and adapter against that case's own fixture directory, exercises the use case, asserts the results, and returns `Promise<void>` — failures throw instead of catching.

The harness lives in `src/` and is entered from `scripts/test-records.ts`: it discovers the case directories, skips those prefixed with `_`, async imports each `run-test.ts`, grabs the `runTest` export, runs the cases in sequence with a try/catch per case, and reports status, duration, errors, and skipped cases. Running N cases in parallel comes later.

## License

Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
