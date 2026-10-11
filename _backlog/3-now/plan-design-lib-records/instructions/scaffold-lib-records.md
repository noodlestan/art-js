# Instructions: `scaffold-lib-records`

**Plan:** `design-lib-records`

**Iteration Id:** `scaffold-lib-records`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/scaffold-lib-records__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `scaffold-lib-records`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `scaffold-lib-records`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Scaffold the `@art-js/records` package skeleton in `$PROJECT/libs/records/` and register it in the project records and knowledge: `_records/project.art`, `README.md`, and `_guide.md`. Commit as `scaffold(records): create @art-js/records package skeleton.`

## Mandatory Reading

- reference: `$PROJECT/libs/bundler/` — the reference package scaffold to mirror: `_guide.md`, `_records/package.art`, `_records/npm-deployment.art`, `.npmignore`, `.prettierignore`, `LICENSE-MIT`, `package.json`, `README.md`, `src/index.ts`, `tsconfig.json`, `tsconfig.build.json`, `build.config.mjs`, `vitest.config.ts`.
- records: `$PROJECT/_records/project.art` — the project record to update.
- guide: `$PROJECT/_guide.md` — the project guide with the Projects table to update.
- readme: `$PROJECT/README.md` — the project readme with the Packages table to update.

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

- Step 1 / 5 — Create `$PROJECT/libs/records/` package skeleton
- Step 2 / 5 — Update `$PROJECT/_records/project.art`
- Step 3 / 5 — Update `$PROJECT/README.md`
- Step 4 / 5 — Update `$PROJECT/_guide.md`
- Step 5 / 5 — Commit `scaffold-lib-records`

## Steps

### Step `1 / 5` — Create `$PROJECT/libs/records/` package skeleton

Create the `@art-js/records` package skeleton at `$PROJECT/libs/records/`, mirroring the reference package `$PROJECT/libs/bundler/` file by file.

If `$PROJECT/libs/records/` already exists (e.g. stale build artifacts such as `dist/` left over from an earlier run), remove its contents first so the skeleton starts clean.

Create the following files:

- `_guide.md` — package overview, layout, records management, and operating instructions, adapted from `libs/bundler/_guide.md` to the records package.
- `_records/package.art` — `Package: Records` record: purpose "Record identity, discovery, extraction, update and serialisation for Markdown documents.", path `libs/records/`, canonical name `@art-js/records`, published `true`, private `false`, deployment `NPM Package Deployment: Records`, language Typescript, engines Node `>= 22`, package manager `npm@10.2.3`, package file `package.json`, dev dependency set `Solid Lib Development`, license `License: Noodlestan 2026 MIT`.
- `_records/npm-deployment.art` — `NPM Package Deployment: Records` record: owner `Package: Records`, status `DEPLOYED`, build `Deployment Build: NPM Command`, deploy `Deployment Command: NPM Package CLI`, canonical name `@art-js/records`, registry `https://registry.npmjs.org`, access `public`.
- `.npmignore` — `*.test.ts`, `*.test.tsx`.
- `.prettierignore` — `.coverage/`, `coverage/`, `env.d.ts`, `dist/`.
- `LICENSE-MIT` — copy from `libs/bundler/LICENSE-MIT`.
- `package.json` — name `@art-js/records`, version `0.0.1`, description "Record identity, discovery, extraction, update and serialisation for Markdown documents.", author `Noodlestan Collective`, license `MIT`, private `false`, publishConfig access `public`, repository directory `libs/records/`, type `module`, sideEffects `false`, main `./src/index.ts`, files `["src", "LICENSE-MIT"]`, and the same scripts and devDependencies as `libs/bundler/package.json`.
- `README.md` — adapted from `libs/bundler/README.md` to the records package.
- `src/index.ts` — placeholder: `// placeholder`.
- `tsconfig.json` — copy from `libs/bundler/tsconfig.json`.
- `tsconfig.build.json` — copy from `libs/bundler/tsconfig.build.json`.
- `build.config.mjs` — copy from `libs/bundler/build.config.mjs`.
- `vitest.config.ts` — copy from `libs/bundler/vitest.config.ts`.

### Step `2 / 5` — Update `$PROJECT/_records/project.art`

Add `Package: Records` to the `**Resources:**` list of the project record, keeping the libraries grouped together: insert it after `- Package: Program` and before `- Package: Validator`.

### Step `3 / 5` — Update `$PROJECT/README.md`

Add the `@art-js/records` row to the `## Packages` table, keeping the libraries grouped together: insert it after the `@art-js/validator` row.

Row: `| `@art-js`|`libs/records/`|`@art-js/records` | Record identity, discovery, extraction, update and serialisation |`

### Step `4 / 5` — Update `$PROJECT/_guide.md`

Add the Records row to the `## Projects` table, keeping the libraries grouped together: insert it after the `Validator` row.

Row: `| Records | `libs/records/\_guide.md`|`NONE` |`

### Step `5 / 5` — Commit `scaffold-lib-records`

#### Commit: `scaffold-lib-records`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
scaffold(records): create @art-js/records package skeleton.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `$PROJECT/libs/records/` contains all the skeleton files: `_guide.md`, `_records/package.art`, `_records/npm-deployment.art`, `.npmignore`, `.prettierignore`, `LICENSE-MIT`, `package.json`, `README.md`, `src/index.ts`, `tsconfig.json`, `tsconfig.build.json`, `build.config.mjs`, `vitest.config.ts`.
- Verify `$PROJECT/_records/project.art` lists `Package: Records` in Resources.
- Verify `$PROJECT/README.md` Packages table has the `@art-js/records` row.
- Verify `$PROJECT/_guide.md` Projects table has the Records row.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
