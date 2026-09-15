# Instructions: `add-tag-and-document-parsers`

**Plan:** `refactor-constructs`

**Iteration Id:** `add-tag-and-document-parsers`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactor-constructs/instructions/add-tag-and-document-parsers__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable      | Resolved Path                 | Purpose                              |
| ------------- | ----------------------------- | ------------------------------------ |
| `$WORKSPACE`  | Current working directory     | Workspace root directory             |
| `$PROJECT`    | Provided with prompt          | Repository root for all code changes |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs`    | Constructs package to modify         |
| `$PIPELINE`   | `$PROJECT/cli/pipeline-tests` | Fixture test runner                  |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Give Tag and Document their own `ConstructParser`s so every construct exposes the factory entry point uniformly. These parsers are NOT registered in the parser default config — Tag is extracted by taggables and Document is the parse root.

## Mandatory Reading

- `$CONSTRUCTS/src/constructs/types.ts` — the `ConstructParser` / `ConstructParserFactory` types.
- `$CONSTRUCTS/src/constructs/Tag/private/createTag.ts` — the Tag factory (`TagFactoryData`).
- `$CONSTRUCTS/src/constructs/Document/private/createDocumentFromData.ts` — the Document factory created in the previous iteration (`DocumentFactoryData`).
- `$CONSTRUCTS/src/constructs/Tag/index.ts` — Tag exports.
- `$CONSTRUCTS/src/index.ts` — exports to update.

## Operating Instructions

### Setting Up

Run from the `$PROJECT` root:

```bash
npm run ci # to verify there are no pre-existing failures.
```

### Verifying Completion

Run from the `$PROJECT` root:

```bash
npm run lint:fix # autofix formatting issues
npm run lint # report remaining issues
npm run workspace sanity # to check git status across all repos
```

### Verifying Step

When making changes to parser, serializer, or constructs packages, execute from `$PIPELINE`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

## Changes

- Add `$CONSTRUCTS/src/constructs/Tag/createTagParser.ts` exposing `createTag` as `ConstructFactory`.
- Add `$CONSTRUCTS/src/constructs/Document/createDocumentParser.ts` exposing `createDocumentFromData` as `ConstructFactory`.
- Update `$CONSTRUCTS/src/index.ts` exports.

## Steps

### Step 1 of 4 — Add the Tag parser

1. Create `$CONSTRUCTS/src/constructs/Tag/createTagParser.ts`:

   ```typescript
   import type { ConstructParserFactory } from '../types';

   import { createTag, type TagFactoryData } from './private/createTag';

   export const createTagParser: ConstructParserFactory = () => ({
     name: 'Tag',
     factory: { fromData: data => createTag(data as TagFactoryData) },
   });
   ```

2. Update `$CONSTRUCTS/src/constructs/Tag/index.ts` to export `createTagParser`.

### Step 2 of 4 — Add the Document parser

1. Create `$CONSTRUCTS/src/constructs/Document/createDocumentParser.ts`:

   ```typescript
   import type { ConstructParserFactory } from '../types';

   import {
     createDocumentFromData,
     type DocumentFactoryData,
   } from './private/createDocumentFromData';

   export const createDocumentParser: ConstructParserFactory = () => ({
     name: 'Document',
     factory: { fromData: data => createDocumentFromData(data as DocumentFactoryData) },
   });
   ```

### Step 3 of 4 — Commit `add-tag-and-document-parsers`

**Policy:** `NOCOMMIT` — Agent MUST stage the changes, present status and the commit message, and MUST NOT execute the commit. When working in autonomous mode it must stop and MUST REPORT A BLOCKER.

**Message:**

```
feat(constructs): Add parsers for Tag and Document

- Add createTagParser exposing createTag as ConstructFactory
- Add createDocumentParser exposing createDocumentFromData as ConstructFactory
- Update constructs index exports
```

### Step 4 of 4 — Verify

1. Run the constructs unit tests from `$CONSTRUCTS`:
   ```bash
   npm run test
   ```
2. Run lint from `$CONSTRUCTS`:
   ```bash
   npm run lint:fix
   ```
3. Run the full pipeline tests from `$PIPELINE`:
   ```bash
   npm run test
   ```
   Expected: all fixtures pass in both `test-parser` and `test-serializer` (roundtrip lossless).

## Final Verification

**Instructions:**

- Verify that `createTagParser` and `createDocumentParser` exist and are exported from `$CONSTRUCTS/src/index.ts`.
- Verify that neither parser is registered in `$PARSER/src/config/createDefaultConfig.ts`.
- Verify that `test-parser` and `test-serializer` both pass all fixtures.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
