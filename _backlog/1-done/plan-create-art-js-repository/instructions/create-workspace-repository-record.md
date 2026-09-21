# Instructions: `create-workspace-repository-record`

**Plan:** `create-art-js-repository`

**Iteration Id:** `create-workspace-repository-record`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-create-art-js-repository/instructions/create-workspace-repository-record__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `create-workspace-repository-record`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path               | Purpose                                        |
| ------------ | --------------------------- | ---------------------------------------------- |
| `$WORKSPACE` | Current working directory   | Workspace root directory                       |
| `$ART_JS`    | `checkouts/art-js-building` | Repository: Art JS checkout (to be re-created) |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `create-workspace-repository-record`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Register the new Art JS repository in the workspace records by creating `$WORKSPACE/_records/repositories/art-js.art`.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ART_JS/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.

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

**Instructions:** (From `$ART_JS/_guide.md`)

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

- Step 1 / 2 — Create `$WORKSPACE/_records/repositories/art-js.art` to Repository: Art JS
- Step 2 / 2 — Commit `create-workspace-repository-record`

## Steps

### Step `1 / 2` — Create `$WORKSPACE/_records/repositories/art-js.art` to Repository: Art JS

Create the workspace repository record at `$WORKSPACE/_records/repositories/art-js.art` following the record conventions of the workspace (see the other records in `$WORKSPACE/_records/repositories/` for the record structure and fields).

The record is Repository: Art JS, with:

- **owner** — Project: Art JS
- **remote** — `git@github.com:noodlestan/art-js.git`

The record content is a copy of `$ART_JS/_records/repository.art` — align it with the repository record created in the iteration `create-records-at-art-js-records`.

### Step `2 / 2` — Commit `create-workspace-repository-record`

---

#### Commit: `create-workspace-repository-record`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
records(workspace): Add art-js repository record.
```

Stage the created record file in `$WORKSPACE/_records/repositories/` and commit with the message above. Do NOT push.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$WORKSPACE/_records/repositories/art-js.art` exists and is Repository: Art JS.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
