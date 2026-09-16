# Instructions: `consolidate-process-insights`

**Plan:** `apply-conventions-recommendations`

**Iteration Id:** `consolidate-process-insights`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-apply-conventions-recommendations/instructions/consolidate-process-insights__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `consolidate-process-insights`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path                      | Purpose                               |
| -------------- | ---------------------------------- | ------------------------------------- |
| `$WORKSPACE`   | Current working directory          | Workspace root directory              |
| `$PROJECT`     | `checkouts/art-js-planning`        | Where work execution is taking place. |
| `$CONVENTIONS` | `$WORKSPACE/checkouts/conventions` | Conventions source code               |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `consolidate-process-insights`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Document the convention adoption process, audit-conventions skill feedback, and recommendations for other projects. Create `$PROJECT/_audit/conventions/plan__adoption-process-insights.md` as the input the conventions repo needs for its "Document Adoption Process" iteration.

## Mandatory Reading

- ::READ `$CONVENTIONS/_backlog/6-plan/plan-pilot-project-adoption-art-js/plan.md` (Plan) — Upstream conventions adoption plan; understand what "Document Adoption Process" expects.
- ::READ `.agents/skills/audit-conventions/SKILL.md` (Skill) — Audit Conventions skill; provide feedback on usability.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

### Operating Instructions: Writing Commit Message

**Instructions:**

Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
Write a message following: `{Type}({Scope}): {Description}.` max 120 chars, optionally followed by up to 3 bullet points, max 100 chars each.

---

## Changes

- Step 1 / 3 — Read all plan attachments
- Step 2 / 3 — Write insights document
- Step 3 / 3 — Commit `consolidate-process-insights`

## Steps

### Step `1 / 3` — Read all plan attachments

Read all attachments produced by previous iterations of the audit plan:

- `$PROJECT/_audit/conventions/plan__conventions-setup-audit.md` — Setup audit report.
- `$PROJECT/_audit/conventions/plan__conventions-adoption-primitives.md` — Primitives adoption report.
- `$PROJECT/_audit/conventions/plan__conventions-adoption-constructs.md` — Constructs adoption report.
- `$PROJECT/_audit/conventions/plan__conventions-adoption-parser.md` — Parser adoption report.
- `$PROJECT/_audit/conventions/plan__conventions-adoption-serializer.md` — Serializer adoption report.

Also read the plan itself to understand the full adoption process:

- `$PROJECT/_backlog/3-now/plan-apply-conventions-recommendations/plan.md`

### Step `2 / 3` — Write insights document

Create the file `$PROJECT/_audit/conventions/plan__adoption-process-insights.md` with the following structure:

**Sections to include:**

1. **This Plan** — Summarise the plan purpose, iterations, and outcomes (what was audited, what was fixed, what was produced).
2. **Adoption Process** — Step-by-step description of the process followed: install packages → configure guides → audit setup → fix setup → audit adoption → apply recommendations → consolidate insights. Describe what worked well and what was friction.
3. **Audit Conventions Skill Feedback** — Evaluate the `audit-conventions` skill: what commands were used, what worked well, what was confusing, what was missing. Include specific examples of friction or gaps encountered during the audit.
4. **Recommendations for Other Projects** — Concrete guidance for other projects adopting Noodlestan conventions: prerequisites, recommended order of operations, common pitfalls, and suggested improvements to the audit-conventions skill.

### Step `3 / 3` — Commit `consolidate-process-insights`

#### Commit: `consolidate-process-insights`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
docs(art-js): Document conventions adoption process insights.

- Summarise adoption process and audit-conventions skill feedback.
- Provide recommendations for rolling out to other projects.
```

## Final Verification

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$PROJECT/_audit/conventions/plan__adoption-process-insights.md` exists and contains all four sections.
- Report according to the "How to Report Back to the Delegator" instructions.
