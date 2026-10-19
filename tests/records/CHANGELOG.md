# CHANGELOG

## 0.0.1

### Added

- **Records integration tests:** fixture-driven test cases covering the `@art-js/records` use cases: setup, discovery, reading, extraction, field and section mutation, record creation, and saving.
- **Fixtures:** one directory per design use case, each with the record files its scenario needs and a `run-test.ts` exporting `runTest()`.
- **Harness:** `src/` types, assertion and fixture helpers, discovery loop that async imports each `runTest`, sequence runner with a try/catch per case, and the report; entered from `scripts/test-records.ts`.
- **Skipped cases:** case directories prefixed with `_` are known failures the harness reports as skipped instead of importing.
