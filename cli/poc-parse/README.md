# Artificials Poc Parse

> POC spike of the artificials parser: a self-contained, CLI-executable package.

Runnable, self-contained CLI package for the artificials parser POC, internally partitioned along the pipeline boundaries (parse/extract/transform/render) so it mirrors the future art-js modules. POC step 1 scaffolds the runnable CLI; parsing logic, schema types, and the micromark substrate are deliberately deferred.

This package is part of the [@artificials](../../README.md) toolkit.

## Development

Make sure you read the [namespace README](../../README.md) first.

### Build

This CLI is packaged for use in Node.js environments.

### Scripts

- **$** `npm run dev` — Run the POC CLI entry (`node --experimental-strip-types src/index.ts`)
- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues
- **$** `npm run build:clean` — Remove build artifacts
- **$** `npm run test` — Run tests

## License

Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
