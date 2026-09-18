# Instructions: `fixture-cleanup`

**Plan:** `integrate-feedback-and-follow-ups`

**Iteration Id:** `fixture-cleanup`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-integrate-feedback-and-follow-ups/instructions/fixture-cleanup__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `fixture-cleanup`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                            | Purpose                               |
| ------------ | ---------------------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory                | Workspace root directory              |
| `$PROJECT`   | Provided with prompt                     | Where work execution is taking place. |
| `$FIXTURES`  | `$PROJECT/libs/constructs/test/fixtures` | Construct test fixtures directory     |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `fixture-cleanup`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Remove noisy POC-era underscore-prefixed fixture files and their JSON snapshots from the construct test suite.

## Changes

- Step 1 / 2 — Delete underscore-prefixed fixtures
- Step 2 / 2 — Commit `fixture-cleanup`

## Steps

### Step `1 / 2` — Delete underscore-prefixed fixtures

Delete all files in `$FIXTURES/` that start with `_` (underscore), including both `.art`, `.md` source files and their `.json` snapshot counterparts.

The following files must be removed:

- `$FIXTURES/_semantics.art`
- `$FIXTURES/_semantics.art.json`
- `$FIXTURES/_scalar.art`
- `$FIXTURES/_scalar.art.json`
- `$FIXTURES/_markdown.md`
- `$FIXTURES/_markdown.md.json`
- `$FIXTURES/_configuration.art`
- `$FIXTURES/_configuration.art.json`
- `$FIXTURES/_language.art`
- `$FIXTURES/_language.art.json`
- `$FIXTURES/_project-lint.art`
- `$FIXTURES/_project-lint.art.json`
- `$FIXTURES/_section-block.art`
- `$FIXTURES/_section-block.art.json`
- `$FIXTURES/_config.md`
- `$FIXTURES/_config.md.json`
- `$FIXTURES/_architecture-index.md`
- `$FIXTURES/_architecture-index.md.json`
- `$FIXTURES/_mantras-architect.md`
- `$FIXTURES/_mantras-architect.md.json`
- `$FIXTURES/_README.md`
- `$FIXTURES/_README.md.json`
- `$FIXTURES/_artificial.art`
- `$FIXTURES/_artificial.art.json`
- `$FIXTURES/_parser.art`
- `$FIXTURES/_parser.art.json`

Verify no `_`-prefixed files remain in `$FIXTURES/`.

### Step `2 / 2` — Commit `fixture-cleanup`

#### Commit: `fixture-cleanup`

**Policy:** MANUAL — The user executes the commit themselves; no instructions file is generated and the commit is not delegated.

**Message:**

```
test(art-js): Remove noisy POC-era underscore-prefixed fixtures

- Delete 13 `_`-prefixed fixture files from `libs/constructs/test/fixtures/`
- Delete corresponding `.json` snapshots
```

## Final Verification

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that no `_`-prefixed files remain in `$FIXTURES/`.
- Report according to the "How to Report Back to the Delegator" instructions.
