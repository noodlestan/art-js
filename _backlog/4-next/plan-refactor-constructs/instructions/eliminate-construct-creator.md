# Instructions: `eliminate-construct-creator`

**Plan:** `refactor-constructs`

**Iteration Id:** `eliminate-construct-creator`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactor-constructs/instructions/eliminate-construct-creator__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable      | Resolved Path                 | Purpose                              |
| ------------- | ----------------------------- | ------------------------------------ |
| `$WORKSPACE`  | Current working directory     | Workspace root directory             |
| `$PROJECT`    | Provided with prompt          | Repository root for all code changes |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs`    | Constructs package to modify         |
| `$PARSER`     | `$PROJECT/libs/parser`        | Parser package to modify             |
| `$PIPELINE`   | `$PROJECT/cli/pipeline-tests` | Fixture test runner                  |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Eliminate the `factory.detect + create` entry point by converting NaturalBlock and SectionBlock to the processor (`captureNode`) pattern, leaving a single parser entry point. The parser builder must no longer consult `factory` for detection.

## Mandatory Reading

- `$CONSTRUCTS/src/constructs/types.ts` — the `ConstructCreator` interface to delete.
- `$CONSTRUCTS/src/constructs/NaturalBlock/private/createNaturalBlockCreator.ts` — creator to replace.
- `$CONSTRUCTS/src/constructs/NaturalBlock/private/createNaturalBlock.ts` — node-based factory to reuse.
- `$CONSTRUCTS/src/constructs/NaturalBlock/createNaturalBlockParser.ts` — parser factory to update.
- `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockCreator.ts` — creator to replace.
- `$CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockParser.ts` — parser factory to update.
- `$PARSER/src/builder.ts` — builder dispatch to update.
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

- Delete the `ConstructCreator` interface from `$CONSTRUCTS/src/constructs/types.ts`.
- Replace `createNaturalBlockCreator.ts` with `createNaturalBlockProcessor.ts`; update `createNaturalBlockParser.ts`.
- Replace `createSectionBlockCreator.ts` with `createSectionBlockProcessor.ts` (extracting `createSectionBlock`); update `createSectionBlockParser.ts`.
- Remove the `factory.detect/create` branch from `$PARSER/src/builder.ts`; `handleNaturalBlock` uses `defaultConstruct.processor.captureNode`.
- Update `$CONSTRUCTS/src/index.ts` exports.

## Steps

### Step 1 of 7 — Delete the ConstructCreator interface

1. In `$CONSTRUCTS/src/constructs/types.ts`, delete the `ConstructCreator` interface entirely.

### Step 2 of 7 — Convert NaturalBlock to a processor

1. Delete `$CONSTRUCTS/src/constructs/NaturalBlock/private/createNaturalBlockCreator.ts` and create `$CONSTRUCTS/src/constructs/NaturalBlock/private/createNaturalBlockProcessor.ts`:

   ```typescript
   import type { ConstructProcessor } from '../../types';

   import { createNaturalBlock } from './createNaturalBlock';

   export function createNaturalBlockProcessor(): ConstructProcessor {
     return {
       captureNode(context, node) {
         return createNaturalBlock(node, context);
       },
     };
   }
   ```

2. Update `$CONSTRUCTS/src/constructs/NaturalBlock/createNaturalBlockParser.ts`:

   ```typescript
   import type { ConstructParserFactory } from '../types';

   import { createNaturalBlockProcessor } from './private/createNaturalBlockProcessor';

   export const createNaturalBlockParser: ConstructParserFactory = () => ({
     processor: createNaturalBlockProcessor(),
   });
   ```

### Step 3 of 7 — Convert SectionBlock to a processor

1. Delete `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockCreator.ts` and create `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockProcessor.ts`. Move the current `create` body into an extracted `createSectionBlock(node, context)` function and expose it via `captureNode`:

   ```typescript
   import { nodePosition } from '@art-js/primitives';
   import type { ParserVisitContext } from '@art-js/primitives';
   import type { Heading } from 'mdast';

   import { rawSlice } from '../../../helpers/rawSlice';
   import { extractTags } from '../../Tag/private/extractTags';
   import type { ConstructProcessor } from '../../types';

   import { KIND_PATTERN } from './constants';
   import type { SectionBlock } from './types';

   export function createSectionBlock(node: Heading, context: ParserVisitContext): SectionBlock {
     const text = rawSlice(node, context)
       .replace(/^[ \t]*#+[ \t]*/, '')
       .trim();
     const { tags, stripped: textWithoutTags } = extractTags(text);
     const kindMatch = textWithoutTags.match(KIND_PATTERN);
     const section: SectionBlock = {
       construct: 'SectionBlock',
       name: kindMatch?.[2]?.trim() ?? textWithoutTags,
       children: [],
       depth: node.depth,
       position: nodePosition(node),
     };
     if (kindMatch?.[1]) section.kind = kindMatch[1];
     if (tags.length) section.tags = tags;
     return section;
   }

   export function createSectionBlockProcessor(): ConstructProcessor {
     return {
       captureNode(context, node) {
         return node.type === 'heading' ? createSectionBlock(node as Heading, context) : null;
       },
     };
   }
   ```

2. Update `$CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockParser.ts`:

   ```typescript
   import type { ConstructParserFactory } from '../types';

   import { createSectionBlockIntegrator } from './private/createSectionBlockIntegrator';
   import { createSectionBlockProcessor } from './private/createSectionBlockProcessor';

   export const createSectionBlockParser: ConstructParserFactory = () => ({
     processor: createSectionBlockProcessor(),
     integrator: createSectionBlockIntegrator(),
   });
   ```

### Step 4 of 7 — Update the parser builder

1. In `$PARSER/src/builder.ts`, `tryConstructs` must no longer consult `factory`. Keep the default construct (index 0) out of the loop so NaturalBlock never captures inline nodes:

   ```typescript
   function tryConstructs(node: Node): HandleResult | null {
     if (node.type === 'root') {
       return null;
     }

     for (let i = 0; i < constructParsers.length; i++) {
       const constructParser = constructParsers[i] as ConstructParser;
       if (i === 0) continue; // default construct handled in handleNaturalBlock

       const processor = constructParser.processor;
       const construct = processor?.captureNode(currentContext, node);
       if (construct) {
         const integrator = constructParser.integrator ?? null;
         return {
           constructs: [construct],
           integrator,
         };
       }
     }
     return null;
   }
   ```

2. `handleNaturalBlock` uses the default construct's processor:

   ```typescript
   function handleNaturalBlock(node: Node): typeof SKIP | undefined {
     if (!defaultConstruct.processor) {
       return SKIP;
     }

     const construct = defaultConstruct.processor.captureNode(currentContext, node) as Construct;
     currentContext = currentContext.onBeforeConstruct(construct);
     currentContext.captureChildConstruct(construct);
     return node.type === 'paragraph' ? undefined : SKIP;
   }
   ```

3. RULE: the roundtrip behavior must be unchanged — NaturalBlock still captures all block types, SectionBlock still captures headings, and paragraphs still descend into children.

### Step 5 of 7 — Update the constructs index exports

1. `$CONSTRUCTS/src/index.ts`: remove the exported type `ConstructCreator`.

### Step 6 of 7 — Commit `eliminate-construct-creator`

**Policy:** `NOCOMMIT` — Agent MUST stage the changes, present status and the commit message, and MUST NOT execute the commit. When working in autonomous mode it must stop and MUST REPORT A BLOCKER.

**Message:**

```
refactor(constructs): Eliminate ConstructCreator in favor of processors

- Convert NaturalBlock and SectionBlock from factory detect/create to processor captureNode
- Extract createSectionBlock from the SectionBlock creator
- Remove the factory branch from the parser builder
- Delete ConstructCreator interface and creator files
```

### Step 7 of 7 — Verify

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

- Verify that `ConstructCreator`, `createNaturalBlockCreator`, `createSectionBlockCreator`, `factory.detect`, and `factory.create` no longer exist anywhere in `$CONSTRUCTS` and `$PARSER`.
- Verify that `createNaturalBlockProcessor.ts` and `createSectionBlockProcessor.ts` exist and `createSectionBlock` is exported from the SectionBlock processor module.
- Verify that `builder.ts` has no `factory` branch and `handleNaturalBlock` uses `defaultConstruct.processor.captureNode`.
- Verify that `test-parser` and `test-serializer` both pass all fixtures.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
