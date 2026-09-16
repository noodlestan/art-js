# Instructions: `rename-integrator-types`

**Plan:** `refactor-constructs`

**Iteration Id:** `rename-integrator-types`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` other than `AUTONOMOUS` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactor-constructs/instructions/rename-integrator-types__report.md`. No separate delegation record is created.
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

Rename the context-integration entry point so the parser entry point is uniformly `integrator.integrate(context, node, construct)`: `ConstructHandler` → `ConstructIntegrator`, `handle` → `integrate`, with the parameter order changed to `(context, node, construct)`.

## Mandatory Reading

- `../plan__construct-types-spec.md` — final shape of `construct/types.ts` for reference; execute only the changes prescribed in this iteration.
- `$CONSTRUCTS/src/constructs/types.ts` — the types to rename.
- `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts` — handler to rename.
- `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts` — handler to rename.
- `$CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockParser.ts` — parser factory to update.
- `$CONSTRUCTS/src/constructs/FieldBlock/createFieldBlockParser.ts` — parser factory to update.
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

- Rename `ConstructHandler` → `ConstructIntegrator` and `handle(construct, node, context)` → `integrate(context, node, construct)` in `$CONSTRUCTS/src/constructs/types.ts`; rename `ConstructParser.handler` → `integrator`.
- Rename `createSectionBlockHandler.ts` → `createSectionBlockIntegrator.ts` and `createFieldBlockHandler.ts` → `createFieldBlockIntegrator.ts`.
- Update `createSectionBlockParser.ts` and `createFieldBlockParser.ts` (`handler:` → `integrator:`).
- Update `$PARSER/src/builder.ts` dispatch.
- Update `$CONSTRUCTS/src/index.ts` exports.

## Steps

### Step 1 of 6 — Rename the integrator types

1. In `$CONSTRUCTS/src/constructs/types.ts`:
   - Rename `ConstructHandler` → `ConstructIntegrator`.
   - Change the method signature from `handle(construct: Construct, node: MdastNode, context: ParserVisitContext): ParserVisitContext` to `integrate(context: ParserVisitContext, node: MdastNode, construct: Construct): ParserVisitContext`.
   - Rename `ConstructParser.handler` → `integrator`.

### Step 2 of 6 — Rename the SectionBlock handler

1. Rename `$CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts` → `createSectionBlockIntegrator.ts` (use `git mv`).
2. In the renamed file:
   - Import `ConstructIntegrator` instead of `ConstructHandler`.
   - Return type `ConstructIntegrator`.
   - `handle(construct, node, context)` → `integrate(context, node, construct)` — keep the body identical, only swap the parameter order.

### Step 3 of 6 — Rename the FieldBlock handler

1. Rename `$CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts` → `createFieldBlockIntegrator.ts` (use `git mv`).
2. In the renamed file:
   - Import `ConstructIntegrator` instead of `ConstructHandler`.
   - Return type `ConstructIntegrator`.
   - `handle(construct, _node, context)` → `integrate(context, _node, construct)` — keep the body identical, only swap the parameter order.

### Step 4 of 6 — Update parser factories, builder, and exports

1. `$CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockParser.ts`: `handler: createSectionBlockHandler()` → `integrator: createSectionBlockIntegrator()`.
2. `$CONSTRUCTS/src/constructs/FieldBlock/createFieldBlockParser.ts`: `handler: createFieldBlockHandler()` → `integrator: createFieldBlockIntegrator()`.
3. `$PARSER/src/builder.ts`:
   - Import `ConstructIntegrator` instead of `ConstructHandler`.
   - `interface HandleResult { constructs: Construct[]; integrator: ConstructIntegrator | null; }`
   - `const handler = constructParser.handler ?? null;` → `const integrator = constructParser.integrator ?? null;` and `return { constructs: [construct], integrator };`
   - `function dispatch(node: Node, constructs: Construct[], handler: ConstructHandler | null): void` → `function dispatch(node: Node, constructs: Construct[], integrator: ConstructIntegrator | null): void`
   - `currentContext = handler.handle(construct, node, currentContext);` → `currentContext = integrator.integrate(currentContext, node, construct);`
4. `$CONSTRUCTS/src/index.ts`: rename the exported type `ConstructHandler` → `ConstructIntegrator`.

### Step 5 of 6 — Commit `rename-integrator-types`

**Policy:**`AUTONOMOUS` — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
refactor(constructs): Rename ConstructHandler to ConstructIntegrator

- Rename ConstructHandler to ConstructIntegrator and handle to integrate
- Change integrate parameter order to (context, node, construct)
- Rename createSectionBlockHandler and createFieldBlockHandler files
- Update parser builder dispatch and parser factories
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

- Verify that `ConstructHandler`, `handler`, and `.handle(` no longer exist anywhere in `$CONSTRUCTS` and `$PARSER`.
- Verify that `createSectionBlockIntegrator.ts` and `createFieldBlockIntegrator.ts` exist and the old file names are gone.
- Verify that `test-parser` and `test-serializer` both pass all fixtures.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
