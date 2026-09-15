# Instructions: `make-field-inline-taggable`

**Plan:** `refactor-tag-extraction`

**Iteration Id:** `make-field-inline-taggable`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactor-tag-extraction/instructions/make-field-inline-taggable-report.md`. No separate delegation record is created.
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

Make FieldInline the first taggable construct: it calls `extractTags` on its own value text and serializes tags back via `tagsToMdast`. The tag must appear at the end of the field inline value as an isolated text node (the last text child of the field value).

## Mandatory Reading

- `$CONSTRUCTS/src/constructs/Tag/private/createTag.ts` — the helper to reshape.
- `$CONSTRUCTS/src/constructs/Tag/private/tagToMdast.ts` — the serialization helpers (created in iteration 1).
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.ts` — the preProcessor to rewrite.
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlineToMdast.ts` — the serializer to update.
- `$CONSTRUCTS/src/constructs/FieldInline/private/types.ts` — the type to extend.
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts` — the test to update.
- `$CONSTRUCTS/test/fixtures/042-tag-in-field-inline.md` — existing field inline fixture (tag in the middle, must stay unchanged).

## Changes

- Add fixtures `060-tag-at-end-of-field-inline.md(+.json)` and `061-invalid-tag-in-field-inline.md(+.json)`.
- Reshape `Tag/private/createTag.ts` into `extractTags(text: string): { tags: Tag[]; stripped: string }` (pure, trailing-only extraction).
- Add `tags?: Tag[]` to `FieldInline/private/types.ts`.
- Rewrite `createFieldInlinePreProcessor.ts` to consume `extractTags` on the last text child of the field value.
- Update `createFieldInlineToMdast.ts` to append `tagsToMdast(field.tags)` after the children.
- Update `createFieldInlinePreProcessor.test.ts`.

## Steps

### Step 1 of 7 — Author fixtures 060/061

1. Create `$CONSTRUCTS/test/fixtures/060-tag-at-end-of-field-inline.md`:

   ```markdown
   # Hello World

   **Greeting:** Hello there (#friend)
   ```

   Expected: FieldInline `Greeting` with `tags: [{ construct: 'Tag', name: 'friend' }]` and value text `Hello there`.

2. Create `$CONSTRUCTS/test/fixtures/061-invalid-tag-in-field-inline.md`:

   ```markdown
   # Hello World

   **Greeting:** Hello (#friend) there
   ```

   Expected: FieldInline `Greeting` with NO tags (tag in the middle — not trailing).

3. Do NOT create the `.json` snapshots yet — they are generated in Step 5 once the implementation produces the expected output.

### Step 2 of 7 — Reshape the extraction helper

1. Rewrite `$CONSTRUCTS/src/constructs/Tag/private/createTag.ts` into `extractTags`:

   ```typescript
   import { TAG_PATTERN } from './constants';
   import type { Tag } from './types';

   export function extractTags(text: string): { tags: Tag[]; stripped: string } {
     const stripped = text.trimEnd();
     TAG_PATTERN.lastIndex = 0;
     const allMatches = [...stripped.matchAll(TAG_PATTERN)];
     if (allMatches.length === 0) return { tags: [], stripped: text };

     const lastMatch = allMatches[allMatches.length - 1];
     if (!lastMatch) return { tags: [], stripped: text };
     const lastMatchIndex = lastMatch.index ?? 0;
     const lastMatchEnd = lastMatchIndex + lastMatch[0].length;
     if (lastMatchEnd !== stripped.length) return { tags: [], stripped: text };

     const tags: Tag[] = [];
     let remaining = stripped;
     for (let i = allMatches.length - 1; i >= 0; i--) {
       const match = allMatches[i];
       if (!match) break;
       const expectedEnd = remaining.trimEnd().length;
       const matchIndex = match.index ?? 0;
       const matchEnd = matchIndex + match[0].length;
       if (matchEnd !== expectedEnd) break;
       tags.unshift({ construct: 'Tag' as const, name: match[1] ?? '' });
       remaining = remaining.slice(0, matchIndex);
     }
     return { tags, stripped: remaining.trimEnd() };
   }
   ```

2. RULE: keep trailing-only extraction — the "no tags in the middle" rule is preserved by construction.
3. RULE: `extractTags` is pure — it does NOT set `position` on tags (the taggable owns position decisions).
4. Update `$CONSTRUCTS/src/constructs/Tag/index.ts` to export `extractTags`.
5. Follow commit policy `NOCOMMIT` — Agent MUST stage the changes, present status and the commit message, and MUST NOT execute the commit. When working in autonomous mode it must stop and MUST REPORT A BLOCKER.

```
refactor(constructs): Reshape tag extraction into extractTags helper

- Replace createTag(node) with extractTags(text) returning { tags, stripped }
- Keep trailing-only extraction (no tags in the middle rule)
```

### Step 3 of 7 — Make FieldInline taggable

1. In `$CONSTRUCTS/src/constructs/FieldInline/private/types.ts`:
   - Add `import type { Tag } from '../../Tag/private/types';`
   - Add `tags?: Tag[];` to the `FieldInline` interface.
2. Rewrite `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.ts`:
   - Keep the existing detection (paragraph + field strong + colon + non-empty value) and the `trimFieldEdges` helper.
   - After building `children`, consume `extractTags` on the last text child:
     ```typescript
     const last = children[children.length - 1];
     if (last?.type === 'text' && typeof last.value === 'string') {
       const { tags, stripped } = extractTags(last.value);
       if (tags.length) {
         field.tags = tags;
         last.value = stripped;
       }
     }
     ```
   - RULE: the tag must be at the end of the field inline value as an isolated text node — i.e., extraction applies to the LAST text child of the field value only.
3. Update `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlineToMdast.ts`:
   - Import `tagsToMdast` from `../Tag/private/tagToMdast`.
   - Append the tag text nodes after the children:
     ```typescript
     children: [
         { type: 'strong', children: [{ type: 'text', value: `${field.name}:` }] },
         { type: 'text', value: ' ' },
         ...children,
         ...tagsToMdast(field.tags ?? []),
     ],
     ```

### Step 4 of 7 — Update tests and generate snapshots

1. Update `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.test.ts` to cover:
   - A field inline with a trailing tag → `tags` populated, last text child stripped.
   - A field inline with a middle tag → no `tags`, text unchanged.
2. Generate the 060/061 snapshots from `$PIPELINE`:
   ```bash
   npx tsx scripts/test-parser.ts --write --fixture 060
   npx tsx scripts/test-parser.ts --write --fixture 061
   ```
3. Run the full pipeline tests:
   ```bash
   npm run test
   ```
   Expected: all fixtures pass, including the new 060/061 and the unchanged `042-tag-in-field-inline`.

### Step 5 of 7 — Commit `make-field-inline-taggable`

**Policy:** `NOCOMMIT` — Agent MUST stage the changes, present status and the commit message, and MUST NOT execute the commit. When working in autonomous mode it must stop and MUST REPORT A BLOCKER.
**Message:**

```
feat(constructs): Make FieldInline taggable

- Add tags?: Tag[] to FieldInline type
- Consume extractTags on the last text child in createFieldInlinePreProcessor
- Append tagsToMdast output in createFieldInlineToMdast
- Add 060/061 fixtures and regenerate snapshots
- Update createFieldInlinePreProcessor tests
```

### Step 6 of 7 — Verify

1. Run lint from `$CONSTRUCTS`:
   ```bash
   npm run lint:fix
   ```
2. Run the full pipeline tests again from `$PIPELINE`:
   ```bash
   npm run test
   ```
   Expected: all fixtures pass in both `test-parser` and `test-serializer` (roundtrip lossless — the tag text is re-emitted at the end of the field inline value).

## Final Verification

**Instructions:**

- Verify that `test-parser` and `test-serializer` both pass all fixtures.
- Verify that `060-tag-at-end-of-field-inline` shows `tags` on the FieldInline and `061-invalid-tag-in-field-inline` shows none.
- Verify that `042-tag-in-field-inline` is unchanged (tag in the middle is not extracted).
- Verify that `extractTags` is exported from the Tag module and `createTag` no longer exists.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
