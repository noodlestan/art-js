# Instructions: `pin-art-md-dependencies`

**Plan:** `adopt-codec-construct-api`

**Iteration Id:** `pin-art-md-dependencies`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/pin-art-md-dependencies__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `pin-art-md-dependencies`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                                      |
| ------------ | ------------------------- | -------------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory                     |
| `$PROJECT`   | `checkouts/art-js`        | Art JS checkout where the work executes      |
| `$PACKAGE`   | `$PROJECT/libs/records`   | The `@art-js/records` package                |
| `$TESTS`     | `$PROJECT/tests/records`  | The `@art-js/test-records` integration suite |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `pin-art-md-dependencies`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Move both workspace edges of `$PROJECT` onto the current `@art-md` release wave and declare the codec package that `$PACKAGE`'s integration fixtures already import, then regenerate and stage `$PROJECT/package-lock.json`. Commit as `deps(records): Pin art-md packages.`

This iteration changes **no source file**. It only rewrites two manifests and the lock: `@art-md/primitives` and `@art-md/constructs` to `0.0.7`, `@art-md/codec` to `0.0.5` everywhere it is declared.

The two manifests must move in one commit. Today `$PACKAGE` resolves `createArtCodec` only because Node climbs out of `$PACKAGE` into `$PROJECT/node_modules/@art-md/codec`, which exists at `0.0.3` solely because `$TESTS` asks for that version. Bumping one edge and not the other leaves two codecs and two primitives in the tree, and install order decides which version each package sees.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript.

- design: `$PACKAGE/knowledge/design/records.md` — what the record API expects from the codec.
- guide: `$PACKAGE/_records/npm-deployment.art` — publish and dependency rules for this package.
- guide: `$PACKAGE/_guide.md` — package layout and operating instructions.
- guide: `$TESTS/_guide.md` — integration suite layout and operating instructions.
- guide: `$PROJECT/_guide.md` — repository layout, workspaces, and operating instructions.
- guide: `$WORKSPACE/_guide.md` — workspace orientation and operating instructions.
- reference: `$PROJECT/node_modules/@art-md/codec/package.json` — the published `0.0.5` manifest whose exact pins the lock must converge on.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root, and again from the `$PROJECT` root — the workspace is not a build root, every project repo builds standalone:

```bash
npm ci # to install dependencies.
```

Do not run `npm ci` after editing the manifests — it refuses to install when the lock disagrees with them. Use `npm install` for the lock regeneration step.

### Verifying Step

**Purpose:** Validate lint, tests and build for a package step.

**Instructions:** (From `$PACKAGE/_guide.md` and `$TESTS/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run build # to produce a full build
```

### Verifying Completion

**Purpose:** Confirm the work item satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root:

```bash
npm run ci # lint, test and build
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there — or reuse the blueprint message provided at the commit step, which is already authored.

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 4 — Pin `@art-md` packages in `$PACKAGE/package.json`
- Step 2 / 4 — Pin `@art-md` packages in `$TESTS/package.json`
- Step 3 / 4 — Regenerate the lock and confirm a single copy of each package
- Step 4 / 4 — Verify and commit `pin-art-md-dependencies`

## Steps

### Step `1 / 4` — Pin `@art-md` packages in `$PACKAGE/package.json`

**Description:** Move the two runtime `@art-md` dependencies to `0.0.7` and declare the codec the fixtures import.

**Instructions:**

Change `dependencies` to:

```json
"dependencies": {
  "@art-md/constructs": "0.0.7",
  "@art-md/primitives": "0.0.7"
}
```

Add `@art-md/codec` to `devDependencies`, keeping the existing entry:

```json
"devDependencies": {
  "@art-md/codec": "0.0.5",
  "vitest": "5.0.5"
}
```

The codec belongs in `devDependencies` because this package's integration fixtures (`$PACKAGE/tests/fixtures/*/integration.test.ts`) import the **value** `createArtCodec`. The library source never imports it: it takes only the `ArtCodec` type, from `@art-md/primitives`, and receives the instance from the consumer through `RecordHandleContext` and `RecordsDocumentContext`. A runtime dependency would force every consumer onto this codec version.

Do not change `version`, `private`, `publishConfig`, `CHANGELOG.md`, or anything outside these two blocks. Do not add `@art-md/parser` or `@art-md/serializer` — they arrive transitively and are never imported here.

### Step `2 / 4` — Pin `@art-md` packages in `$TESTS/package.json`

**Description:** Move the integration suite onto the same wave, so no workspace package resolves an older copy.

**Instructions:**

Change `dependencies` to:

```json
"dependencies": {
  "@art-js/records": "*",
  "@art-lib/fs-records": "0.0.3",
  "@art-md/codec": "0.0.5",
  "@art-md/primitives": "0.0.7"
}
```

Three deliberate non-changes:

- Do not add `@art-md/constructs`. This package never imports it, and `@art-md/codec@0.0.5` already pins `constructs@0.0.7` exactly.
- Leave `@art-js/records` at `"*"`. It is the internal workspace edge; the release iteration of `Plan: Canonical Record Field Names` re-pins it when `0.1.0` ships.
- Leave `@art-lib/fs-records` at `0.0.3`. Its own `@art-md/primitives: 0.0.6` pin is fixed in the art-lib project, not here.

Do not change `version`, `private`, `publishConfig`, `CHANGELOG.md`, or the `scripts` block.

### Step `3 / 4` — Regenerate the lock and confirm a single copy of each package

**Description:** Rewrite `$PROJECT/package-lock.json` from the new manifests and prove the tree converged.

**Instructions:**

Run from `$PROJECT`:

```bash
npm install
```

Expect the following entries to move, because `@art-md/codec@0.0.5` pins its siblings exactly:

| Package              | Before                        | After        |
| -------------------- | ----------------------------- | ------------ |
| `@art-md/codec`      | `0.0.3`                       | `0.0.5`      |
| `@art-md/primitives` | `0.0.5` root + `0.0.6` nested | `0.0.7` root |
| `@art-md/constructs` | `0.0.6`                       | `0.0.7`      |
| `@art-md/parser`     | `0.0.4`                       | `0.0.6`      |
| `@art-md/serializer` | `0.0.4`                       | `0.0.6`      |

Then run from `$PROJECT`:

```bash
npm ls @art-md/codec @art-md/primitives @art-md/constructs --all
```

Required outcome:

- `@art-js/records` and `@art-js/test-records` both resolve the same single `@art-md/codec@0.0.5`, now declared rather than reached by hoisting.
- `@art-md/primitives@0.0.7` is the version resolved by every workspace package, `@art-md/constructs`, and `@art-md/codec`.
- Exactly one duplicate remains: `@art-md/primitives@0.0.6` nested under `@art-lib/fs-records@0.0.3`. That is the documented residual — keep it, and do not run `npm dedupe`, `npm update`, or a hand-edited lock to remove it.
- Any other duplicate, or any `@art-md` package still at `0.0.4`, `0.0.5`, or `0.0.6` outside that residual, is a BLOCKER.

If `npm install` rewrites a manifest other than the two you edited, revert that file and REPORT A BLOCKER with the diff.

Stage `$PROJECT/package-lock.json` — the whole file, not a hand-picked hunk. The committed lock must be the one `npm install` produced.

### Step `4 / 4` — Verify and commit `pin-art-md-dependencies`

**Description:** Prove nothing regressed and record the change.

**Instructions:**

1. Run the **Verifying Step** from `$PACKAGE`, then the same commands from `$TESTS`. Both must pass with no source change. The integration suite exercises the codec through `createArtCodec`, so it is the real check that the pins and the tree agree. Keep this order: `$TESTS` resolves `@art-js/records` through `$PACKAGE/dist`, so the package must be built before its tests run.
2. Run the **Verifying Completion** from `$PROJECT`.
3. Stage exactly three files: `$PACKAGE/package.json`, `$TESTS/package.json`, `$PROJECT/package-lock.json`. Confirm with `git status --short` that nothing else is staged — in particular no `_backlog` or `_roadmap` file, no `dist`, and no `node_modules`.
4. Commit from `$PROJECT`.

**Message:**

```text
deps(records): Pin art-md packages.

- Pin `@art-md/primitives` and `@art-md/constructs` to `0.0.7`.
- Add `@art-md/codec` `0.0.5` for the construct API the fixtures import.
- Move `@art-js/test-records` onto the same pins.
```

The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push and do **not** run `npm version`, `npm publish`, or any release command: publishing is a separate, explicit decision.

---

## Final Verification

**Instructions:**

- Verify the commit exists locally and was **not** pushed.
- Verify exactly three files were committed: `$PACKAGE/package.json`, `$TESTS/package.json`, `$PROJECT/package-lock.json`.
- Verify `$PACKAGE/package.json` declares `@art-md/constructs: 0.0.7`, `@art-md/primitives: 0.0.7`, and `@art-md/codec: 0.0.5` under `devDependencies` only.
- Verify `$TESTS/package.json` declares `@art-md/codec: 0.0.5`, `@art-md/primitives: 0.0.7`, `@art-js/records: "*"`, `@art-lib/fs-records: 0.0.3`, and no `@art-md/constructs`.
- Verify no manifest outside these two changed — in particular `$PACKAGE/src` and `$TESTS/fixtures` are untouched, and `$PACKAGE/CHANGELOG.md` is untouched.
- Verify `grep -n '"\*"' $PACKAGE/package.json $TESTS/package.json` prints only the `@art-js/records` line.
- Verify `npm ls @art-md/codec @art-md/primitives --all` from `$PROJECT` shows one `codec@0.0.5`, one `primitives@0.0.7`, and only the `@art-lib/fs-records` residual at `0.0.6`.
- Verify the lock declares the same versions as the manifests, and that no `resolved` URL points at `0.0.4`, `0.0.5`, or `0.0.6` for these packages outside the residual.
- Verify `$PACKAGE` and `$TESTS` pass `npm run ci`, and `$PROJECT` passes `npm run ci`.
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Report according to the "How to Report Back to the Delegator" instructions.
