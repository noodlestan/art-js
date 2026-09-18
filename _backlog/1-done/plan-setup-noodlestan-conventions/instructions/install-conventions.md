# Instructions: `install-conventions`

**Plan:** `setup-noodlestan-conventions`

**Iteration Id:** `install-conventions`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-setup-noodlestan-conventions/instructions/install-conventions__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `install-conventions`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `install-conventions`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Install `@noodlestan/conventions-typescript` as a dev dependency in Art JS.

## Mandatory Reading

- ::READ `$PROJECT/package.json` (Knowledge) — Root package configuration.

## Changes

- Step 1 / 3 — Add dependency
- Step 2 / 3 — Install and verify
- Step 3 / 3 — Commit `install-conventions`

## Steps

### Step `1 / 3` — Add dependency

Edit `$PROJECT/package.json` to add `@noodlestan/conventions-typescript` to `devDependencies`.

Add the entry (use latest version available, or `*` if uncertain):

```json
"@noodlestan/conventions-typescript": "0.0.1"
```

### Step `2 / 3` — Install and verify

Run `npm install` from `$PROJECT` to install the new dependency.

Verify that the package exists at:

```
$PROJECT/node_modules/@noodlestan/conventions-typescript/
```

If installation fails, REPORT A BLOCKER.

### Step `3 / 3` — Commit `install-conventions`

#### Commit: `install-conventions`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
configs(art-js): Install @noodlestan/conventions-typescript

- Add `@noodlestan/conventions-typescript` to devDependencies
```

## Final Verification

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/typescript.md` exists and is readable.
- Report according to the "How to Report Back to the Delegator" instructions.
