# Instructions: `merge-preprocessors-and-factories`

**Plan:** `refactoring-and-test-coverage`

**Iteration Id:** `merge-preprocessors-and-factories`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-refactoring-and-test-coverage/instructions/merge-preprocessors-and-factories__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |
| `$PARSER`    | `$PROJECT/libs/parser`    | Parser package to refactor           |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback.
3. **User interaction is minimal.** The user expects a light confirmation: a happy face and up to 3 bullet points.

## Goals

Evaluate whether `tryPreProcessors` and `maybeHandleFactory` in `libs/parser/src/builder.ts` can be merged or streamlined into a unified construct dispatch pipeline. Implement the merge if it reduces duplication without harming clarity.

## Mandatory Reading

- `$PROJECT/libs/parser/src/builder.ts` — the builder to refactor.
- `$PROJECT/libs/parser/src/private/getFactory.ts` — factory lookup logic.
- `$PROJECT/libs/parser/src/config/types.ts` — `ParserConfig` and `ConstructParser` types.

## Changes

- Evaluate the similarity between `tryPreProcessors` and `maybeHandleFactory`.
- If mergeable, refactor into a single `tryConstructs(node)` dispatch function that checks pre-processors first, then factories.
- Preserve the current evaluation order: pre-processors before factories.
- Preserve the `HandleResult` return shape.
- Ensure `handleNaturalBlock` fallback stays untouched.

## Steps

### Step 1 of 3 — Analyse duplication

1. Read `builder.ts` and compare `tryPreProcessors` and `maybeHandleFactory`.
2. Note the common pattern: both iterate constructs, both return `HandleResult | null`, both feed into `dispatch()`.
3. Identify the differences:
   - `tryPreProcessors` calls `construct.preProcessor?.preProcess(node, currentContext)`.
   - `maybeHandleFactory` calls `getFactory(node, currentContext, constructs)` then `construct.factory.create(node, currentContext)`.
   - `maybeHandleFactory` skips `node.type === 'root'`.
4. Decide: can they share a single loop over `constructs` with conditional logic inside, or is the separation valuable?

### Step 2 of 3 — Implement or document

**If merge is advisable:**

1. Replace `tryPreProcessors` and `maybeHandleFactory` with a single `tryConstructs(node)` function:
   ```typescript
   function tryConstructs(node: Node): HandleResult | null {
     if (node.type === 'root') return null;
     for (const construct of constructs) {
       const preProcessor = construct.preProcessor;
       const record = preProcessor?.preProcess(node, currentContext);
       if (record) {
         const rec = record as Construct;
         const handler = construct.handler ?? null;
         return { records: [rec], handler };
       }
       const factory = construct.factory;
       if (factory?.detect(node, currentContext)) {
         const result = factory.create(node, currentContext);
         const records = Array.isArray(result) ? result : [result];
         const firstRecord = records[0] as Construct | undefined;
         const handler = records.length > 0 && firstRecord ? (construct.handler ?? null) : null;
         return { records, handler };
       }
     }
     return null;
   }
   ```
2. Update `visitNode` to call `tryConstructs` once instead of `tryPreProcessors` then `maybeHandleFactory`.
3. Remove `getFactory` import if no longer used; remove `getFactory.ts` if orphaned.

**If merge is NOT advisable:**

1. Document the rationale in your report: why the separation is valuable (e.g., evaluation order, different return shapes, factory detection overhead).
2. Apply any micro-cleanups that DO make sense (naming, redundant casts).

### Step 3 of 3 — Verify

1. Run the parser tests:
   ```bash
   cd $PROJECT/libs/parser && npm run test
   ```
2. Run the pipeline tests:
   ```bash
   cd $PROJECT/cli/pipeline-tests && npm run test
   ```
3. Run lint:
   ```bash
   cd $PROJECT/libs/parser && npm run lint
   ```

## Final Verification

**Instructions:**

- Verify that all tests pass (parser + pipeline).
- Verify that lint passes.
- If changes were staged, STOP and report back — the commit for this iteration is MANUAL.
- Report according to the "How to Report Back to the Delegator" instructions.
