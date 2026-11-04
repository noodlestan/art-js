# Records Tests

> Integration tests for the record API through the codec and the FS records adapter.

Provides fixture-driven integration tests for the `@art-js/records` use cases defined in the Records design: setup, discovery, reading, extraction, field and section mutation, record creation, and saving.

This package is part of the [Art JS](https://github.com/noodlestan/art-js) project.

## Development

Make sure you read the [Art JS README](../../README.md) first.

### Scripts

- `npm run test` — runs every fixture test case
- `npm run test -- 07` — runs only the cases whose directory name contains `07`
- `npm run ci` — lints the package and runs the integration suite

### Fixtures

Fixtures live under `fixtures/`, one directory per design use case. Each case holds the record files its scenario needs and an `integration.test.ts` that wires the config, codec, and adapter against that case's own fixture directory, exercises the use case, and asserts the results — failures throw instead of catching.

The shared helpers live in `src/`: fixture copying and path resolution, record and field lookup, and temporary directory creation and cleanup. Every case runs independently; a failure in one does not stop the others.

## License

Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
