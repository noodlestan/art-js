# Sub-Agent REPORT (#producer)

**Plan:** `refactor-test-helpers`

**Iteration Id:** `simplify-async-imports`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Simplified async imports inside `vi.mock()` blocks to static imports where safe, and documented edge cases where async imports remain necessary.

#### Files changed

- `libs/constructs/src/constructs/Document/createDocument.test.ts` — converted `@art-js/primitives` mock to static import.
- `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockFromParagraph.test.ts` — converted `@art-js/primitives` and `./stripStrong` mocks to static imports.
- `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockIntegrator.test.ts` — converted `@art-js/primitives` mock to static import.
- `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockProcessor.test.ts` — converted `../../../helpers/rawSlice` and `./createFieldBlockFromParagraph` mocks to static imports.
- `libs/constructs/src/constructs/FieldBlock/private/isFieldStrong.test.ts` — converted `./stripStrong` mock to static import.
- `libs/constructs/src/constructs/NaturalBlock/private/createNaturalBlock.test.ts` — converted `@art-js/primitives`, `../../../helpers/rawSlice`, and `../../NaturalExpression/private/createNaturalExpression` mocks to static imports.
- `libs/constructs/src/constructs/NaturalExpression/private/createNaturalExpression.test.ts` — converted `@art-js/primitives/src/parser/helpers` mock to static import.
- `libs/constructs/src/constructs/SectionBlock/private/createSectionBlockIntegrator.test.ts` — converted `./findTagable` mock to static import.
- `libs/constructs/src/constructs/SectionBlock/private/createSectionBlockProcessor.test.ts` — converted `@art-js/primitives` mock to static import.
- `libs/constructs/src/constructs/Tag/private/tagsToMdast.test.ts` — converted `./tagToMdast` mock to static import.
- `libs/parser/src/builder.test.ts` — converted `@art-js/constructs` and `@art-js/primitives` mocks to static imports.
- `libs/parser/src/private/createDocumentContext.test.ts` — converted `@art-js/primitives` mock to static import.

#### Edge cases where async imports remain necessary

The following files still use `async`/`await import` inside `vi.mock()` because the test file imports from the exact path being mocked. Vitest hoists `vi.mock` above top-level imports, so referencing a statically imported helper in the factory fails with `ReferenceError: Cannot access '__vi_import_X__' before initialization`.

- `libs/constructs/src/constructs/FieldBlock/private/stripStrong.test.ts` — mocks `../../../helpers/rawSlice` and imports `rawSlice` from same path.
- `libs/constructs/src/constructs/NaturalBlock/private/createNaturalBlock.test.ts` — mocks `../../Tag/private/extractTags` and imports `extractTags` from same path.
- `libs/constructs/src/constructs/SectionBlock/private/createSectionBlockIntegrator.test.ts` — mocks `@art-js/primitives` and imports `createParserVisitContext` from same path.
- `libs/constructs/src/constructs/SectionBlock/private/createSectionBlockProcessor.test.ts` — mocks `../../../helpers/rawSlice` and `../../Tag/private/extractTags` and imports both.
- `libs/constructs/src/constructs/FieldBlock/private/createFieldBlockProcessor.test.ts` — mocks `../../Tag/private/extractTags` and `./isFieldStrong` and imports both.

## Blockers (if any)

None.

## Feedback

### For the planner

The instructions were clear and self-contained. One edge case emerged during execution: when a test file imports from the exact path being mocked, static imports inside `vi.mock` factories trigger a Vitest hoisting error. The safe rule is: if the file does **not** import from the mocked path, convert to static; otherwise keep `async`.

### For the technical writers

Consider documenting this Vitest hoisting rule in the project's testing conventions or mock-helper guidelines so future authors know when `async` mock factories are required.

### For the crew

The conversion pattern is mechanical and improves readability. A future lint rule or codemod could automate this check by verifying whether the mocked path appears in any top-level static import of the same test file.
