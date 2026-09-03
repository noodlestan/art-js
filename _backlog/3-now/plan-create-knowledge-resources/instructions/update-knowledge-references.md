# Instructions: `update-knowledge-references`

**Plan:** `create-knowledge-resources`

**Iteration Id:** `update-knowledge-references`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-create-knowledge-resources/instructions/update-knowledge-references__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-knowledge-references`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                           |
| ------------ | ------------------------- | --------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory          |
| `$PROJECT`   | Provided with prompt      | project repository root           |
| `$ARCH`      | `$PROJECT/architecture/`  | repo-level architecture directory |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-knowledge-references`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Update `_guide.md` knowledge references so the repository guide points to the newly created architecture documents.

## Mandatory Reading

- `$PROJECT/_guide.md` — repository guide to update (specifically the "## Knowledge References" section).

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Verifying Step

**Instructions:**

To verify documentation changes, from `$PROJECT`:

```bash
npm run lint:fix # fix automatically
npm run lint # report errors that can't be fixed automatically
```

Confirm the markdown is well-formed and the guide links resolve.

---

## Changes

- Step 1 / 2 — Update `_guide.md` knowledge references
- Step 2 / 2 — Commit `update-knowledge-references`

## Steps

### Step `1 / 2` — Update `_guide.md` knowledge references

In `$PROJECT/_guide.md`, update the `## Knowledge References` section so it lists the architecture documents created in this plan. Add references to the newly created documents (e.g. `architecture/components.md`, `architecture/overview.md` if created) alongside the existing entries (`architecture/index.md`, `libs/parser/architecture/index.md`).

Ensure the guide's "## Repository Layout" and "## Projects" sections (updated in the prior plan) still correctly reflect the repository structure.

---

#### Commit: `update-knowledge-references`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
docs(art-js): Update knowledge references.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `_guide.md` knowledge references include the new architecture documents.
- Execute the **Verifying Step** as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
