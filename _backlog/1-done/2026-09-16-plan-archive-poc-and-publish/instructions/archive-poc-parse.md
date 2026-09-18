# Instructions: `archive-poc-parse`

**Plan:** `archive-poc-and-publish`

**Iteration Id:** `archive-poc-parse`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-archive-poc-and-publish/instructions/archive-poc-parse__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `archive-poc-parse`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |
| `$POC`       | `$PROJECT/cli/poc-parse`  | POC parse package directory           |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `archive-poc-parse`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Remove `cli/poc-parse/` and leave a small note at the bottom of `architecture/components.md` with a last known commit hash.

## Mandatory Reading

- ::READ `$POC/package.json` (Knowledge) — POC parse package configuration.

## Changes

- Step 1 / 2 — Remove `cli/poc-parse/` and add archival notice to `architecture/components.md`
- Step 2 / 2 — Commit `archive-poc-parse`

## Steps

### Step `1 / 2` — Remove `cli/poc-parse/` and add archival notice to Architecture/Components

1. Delete the entire `$POC/` directory (`rm -rf $POC`).
2. Edit `$PROJECT/architecture/components.md` to add an archival notice at the bottom of the file.

```md
## Archived

### `@art-js/poc-parse`

This package was used to prototype different options for the parser. The POC parser logic has been superseded by the `@art-js/parser`, `@art-js/constructs`, and `@art-js/serializer` packages. Last version of the POC can be found on [Github noodlestan/art-js](https://github.com/noodlestan/art-js/tree/e2940760f1b3fe8811b49d8dd724b82d1e668514/cli/poc-parse).
```

### Step `2 / 2` — Commit `archive-poc-parse`

#### Commit: `archive-poc-parse`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
chore(art-js): Archive poc-parse package

- Add archival notice to `architecture/components.md`
```

## Final Verification

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `cli/poc-parse/` has been removed from the monorepo.
- Verify that `architecture/components.md` contains the archival notice.
- Report according to the "How to Report Back to the Delegator" instructions.
