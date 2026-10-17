# Instructions: `implement-record-model`

**Plan:** `create-lib-records`

**Iteration Id:** `implement-record-model`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**GATE — do not start if the gate has not lifted:** this iteration requires `@art-md/constructs@0.0.4` (the release carrying `delete-kind-from-code` from `$ART_MD/_backlog/3-now/plan-drop-kind-and-reword-claims/plan.md`). Verify the pin in `package.json` is at least `0.0.4` and the installed `SectionBlock` type has no `kind?`. If `kind?` still exists, REPORT A BLOCKER with "constructs release with kind deletion not installed" and STOP.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-record-model__report.md`.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse: happy face + up to 3 bullet points. The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                          | Purpose                        |
| ------------ | -------------------------------------- | ------------------------------ |
| `$WORKSPACE` | Current working directory              | Workspace root directory       |
| `$PROJECT`   | Provided with prompt                   | Art JS repository (this plan). |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md-planning` | Upstream contracts and codec.  |

## Working Agreements

1. **This instructions file is self-contained.** Everything you need is here plus its mandatory reading — never rely on session memory or chat context.
2. **Your report is mandatory.** The rendered report file carries the full trail; your chat response is only a pointer to it.
3. **User interaction is minimal.** A happy face and up to 3 bullet points. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Land the identity, transport, and factory foundation of `@art-js/records`: add the upstream dependencies and implement `src/record/` (identity + synthetic section factory) and `src/capsule/` (capsule + injectable factory) with unit tests. Commit as `build(create-lib-records): Implement record identity, capsule, and factory with tests.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/4-next/plan-create-lib-records/plan.md` — this plan; Unit Tests section defines the suites.
- design: `$PROJECT/knowledge/design/records.md` — record model, synthetic sections, capsule factory injection.
- overview: `$PROJECT/knowledge/overview-records.md` — responsibilities and use cases.
- contracts: `$PROJECT/_backlog/whiteboard-art-records/whiteboard.md` (Contracts ▸ `@art-js/records`, `@art-md`) — binding agreements.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

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

- Step 1 / 4 — Add upstream dependencies to `package.json`.
- Step 2 / 4 — Implement `src/record/`.
- Step 3 / 4 — Implement `src/capsule/` with unit tests.
- Step 4 / 4 — Commit `implement-record-model`.

## Steps

### Step `1 / 4` — Add upstream dependencies

In `$PROJECT/libs/records/package.json` add:

- `@art-md/primitives` — version of the release published at the time you run (contract package; `0.0.3` is the floor).
- `@art-md/constructs` — **the release carrying the `kind` deletion** (verify per the GATE above; bump from `0.0.3`).

RULE: do not add `@art-md/codec` or any other dependency. This package depends on contracts (`primitives`) and construct types (`constructs`) only.

### Step `2 / 4` — Implement `src/record/`

**`src/record/types.ts`**

```ts
export interface ArtRecord {
  name: string; // whole heading text, verbatim
}
```

**`src/record/createArtRecord.ts`**

```ts
export type SectionInput = Partial<SectionBlock> & { name: string };

export function createArtRecord(input: SectionInput): ArtRecord;
```

- Returns the record identity `{ name: input.name }` — the **whole heading text**, verbatim.
- `SectionInput` accepts any known or unknown section property (`depth`, `children`, etc.); unknown properties pass through unchanged. This makes `createArtRecord` both the identity projection and the synthetic section factory.
- **No parsing, no filtering, no kind** (CEO decision 2026-10-14): every `SectionBlock` is a record; heading interpretation belongs to consumers.
- `input.name` must be the complete heading — which is why the GATE requires the kind-free constructs release (the old parser split headings and left `name` incomplete).

**Unit tests** — per the plan's Unit Tests section:

- identity: `name` present and equals the input name;
- bridge: `## Checkout: Art Work` → `{name: 'Checkout: Art Work'}`; `## Greeting` → `{name: 'Greeting'}` — no section is filtered out;
- synthetic: `createArtRecord({ name, depth: 2, children: [] })` carries all properties through;
- pass-through: unknown section attributes survive unchanged.

### Step `3 / 4` — Implement `src/capsule/`

**`src/capsule/types.ts`**

```ts
export interface ArtRecordCapsule<T extends ArtRecord> {
  readonly _source: ArtDocumentSource;
  readonly _maybeRecord: T | undefined;
  readonly _id: ArtRecord;
  raw(): T | undefined;
  [fieldName: string]: unknown;
}
```

**`src/capsule/createArtRecordCapsule.ts`**

```ts
export function createArtRecordCapsule<T extends ArtRecord>(
  source: ArtDocumentSource,
  maybeRecord?: T,
): ArtRecordCapsule<T>;
```

- `_id` is always available (eager); `_maybeRecord`/`raw()` reflect hydration state (lazy).
- `_source` is the `ArtDocumentSource` the capsule came from.

**`src/capsule/createCapsuleFactory.ts`**

```ts
export type CapsuleFactory<T extends ArtRecord> = (record?: T) => ArtRecordCapsule<T>;

export function createCapsuleFactory<T extends ArtRecord>(
  source: ArtDocumentSource,
  base?: CapsuleFactory<T>,
): CapsuleFactory<T>;
```

- Produces `ArtRecordCapsule<T>` instances over the same source.
- Accepts an optional `base` factory or unhydrated capsule prototype so variant flavours (plain / reactive) can share the same seam. Internal APIs work against the `CapsuleFactory` interface; external callers never see which flavour is in use.

**Unit tests** — per the plan's Unit Tests section:

- `_id` before hydration; `_maybeRecord`/`raw()` after; `_source` is the given source;
- factory produces capsules; injected base factory is called when provided.

Verify from `$PROJECT/libs/records/`: `npm run lint`, `npm run build`, `npm run test`.

### Step `4 / 4` — Commit `implement-record-model`

#### Commit: `implement-record-model`

**Policy:** AUTONOMOUS — commit autonomously, do not push unless the commit policy says so.

**Message:**

```text
build(create-lib-records): Implement record identity, capsule, and factory with tests.
```

---

## Final Verification

- Verify `package.json` depends only on `@art-md/primitives@0.0.3` and `@art-md/constructs@0.0.4` (kind-free release).
- Verify `createArtRecord` performs no string manipulation on `name` — `name` equals the input name exactly.
- Verify `createArtRecord` passes through `depth`, `tags`, `children`, and unknown properties.
- Verify `src/index.ts` is untouched — exports are wired in a later iteration.
- Execute the **Verifying Completion** step above.
- Report according to the "How to Report Back to the Delegator" instructions.
