# Sub-Agent REPORT (#producer)

**Plan:** `refactor-test-helpers`

**Iteration Id:** `deduplicate-primitive-helpers`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                          | Status |
| --------------------------------------------- | ------ |
| Move primitives mocks into primitives package | Done   |
| Merge parserVisitContextMock variants         | Done   |
| Deduplicate makeDocumentMock across packages  | Done   |
| Update all cross-package imports              | Done   |

#### Files changed

**Created in primitives:**

- `libs/primitives/src/test/helpers/primitives/nodePositionMock.ts` — moved from constructs
- `libs/primitives/src/test/helpers/primitives/parserVisitContextMock.ts` — moved from constructs, merged with parser variant (added `markdown ?? parentContext?.markdown ?? ''` fallback)
- `libs/primitives/src/test/helpers/document/makeDocumentMock.ts` — renamed from `makeDocument.ts`, changed to generic return type so it satisfies both `ContainerConstructBase` and `ArtDocument`
- `libs/primitives/.eslintrc.cjs` — added to disable `import/no-extraneous-dependencies` for test helpers

**Deleted from constructs:**

- `libs/constructs/src/test/helpers/primitives/nodePositionMock.ts`
- `libs/constructs/src/test/helpers/primitives/parserVisitContextMock.ts`
- `libs/constructs/src/test/helpers/constructs/Document/makeDocumentMock.ts`

**Deleted from parser:**

- `libs/parser/src/test/helpers/primitives/makeParserVisitContextMock.ts`
- `libs/parser/src/test/helpers/document/makeDocument.ts`

**Updated imports in constructs (12 files):**

- All `nodePositionMock` imports now use `@art-js/primitives/src/test/helpers/primitives/nodePositionMock`
- All `parserVisitContextMock` imports now use `@art-js/primitives/src/test/helpers/primitives/parserVisitContextMock`
- All `makeDocumentMock` imports now use `@art-js/primitives/src/test/helpers/document/makeDocumentMock`

**Updated imports in parser (2 files):**

- `builder.test.ts` and `createDocumentContext.test.ts` updated to import `makeDocumentMock` and `parserVisitContextMock` from `@art-js/primitives`

**Updated in primitives:**

- `src/parser/helpers/createParserVisitContext.test.ts` updated to import renamed `makeDocumentMock`

## Blockers (if any)

None.

## Feedback

### For the planner

The instruction was clear and self-contained. The only ambiguity was how to handle the `makeDocumentMock` type mismatch between `ContainerConstructBase` (primitives) and `ArtDocument` (constructs). A generic defaulting to `never` for the children array solved this cleanly.

### For the technical writers

The pattern of importing test helpers from `@art-js/primitives/src/test/helpers/...` works but is verbose. Consider adding a subpath export or barrel file for test helpers if more deduplication iterations follow.

### For the crew

The pre-commit hook (`lefthook`) runs the full workspace `ci`, which checks prettier on ALL files including untracked `_backlog/` plan files. This caused a commit failure until those files were formatted. Consider adding `_backlog/` to `.prettierignore` or ensuring plan files are formatted when created.
