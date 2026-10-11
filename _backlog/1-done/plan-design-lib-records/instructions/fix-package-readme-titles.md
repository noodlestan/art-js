# Instructions: `fix-package-readme-titles`

**Plan:** `design-lib-records`

**Iteration Id:** `fix-package-readme-titles`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/fix-package-readme-titles__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `fix-package-readme-titles`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `fix-package-readme-titles`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Replace the legacy `Artificial`/`artificial` README titles with canonical `@art-js/*` package names across all 8 packages in `$PROJECT/libs/` and `$PROJECT/cli/`, clearing the backlog parking lot actionable. Commit as `renames(art-js): README titles to canonical package names.`

## Mandatory Reading

- readme: `$PROJECT/README.md` — the Packages table defining the canonical package names.
- guide: `$PROJECT/_guide.md` — project layout, conventions, and operating instructions.

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

- Step 1 / 2 — Update 8 package README titles to canonical package names
- Step 2 / 2 — Commit `fix-package-readme-titles`

## Steps

### Step `1 / 2` — Update 8 package README titles to canonical package names

For each file below, replace the first-line title (the `# ...` heading) with the canonical package name. Change ONLY the first line — leave the rest of each README untouched.

| File                                     | Current title                  | New title                   |
| ---------------------------------------- | ------------------------------ | --------------------------- |
| `$PROJECT/libs/bundler/README.md`        | `# Artificial Bundler`         | `# @art-js/bundler`         |
| `$PROJECT/libs/program/README.md`        | `# artificial-program`         | `# @art-js/program`         |
| `$PROJECT/libs/validator/README.md`      | `# artificial-validator`       | `# @art-js/validator`       |
| `$PROJECT/cli/bin/README.md`             | `# Artificial Bin`             | `# @art-js/bin`             |
| `$PROJECT/cli/dev-server/README.md`      | `# Artificial Dev Server`      | `# @art-js/dev-server`      |
| `$PROJECT/cli/language-server/README.md` | `# Artificial Language Server` | `# @art-js/language-server` |
| `$PROJECT/cli/tools/README.md`           | `# Artificial Tools`           | `# @art-js/tools`           |
| `$PROJECT/cli/watcher/README.md`         | `# Artificials Watcher`        | `# @art-js/watcher`         |

The canonical names match the `## Packages` table in `$PROJECT/README.md`.

Expected outcome: no README under `$PROJECT/libs/` or `$PROJECT/cli/` starts with an `Artificial`/`artificial` title.

Verify with:

```bash
grep -rn "^# [Aa]rtificial" $PROJECT/libs $PROJECT/cli --include=README.md
```

The command must return no matches.

### Step `2 / 2` — Commit `fix-package-readme-titles`

#### Commit: `fix-package-readme-titles`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
renames(art-js): README titles to canonical package names.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify each of the 8 README files starts with its canonical `@art-js/*` title as listed in the Changes table.
- Verify `grep -rn "^# [Aa]rtificial" $PROJECT/libs $PROJECT/cli --include=README.md` returns no matches.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
