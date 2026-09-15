# Instructions: `introduce-construct-factory`

**Plan:** `refactor-constructs`

**Iteration Id:** `introduce-construct-factory`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactor-constructs/instructions/introduce-construct-factory__report.md`. No separate delegation record is created.
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

Introduce the "factory from data" entry point — `ConstructFactory.fromData` — exposed via `ConstructParser.factory`, and add `readonly name` to `ConstructParser`. Each construct gets a `create{Name}FromData(data: {Name}FactoryData)` factory following the Tag example (`createTag` + `TagFactoryData`). The goal is to replace `const something: ConstructType = {...}` object literals with small factory functions exposed in `ConstructParser.factory`.

## Mandatory Reading

- `$CONSTRUCTS/src/constructs/types.ts` — the types to extend.
- `$CONSTRUCTS/src/constructs/Tag/private/createTag.ts` — the canonical example (`TagFactoryData` + `createTag`).
- `$CONSTRUCTS/src/constructs/Tag/private/types.ts` — the Tag type.
- `$CONSTRUCTS/src/constructs/Document/types.ts` — the Document type.
- `$CONSTRUCTS/src/constructs/NaturalBlock/private/types.ts` — the NaturalBlock type.
- `$CONSTRUCTS/src/constructs/NaturalExpression/private/types.ts` — the NaturalExpression type.
- `$CONSTRUCTS/src/constructs/SectionBlock/private/types.ts` — the SectionBlock type.
- `$CONSTRUCTS/src/constructs/FieldBlock/private/types.ts` — the FieldBlock type.
- `$CONSTRUCTS/src/constructs/FieldInline/private/types.ts` — the FieldInline type.
- `$CONSTRUCTS/src/constructs/NaturalBlock/createNaturalBlockParser.ts`, `SectionBlock/createSectionBlockParser.ts`, `FieldBlock/createFieldBlockParser.ts`, `FieldInline/createFieldInlineParser.ts` — facades to update.
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

- Add `ConstructFactory` with `fromData(data: unknown): Construct` to `$CONSTRUCTS/src/constructs/types.ts`; change `ConstructParser.factory` type to `ConstructFactory`; add `readonly name: string` to `ConstructParser`.
- Add `create{Name}FromData(data: {Name}FactoryData)` factories for Document, NaturalBlock, NaturalExpression, SectionBlock, FieldBlock, and FieldInline (Tag already has `createTag`).
- Update the 4 existing facades with `name` and `factory`.
- Update `$CONSTRUCTS/src/index.ts` exports.

## Steps

### Step 1 of 6 — Extend the construct types

1. In `$CONSTRUCTS/src/constructs/types.ts`:

   ```typescript
   export interface ConstructFactory {
     fromData(data: unknown): Construct;
   }
   ```

2. Change `ConstructParser.factory` type from `ConstructCreator` (deleted in the previous iteration) to `ConstructFactory`.
3. Add `readonly name: string` to `ConstructParser`.

### Step 2 of 6 — Add the fromData factories

Follow the Tag example — `export interface {Name}FactoryData` declared just above `create{Name}FromData`. Members mirror the construct's own fields (minus `construct`/`position`), may be based on the construct type, and may be optional with defaults when convenient. The decision is driven by what the construct currently needs.

1. `$CONSTRUCTS/src/constructs/Document/private/createDocumentFromData.ts`:

   ```typescript
   import type { BlockContent } from '../../../registry';

   import type { ArtDocument } from '../types';

   export interface DocumentFactoryData {
     children: BlockContent[];
   }

   export function createDocumentFromData(data: DocumentFactoryData): ArtDocument {
     return { construct: 'Document', children: data.children };
   }
   ```

2. `$CONSTRUCTS/src/constructs/NaturalBlock/private/createNaturalBlockFromData.ts`:

   ```typescript
   import type { ContainerConstructBase } from '@art-js/primitives';

   import type { Tag } from '../../Tag/private/types';

   import type { NaturalBlock } from './types';

   export interface NaturalBlockFactoryData {
     value: string;
     children: ContainerConstructBase[];
     type?: string;
     lang?: string | null;
     meta?: string | null;
     tags?: Tag[];
   }

   export function createNaturalBlockFromData(data: NaturalBlockFactoryData): NaturalBlock {
     const block: NaturalBlock = {
       construct: 'NaturalBlock',
       value: data.value,
       children: data.children,
     };
     if (data.type) block.type = data.type;
     if (data.lang !== undefined) block.lang = data.lang;
     if (data.meta !== undefined) block.meta = data.meta;
     if (data.tags?.length) block.tags = data.tags;
     return block;
   }
   ```

3. `$CONSTRUCTS/src/constructs/NaturalExpression/private/createNaturalExpressionFromData.ts`:

   ```typescript
   import type { NaturalExpression } from './types';

   export interface NaturalExpressionFactoryData {
     type: string;
     value?: string;
     attributes?: Record<string, unknown>;
     children?: NaturalExpression[];
   }

   export function createNaturalExpressionFromData(
     data: NaturalExpressionFactoryData,
   ): NaturalExpression {
     return {
       construct: 'NaturalExpression',
       type: data.type,
       value: data.value,
       attributes: data.attributes,
       children: data.children ?? [],
     };
   }
   ```

4. `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockFromData.ts`:

   ```typescript
   import type { ConstructBase } from '@art-js/primitives';

   import type { Tag } from '../../Tag/private/types';

   import type { SectionBlock } from './types';

   export interface SectionBlockFactoryData {
     name: string;
     kind?: string;
     depth?: number;
     children?: ConstructBase[];
     tags?: Tag[];
   }

   export function createSectionBlockFromData(data: SectionBlockFactoryData): SectionBlock {
     const section: SectionBlock = {
       construct: 'SectionBlock',
       name: data.name,
       children: data.children ?? [],
     };
     if (data.kind) section.kind = data.kind;
     if (data.depth !== undefined) section.depth = data.depth;
     if (data.tags?.length) section.tags = data.tags;
     return section;
   }
   ```

5. `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockFromData.ts`:

   ```typescript
   import type { BlockContent } from '../../../registry';

   import type { Tag } from '../../Tag/private/types';

   import type { FieldBlock } from './types';

   export interface FieldBlockFactoryData {
     name: string;
     children?: BlockContent[];
     tags?: Tag[];
   }

   export function createFieldBlockFromData(data: FieldBlockFactoryData): FieldBlock {
     const field: FieldBlock = {
       construct: 'FieldBlock',
       name: data.name,
       children: data.children ?? [],
     };
     if (data.tags?.length) field.tags = data.tags;
     return field;
   }
   ```

6. `$CONSTRUCTS/src/constructs/FieldInline/private/createFieldInlineFromData.ts`:

   ```typescript
   import type { NaturalExpression } from '../../NaturalExpression/private/types';
   import type { Tag } from '../../Tag/private/types';

   import type { FieldInline } from './types';

   export interface FieldInlineFactoryData {
     name: string;
     children?: NaturalExpression[];
     tags?: Tag[];
   }

   export function createFieldInlineFromData(data: FieldInlineFactoryData): FieldInline {
     const field: FieldInline = {
       construct: 'FieldInline',
       name: data.name,
       children: data.children ?? [],
     };
     if (data.tags?.length) field.tags = data.tags;
     return field;
   }
   ```

7. RULE: node-based factories (`create{Name}FromNode`, e.g. `createFieldBlockFromParagraph`, `createSectionBlock`, `createNaturalBlock`, `createNaturalExpression`, `createDocument`) stay internal and are NOT exposed via `ConstructParser.factory` — only the `create{Name}FromData` factories are exposed.

### Step 3 of 6 — Update the facades

1. `$CONSTRUCTS/src/constructs/NaturalBlock/createNaturalBlockParser.ts`:

   ```typescript
   import type { ConstructParserFactory } from '../types';

   import {
     createNaturalBlockFromData,
     type NaturalBlockFactoryData,
   } from './private/createNaturalBlockFromData';
   import { createNaturalBlockProcessor } from './private/createNaturalBlockProcessor';

   export const createNaturalBlockParser: ConstructParserFactory = () => ({
     name: 'NaturalBlock',
     processor: createNaturalBlockProcessor(),
     factory: { fromData: data => createNaturalBlockFromData(data as NaturalBlockFactoryData) },
   });
   ```

2. `$CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockParser.ts`:

   ```typescript
   import type { ConstructParserFactory } from '../types';

   import {
     createSectionBlockFromData,
     type SectionBlockFactoryData,
   } from './private/createSectionBlockFromData';
   import { createSectionBlockIntegrator } from './private/createSectionBlockIntegrator';
   import { createSectionBlockProcessor } from './private/createSectionBlockProcessor';

   export const createSectionBlockParser: ConstructParserFactory = () => ({
     name: 'SectionBlock',
     processor: createSectionBlockProcessor(),
     integrator: createSectionBlockIntegrator(),
     factory: { fromData: data => createSectionBlockFromData(data as SectionBlockFactoryData) },
   });
   ```

3. `$CONSTRUCTS/src/constructs/FieldBlock/createFieldBlockParser.ts`:

   ```typescript
   import type { ConstructParserFactory } from '../types';

   import {
     createFieldBlockFromData,
     type FieldBlockFactoryData,
   } from './private/createFieldBlockFromData';
   import { createFieldBlockIntegrator } from './private/createFieldBlockIntegrator';
   import { createFieldBlockProcessor } from './private/createFieldBlockProcessor';

   export const createFieldBlockParser: ConstructParserFactory = () => ({
     name: 'FieldBlock',
     processor: createFieldBlockProcessor(),
     integrator: createFieldBlockIntegrator(),
     factory: { fromData: data => createFieldBlockFromData(data as FieldBlockFactoryData) },
   });
   ```

4. `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlineParser.ts`:

   ```typescript
   import type { ConstructParserFactory } from '../types';

   import {
     createFieldInlineFromData,
     type FieldInlineFactoryData,
   } from './private/createFieldInlineFromData';
   import { createFieldInlineProcessor } from './createFieldInlineProcessor';

   export const createFieldInlineParser: ConstructParserFactory = () => ({
     name: 'FieldInline',
     processor: createFieldInlineProcessor(),
     factory: { fromData: data => createFieldInlineFromData(data as FieldInlineFactoryData) },
   });
   ```

### Step 4 of 6 — Update the constructs index exports

1. `$CONSTRUCTS/src/index.ts`: export `ConstructFactory` and the new `create{Name}FromData` factories.

### Step 5 of 6 — Commit `introduce-construct-factory`

**Policy:**`AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
feat(constructs): Introduce ConstructFactory fromData entry point

- Add ConstructFactory interface with fromData(data)
- Add fromData factories for Document, NaturalBlock, NaturalExpression, SectionBlock, FieldBlock, FieldInline
- Expose factories via ConstructParser.factory in all facades
- Add readonly name to ConstructParser and set names in facades
```

### Step 6 of 6 — Verify

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

- Verify that `ConstructFactory` exists with `fromData(data: unknown): Construct` and `ConstructParser` has `readonly name`, `processor`, `integrator`, and `factory: ConstructFactory`.
- Verify that each construct has a `create{Name}FromData` with a `{Name}FactoryData` interface declared just above it, and that node-based factories are not exposed via `ConstructParser.factory`.
- Verify that all 4 facades expose `name` and `factory`.
- Verify that `test-parser` and `test-serializer` both pass all fixtures.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
