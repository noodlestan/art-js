# Sub-Agent REPORT (#producer)

**Plan:** `test-coverage`

**Iteration Id:** `extract-test-helpers`

**Outcome:** `COMPLETED`

## Evidence

### Changes

- Created `src/test/helpers/{topic}/` in the constructs package with 11 helper files for repeated mock patterns.
- Updated 10 test files in constructs to consume helpers via async `vi.mock` factories with dynamic imports.
- Added package-level `.eslintrc.cjs` in constructs to allow `vitest` imports in `src/test/helpers/**/*.ts`.

#### Files changed

| File                                                                                                      | Change                                                                 |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `libs/constructs/src/test/helpers/context/makeDocumentContext.ts`                                         | New helper: creates a standard document context fixture                |
| `libs/constructs/src/test/helpers/primitives/makeNodePositionMock.ts`                                     | New helper: mocks `nodePosition` from `@art-js/primitives`             |
| `libs/constructs/src/test/helpers/primitives/makeParserVisitContextMock.ts`                               | New helper: mocks `createParserVisitContext` from `@art-js/primitives` |
| `libs/constructs/src/test/helpers/rawSlice/makeRawSliceMock.ts`                                           | New helper: mocks `rawSlice` with configurable return value            |
| `libs/constructs/src/test/helpers/extractTags/makeExtractTagsMock.ts`                                     | New helper: mocks `extractTags` with configurable tags/stripped        |
| `libs/constructs/src/test/helpers/stripStrong/makeStripStrongMock.ts`                                     | New helper: mocks `stripStrong` with configurable return value         |
| `libs/constructs/src/test/helpers/createFieldBlockFromParagraph/makeCreateFieldBlockFromParagraphMock.ts` | New helper: mocks `createFieldBlockFromParagraph`                      |
| `libs/constructs/src/test/helpers/isFieldStrong/makeIsFieldStrongMock.ts`                                 | New helper: mocks `isFieldStrong` with configurable return value       |
| `libs/constructs/src/test/helpers/tagToMdast/makeTagToMdastMock.ts`                                       | New helper: mocks `tagToMdast`                                         |
| `libs/constructs/src/test/helpers/findTagable/makeFindTagableMock.ts`                                     | New helper: mocks `findTagable`                                        |
| `libs/constructs/src/test/helpers/createNaturalExpression/makeCreateNaturalExpressionMock.ts`             | New helper: mocks `createNaturalExpression`                            |
| `libs/constructs/.eslintrc.cjs`                                                                           | New package ESLint override for test helpers                           |
| `libs/constructs/src/constructs/Document/createDocument.test.ts`                                          | Replaced inline mock with `makeNodePositionMock` helper                |
| `libs/constructs/src/constructs/NaturalExpression/private/createNaturalExpression.test.ts`                | Replaced inline mock with `makeNodePositionMock` helper                |
| `libs/constructs/src/constructs/NaturalBlock/private/createNaturalBlock.test.ts`                          | Replaced 4 inline mocks with helpers                                   |
| `libs/constructs/src/constructs/SectionBlock/private/createSectionBlockProcessor.test.ts`                 | Replaced 3 inline mocks with helpers                                   |
| `libs/constructs/src/constructs/SectionBlock/private/createSectionBlockIntegrator.test.ts`                | Replaced 2 inline mocks + context fixture with helpers                 |
| `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockFromParagraph.test.ts`                 | Replaced 2 inline mocks with helpers                                   |
| `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockIntegrator.test.ts`                    | Replaced inline mock + context fixture with helpers                    |
| `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockProcessor.test.ts`                     | Replaced 4 inline mocks with helpers                                   |
| `libs/constructs/src/constructs/FieldBlock/private/isFieldStrong.test.ts`                                 | Replaced inline mock with `makeStripStrongMock` helper                 |
| `libs/constructs/src/constructs/Tag/private/tagsToMdast.test.ts`                                          | Replaced inline mock with `makeTagToMdastMock` helper                  |

## Blockers (if any)

None.

## Feedback

### For the planner

- The instruction to use `vi.mock` with imported helper factories hits a known vitest hoisting limitation (TDZ on local imports). The working pattern is an async factory with dynamic `import()`: `vi.mock('module', async () => { const { helper } = await import('./helper'); return helper(); })`. This could be worth documenting in future instructions that involve shared mock factories.

### For the technical writers

- The ESLint config (`@noodlestan/eslint-config`) only disables `import/no-extraneous-dependencies` for `**/*.test.ts` and `**/*.spec.ts`. Files in `src/test/helpers/**/*.ts` do not match and trigger the rule. A package-level `.eslintrc.cjs` override was needed. Consider adding `src/test/helpers/**/*.ts` to the global test file patterns in the shared config.

### For the crew

- No `it.todo()`, `it.skip`, or `it.only` was introduced.
- All 84 tests in constructs pass. Coverage is stable (82.12% statements, 66.66% branches, 87.77% functions, 83.91% lines).
- Helpers are colocated in the constructs package only; no cross-package sharing.
