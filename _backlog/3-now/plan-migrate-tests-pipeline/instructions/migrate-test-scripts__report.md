# Sub-Agent REPORT (#producer)

**Plan:** `migrate-tests-pipeline`

**Iteration Id:** `migrate-test-scripts`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                | Change                                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Move test scripts to pipeline-tests | Moved `test-parser.ts`, `test-serializer.ts`, and `test/` support files from `libs/parser/scripts/` to `cli/pipeline-tests/scripts/` |
| Move fixtures to constructs         | Moved 45 fixture files (`.md`, `.art`, `.json`) from `libs/parser/test/fixtures/` to `libs/constructs/test/fixtures/`                |
| Wire `--path` parameter             | Updated `constants.ts` to read `--path` from `process.argv` with default `libs/constructs/test/fixtures/`                            |
| Update package manifests            | Updated `cli/pipeline-tests/package.json` with scripts and dependencies; updated `libs/parser/package.json` to remove test scripts   |

#### Files changed

- `cli/pipeline-tests/package.json` — added `test-parser`, `test-serializer`, `test` scripts; added dependencies `@art-js/parser`, `@art-js/serializer`, `@art-js/constructs`; added devDependency `tsx`
- `libs/parser/package.json` — removed `test-parser`, `test-serializer`, `test` scripts; updated `ci` to `npm run lint && npm run build`
- `cli/pipeline-tests/scripts/test-parser.ts` — moved from parser; removed `FIXTURES_DIR` import; uses `fixturesDir` from parsed args
- `cli/pipeline-tests/scripts/test-serializer.ts` — moved from parser; removed `FIXTURES_DIR` import; uses `fixturesDir` from parsed args
- `cli/pipeline-tests/scripts/test/constants.ts` — moved from parser; added `--path` CLI argument parsing; default resolves to `libs/constructs/test/fixtures/`
- `cli/pipeline-tests/scripts/test/parser/parseFixture.ts` — moved from parser; changed `parse` import from relative `../../../src/index` to `@art-js/parser`
- `cli/pipeline-tests/scripts/test/parser/parseParserArgs.ts` — added `fixturesDir` to returned args
- `cli/pipeline-tests/scripts/test/parser/types.ts` — added `fixturesDir: string` to `ParserCliArgs`
- `cli/pipeline-tests/scripts/test/serializer/parseSerializerArgs.ts` — added `fixturesDir` to returned args
- `cli/pipeline-tests/scripts/test/serializer/types.ts` — added `fixturesDir: string` to `SerializerCliArgs`
- 45 fixture files — renamed from `libs/parser/test/fixtures/*` to `libs/constructs/test/fixtures/*`

## Blockers (if any)

None.

## Feedback

Not requested.
