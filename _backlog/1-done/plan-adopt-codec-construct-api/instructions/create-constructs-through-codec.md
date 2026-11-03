# Instructions: `create-constructs-through-codec`

**Plan:** `adopt-codec-construct-api`

**Iteration Id:** `create-constructs-through-codec`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Precondition:** this iteration depends on `pin-art-md-dependencies`, which may not have been delegated yet. Before touching any file, confirm the dependency landed:

```bash
node -p "require('$PROJECT/node_modules/@art-md/codec/package.json').version"
node -p "require('$PROJECT/node_modules/@art-md/primitives/package.json').version"
```

Both must print `0.0.5` and `0.0.7` respectively, and `$PACKAGE/package.json` must declare `@art-md/codec: 0.0.5` under `devDependencies` and `@art-md/primitives: 0.0.7` under `dependencies`. If any check fails, REPORT A BLOCKER — do not add the dependency yourself, do not edit the manifests, and do not run `npm install`.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/create-constructs-through-codec__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `create-constructs-through-codec`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                                      |
| ------------ | ------------------------- | -------------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory                     |
| `$PROJECT`   | `checkouts/art-js`        | Art JS checkout where the work executes      |
| `$PACKAGE`   | `$PROJECT/libs/records`   | The `@art-js/records` package                |
| `$TESTS`     | `$PROJECT/tests/records`  | The `@art-js/test-records` integration suite |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `create-constructs-through-codec`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Delete the three private construct helpers of `@art-js/records` and make the section-field read and write path call the codec the consumer already injects: `codec.create` for the `NaturalBlock` and `NaturalExpression` constructs, `codec.toText` for reading a field. Thread the injected codec into the two internal contexts that build record handles, and update the unit tests and the test helper that build those contexts. Commit as `refactor(records): Create constructs through the codec.`

This is a **behaviour-preserving** refactor. It changes who owns the behaviour, not what it produces: the same constructs are built, the same strings are read, the same Markdown is written. No fixture, snapshot, or expected-output assertion changes.

Two things the plan text assumes that `05a7a88` did **not** deliver, and this iteration must add:

- Neither `RecordHandleContext` nor `RecordsCollectionContext` declares `codec`. `context.codec` exists on `RecordContext` and `RecordsDocumentContext` only, so it has to be threaded down into the two internal contexts.
- `$PACKAGE/src/record/private/createRecordProxy.test.ts` also passes `codec: {} as never`, and its append case is the first call that dereferences it.

Commit `create-constructs-through-codec` is `NOPUSH`.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript.

::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — Conventions: Unit Tests.

- design: `$PACKAGE/knowledge/design/records.md` — the consumer contract: the codec is injected by the consumer and `@art-js/records` never creates one.
- guide: `$PACKAGE/_guide.md` — package layout and operating instructions.
- guide: `$TESTS/_guide.md` — integration suite layout and operating instructions.
- guide: `$PROJECT/_guide.md` — repository layout, workspaces, and operating instructions.
- guide: `$WORKSPACE/_guide.md` — workspace orientation and operating instructions.
- reference: `$PROJECT/node_modules/@art-md/primitives/dist/codec/types.d.ts` — the `ArtCodec` interface: the `create` and `toText` signatures this iteration calls.
- reference: `$PROJECT/node_modules/@art-md/codec/dist/createArtCodec.d.ts` — `createArtCodec(config?)` returns an `ArtCodec`.
- reference: `$PROJECT/node_modules/@art-md/constructs/dist/factories/constructs/NaturalExpression/factory/types.d.ts` — `NaturalExpressionFactoryData`.
- reference: `$PROJECT/node_modules/@art-md/constructs/dist/factories/constructs/NaturalBlock/factory/types.d.ts` — `NaturalBlockFactoryData`.
- reference: `$PROJECT/node_modules/@art-md/constructs/dist/factories/constructs/FieldInline/types.d.ts` — the `FieldInline` shape the append path keeps as a literal.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root, and again from the `$PROJECT` root — the workspace is not a build root, every project repo builds standalone:

```bash
npm ci # to install dependencies.
```

The pins this iteration compiles against are already in place from `pin-art-md-dependencies`. If `npm ci` changes `$PROJECT/package-lock.json`, revert that file and REPORT A BLOCKER — this iteration does not touch manifests or the lock.

### Verifying Step

**Purpose:** Validate lint, tests and build for a package step.

**Instructions:** (From `$PACKAGE/_guide.md` and `$TESTS/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run build # to produce a full build
```

From `$PACKAGE` also use the narrower scripts while iterating: `npm run test:unit` and `npm run test:integration`.

### Verifying Completion

**Purpose:** Confirm the work item satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root:

```bash
npm run ci # lint, test and build
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there — or reuse the blueprint message provided at the commit step, which is already authored.

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 7 — Thread the codec through the record handle and collection contexts
- Step 2 / 7 — Build the block and expression through `codec.create` in `setSectionField`
- Step 3 / 7 — Read field text through `codec.toText` in `getSectionField`
- Step 4 / 7 — Build the appended expression through `codec.create` in `appendSectionField`
- Step 5 / 7 — Delete `createTextBlock`, `createTextExpression`, and `readText`
- Step 6 / 7 — Verify behaviour preservation with the untouched fixtures
- Step 7 / 7 — Verify and commit `create-constructs-through-codec`

## Steps

### Step `1 / 7` — Thread the codec through the record handle and collection contexts

**Description:** Make the injected codec reachable from `createRecordCapsule` and from the collection that extracts and adds records, then supply it wherever a handle context is built.

**Instructions:**

`RecordHandleContext` and `RecordsCollectionContext` are internal types (neither is exported from `src/index.ts`); only `RecordContext` and `RecordsDocumentContext` are public, and both already declare `codec: ArtCodec`. Add the field to the internal contexts and populate it at every construction site:

1. MODIFY `$PACKAGE/src/record/types.ts` — add `readonly codec: ArtCodec;` to `RecordHandleContext`. `ArtCodec` is already imported from `@art-md/primitives`. Leave `RecordContext` unchanged.
2. MODIFY `$PACKAGE/src/record/createRecord.ts` — add `codec: context.codec,` to the `handleContext` literal, next to `section`.
3. MODIFY `$PACKAGE/src/records-document/private/types.ts` — add `readonly codec: ArtCodec;` to `RecordsCollectionContext`, and add `ArtCodec` to the existing type import from `@art-md/primitives`.
4. MODIFY `$PACKAGE/src/records-document/createRecordsDocument.ts` — add `codec: context.codec,` to the `collectionContext` literal.
5. MODIFY `$PACKAGE/src/records-document/private/createRecordsCollection.ts` — add `codec: context.codec,` to the `recordContext` literal.
6. MODIFY `$PACKAGE/tests/helpers/records/createSectionRecord.ts` — this helper builds a handle context around a hand-built section, so the new required field breaks its compile. Add `import { createArtCodec } from '@art-md/codec';` and `codec: createArtCodec(),` to the `wrapSectionAsRecord({ … })` call. Rewrite the doc comment: the section and its fields remain hand-built (so digit-led and non-ASCII labels bypass parsing), but field reads and writes go through the supplied codec. Keep `makeFieldInline` as it is.
7. MODIFY `$PACKAGE/src/record/createRecord.test.ts` and `$PACKAGE/src/record/private/createRecordProxy.test.ts` — both pass `codec: {} as never`, which Step 4 dereferences. In each file add `import { createArtCodec } from '@art-md/codec';` and pass a real instance: a module-scope `const codec = createArtCodec();` used by both `createRecord` calls in `createRecord.test.ts`, and `codec: createArtCodec()` in `createRecordProxy.test.ts`'s `createTestRecord()`. Keep every test case and assertion unchanged — in particular the `Record field names starting with "__" are reserved` message.

There are exactly three construction sites of `RecordHandleContext` in the package: `$PACKAGE/src/record/createRecord.ts`, `$PACKAGE/src/records-document/private/createRecordsCollection.ts`, and the test helper above. `RecordsCollectionContext` has one construction site (`createRecordsDocument.ts`) and one consumer (`createRecordsCollection.ts`). `grep -rn "nameIsMutable" $PACKAGE/src $PACKAGE/tests` finds them all.

Do not add `codec` to `RecordContext` or `RecordsDocumentContext` (already present), and do not change `src/index.ts` or `src/api/index.ts`: no new public surface.

**Expected outcome:** every handle context carries a real `ArtCodec`; `createRecordCapsule` can read `context.codec` without a cast; no `codec: {} as never` remains under `$PACKAGE/src` or `$PACKAGE/tests`.

**Verify:** `npm run lint` and `npm run test:unit` from `$PACKAGE` are green (`lint` runs `tsc --noEmit`).

### Step `2 / 7` — Build the block and expression through `codec.create` in `setSectionField`

**Description:** Replace the two private construct factories with the codec's `create`, keeping the coercion and the inline/block branch untouched.

**Instructions:**

Rewrite `$PACKAGE/src/record/private/setSectionField.ts` as:

```ts
import type { NaturalBlock, NaturalExpression } from '@art-md/constructs';
import type { ArtCodec } from '@art-md/primitives';

import type { SectionField } from './types.js';

export function setSectionField(codec: ArtCodec, field: SectionField, value: unknown): void {
  const text = String(value);

  if (field.construct === 'FieldInline') {
    const expression = codec.create<NaturalExpression>('NaturalExpression', {
      type: 'text',
      value: text,
    });
    field.children = [expression];
    return;
  }

  const block = codec.create<NaturalBlock>('NaturalBlock', { value: text, children: [] });
  field.children = [block];
}
```

Then update the single call site in `$PACKAGE/src/record/private/createRecordCapsule.ts`:

```ts
setSectionField(context.codec, field, value);
```

Codec API, confirmed against `@art-md/primitives@0.0.7` and `@art-md/codec@0.0.5`:

```ts
create<C extends ConstructBase = ConstructBase>(name: string, ...args: readonly unknown[]): C;
toText(construct: ConstructBase): string;
```

- `create` looks the name up in the codec's factory registry and forwards every `args` entry to the factory unchanged. `'NaturalExpression'` and `'NaturalBlock'` are both registered names in `FACTORIES`. An unknown name throws `TypeError("Unknown construct name: {name}")`.
- The variadic `args` are typed `unknown`, so a wrong data shape compiles clean and fails at runtime. The shapes must be exact: `NaturalExpressionFactoryData` requires `type` and accepts optional `value` (the factory defaults `children` to `[]`); `NaturalBlockFactoryData` requires both `value` and `children`.
- Do not call `codec.create('FieldInline', …)`, and do not create `SectionBlock` or `Document` through the codec — only the expression helpers are in scope.
- Keep `NaturalBlock` and `NaturalExpression` as **type-only** imports: they are used only as the generic argument.

The two helper files stay on disk until Step 5; after this step `setSectionField` no longer imports them.

**Expected outcome:** setting a value on a `FieldInline` writes `[{ construct: 'NaturalExpression', type: 'text', value: text, ... }]` and setting a value on a `FieldBlock` writes `[{ construct: 'NaturalBlock', value: text, children: [] }]`. `codec.create` adds `attributes: undefined` to expressions, but the serializer spreads `attributes` (undefined spreads to nothing), so the written Markdown is unchanged — Step 6 verifies this against the integration fixtures.

**Verify:** `npm run lint` and `npm run test:unit` from `$PACKAGE` are green.

### Step `3 / 7` — Read field text through `codec.toText` in `getSectionField`

**Description:** Delete the local recursive text reader from the read path and delegate to the codec.

**Instructions:**

Rewrite `$PACKAGE/src/record/private/getSectionField.ts` as:

```ts
import type { ArtCodec } from '@art-md/primitives';

import type { SectionField } from './types.js';

export function getSectionField(codec: ArtCodec, field: SectionField): string {
  return codec.toText(field);
}
```

Then update the single call site in `$PACKAGE/src/record/private/createRecordCapsule.ts`:

```ts
return getSectionField(context.codec, field);
```

`codec.toText` is `readConstructText` in `@art-md/codec@0.0.5`: it returns the construct's `value` when it is a string, otherwise joins the recursive `children` results, otherwise returns `''`. On a `SectionField` (`FieldBlock | FieldInline`, both `ConstructBase`) it returns exactly what `readText` returns today. The helper file stays on disk until Step 5.

**Expected outcome:** reading a field yields the same string as before the change, for a value-bearing field and for a field whose text lives in children.

**Verify:** `npm run lint`, `npm run test:unit`, and `npm run test:integration` from `$PACKAGE` are green.

### Step `4 / 7` — Build the appended expression through `codec.create` in `appendSectionField`

**Description:** Route the append path through the codec while keeping the `FieldInline` wrapper a plain literal.

**Instructions:**

Rewrite `$PACKAGE/src/record/private/appendSectionField.ts` as:

```ts
import type { FieldInline, NaturalExpression, SectionBlock } from '@art-md/constructs';
import type { ArtCodec } from '@art-md/primitives';

import { nameToLabel } from './nameToLabel.js';
import type { FieldName } from './types.js';

export function appendSectionField(
  codec: ArtCodec,
  section: SectionBlock,
  name: FieldName,
  value: unknown,
): void {
  const text = String(value);
  const expression = codec.create<NaturalExpression>('NaturalExpression', {
    type: 'text',
    value: text,
  });

  const field: FieldInline = {
    construct: 'FieldInline',
    name: nameToLabel(name),
    children: [expression],
  };

  section.children.push(field);
}
```

Then update the single call site in `$PACKAGE/src/record/private/createRecordCapsule.ts`:

```ts
appendSectionField(context.codec, context.section, name, value);
```

The `FieldInline` stays an object literal by decision: this iteration replaces the three helpers, not every construct literal in the package. Keep the `nameToLabel` call and the argument order. No other change in `createRecordCapsule.ts`: the index, the rename path, and the delete path are untouched. All three codec call sites now read `context.codec`.

**Expected outcome:** appending a field produces a `FieldInline` with a codec-created expression, and `record['brandNew'] = 'x'` still yields one field labelled `**Brand New:**`.

**Verify:** `npm run lint`, `npm run test:unit`, and `npm run test:integration` from `$PACKAGE` are green.

### Step `5 / 7` — Delete `createTextBlock`, `createTextExpression`, and `readText`

**Description:** Remove the three private helpers now that nothing imports them.

**Instructions:**

Delete the files:

- `$PACKAGE/src/record/private/createTextBlock.ts`
- `$PACKAGE/src/record/private/createTextExpression.ts`
- `$PACKAGE/src/record/private/readText.ts`

Use `git rm` so the deletion is staged. After the deletion, confirm nothing references them:

```bash
grep -rn "createTextBlock\|createTextExpression\|readText" $PACKAGE/src
```

That command must print nothing. If it prints anything else — a barrel export, a test, another module — stop and REPORT A BLOCKER rather than editing that file: the plan scopes this iteration to the three helpers and their direct callers.

Also confirm the helpers were never public:

```bash
grep -rn "createTextBlock\|createTextExpression\|readText" $PACKAGE/src/index.ts $PACKAGE/src/api
```

must print nothing. Do not add a replacement module, alias, or re-export.

**Expected outcome:** the three files are gone, no import references them, and `tsc --noEmit` passes.

**Verify:** `npm run lint`, `npm run test:unit`, and `npm run test:integration` from `$PACKAGE` are green.

### Step `6 / 7` — Verify behaviour preservation with the untouched fixtures

**Description:** Prove the refactor changed no observable output and needed no test-expectation change.

**Instructions:**

1. Rebuild the package so `$TESTS` sees the new `dist`:

   ```bash
   npm run build
   ```

   from `$PACKAGE`.

2. Run the **Verifying Step** from `$TESTS` (`lint:fix`, `lint`, `build`, `test`). Its fixtures create a real codec through `createArtCodec()` and assert persisted Markdown; they must pass with **no** change to the suite.

3. Confirm no fixture or expectation moved:

   ```bash
   git status --short
   git diff --stat
   ```

   - Nothing under `$PACKAGE/tests/fixtures` or `$TESTS/fixtures` appears as modified.
   - The only changed paths are the ones listed in Step 7 (12 modifications, 3 deletions).
   - No `package.json`, `package-lock.json`, `CHANGELOG.md`, roadmap, or backlog file appears.

4. Confirm the read path still agrees with the old reader for a value-bearing field and for a field whose text lives in children, and that a write-then-save produces the same Markdown as before. The integration fixtures `04-field-read`, `05-write-field`, `06-add-field`, and `18-canonical-name-round-trip` already cover these cases; cite their passing run in the report instead of adding tests.

If an assertion fails because the serialized Markdown changed, REPORT A BLOCKER with the diff. Do not update the fixture.

**Expected outcome:** `$PACKAGE` and `$TESTS` are green with zero fixture edits.

**Verify:** `git diff --stat` matches the Step 7 file list exactly.

### Step `7 / 7` — Verify and commit `create-constructs-through-codec`

**Description:** Run the full verification and record the refactor.

**Instructions:**

1. Run the **Verifying Step** from `$PACKAGE`: `lint:fix`, `lint`, `test`, `build`.
2. Run the **Verifying Step** from `$TESTS`: `lint:fix`, `lint`, `build`, `test`. Keep this order — `$TESTS` resolves `@art-js/records` through `$PACKAGE/dist`, so the package must be rebuilt first.
3. Run the **Verifying Completion** from `$PROJECT`.
4. Stage exactly the 15 paths:

   ```text
   $PACKAGE/src/record/types.ts
   $PACKAGE/src/record/createRecord.ts
   $PACKAGE/src/record/createRecord.test.ts
   $PACKAGE/src/record/private/createRecordCapsule.ts
   $PACKAGE/src/record/private/createRecordProxy.test.ts
   $PACKAGE/src/record/private/setSectionField.ts
   $PACKAGE/src/record/private/getSectionField.ts
   $PACKAGE/src/record/private/appendSectionField.ts
   $PACKAGE/src/records-document/createRecordsDocument.ts
   $PACKAGE/src/records-document/private/types.ts
   $PACKAGE/src/records-document/private/createRecordsCollection.ts
   $PACKAGE/tests/helpers/records/createSectionRecord.ts
   $PACKAGE/src/record/private/createTextBlock.ts (deleted)
   $PACKAGE/src/record/private/createTextExpression.ts (deleted)
   $PACKAGE/src/record/private/readText.ts (deleted)
   ```

   Stage paths explicitly (file by file, or `git add $PACKAGE/src $PACKAGE/tests/helpers` plus `git rm` for the deleted files). Never `git add -A` or `git add .`. Confirm with `git status --short` that nothing else is staged — in particular no `_backlog` file, no `dist`, no `node_modules`, and no manifest or lock.

5. Commit from `$PROJECT`.

**Message:**

```text
refactor(records): Create constructs through the codec.

- Delete the local `createTextBlock`, `createTextExpression`, and `readText` helpers.
- Call `codec.create` and `codec.toText` from the section-field read and write path.
```

The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push and do **not** run `npm version`, `npm publish`, or any release command: publishing is a separate, explicit decision.

---

## Final Verification

**Instructions:**

- Verify the commit exists locally and was **not** pushed.
- Verify exactly 15 paths were committed: the 12 modifications and the 3 deletions listed in Step 7. No manifest, lock, `CHANGELOG.md`, roadmap, backlog, or fixture file is part of the commit.
- Verify `grep -rn "createTextBlock\|createTextExpression\|readText" $PACKAGE/src` prints nothing, and that none of the three names appeared in `$PACKAGE/src/index.ts` or `$PACKAGE/src/api` before their deletion.
- Verify `createRecordCapsule` passes `context.codec` at all three call sites: the `getField` read, the `setField` update, and the `setField` append. There is no append branch left inside `setSectionField`.
- Verify the three field helpers take the codec as their first parameter: `setSectionField(codec, field, value)`, `getSectionField(codec, field)`, `appendSectionField(codec, section, name, value)`.
- Verify `RecordHandleContext` and `RecordsCollectionContext` carry `codec`, that every construction site populates it, and that neither type is exported from `$PACKAGE/src/index.ts` or `$PACKAGE/src/api/index.ts`.
- Verify the expression and block in a newly written field come from `codec.create`, not from an object literal: the only construct literals left in these paths are the `FieldInline` wrapper in `appendSectionField` and the hand-built fixtures/helpers.
- Verify no `codec: {} as never` remains in `$PACKAGE/src` or `$PACKAGE/tests`, and that `createRecord.test.ts`, `createRecordProxy.test.ts`, and `createSectionRecord.ts` still assert/behave as before apart from the codec supply.
- Verify behaviour preservation: `$PACKAGE/tests/fixtures` and `$TESTS/fixtures` are untouched, and the full `$PACKAGE` and `$TESTS` suites pass, including the persisted-Markdown assertions.
- Verify `npm run ci` passes from `$PACKAGE` and from `$TESTS` (in that order), and from `$PROJECT`.
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Report according to the "How to Report Back to the Delegator" instructions.
