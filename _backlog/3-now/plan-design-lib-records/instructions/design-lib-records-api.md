# Instructions: `design-lib-records-api`

**Plan:** `design-lib-records`

**Iteration Id:** `design-lib-records-api`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/design-lib-records-api__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `design-lib-records-api`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                            | Purpose                                                   |
| ------------ | ---------------------------------------- | --------------------------------------------------------- |
| `$WORKSPACE` | Current working directory                | Workspace root directory                                  |
| `$PROJECT`   | Provided with prompt                     | Where work execution is taking place.                     |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md-planning`   | Art MD repository — codec and source contracts (upstream) |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-planning`  | Art Lib repository — downstream provider                  |
| `$ART_WORK`  | `$WORKSPACE/checkouts/art-work-planning` | Art Work repository — downstream consumer                 |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `design-lib-records-api`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Produce the records architecture knowledge and the full package spec for `@art-js/records`. Create `$PROJECT/architecture/records.md` as the records architecture doc, update `$PROJECT/architecture/components.md` so the Records library reflects the plan, and finalise `./plan__design.md` as the complete package spec (layout, files to create with types and factories). Commit as `knowledge(art-js): records API spec and components update.`

## Mandatory Reading

- architecture: `$PROJECT/architecture/components.md` — Modular pipeline for parsing and serialising a markdown dialect (Art-MD). Components are organised into core libraries (`libs/`) and CLI tools (`cli/`).
- architecture: `$PROJECT/architecture/index.md` — Architecture document index, including the ADRs with the design decisions in force.
- architecture: `$ART_MD/architecture/design/codec.md` — Codec and source contracts: `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, operation contexts, and dependency direction.
- briefing: `$PROJECT/_roadmap/_architect.md` — Art JS principles, NFRs, milestones.
- plan: `$ART_LIB/_backlog/4-next/plan-add-fs-records-adapter/plan.md` — `$ART_LIB` provider plan defining FS-backed concrete extensions of the abstractions designed here.
- plan: `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md` — `$ART_WORK` consumer plan showing real consumption patterns for the abstractions designed here.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 4 — Create `$PROJECT/architecture/records.md`
- Step 2 / 4 — Update `$PROJECT/architecture/components.md`
- Step 3 / 4 — Finalise `./plan__design.md`
- Step 4 / 4 — Commit `design-lib-records-api`

## Steps

### Step `1 / 4` — Create `$PROJECT/architecture/records.md`

Create the records architecture knowledge document at `$PROJECT/architecture/records.md`.

The document MUST cover:

- **Purpose** — the role of the records library in the Art JS ecosystem: Record identity, discovery, extraction, update and serialisation for Markdown documents.
- **Responsibilities** — record modelling extracted from `SectionBlock` and `Field` constructs; extraction and presence-assertion API; write-back with positioning anchors and an optional content-hash guard; optional `ProxyObject`-based transparent field access. Primary types: `ArtRecord`, `ArtRecordCapsule`, `Records`.
- **Principles** — the design principles used, with the goal in mind. Ground them in `$PROJECT/architecture/index.md` and its ADRs, and in `$PROJECT/_roadmap/_architect.md`.
- **Dependencies** — with other packages: upstream contracts from `@art-md/primitives` (`ArtCodec`, `ArtContentSource`, `ArtDocumentSource`) and implementation from `@art-md/codec`; downstream adoption by `@art-lib/fs-records` (`$ART_LIB`) and the Art Work CLI (`$ART_WORK`).

RULE: Do NOT include a filesystem layout diagram of the records library — the layout lives in `./plan__design.md`.

Follow the structure and tone of existing architecture docs such as `$ART_MD/architecture/design/codec.md`. Register the new document in `$PROJECT/architecture/index.md` if the index lists architecture documents.

### Step `2 / 4` — Update `$PROJECT/architecture/components.md`

Update the components document so the Records library reflects the plan.

- Move the `### Records (@art-js/records)` section from `## Planned Packages` to `## Core Libraries (libs/)`, keeping the alphabetical order of the core libraries (Bundler, Program, Records, Validator).
- Set `**Status:** SCAFFOLD` for Records.
- Keep the description aligned with the plan: Record identity, discovery, extraction, update and serialisation; primary types `ArtRecord`, `ArtRecordCapsule`, `Records`.
- Remove the duplicate `### Records (@art-js/modules)` section from `## Planned Packages`.
- If `## Planned Packages` becomes empty, remove the section and update the intro paragraph so it no longer references planned packages derived from the records design.

### Step `3 / 4` — Finalise `./plan__design.md`

Review and finalise `./plan__design.md` as the complete spec of the `@art-js/records` package.

The spec MUST contain:

- **Responsibilities table** — layers: codec contracts (`@art-md/primitives`), codec implementation (`@art-md/codec`), records (`@art-js/records`), FS adapter (`@art-lib/fs-records`), consumer (Art Work). No `@art-md/source` package.
- **Boundaries diagram** — `FSContentSource → ArtContentSource → ArtDocumentSource → ArtRecordCapsule`.
- **Layout tree** — `libs/records/` with `_guide.md`, `_records/`, dotfiles, `package.json`, `README.md`, `src/` modules (`record/`, `capsule/`, `records/`, `extract/`, `write-back/`, `proxy/`), config files.
- **Files with types and factories** — for each `src/` file: responsibility and type/factory signature:
  - `src/record/types.ts` — `ArtRecord` (`kind`, `name`); `src/record/createArtRecord.ts` — `createArtRecord(block: SectionBlock): ArtRecord`.
  - `src/capsule/types.ts` — `ArtRecordCapsule<T>` (`_source`, `_maybeRecord`, `_id`, `raw()`, index signature); `src/capsule/createArtRecordCapsule.ts` — `createArtRecordCapsule<T>(source, maybeRecord?)`.
  - `src/records/types.ts` — `Records<T>` (`assertPresence`, `extract`, `update`, `serialize`); `src/records/createRecords.ts` — `createRecords<T>(source)`.
  - `src/extract/types.ts` — `ExtractOptions`; `src/extract/assertRecordPresence.ts`; `src/extract/extractRecords.ts`.
  - `src/write-back/types.ts` — `RecordPosition`, `WriteBackOptions` (content-hash guard, opt-in); `src/write-back/writeRecord.ts` — works on content strings, not the filesystem.
  - `src/proxy/types.ts` — `FieldResolver`; `src/proxy/createProxyObject.ts` — properties defined on `T` returned from record identity, other accesses through `resolveField`, setters route to `field.value` and track `field.modifiedValue`.
  - `src/index.ts` — public exports.

Verify the spec against the design decisions in the plan (Findings: `ArtRecord` coincides with `SectionBlock`; Decisions: `ProxyObject` delegates unknown properties to `FieldResolver`) and against the `$ART_LIB` and `$ART_WORK` plans read under Mandatory Reading.

### Step `4 / 4` — Commit `design-lib-records-api`

#### Commit: `design-lib-records-api`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
knowledge(art-js): records API spec and components update.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `$PROJECT/architecture/records.md` exists and covers purpose, responsibilities, principles, and dependencies — with no filesystem layout diagram.
- Verify `$PROJECT/architecture/components.md` lists Records under Core Libraries with `**Status:** SCAFFOLD` and no duplicate Records section remains.
- Verify `./plan__design.md` contains the full package spec: responsibilities table, boundaries diagram, layout tree, and files with types and factories.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
