# Instructions: `implement-proxy-resolver`

**Plan:** `create-lib-records`

**Iteration Id:** `implement-proxy-resolver`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Precondition:** iteration `implement-record-model` is complete (`src/record/` exists). If not, REPORT A BLOCKER and STOP.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-proxy-resolver__report.md`.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse: happy face + up to 3 bullet points. The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                        |
| ------------ | ------------------------- | ------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory       |
| `$PROJECT`   | Provided with prompt      | Art JS repository (this plan). |

## Working Agreements

1. **This instructions file is self-contained.** Everything you need is here plus its mandatory reading — never rely on session memory or chat context.
2. **Your report is mandatory.** The rendered report file carries the full trail; your chat response is only a pointer to it.
3. **User interaction is minimal.** A happy face and up to 3 bullet points. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Transparent field access: `FieldResolver`, the default `createFieldResolver` factory, and `createProxyObject`. Commit as `build(create-lib-records): Implement proxy access and field resolver with tests.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/4-next/plan-create-lib-records/plan.md` — this plan; Unit Tests section defines the suites.
- spec: `$PROJECT/_backlog/1-done/plan-design-lib-records/plan__design.md` — package spec (§`src/proxy`).
- knowledge: `$PROJECT/knowledge/design/records.md` — design decisions in force (records-domain mutation, always-available proxy).
- contracts: `$PROJECT/_backlog/whiteboard-art-records/whiteboard.md` (Contracts ▸ `@art-js/records`) — the `createProxyObject`/`createFieldResolver` bullet is binding.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Instructions:** (From `$WORKSPACE/_guide.md`)

```bash
npm ci
npm run ci # verify build is green before starting
```

### Writing Commit Message

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Instructions:** (From `$PROJECT/_guide.md`) — from `$PROJECT/libs/records/`:

```bash
npm run lint:fix
npm run lint
npm run build
npm run test
```

---

## Changes

- Step 1 / 3 — Implement `src/proxy/` with unit tests.
- Step 2 / 3 — Verify against contracts.
- Step 3 / 3 — Commit `implement-proxy-resolver`.

## Steps

### Step `1 / 3` — Implement `src/proxy/`

**`src/proxy/types.ts`**

```ts
export interface FieldResolver {
  resolveField(fieldName: string): unknown;
  setField(fieldName: string, value: unknown): void;
}
```

**`src/proxy/createFieldResolver.ts`**

```ts
export function createFieldResolver<T extends ArtRecord>(record: T): FieldResolver;
```

- Default field mapping for record fields (skip `name` — it comes from identity).
- Reads pull the field's current value; writes route to `field.value` and track `field.modifiedValue`.
- RULE: `modifiedValue` is **records-domain tracking state** — it does not exist upstream in `@art-md/constructs`; this factory owns it.

**`src/proxy/createProxyObject.ts`**

```ts
export function createProxyObject<T extends ArtRecord>(
  capsule: ArtRecordCapsule<T>,
  resolver: FieldResolver,
): T;
```

- The property defined on `T` (`name`) is returned from the record identity (`capsule._id`).
- Every other access goes through `resolver.resolveField`.
- Setters route to `resolver.setField` (which writes `field.value` and tracks `field.modifiedValue`).
- The factory is always-available and explicit — callers opt in by calling it; there is no default-switching mode.

**Unit tests** — per the plan's Unit Tests section:

- `name` returned from record identity;
- unknown fields resolve through the resolver;
- setters route to `field.value` and `track field.modifiedValue`;
- `createFieldResolver`: reads current value, sets value + modified-value tracking.

Verify from `$PROJECT/libs/records/`: `npm run lint`, `npm run build`, `npm run test`.

### Step `2 / 3` — Verify against contracts

- Confirm no import from `@art-md/codec` and no filesystem access.
- Confirm `FieldResolver` has no other factory in the package (single source of field mapping).

### Step `3 / 3` — Commit `implement-proxy-resolver`

#### Commit: `implement-proxy-resolver`

**Policy:** AUTONOMOUS — commit autonomously, do not push unless the commit policy says so.

**Message:**

```text
build(create-lib-records): Implement proxy access and field resolver with tests.
```

---

## Final Verification

- Verify `createFieldResolver` is exported from `src/proxy/` (public wiring happens in the facade iteration).
- Verify `src/index.ts` is untouched — exports are wired in the next iteration.
- Execute the **Verifying Completion** step above.
- Report according to the "How to Report Back to the Delegator" instructions.
