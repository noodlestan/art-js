# Plan: Extract Libs and CLI Placeholders to Art JS

**ID:** `extract-libs-and-cli-placeholders-to-art-js`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Move the placeholder packages from Art MD to Art JS.

**Description:** Extract the placeholder libs (bundler, program, validator) and cli (bin, dev-server, language-server, tools, watcher) packages from Art MD into the new Art JS repository, updating records and references.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                                  | Purpose                            |
| ------------ | ---------------------------------------------- | ---------------------------------- |
| `$WORKSPACE` | Current working directory                      | Workspace root directory           |
| `$PROJECT`   | `checkouts/art-md-planning`                    | Current checkout for planning only |
| `$ART_MD`    | `checkouts/art-md-building` (after rename)     | Repository: Art MD checkout        |
| `$ART_JS`    | `checkouts/art-js-building` (to be re-created) | Repository: Art JS checkout        |

## Summary

Move the placeholder libs and cli packages from Art MD to Art JS, update the namespace and project records in both repositories, and rename the `@art-js` scope to `@art-md` for the packages staying in Art MD.

## Context

### Upstream Work

| Kind      | Path                                                            | Role                                                   |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-extract-art-md/milestone.md` | Coordinates this plan within the Extract MD milestone. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ART_MD/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ART_JS/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.

## Scope

Move the placeholder packages from Art MD to Art JS, update the namespace and project records in both repositories, and rename the `@art-js` scope to `@art-md` for the packages staying in Art MD.

### Package Inventory

#### Packages Staying in Art MD

The 6 md core packages stay in `$ART_MD` and are renamed from `@art-js` to `@art-md`:

| Package           | Path                  | Canonical Name (before)     | Canonical Name (after)      |
| ----------------- | --------------------- | --------------------------- | --------------------------- |
| Constructs        | `libs/constructs/`    | `@art-js/constructs`        | `@art-md/constructs`        |
| Parser            | `libs/parser/`        | `@art-js/parser`            | `@art-md/parser`            |
| Primitives        | `libs/primitives/`    | `@art-js/primitives`        | `@art-md/primitives`        |
| Serializer        | `libs/serializer/`    | `@art-js/serializer`        | `@art-md/serializer`        |
| Spec              | `spec/`               | `@art-js/spec`              | `@art-md/spec`              |
| Pipeline Test CLI | `cli/pipeline-tests/` | `@art-js/pipeline-test-cli` | `@art-md/pipeline-test-cli` |

#### Packages Moving to Art JS

The 8 placeholder packages move to `$ART_JS` and keep the `@art-js` scope:

| Package         | Path                   | Canonical Name            |
| --------------- | ---------------------- | ------------------------- |
| Bundler         | `libs/bundler/`        | `@art-js/bundler`         |
| Program         | `libs/program/`        | `@art-js/program`         |
| Validator       | `libs/validator/`      | `@art-js/validator`       |
| Bin             | `cli/bin/`             | `@art-js/bin`             |
| Dev Server      | `cli/dev-server/`      | `@art-js/dev-server`      |
| Language Server | `cli/language-server/` | `@art-js/language-server` |
| Tools           | `cli/tools/`           | `@art-js/tools`           |
| Watcher         | `cli/watcher/`         | `@art-js/watcher`         |

### Files to Update

#### Files in `$ART_MD` (root)

| File                      | Change                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `README.md`               | Packages table → 6 md core packages with `@art-md`; remove stale `cli/poc-parse` row.                               |
| `_guide.md`               | Projects table → 6 md core packages; remove moved packages (Bin, Dev Server, Watcher, Bundler, Program, Validator). |
| `package.json`            | `name` → `noodlestan/art-md`.                                                                                       |
| `_records/repository.art` | Record name → `Repository: Art MD`; Owner → `Project: Art MD`.                                                      |
| `_records/project.art`    | Record name → `Project: Art MD`; Resources → 6 packages (add Spec).                                                 |
| `_records/namespace.art`  | Owner → `Project: Art MD`.                                                                                          |

#### Files in `$WORKSPACE` (root)

| File                               | Change                     |
| ---------------------------------- | -------------------------- |
| `_records/repositories/art-md.art` | Owner → `Project: Art MD`. |

#### Files per Staying Package in `$ART_MD`

For each of the 6 staying packages (`libs/constructs`, `libs/parser`, `libs/primitives`, `libs/serializer`, `spec`, `cli/pipeline-tests`):

| File                                        | Change                                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `package.json`                              | `name` → `@art-md/{pkg}`; `repository.url` → `https://github.com/noodlestan/art-md`.          |
| `_records/package.art`                      | `Canonical Name` → `@art-md/{pkg}`; Owner → `Project: Art MD`; dependency refs → `@art-md/*`. |
| `_records/npm-deployment.art`               | `Canonical Name` → `@art-md/{pkg}`.                                                           |
| `_guide.md`                                 | Intro `@art-js/{pkg}` → `@art-md/{pkg}`.                                                      |
| `README.md`                                 | "Art-JS toolkit" / "@artificials" → "Art MD".                                                 |
| `src/**`                                    | Imports `@art-js/*` → `@art-md/*` (parser, serializer, constructs, primitives).               |
| `architecture/*`                            | References `@art-js/*` → `@art-md/*` (constructs, parser, primitives, serializer).            |
| `cli/pipeline-tests/scripts/**`             | Imports `@art-js/parser`, `@art-js/primitives`, `@art-js/serializer` → `@art-md/*`.           |
| `spec/modules/validate/validate-module.art` | `artificials/art-js/spec/...` → `artificials/art-md/spec/...`.                                |

#### Files per Moving Package (moved to `$ART_JS`)

For each of the 8 moving packages, the full package directory moves as-is:

| File                                                                                   | Notes                                                        |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `_records/package.art`                                                                 | Already `@art-js/*` and Owner: Project: Art JS; verify only. |
| `_records/npm-deployment.art`                                                          | Already `@art-js/*`; verify only.                            |
| `_guide.md`                                                                            | Not present in `cli/language-server`, `cli/tools`.           |
| `README.md`                                                                            | Present in all 8 packages.                                   |
| `package.json`                                                                         | Not present in `cli/language-server`, `cli/tools`.           |
| `src/`, `dist/`, `tsconfig*.json`, `vite.config.ts`, `vitest.config.ts`, `LICENSE-MIT` | Present in the 6 packages with `package.json`.               |
| `architecture/`                                                                        | Only `cli/language-server`.                                  |

#### Files in `$ART_JS` (root)

| File                      | Change                                                               |
| ------------------------- | -------------------------------------------------------------------- |
| `README.md`               | Packages table → 8 packages with `@art-js`.                          |
| `_guide.md`               | Projects table → 8 packages.                                         |
| `package.json`            | `name` → `noodlestan/art-js`; description to Art JS scope.           |
| `_records/project.art`    | Resources → 8 packages.                                              |
| `_records/repository.art` | Verify (created by plan `create-art-js-repository`).                 |
| `_records/namespace.art`  | Verify scope `@art-js` (created by plan `create-art-js-repository`). |

### (Scope) Repository: Art MD

**Record:** `$ART_MD/_records/repository.art`

**Role:** Hosts the md core packages (parser, serializer, constructs, primitives, spec, pipeline-tests) after extraction.

**Changes:**

- Remove the placeholder packages extracted to Art JS.
- Update `$ART_MD/_records/namespace.art` to `@art-md`.
- Update `$ART_MD/_records/project.art` resources to the md core packages.
- Rename `@art-js` → `@art-md` for the packages staying in Art MD.

**Dependencies:**

- None.

### (Scope) Repository: Art JS

**Record:** `$ART_JS/_records/repository.art`

**Role:** Receives the extracted placeholder packages.

**Changes:**

- Receive the extracted placeholder packages from Art MD.
- Update `$ART_JS/_records/namespace.art` to `@art-js`.
- Update `$ART_JS/_records/project.art` resources to the migrated packages.

**Dependencies:**

- Repository: Art MD — extraction requires the rename and creation to complete.

### (Scope) Repository: Workspace

**Record:** `$WORKSPACE/_records/repositories/art-md.art`

**Role:** Workspace repository record for Art MD; Owner still references `Project: Art JS` after the rename plan.

**Changes:**

- Update Owner to `Project: Art MD`.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; the placeholder packages move from `$ART_MD` (checkout `checkouts/art-md-building`) to `$ART_JS` (checkout `checkouts/art-js-building`), and records and knowledge are updated in both repositories.

---

## Items:

| Iteration / Instructions                                  | Status  |
| --------------------------------------------------------- | ------- |
| Iteration: Move Placeholder Packages to Art JS            | `READY` |
| Iteration: Update Art JS Records                          | `READY` |
| Iteration: Update Art MD Records                          | `READY` |
| Iteration: Rename @art-js to @art-md for Staying Packages | `READY` |
| Iteration: Update Knowledge Files                         | `READY` |

### Iteration: Move Placeholder Packages to Art JS

**ID:** `move-placeholder-packages-to-art-js`

**Status:** `READY`

**Purpose:** Move the placeholder libs and cli packages from Art MD to Art JS.

**Description:** Move the 8 placeholder packages (libs/bundler, libs/program, libs/validator, cli/bin, cli/dev-server, cli/language-server, cli/tools, cli/watcher) from `$ART_MD` to `$ART_JS`, including their `_records/` and package files.

**Changes:**

- Copy the 8 placeholder packages from `$ART_MD` to `$ART_JS`:
  - `libs/bundler`, `libs/program`, `libs/validator`
  - `cli/bin`, `cli/dev-server`, `cli/language-server`, `cli/tools`, `cli/watcher`
- Each package moves with its full contents: `_records/`, `_guide.md`, `README.md`, `package.json`, `src/`, `dist/`, `tsconfig*.json`, `vite.config.ts`, `vitest.config.ts`, `LICENSE-MIT`, and `architecture/` (language-server only).
- Add the moved packages to `$ART_JS` with `git add`.
- Remove the moved packages from `$ART_MD` with `git rm`.
- Verify the root `package.json` workspaces in both repositories still cover the remaining and moved packages (globs `libs/**`, `cli/**`, `spec/**`).

**Dependencies:**

- Plan: Create Art JS Repository.

#### Commits:

| ID                                        | Repository / Checkout / Branch  | Policy   | Hash | Status     |
| ----------------------------------------- | ------------------------------- | -------- | ---- | ---------- |
| `add-placeholder-packages-to-art-js`      | Art JS / `$ART_JS` / `building` | `MANUAL` |      | `AUTHORED` |
| `remove-placeholder-packages-from-art-md` | Art MD / `$ART_MD` / `building` | `MANUAL` |      | `AUTHORED` |

##### Commit: `add-placeholder-packages-to-art-js`

**Repository:** Art JS

**Message:**

```text
migrate(art-js): Add placeholder packages extracted from Art MD.
```

##### Commit: `remove-placeholder-packages-from-art-md`

**Repository:** Art MD

**Message:**

```text
migrate(art-md): Remove placeholder packages moved to Art JS.
```

### Iteration: Update Art JS Records

**ID:** `update-art-js-records`

**Status:** `READY`

**Purpose:** Update the Art JS namespace and project records to the migrated scope.

**Description:** Update `$ART_JS/_records/project.art` resources to the 8 migrated packages and verify the namespace, repository, and package records created by the scaffold and moved with the packages.

**Changes:**

- Update `$ART_JS/_records/project.art`:
  - Resources → 8 packages: Bundler, Program, Validator, Bin, Dev Server, Language Server, Tools, Watcher.
- Verify `$ART_JS/_records/namespace.art` scope `@art-js` (created by plan `create-art-js-repository`).
- Verify `$ART_JS/_records/repository.art` (created by plan `create-art-js-repository`).
- Verify each moved package's `_records/package.art`:
  - Owner: `Project: Art JS` (already correct).
  - Canonical Name: `@art-js/{pkg}` (already correct).
  - Path: `libs/{pkg}/` or `cli/{pkg}/` (already correct).
- Verify each moved package's `_records/npm-deployment.art` Canonical Name `@art-js/{pkg}` (already correct).
- Verify each moved package's `package.json` `name` and `repository.url` (already `@art-js/*` and `art-js`).

**Dependencies:**

- Iteration: Move Placeholder Packages to Art JS.

#### Commits:

| ID                             | Repository / Checkout / Branch  | Policy   | Hash | Status     |
| ------------------------------ | ------------------------------- | -------- | ---- | ---------- |
| `update-art-js-project-record` | Art JS / `$ART_JS` / `building` | `MANUAL` |      | `AUTHORED` |

##### Commit: `update-art-js-project-record`

**Repository:** Art JS

**Message:**

```text
records(art-js): Update project record resources for migrated packages.
```

### Iteration: Update Art MD Records

**ID:** `update-art-md-records`

**Status:** `READY`

**Purpose:** Update the Art MD namespace and project records to the md core scope.

**Description:** Rename the repository and project record names to Art MD, update the namespace owner, and update the workspace repository record owner.

**Changes:**

- Update `$ART_MD/_records/repository.art`:
  - Record name: `## Repository: Art JS` → `## Repository: Art MD`.
  - Owner: `Project: Art JS` → `Project: Art MD`.
- Update `$ART_MD/_records/project.art`:
  - Record name: `## Project: Art JS` → `## Project: Art MD`.
  - Resources → 6 packages: Parser, Serializer, Constructs, Primitives, Spec, Pipeline Tests (add Spec — currently missing).
- Update `$ART_MD/_records/namespace.art`:
  - Owner: `Project: Art JS` → `Project: Art MD`.
- Update `$WORKSPACE/_records/repositories/art-md.art`:
  - Owner: `Project: Art JS` → `Project: Art MD`.

**Dependencies:**

- Iteration: Move Placeholder Packages to Art JS.

#### Commits:

| ID                               | Repository / Checkout / Branch    | Policy   | Hash | Status     |
| -------------------------------- | --------------------------------- | -------- | ---- | ---------- |
| `rename-art-md-records`          | Art MD / `$ART_MD` / `building`   | `MANUAL` |      | `AUTHORED` |
| `update-workspace-art-md-record` | Workspace / `$WORKSPACE` / `main` | `MANUAL` |      | `AUTHORED` |

##### Commit: `rename-art-md-records`

**Repository:** Art MD

**Message:**

```text
records(art-md): Rename repository and project records to Art MD scope.
```

##### Commit: `update-workspace-art-md-record`

**Repository:** Workspace

**Message:**

```text
records(workspace): Update art-md repository record owner.
```

### Iteration: Rename @art-js to @art-md for Staying Packages

**ID:** `rename-art-js-to-art-md-for-staying-packages`

**Status:** `READY`

**Purpose:** Rename the `@art-js` scope to `@art-md` for the packages staying in Art MD.

**Description:** Rename package.json `name`, `Canonical Name` in `_records/package.art` and `_records/npm-deployment.art`, and all `@art-js/*` references (imports, guides, READMEs, architecture) from `@art-js/*` to `@art-md/*` for the 6 packages staying in `$ART_MD`.

**Changes:**

- For each of the 6 staying packages (`libs/constructs`, `libs/parser`, `libs/primitives`, `libs/serializer`, `spec`, `cli/pipeline-tests`):
  - Update `package.json`:
    - `name`: `@art-js/{pkg}` → `@art-md/{pkg}`.
    - `repository.url`: `https://github.com/noodlestan/art-js` → `https://github.com/noodlestan/art-md`.
  - Update `_records/package.art`:
    - `Canonical Name`: `@art-js/{pkg}` → `@art-md/{pkg}`.
    - Owner: `Project: Art JS` → `Project: Art MD`.
    - Dependency refs: `@art-js/primitives`, `@art-js/constructs`, `@art-js/serializer` → `@art-md/*` (parser, serializer, constructs).
  - Update `_records/npm-deployment.art`:
    - `Canonical Name`: `@art-js/{pkg}` → `@art-md/{pkg}`.
  - Update `_guide.md`:
    - Intro: `@art-js/{pkg}` → `@art-md/{pkg}`.
  - Update `README.md`:
    - "Art-JS toolkit" → "Art MD" (constructs); "@artificials" → "Art MD" (parser, primitives, serializer, pipeline-tests).
- Update `src/**` imports `@art-js/*` → `@art-md/*` (52 files across parser, serializer, constructs, primitives).
- Update `architecture/*` references `@art-js/*` → `@art-md/*` (constructs, parser, primitives, serializer).
- Update `cli/pipeline-tests/scripts/**` imports `@art-js/parser`, `@art-js/primitives`, `@art-js/serializer` → `@art-md/*`.
- Update `spec/modules/validate/validate-module.art` reference `artificials/art-js/spec/...` → `artificials/art-md/spec/...`.

**Dependencies:**

- Iteration: Update Art MD Records.

#### Commits:

| ID                              | Repository / Checkout / Branch  | Policy   | Hash | Status     |
| ------------------------------- | ------------------------------- | -------- | ---- | ---------- |
| `rename-staying-packages-scope` | Art MD / `$ART_MD` / `building` | `MANUAL` |      | `AUTHORED` |

##### Commit: `rename-staying-packages-scope`

**Repository:** Art MD

**Message:**

```text
renames(art-md): Rename @art-js scope to @art-md for staying packages.
```

### Iteration: Update Knowledge Files

**ID:** `update-knowledge-files`

**Status:** `READY`

**Purpose:** Update README, `_guide.md`, and package.json descriptions in both repositories.

**Description:** Update the README, `$ART_MD/_guide.md`, `$ART_JS/_guide.md`, and package.json descriptions to match the new repository scopes.

**Changes:**

- Update `$ART_MD/README.md`:
  - Packages table → 6 md core packages with `@art-md` namespace.
  - Remove stale `cli/poc-parse` row.
- Update `$ART_MD/_guide.md`:
  - Projects table → 6 md core packages (Pipeline Test CLI, Constructs, Parser, Primitives, Serializer, Spec).
  - Remove moved packages (Bin, Dev Server, Watcher, Bundler, Program, Validator).
- Update `$ART_MD/package.json`:
  - `name`: `noodlestan/art-js` → `noodlestan/art-md`.
- Update `$ART_JS/README.md`:
  - Packages table → 8 packages with `@art-js` namespace.
- Update `$ART_JS/_guide.md`:
  - Projects table → 8 packages.
- Update `$ART_JS/package.json`:
  - `name`: `noodlestan/art-js` (verify).
  - `description`: Art JS scope.

**Dependencies:**

- Iteration: Rename @art-js to @art-md for Staying Packages.

#### Commits:

| ID                              | Repository / Checkout / Branch  | Policy   | Hash | Status     |
| ------------------------------- | ------------------------------- | -------- | ---- | ---------- |
| `update-art-md-knowledge-files` | Art MD / `$ART_MD` / `building` | `NOPUSH` |      | `AUTHORED` |
| `update-art-js-knowledge-files` | Art JS / `$ART_JS` / `building` | `NOPUSH` |      | `AUTHORED` |

##### Commit: `update-art-md-knowledge-files`

**Repository:** Art MD

**Message:**

```text
docs(art-md): Update README, guide, and package description to Art MD scope.
```

##### Commit: `update-art-js-knowledge-files`

**Repository:** Art JS

**Message:**

```text
docs(art-js): Update README, guide, and package description to Art JS scope.
```

---

## Work

### Next

Execute in a pairing ession.

### Blockers

- None.

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

**Instructions:** (From `$ART_MD/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

---

## Coordination

### Not In Scope

- **Implementing placeholder packages** — the extracted packages move as scaffolds; implementation is future work in Art JS.
- **Renaming the current repository to Art MD** — Covered by the sibling plan `plan-rename-repository-to-art-md`.
- **Creating the Art JS repository** — Covered by the sibling plan `plan-create-art-js-repository`.
- **Updating `_backlog/_architect.md`, `_roadmap/_architect.md`, and `architecture/*`** — still reference "Art JS"; tracked as follow-ups.

### Evidence

- None yet.

### Findings

- **Placeholder packages** — bundler, program, validator, bin, dev-server, language-server, tools, and watcher are scaffolds (dist, LICENSE, README only) with no real code.
- **Md core packages** — parser, serializer, constructs, primitives, spec, and pipeline-tests carry the real code and dependencies.
- **No package.json** — `cli/language-server` and `cli/tools` have no `package.json` (only `_records/` + `README.md`); placeholders have empty `devDependencies`.
- **Rename plan gaps** — the rename plan updated purpose/description fields but left record names `Repository: Art JS` and `Project: Art JS`, Owner `Project: Art JS`, and the workspace `art-md.art` Owner unchanged.
- **Stale README** — `$ART_MD/README.md` still lists `cli/poc-parse` (archived) and all 14 packages under `@art-js`.
- **Missing Spec in project record** — `$ART_MD/_records/project.art` Resources lists 5 packages, missing Spec.
- **Missing guide rows** — `$ART_MD/_guide.md` Projects table omits Language Server and Tools.
- **Package guides and READMEs** — all 6 staying packages reference `@art-js/{pkg}` in `_guide.md` intros; READMEs reference "Art-JS toolkit" or "@artificials".

### Decisions

- **Extract all placeholders** — all remaining placeholder packages move to the new Art JS repo; Art MD keeps the md core.
- **Rename scope in extract plan** — the `@art-js` → `@art-md` renames (package.json `name` + `Canonical Name`) happen only during this plan, not the rename plan.
- **Move with git history** — packages move with `git mv`/copy so history is preserved where possible.

### Knowledge to Update

- **README, `_guide.md`, `package.json`** — update in both `$ART_MD` and `$ART_JS` to the new scopes.
- **Package `_guide.md` and `README.md`** — update `@art-js` → `@art-md` in the 6 staying packages.

### Follow Ups

- **Update checkout records** after the extraction (`$WORKSPACE/_records/checkouts/art-md-@-building-checkout.art` still says "Checkout: Art JS @ building").
- **Update `_backlog/_architect.md` and `_roadmap/_architect.md`** — still reference "Art JS" in titles.
- **Update `architecture/*`** — repository-level architecture docs reference Art JS.

### Feedback

- None.
