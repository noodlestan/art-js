# Instructions: `configure-guides`

**Plan:** `setup-noodlestan-conventions`

**Iteration Id:** `configure-guides`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-setup-noodlestan-conventions/instructions/configure-guides__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `configure-guides`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `configure-guides`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Configure Art JS `_guide.md` to reference installed Noodlestan conventions.

## Mandatory Reading

- ::READ `$PROJECT/_guide.md` (Knowledge) — Project guide to update.
- ::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/typescript.md` (Knowledge) — Installed conventions index.

## Changes

- Step 1 / 2 — Update `_guide.md` files
- Step 2 / 2 — Commit `configure-guides`

## Steps

### Step `1 / 2` — Update `_guide.md` files

Edit `$PROJECT/_guide.md` to add a conventions reference section.

Add the following section after `## Knowledge References` and before `## Workflows`:

```md
## Conventions

This repository follows strict conventions.

Read the convention indexes listed below and follow them when planning and executing work.

The following conventions apply to all packages in this repository:

::READ `./node_modules/@noodlestan/conventions-typescript/art/typescript.md` — TypeScript conventions.

In case of ambiguity or conflict applying conventions, follow links from the convention indexes to extended convention files and read the "Avoid" and "Prefer" examples.
```

Edit all of `$PROJECT/libs/primitives/_guide.md`, `$PROJECT/libs/parser/_guide.md`, `$PROJECT/libs/constructs/_guide.md`, `$PROJECT/libs/serializer/_guide.md`, to add a conventions reference section.

Add the following section after `## Knowledge References` and before `## Workflows`:

```md
## Conventions

This package follows strict conventions.

::READ `../../_guide.md` for repository-wide conventions.
```

### Step `2 / 2` — Commit `configure-guides`

#### Commit: `configure-guides`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
guides(art-js): Reference Noodlestan conventions in project guide

- Add Conventions section to `_guide.md` with `@noodlestan/conventions-typescript` index
- Add Conventions sections to package guides with reference to root guide.
```

## Final Verification

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$PROJECT/_guide.md` contains the `## Conventions` section with the correct reference.
- Report according to the "How to Report Back to the Delegator" instructions.
