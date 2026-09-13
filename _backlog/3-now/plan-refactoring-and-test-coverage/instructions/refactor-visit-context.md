# Instructions: `refactor-visit-context`

**Plan:** `refactoring-and-test-coverage`

**Iteration Id:** `refactor-visit-context`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactoring-and-test-coverage/instructions/refactor-visit-context__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable      | Resolved Path              | Purpose                              |
| ------------- | -------------------------- | ------------------------------------ |
| `$WORKSPACE`  | Current working directory  | Workspace root directory             |
| `$PROJECT`    | Provided with prompt       | Repository root for all code changes |
| `$PRIMITIVES` | `$PROJECT/libs/primitives` | Primitives package (rename source)   |
| `$PARSER`     | `$PROJECT/libs/parser`     | Parser package (consumes rename)     |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs` | Constructs package (consumes rename) |
| `$SERIALIZER` | `$PROJECT/libs/serializer` | Serializer package (consumes rename) |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Rename `VisitContext` to `ParserVisitContext` and `createNestedContext()` to `createParserVisitContext` across the `@art-js/artificial-*` packages. Rename `source` to `markdown`, replace `capturing()` with `readonly construct: ConstructBase`, eliminate the global `sectionMap` dependency, and update `findTagable` to traverse context parents. Change the factory signature to accept `construct: ConstructBase`. Rename `.value` to `.children` in `FieldBlock` and `FieldInline`. Do NOT touch the `poc-parse` package (read-only migration source).

## Mandatory Reading

- `$PRIMITIVES/src/parser/types.ts` — the `VisitContext` interface to rename.
- `$PRIMITIVES/src/parser/helpers/createNestedContext.ts` — the factory function to rename and refactor.
- `$PRIMITIVES/src/parser/helpers/index.ts` — helper re-exports.
- `$PRIMITIVES/src/parser/index.ts` — public API exports.
- `$CONSTRUCTS/src/constructs/Tag/private/findTagable.ts` — consumer of `getSectionMap`.
- `$PARSER/src/private/createDocumentContext.ts` — root context factory.
- `$PARSER/src/builder.ts` — parser builder, calls `createDocumentContext`.
- `$CONSTRUCTS/src/constructs/FieldBlock/private/types.ts` — `FieldBlock` type with `.value`.
- `$CONSTRUCTS/src/constructs/FieldInline/private/types.ts` — `FieldInline` type with `.value`.
- `$SERIALIZER/src/artAstToMdast.ts` — serializer that reads `.value` from `FieldBlock`.

## Commits

### Commit: `refactor-visit-context-rename`

**Policy:** `AUTONOMOUS`

**Message:**

```
refactor(art-js): Rename VisitContext to ParserVisitContext and eliminate global sectionMap

- Rename VisitContext → ParserVisitContext in primitives types
- Rename createNestedContext → createParserVisitContext in factory and file
- Rename source → markdown in context type and consumers
- Replace capturing() with readonly construct: ConstructBase
- Eliminate getSectionMap export and global WeakMap
- Update findTagable to traverse parent() chain instead of sectionMap
- Update all imports across parser, constructs, and tests
```

#### Changes

- Rename `VisitContext` → `ParserVisitContext` in `$PRIMITIVES/src/parser/types.ts`.
- Rename `createNestedContext` → `createParserVisitContext` in the factory file.
- Rename factory file `$PRIMITIVES/src/parser/helpers/createNestedContext.ts` → `createParserVisitContext.ts`.
- Rename `source` → `markdown` in `ParserVisitContext` interface and all consumers.
- Replace `capturing(): string | undefined` with `readonly construct: ConstructBase` in the interface and factory implementation.
- Eliminate `getSectionMap` function and the global `sectionMap` WeakMap from the factory file.
- Eliminate `getSectionMap` from `$PRIMITIVES/src/parser/helpers/index.ts` exports.
- Eliminate `getSectionMap` from `$PRIMITIVES/src/parser/index.ts` public API exports.
- Update `$PRIMITIVES/src/parser/index.ts` to export `ParserVisitContext` instead of `VisitContext`.
- Update `findTagable` to traverse `parent()` chain, checking `current.construct.construct === 'SectionBlock'` instead of using `getSectionMap`.
- Update all imports of `VisitContext` → `ParserVisitContext` across `$PARSER`, `$CONSTRUCTS`, and test files.
- Update all imports of `createNestedContext` → `createParserVisitContext` across `$PARSER`, `$CONSTRUCTS`, and test files.
- Update all references to `.source` → `.markdown` on context objects.
- Update all calls to `.capturing()` → `.construct` property access.
- Do NOT modify `$PROJECT/cli/poc-parse/**`.

#### Steps

##### Step 1 of 4 — Rename in primitives

1. Rename the interface in `$PRIMITIVES/src/parser/types.ts`:
   - Change `export interface VisitContext` to `export interface ParserVisitContext`.
   - Change `source: string;` to `markdown: string;`.
   - Replace `capturing(): string | undefined;` with `readonly construct: ConstructBase;`.
   - Update `BeforeRecord` type to use `ParserVisitContext`.
2. Rename the factory file `$PRIMITIVES/src/parser/helpers/createNestedContext.ts` → `createParserVisitContext.ts`.
3. Update the renamed factory file:
   - Change `export function createNestedContext(` to `export function createParserVisitContext(`.
   - Change parameter `structure: string` to `construct: ConstructBase`.
   - Remove `section?: unknown` parameter.
   - Remove the `sectionMap` WeakMap and `getSectionMap` export.
   - Replace `capturing() { return structure; }` with `construct,` (readonly property initialized from parameter).
   - Change `source: source ?? parentContext?.source ?? ''` to `markdown: markdown ?? parentContext?.markdown ?? ''` (rename parameter `source` → `markdown`).
   - Remove `if (section) { sectionMap.set(ctx, section); }`.
4. Update `$PRIMITIVES/src/parser/helpers/index.ts`:
   - Change `export { createNestedContext, getSectionMap }` to `export { createParserVisitContext }`.
5. Update `$PRIMITIVES/src/parser/index.ts`:
   - Change `export type { BeforeRecord, MdastNode, VisitContext }` to `export type { BeforeRecord, MdastNode, ParserVisitContext }`.
   - Change `export { createNestedContext, getSectionMap, sectionDepth }` to `export { createParserVisitContext, sectionDepth }`.

##### Step 2 of 4 — Update findTagable

1. Rewrite `$CONSTRUCTS/src/constructs/Tag/private/findTagable.ts`:

   ```typescript
   import type { ParserVisitContext } from '@art-js/primitives';

   export function findTagable(context: ParserVisitContext): unknown | undefined {
     let current: ParserVisitContext | undefined = context;
     while (current) {
       if (current.construct?.construct === 'SectionBlock') {
         return current.construct;
       }
       current = current.parent();
     }
     return undefined;
   }
   ```

##### Step 3 of 4 — Update consumers

Update all imports across these files (search for `VisitContext` and `createNestedContext`):

- `$PARSER/src/private/createDocumentContext.ts`
- `$PARSER/src/private/flushGap.ts`
- `$PARSER/src/private/rawSlice.ts`
- `$PARSER/src/builder.ts`
- `$CONSTRUCTS/src/helpers/rawSlice.ts`
- `$CONSTRUCTS/src/constructs/types.ts`
- `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts`
- `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockFromParagraph.ts`
- `$CONSTRUCTS/src/constructs/FieldBlock/private/stripStrong.ts`
- `$CONSTRUCTS/src/constructs/FieldBlock/private/isFieldStrong.ts`
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.ts`
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts`
- `$CONSTRUCTS/src/constructs/NaturalBlock/private/createNaturalBlock.ts`
- `$CONSTRUCTS/src/constructs/NaturalExpression/private/createNaturalExpression.ts`
- `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts`
- `$CONSTRUCTS/src/constructs/Tag/private/findTagable.ts`

Replace every occurrence of:

- `VisitContext` → `ParserVisitContext`
- `createNestedContext` → `createParserVisitContext`
- `.source` → `.markdown` on context objects
- `.capturing()` → `.construct`

##### Step 4 of 4 — Verify

1. Run tests across affected packages:
   ```bash
   cd $PROJECT && npm run ci
   ```
2. Confirm no remaining references outside `cli/poc-parse`:
   ```bash
   grep -rn "createNestedContext\|getSectionMap" $PROJECT/libs --include="*.ts"
   ```
   Expected: no matches in `libs/`.
3. Stage all changes.
4. Commit autonomously with the commit message above.
5. Push.

---

### Commit: `refactor-constructs-align-children`

**Policy:** `MANUAL`

**Message:**

```
refactor(constructs): Rename .value to .children to align field constructs with others

- Rename FieldBlock.value → children in type, handler, creator, and serializer
- Rename FieldInline.value → children in type, pre-processor, and serializer
- Update artAstToMdast to use .children for FieldBlock traversal
- Update tests and regenerate fixtures
```

#### Changes

- Rename `value` → `children` in `$CONSTRUCTS/src/constructs/FieldBlock/private/types.ts`.
- Rename `value` → `children` in `$CONSTRUCTS/src/constructs/FieldInline/private/types.ts`.
- Update `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts` to use `field.children`.
- Update `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockFromParagraph.ts` to use `field.children`.
- Update `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.ts` to use `field.children`.
- Update `$SERIALIZER/src/artAstToMdast.ts` to use `.children` instead of `.value` for `FieldBlock` traversal.
- Update test files that construct `FieldBlock` or `FieldInline` objects inline.
- Regenerate or update test fixtures/snapshots if they contain `.value` for these constructs.

#### Steps

##### Step 1 of 3 — Update types

1. In `$CONSTRUCTS/src/constructs/FieldBlock/private/types.ts`, change `value: BlockContent[];` to `children: BlockContent[];`.
2. In `$CONSTRUCTS/src/constructs/FieldInline/private/types.ts`, change `value: NaturalExpression[];` to `children: NaturalExpression[];`.

##### Step 2 of 3 — Update consumers

Update all references to `.value` on `FieldBlock` and `FieldInline` instances:

- `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts`: `field.value` → `field.children`
- `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockFromParagraph.ts`: `field.value.push(...)` → `field.children.push(...)`
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.ts`: `value:` property in object literal → `children:`
- `$SERIALIZER/src/artAstToMdast.ts`: update the `.value` branch for `FieldBlock` to use `.children`
- Test files: `$SERIALIZER/src/serializer.test.ts`, `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts`

##### Step 3 of 3 — Verify

1. Run tests:
   ```bash
   cd $PROJECT && npm run ci
   ```
2. If tests fail due to fixture/snapshot mismatches, regenerate or update them.
3. Stage all changes.
4. **STOP — this commit is MANUAL.** Report back for user review before committing.

---

### Commit: `refactor-parser-visit-context`

**Policy:** `AUTONOMOUS`

**Message:**

```
refactor(parser): Change ParserVisitContext factory to accept ConstructBase

- Change factory signature from structure: string to construct: ConstructBase
- Remove section parameter; SectionBlock context carries construct via readonly property
- Update builder.ts to create ArtDocument at top and pass to createDocumentContext
- Update all callers to pass construct instance instead of string
```

#### Changes

- Change `createParserVisitContext` signature from `(structure: string, parentContext?, source?, targetArray?, boundary?)` to `(construct: ConstructBase, parentContext?, markdown?, targetArray?, boundary?)`.
- Remove the `section` parameter entirely.
- Update `$PARSER/src/builder.ts`:
  - Create an `ArtDocument` construct instance at the top of `buildDocument`.
  - Pass it to `createDocumentContext(document, markdown)` instead of `createDocumentContext(markdown)`.
- Update `$PARSER/src/private/createDocumentContext.ts`:
  - Change signature to accept the document construct instance.
  - Call `createParserVisitContext(document, undefined, markdown)` instead of `createParserVisitContext('Document', undefined, source)`.
- Update all other callers:
  - `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts`: pass a minimal `ConstructBase` with `construct: 'FieldBlock'` instead of `'FieldBlock'` string.
  - `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts`: pass the `section` construct instance instead of `'SectionBlock'` string and the `section` object separately.
  - `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts`: pass a `ConstructBase` instead of `'Document'` string.

#### Steps

##### Step 1 of 4 — Update factory signature

1. In `$PRIMITIVES/src/parser/helpers/createParserVisitContext.ts`:
   - Change first parameter from `structure: string` to `construct: ConstructBase`.
   - Remove `section?: unknown` parameter.
   - The `construct` parameter becomes the `readonly construct` property on the returned context.

##### Step 2 of 4 — Update builder and document context

1. In `$PARSER/src/builder.ts`:
   - At the top of `buildDocument`, create the document construct:
     ```typescript
     const document: ArtDocument = { construct: 'Document', children: [] };
     ```
   - Change `createDocumentContext(markdown)` to `createDocumentContext(document, markdown)`.
   - Update the return statement to use the pre-created `document`:
     ```typescript
     return { ...document, children: docContext.target() as BlockContent[] };
     ```
2. In `$PARSER/src/private/createDocumentContext.ts`:
   - Change signature to `export function createDocumentContext(document: ArtDocument, markdown: string): ParserVisitContext`.
   - Call `createParserVisitContext(document, undefined, markdown)`.

##### Step 3 of 4 — Update all callers

1. `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts`:
   - Change `createParserVisitContext('FieldBlock', context, undefined, field.children, undefined, closeFieldBlock)` to `createParserVisitContext(field, context, undefined, field.children, closeFieldBlock)`.
2. `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts`:
   - Change `createParserVisitContext('SectionBlock', ctx, undefined, section.children, section)` to `createParserVisitContext(section, ctx, undefined, section.children)`.
3. `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts`:
   - Change `createParserVisitContext('Document', undefined, markdown)` to `createParserVisitContext({ construct: 'Document', children: [] }, undefined, markdown)`.
4. Any other callers: search for `createParserVisitContext(` and update.

##### Step 4 of 4 — Verify

1. Run tests:
   ```bash
   cd $PROJECT && npm run ci
   ```
2. Stage all changes.
3. Commit autonomously with the commit message above.
4. Push and report back.

## Final Verification

**Instructions:**

- Verify that `npm run ci` passes across all packages after all three commits.
- Verify that `grep -rn "createNestedContext\|VisitContext\|getSectionMap" $PROJECT/libs --include="*.ts"` returns no matches (outside of historical references in comments if any).
- Report back according to the "How to Report Back to the Delegator" instructions.
