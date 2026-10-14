# Instructions: `implement-extract-write-back`

**Plan:** `create-lib-records`

**Iteration Id:** `implement-extract-write-back`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Precondition:** iteration `implement-record-model` is complete (its `src/record/` and `src/capsule/` exist and tests pass). If not, REPORT A BLOCKER and STOP.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-extract-write-back__report.md`.
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

Deliver the read and write halves of the API: presence assertion, extraction into capsules, and guarded line-splice write-back. Commit as `build(create-lib-records): Implement extraction and guarded write-back with tests.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/4-next/plan-create-lib-records/plan.md` — this plan; Unit Tests section defines the suites.
- spec: `$PROJECT/_backlog/1-done/plan-design-lib-records/plan__design.md` — package spec (§`src/extract`, §`src/write-back`).
- knowledge: `$PROJECT/knowledge/records.md` — the records model and flow.
- knowledge: `$PROJECT/knowledge/design/records.md` — design decisions in force (line-splice write-back, byte guarantee).
- contracts: `$PROJECT/_backlog/whiteboard-art-records/whiteboard.md` (Contracts ▸ `@art-js/records`) — the Write API and Anchor durability bullets are binding.

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

- Step 1 / 3 — Implement `src/extract/`.
- Step 2 / 3 — Implement `src/write-back/` with unit tests.
- Step 3 / 3 — Commit `implement-extract-write-back`.

## Steps

### Step `1 / 3` — Implement `src/extract/`

**`src/extract/assertRecordPresence.ts`**

```ts
export function assertRecordPresence(document: ArtDocument, name: string): boolean; // exact heading-text match
```

**`src/extract/extractRecords.ts`**

```ts
export function extractRecords<T extends ArtRecord>(document: ArtDocument): ArtRecordCapsule<T>[];
```

One capsule per `SectionBlock` — no filtering; consumers select by name.

- Map each `SectionBlock` through `createArtRecord`; skip blocks that return `undefined` (not records).
- Wrap each record in `createArtRecordCapsule(document-source, record)`; hydrate fields and examples lazily per the spec.

### Step `2 / 3` — Implement `src/write-back/`

**`src/write-back/types.ts`**

```ts
export interface RecordPosition {
  readonly startLine: number;
  readonly endLine?: number;
}

export interface WriteBackOptions {
  guard?: boolean; // content-hash guard, opt-in, default off
}
```

**`src/write-back/writeRecord.ts`**

```ts
export function writeRecord(
  content: string,
  capsule: ArtRecordCapsule<ArtRecord>,
  options?: WriteBackOptions,
): string;
```

RULES (binding contracts):

- **Pure line-splice on content strings.** Replace exactly the anchored record section; everything outside the anchors passes through **byte-identical** (tables, comments, ordering, blank lines, final newline). Never invoke the codec here.
- **Guard is opt-in.** `guard: true` compares the capsule's content hash against `content` and refuses (throws a typed error) when content changed; default off = unsafe write proceeds.
- Positioning comes from the capsule's anchors (`startLine`/`endLine`), computed against the content string passed in.
- The filesystem is never touched — persistence belongs to the downstream content source.

**Unit tests** — per the plan's Unit Tests section:

- write-back lands at the anchors;
- **same-name disambiguation:** a fixture with several sections sharing an identical heading text (model: `$ART_WORK/cli/work/_records/package.art`) writes back exactly **one** record; sibling records and all other content remain byte-identical;
- hash guard: safe write refuses when content changed, unsafe write proceeds;
- content outside anchors is byte-identical (assert with string equality on the untouched regions).

Verify from `$PROJECT/libs/records/`: `npm run lint`, `npm run build`, `npm run test`.

### Step `3 / 3` — Commit `implement-extract-write-back`

#### Commit: `implement-extract-write-back`

**Policy:** AUTONOMOUS — commit autonomously, do not push unless the commit policy says so.

**Message:**

```text
build(create-lib-records): Implement extraction and guarded write-back with tests.
```

---

## Final Verification

- Verify `writeRecord` performs no I/O and imports no codec.
- Verify the same-name disambiguation test exists and passes.
- Verify `src/index.ts` is untouched — exports are wired in a later iteration.
- Execute the **Verifying Completion** step above.
- Report according to the "How to Report Back to the Delegator" instructions.
