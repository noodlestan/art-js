# Instructions: `apply-conventions-audit-recommendations`

**Plan:** `apply-conventions-recommendations`

**Iteration Id:** `apply-conventions-audit-recommendations`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-apply-conventions-recommendations/instructions/apply-conventions-audit-recommendations__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `apply-conventions-audit-recommendations`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path               | Purpose                               |
| ------------ | --------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory   | Workspace root directory              |
| `$PROJECT`   | `checkouts/art-js-planning` | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `apply-conventions-audit-recommendations`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Apply the convention fixes recommended in the per-package adoption audit reports. Load each package's adoption report attachment, apply the recommended changes to the package source code, and commit one package at a time.

## Mandatory Reading

- ::READ `$PROJECT/_guide.md` (Guide) — Project guide for conventions references.
- ::READ `$PROJECT/libs/primitives/_guide.md` (Guide) — Primitives package guide.
- ::READ `$PROJECT/libs/constructs/_guide.md` (Guide) — Constructs package guide.
- ::READ `$PROJECT/libs/parser/_guide.md` (Guide) — Parser package guide.
- ::READ `$PROJECT/libs/serializer/_guide.md` (Guide) — Serializer package guide.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Verifying Completion

**Instructions:**

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Operating Instructions: Verifying Step

**Instructions:**

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

---

## Changes

- Step 1 / 8 — Apply primitives fixes
- Step 2 / 8 — Commit `apply-conventions-primitives`
- Step 3 / 8 — Apply constructs fixes
- Step 4 / 8 — Commit `apply-conventions-constructs`
- Step 5 / 8 — Apply parser fixes
- Step 6 / 8 — Commit `apply-conventions-parser`
- Step 7 / 8 — Apply serializer fixes
- Step 8 / 8 — Commit `apply-conventions-serializer`

## Steps

### Step `1 / 8` — Apply primitives fixes

Read the adoption audit report at `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-primitives.md`.

For each issue listed in the report, apply the recommended fix to the corresponding source file in `$PROJECT/libs/primitives/`.

### Step `2 / 8` — Commit `apply-conventions-primitives`

#### Commit: `apply-conventions-primitives`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
conventions(primitives): Apply noodlestan conventions in @art-js/primitives.

- Normalize primitive type declarations and module imports.
- Clarify parser context naming and expand source position literals.
```

### Step `3 / 8` — Apply constructs fixes

Read the adoption audit report at `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-constructs.md`.

For each issue listed in the report, apply the recommended fix to the corresponding source file in `$PROJECT/libs/constructs/`.

### Step `4 / 8` — Commit `apply-conventions-constructs`

#### Commit: `apply-conventions-constructs`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
conventions(typescript): Apply noodlestan conventions in @art-js/constructs.

- Extract Document shape type to primitives.
- Replace interface declarations with explicit type aliases.
- Relocate construct private functions into small module type files.
- Route cross-module type imports through public module barrels.
- Add explicit control-flow blocks and descriptive local names.
- Extract shared tag/natural-expression helpers, add barrels to test helpers.
```

### Step `5 / 8` — Apply parser fixes

Read the adoption audit report at `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-parser.md`.

For each issue listed in the report, apply the recommended fix to the corresponding source file in `$PROJECT/libs/parser/`.

### Step `6 / 8` — Commit `apply-conventions-parser`

#### Commit: `apply-conventions-parser`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
conventions(typescript): Apply noodlestan conventions.

- Apply adoption audit recommendations for @art-js/parser.
```

### Step `7 / 8` — Apply serializer fixes

Read the adoption audit report at `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-serializer.md`.

For each issue listed in the report, apply the recommended fix to the corresponding source file in `$PROJECT/libs/serializer/`.

### Step `8 / 8` — Commit `apply-conventions-serializer`

#### Commit: `apply-conventions-serializer`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
conventions(typescript): Apply noodlestan conventions.

- Apply adoption audit recommendations for @art-js/serializer.
```

## Final Verification

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that each package's source code reflects the fixes recommended in its adoption report.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
