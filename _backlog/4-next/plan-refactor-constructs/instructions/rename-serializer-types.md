# Instructions: `rename-serializer-types`

**Plan:** `refactor-constructs`

**Iteration Id:** `rename-serializer-types`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactor-constructs/instructions/rename-serializer-types__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable      | Resolved Path                 | Purpose                              |
| ------------- | ----------------------------- | ------------------------------------ |
| `$WORKSPACE`  | Current working directory     | Workspace root directory             |
| `$PROJECT`    | Provided with prompt          | Repository root for all code changes |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs`    | Constructs package to modify         |
| `$SERIALIZER` | `$PROJECT/libs/serializer`    | Serializer package to modify         |
| `$PIPELINE`   | `$PROJECT/cli/pipeline-tests` | Fixture test runner                  |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Rename the serializer types so serializers are identified by `name` like every other construct API surface: `ConstructToMdast` → `ConstructSerializer`, `ConstructToMdastFactory` → `ConstructSerializerFactory`, and the `construct` discriminator → `readonly name`.

## Mandatory Reading

- `../plan__construct-types-spec.md` — final shape of `construct/types.ts` for reference; execute only the changes prescribed in this iteration.
- `$CONSTRUCTS/src/constructs/types.ts` — the types to rename.
- `$CONSTRUCTS/src/constructs/Document/createDocumentToMdast.ts` — serializer factory to update.
- `$CONSTRUCTS/src/constructs/NaturalBlock/createNaturalBlockToMdast.ts` — serializer factory to update.
- `$CONSTRUCTS/src/constructs/NaturalExpression/createNaturalExpressionToMdast.ts` — serializer factory to update.
- `$CONSTRUCTS/src/constructs/FieldBlock/createFieldBlockToMdast.ts` — serializer factory to update.
- `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlineToMdast.ts` — serializer factory to update.
- `$CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockToMdast.ts` — serializer factory to update.
- `$SERIALIZER/src/config/types.ts` — serializer config type to update.
- `$SERIALIZER/src/artAstToMdast.ts` — serializer registry keyed by name.
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

- Rename `ConstructToMdast` → `ConstructSerializer` and `ConstructToMdastFactory` → `ConstructSerializerFactory` in `$CONSTRUCTS/src/constructs/types.ts`; change `construct: string` → `readonly name: string`.
- Update all 6 serializer factories to return `ConstructSerializer` with `name: '<Construct>'`.
- Update `$SERIALIZER/src/config/types.ts` and `$SERIALIZER/src/artAstToMdast.ts` (registry key `impl.name`).
- Update `$CONSTRUCTS/src/index.ts` exports.

## Steps

### Step 1 of 6 — Rename the serializer types

1. In `$CONSTRUCTS/src/constructs/types.ts`:
   - Rename `ConstructToMdast` → `ConstructSerializer`.
   - Rename `ConstructToMdastFactory` → `ConstructSerializerFactory`.
   - In `ConstructSerializer`, change `construct: string` → `readonly name: string`.

### Step 2 of 6 — Update the serializer factories

1. In each of the 6 serializer factories, change the return type to `ConstructSerializer` and the discriminator to `name`:
   - `$CONSTRUCTS/src/constructs/Document/createDocumentToMdast.ts` — `name: 'Document'`.
   - `$CONSTRUCTS/src/constructs/NaturalBlock/createNaturalBlockToMdast.ts` — `name: 'NaturalBlock'`.
   - `$CONSTRUCTS/src/constructs/NaturalExpression/createNaturalExpressionToMdast.ts` — `name: 'NaturalExpression'`.
   - `$CONSTRUCTS/src/constructs/FieldBlock/createFieldBlockToMdast.ts` — `name: 'FieldBlock'`.
   - `$CONSTRUCTS/src/constructs/FieldInline/createFieldInlineToMdast.ts` — `name: 'FieldInline'`.
   - `$CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockToMdast.ts` — `name: 'SectionBlock'`.
2. RULE: do not change the `toMdast` implementations — only the type and the discriminator.

### Step 3 of 6 — Update the serializer config and registry

1. `$SERIALIZER/src/config/types.ts`: `ConstructToMdastFactory` → `ConstructSerializerFactory`.
2. `$SERIALIZER/src/artAstToMdast.ts`:
   - Import `ConstructSerializer` instead of `ConstructToMdast`.
   - `const registry = new Map<string, ConstructSerializer>();`
   - `registry.set(impl.name, impl);`

### Step 4 of 6 — Update the constructs index exports

1. `$CONSTRUCTS/src/index.ts`: rename the exported types `ConstructToMdast` → `ConstructSerializer` and `ConstructToMdastFactory` → `ConstructSerializerFactory`.

### Step 5 of 6 — Commit `rename-serializer-types`

**Policy:** `NOCOMMIT` — Agent MUST stage the changes, present status and the commit message, and MUST NOT execute the commit. When working in autonomous mode it must stop and MUST REPORT A BLOCKER.

**Message:**

```
refactor(constructs): Rename ConstructToMdast to ConstructSerializer

- Rename ConstructToMdast to ConstructSerializer and ConstructToMdastFactory to ConstructSerializerFactory
- Rename the construct discriminator to readonly name in all serializer factories
- Update serializer config types and artAstToMdast registry key
- Update constructs index exports
```

### Step 6 of 6 — Verify

1. Run lint from `$CONSTRUCTS`:
   ```bash
   npm run lint:fix
   ```
2. Run the full pipeline tests from `$PIPELINE`:
   ```bash
   npm run test
   ```
   Expected: all fixtures pass in both `test-parser` and `test-serializer` (roundtrip lossless).

## Final Verification

**Instructions:**

- Verify that `ConstructToMdast` and `ConstructToMdastFactory` no longer exist anywhere in `$CONSTRUCTS` and `$SERIALIZER`.
- Verify that all 6 serializer factories expose `readonly name` and the registry in `artAstToMdast.ts` keys by `impl.name`.
- Verify that `test-parser` and `test-serializer` both pass all fixtures.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
