# Instructions: `strip-tag-construct-to-helpers`

**Plan:** `refactor-tag-extraction`

**Iteration Id:** `strip-tag-construct-to-helpers`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactor-tag-extraction/instructions/strip-tag-construct-to-helpers-report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable      | Resolved Path                 | Purpose                              |
| ------------- | ----------------------------- | ------------------------------------ |
| `$WORKSPACE`  | Current working directory     | Workspace root directory             |
| `$PROJECT`    | Provided with prompt          | Repository root for all code changes |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs`    | Constructs package to modify         |
| `$PARSER`     | `$PROJECT/libs/parser`        | Parser package (config only)         |
| `$SERIALIZER` | `$PROJECT/libs/serializer`    | Serializer package (config only)     |
| `$PIPELINE`   | `$PROJECT/cli/pipeline-tests` | Fixture test runner                  |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Strip the Tag construct down to helpers, types, and patterns; remove it from the default parser and serializer configs; keep all fixtures passing except 052, which loses its tags entirely.

## Mandatory Reading

- `$CONSTRUCTS/src/constructs/Tag/` — the construct to strip (read all files in the folder).
- `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts` — the only remaining consumer of `findTagable`.
- `$PARSER/src/config/createDefaultConfig.ts` — parser config to update.
- `$SERIALIZER/src/config/createDefaultSerializerConfig.ts` — serializer config to update.
- `$CONSTRUCTS/src/index.ts` — package exports to update.

## Changes

- Delete Tag parser machinery: `createTagParser.ts`, `private/createTagCreator.ts`, `private/createTagRoutingHandler.ts`, `private/findTagable.ts`, `createTagToMdast.ts` (+ `createTagToMdast.test.ts`).
- Keep: `private/createTag.ts`, `private/types.ts`, `private/constants.ts`.
- Add serialization helpers `tagToMdast` / `tagsToMdast` emitting `(#name)` text nodes.
- Move `findTagable` to `SectionBlock/private/findTagable.ts`; update the import in `createSectionBlockHandler.ts`.
- Update `Tag/index.ts` and `$CONSTRUCTS/src/index.ts` exports.
- Remove `createTagParser` from `createDefaultConfig.ts`.
- Remove `createTagToMdast` from `createDefaultSerializerConfig.ts`.
- - Rename fixture \_052 back to 052 and regenerate snapshot.

## Steps

### Step 1 of 6 — Strip Tag parser machinery

1. In `$CONSTRUCTS/src/constructs/Tag/`, delete:
   - `createTagParser.ts`
   - `private/createTagCreator.ts`
   - `private/createTagRoutingHandler.ts`
   - `private/findTagable.ts`
   - `createTagToMdast.ts`
   - `createTagToMdast.test.ts`
2. Keep the following files untouched:
   - `private/createTag.ts` (extraction helper)
   - `private/types.ts` (Tag type)
   - `private/constants.ts` (TAG_PATTERN)

### Step 2 of 6 — Add serialization helpers

1. Create `$CONSTRUCTS/src/constructs/Tag/private/tagToMdast.ts` exporting:
   - `tagToMdast(tag: Tag): Node` — returns `{ type: 'text', value: `(#${tag.name})` }`.
   - `tagsToMdast(tags: Tag[]): Node[]` — returns `tags.map(tagToMdast)`.
2. RULE: the emitted syntax MUST be `(#name)` — matching `TAG_PATTERN` and SectionBlock's current inline `tagSyntax`. Do NOT use the old `@name` syntax from the deleted `createTagToMdast`.
3. Update `$CONSTRUCTS/src/constructs/Tag/index.ts`:
   - Remove `export { createTagParser }` and `export { createTagToMdast }`.
   - Add exports for `tagToMdast` and `tagsToMdast`.

### Step 3 of 6 — Move findTagable to SectionBlock

1. Create `$CONSTRUCTS/src/constructs/SectionBlock/private/findTagable.ts` with the same walk-up logic that was in the deleted `Tag/private/findTagable.ts`:

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

2. Update `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts`:
   - Replace `import { findTagable } from '../../Tag/private/findTagable';` with `import { findTagable } from './findTagable';`.
3. Update `$CONSTRUCTS/src/index.ts`:
   - Remove `export { createTagParser } from './constructs/Tag';` and `export { createTagToMdast } from './constructs/Tag';`.

### Step 4 of 6 — Commit `strip-tag-construct-to-helpers`

**Policy:** `NOCOMMIT` — Agent MUST stage the changes, present status and the commit message, and MUST NOT execute the commit. When working in autonomous mode it must stop and MUST REPORT A BLOCKER.
**Message:**

```
refactor(constructs): Strip Tag construct to helpers and serialization utilities

- Delete createTagParser, createTagCreator, createTagRoutingHandler, createTagToMdast
- Add tagToMdast and tagsToMdast helpers emitting (#name) text nodes
- Move findTagable to SectionBlock/private and update handler import
- Update Tag and constructs index exports
```

### Step 5 of 6 — Remove Tag from default configs

1. In `$PARSER/src/config/createDefaultConfig.ts`:
   - Remove `createTagParser` from the `constructs` array.
   - Remove the `createTagParser` import.
2. In `$SERIALIZER/src/config/createDefaultSerializerConfig.ts`:
   - Remove `createTagToMdast` from the `constructs` array.
   - Remove the `createTagToMdast` import.
3. Follow commit policy `NOCOMMIT` — Agent MUST stage the changes, present status and the commit message, and MUST NOT execute the commit. When working in autonomous mode it must stop and MUST REPORT A BLOCKER.

```
refactor(art-js): Remove Tag from default parser and serializer configs

- Remove createTagParser from parser createDefaultConfig
- Remove createTagToMdast from serializer createDefaultSerializerConfig
```

### Step 6 of 6 — Regenerate 052 snapshot and verify

1. Rename `_052-tags-in-paragraph-in-section.md` and `_052-tags-in-paragraph-in-section.md.json` and re-run the parser tests from `$PIPELINE`:
   ```bash
   npx tsx scripts/test-parser.ts
   ```
   Expected: only `052-tags-in-paragraph-in-section.md` fails (tags no longer attached anywhere).
2. Regenerate the 052 snapshot:
   ```bash
   npx tsx scripts/test-parser.ts --write --fixture 052
   ```
3. Run the full pipeline tests:
   ```bash
   npm run test
   ```
   Expected: all fixtures pass in both `test-parser` and `test-serializer`.
4. Run lint from `$CONSTRUCTS`:
   ```bash
   npm run lint:fix
   ```
5. Follow commit policy `NOCOMMIT` — Agent MUST stage the changes, present status and the commit message, and MUST NOT execute the commit. When working in autonomous mode it must stop and MUST REPORT A BLOCKER.

```
test(constructs): Regenerate 052 snapshot without tags

- Rename fixture _052 back to 052
- Tags are no longer attached to any construct after Tag parser removal
```

## Final Verification

**Instructions:**

- Verify that `test-parser` and `test-serializer` both pass all fixtures.
- Verify that `findTagable` no longer exists under `Tag/` and lives under `SectionBlock/private/`.
- Verify that `Tag/index.ts` and `$CONSTRUCTS/src/index.ts` no longer export `createTagParser` or `createTagToMdast`.
- Verify that the default parser and serializer configs no longer reference Tag.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
