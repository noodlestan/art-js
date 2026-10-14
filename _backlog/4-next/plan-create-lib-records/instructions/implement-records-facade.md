# Instructions: `implement-records-facade`

**Plan:** `create-lib-records`

**Iteration Id:** `implement-records-facade`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Precondition:** iterations `implement-extract-write-back` and `implement-proxy-resolver` are complete. If not, REPORT A BLOCKER and STOP.

**GATE — do not start if the gate has not lifted:** the new-file test requires the `@art-md` release carrying `delete-kind-from-code` (`$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md`) so a full heading round-trips verbatim. If the pinned codec/constructs still split headings, REPORT A BLOCKER and STOP. **RULE: never write a hand-rolled markdown emitter as a fallback — `serialize` reaches `codec.serialize`, one serializer (whiteboard contract).**

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-records-facade__report.md`.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse: happy face + up to 3 bullet points. The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                          | Purpose                        |
| ------------ | -------------------------------------- | ------------------------------ |
| `$WORKSPACE` | Current working directory              | Workspace root directory       |
| `$PROJECT`   | Provided with prompt                   | Art JS repository (this plan). |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md-planning` | Upstream codec (serialize).    |

## Working Agreements

1. **This instructions file is self-contained.** Everything you need is here plus its mandatory reading — never rely on session memory or chat context.
2. **Your report is mandatory.** The rendered report file carries the full trail; your chat response is only a pointer to it.
3. **User interaction is minimal.** A happy face and up to 3 bullet points. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Complete the public API — the `Records<T>` facade and the exported surface. Commit as `build(create-lib-records): Implement Records facade and public exports with tests.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/4-next/plan-create-lib-records/plan.md` — this plan; Unit Tests section defines the suites.
- spec: `$PROJECT/_backlog/1-done/plan-design-lib-records/plan__design.md` — package spec (§`src/records`, §`src/index.ts`).
- knowledge: `$PROJECT/knowledge/records.md` — the records model, safe/unsafe split.
- knowledge: `$PROJECT/knowledge/design/records.md` — design decisions in force (single serializer).
- contracts: `$PROJECT/_backlog/whiteboard-art-records/whiteboard.md` (Contracts ▸ `@art-js/records`) — Read API, Split, and Import path bullets are binding.

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

- Step 1 / 3 — Implement `src/records/` with unit tests.
- Step 2 / 3 — Wire `src/index.ts` and verify against contracts.
- Step 3 / 3 — Commit `implement-records-facade`.

## Steps

### Step `1 / 3` — Implement `src/records/`

**`src/records/types.ts`**

```ts
export interface Records<T extends ArtRecord> {
  assertPresence(name: string): boolean; // exact heading-text match
  extract(): ArtRecordCapsule<T>[]; // one capsule per section; no filtering
  update(capsule: ArtRecordCapsule<T>, options?: WriteBackOptions): string;
  serialize(capsule: ArtRecordCapsule<T>): string;
}
```

**`src/records/createRecords.ts`**

```ts
export function createRecords<T extends ArtRecord>(source: ArtDocumentSource): Records<T>;
```

- `assertPresence` / `extract` delegate to `src/extract/` per document (name-only, no filtering).
- **`update`** = guarded line-splice over existing content (`writeRecord` with `guard` available — the safe path).
- **`serialize`** = content for a **new** file with no prior bytes — unguarded by definition. It builds the record's section as a `SectionBlock` whose `name` is the full heading text (`Checkout: Art Work`) and calls **`codec.serialize`**. RULE: no local string building of markdown; one serializer (whiteboard contract).

**Unit tests** — per the plan's Unit Tests section:

- facade round-trip: `extract` → mutate → `update`/`serialize` returns content with the change applied and untouched records preserved;
- **new-file heading round-trip:** `serialize` on a new file emits `## Checkout: Art Work` verbatim — the name IS the heading text.

### Step `2 / 3` — Wire `src/index.ts` and verify

Export exactly the public surface specified in `$PROJECT/_backlog/1-done/plan-design-lib-records/plan__design.md` §`src/index.ts`, plus `createFieldResolver`:

- types: `ArtRecord`, `ArtRecordCapsule`, `Records`, `ExtractOptions`, `RecordPosition`, `WriteBackOptions`, `FieldResolver`;
- values: `createArtRecord`, `createArtRecordCapsule`, `createRecords`, `assertRecordPresence`, `extractRecords`, `writeRecord`, `createFieldResolver`, `createProxyObject`.

RULE (binding contract — import path): `src/index.ts` exports **only this package's own symbols**. `ArtContentSource`, `ArtDocumentSource`, `ArtCodec` are **not** re-exported; consumers import them from `@art-md/primitives` directly.

### Step `3 / 3` — Commit `implement-records-facade`

#### Commit: `implement-records-facade`

**Policy:** AUTONOMOUS — commit autonomously, do not push unless the commit policy says so.

**Message:**

```text
build(create-lib-records): Implement Records facade and public exports with tests.
```

---

## Final Verification

- Verify `serialize` imports and calls `codec.serialize` — grep `src/` for hand-built markdown emitters and report any as a violation.
- Verify `src/index.ts` exports no `@art-md` symbols.
- Verify all six `src/` modules have passing test suites (no `passWithNoTests` escape — remove it from `vitest.config.ts` if still present).
- Execute the **Verifying Completion** step above.
- Report according to the "How to Report Back to the Delegator" instructions.
