# Instructions: `publish-v0.0.2`

**Plan:** `archive-poc-and-publish`

**Iteration Id:** `publish-v0.0.2`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-archive-poc-and-publish/instructions/publish-v0.0.2__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `publish-v0.0.2`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable      | Resolved Path              | Purpose                               |
| ------------- | -------------------------- | ------------------------------------- |
| `$WORKSPACE`  | Current working directory  | Workspace root directory              |
| `$PROJECT`    | Provided with prompt       | Where work execution is taking place. |
| `$PRIMITIVES` | `$PROJECT/libs/primitives` | Primitives package directory          |
| `$CONSTRUCTS` | `$PROJECT/libs/constructs` | Constructs package directory          |
| `$PARSER`     | `$PROJECT/libs/parser`     | Parser package directory              |
| `$SERIALIZER` | `$PROJECT/libs/serializer` | Serializer package directory          |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `publish-v0.0.2`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Bump version to `0.0.2` for primitives, constructs, parser, and serializer packages. User will publish manually to npm after review.

## Mandatory Reading

- ::READ `$PRIMITIVES/package.json` (Knowledge) — Primitives package configuration.
- ::READ `$CONSTRUCTS/package.json` (Knowledge) — Constructs package configuration.
- ::READ `$PARSER/package.json` (Knowledge) — Parser package configuration.
- ::READ `$SERIALIZER/package.json` (Knowledge) — Serializer package configuration.

## Changes

- Step 1 / 3 — Bump package versions
- Step 2 / 3 — Create CHANGELOG.md in primitives, constructs, parser, and serializer packages.
- Step 3 / 3 — Commit `publish-v0.0.2`

## Steps

### Step `1 / 3` — Bump package versions

Update the `version` field in the following `package.json` files from `0.0.1` to `0.0.2`:

- `$PRIMITIVES/package.json`
- `$CONSTRUCTS/package.json`
- `$PARSER/package.json`
- `$SERIALIZER/package.json`

Verify that each file has:

- `"version": "0.0.2"`
- `"publishConfig": { "access": "public" }`

### Step `2 / 3` — Create CHANGELOG.md in primitives, constructs, parser, and serializer packages.

In each package directory create a CHANGELOG adapted to the package API. (constructs package will list all constructs)

Example for `parser`

```md
# CHANGELOG

## 0.0.2

### Added

- Stable API for `parse()`

### Tested

- Add comprehensive unit testing.
```

### Step `3 / 3` — Commit `publish-v0.0.2`

#### Commit: `publish-v0.0.2`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
release(art-js): Prepare v0.0.2 of primitives, constructs, parser, and serializer
```

## Final Verification

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that all four `package.json` files show version `0.0.2`.
- Verify that CHANGELOG.md exists in primitives, constructs, parser, and serializer packages.
- Report according to the "How to Report Back to the Delegator" instructions.
