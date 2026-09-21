# Plan: Create Art JS Repository

**ID:** `create-art-js-repository`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Create and scaffold the new Art JS repository.

**Description:** Create the repository, scaffold the project skeleton, and create project, repository, namespace, and package records.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path               | Purpose                                        |
| ------------ | --------------------------- | ---------------------------------------------- |
| `$WORKSPACE` | Current working directory   | Workspace root directory                       |
| `$PROJECT`   | `checkouts/art-js-planning` | Current checkout for planning only             |
| `$ART_JS`    | `checkouts/art-js-building` | Repository: Art JS checkout (to be re-created) |

## Summary

Create and scaffold the new Art JS repository, create its project, repository, and namespace records, and register it in the workspace repository records.

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
::READ `$ART_JS/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.

## Scope

Create and scaffold the new Art JS repository: create the repository and checkout, scaffold the project skeleton, create project, repository, and namespace records, and register the repository in the workspace records.

### (Scope) Repository: Art JS

**Record:** To be created at `$WORKSPACE/_records/repositories/art-js.art`

**Role:** — Created and scaffolded by this plan; receives the extracted placeholder packages.

**Partial:**

- `owner` — Project: Art JS
- `remote` — `git@github.com:noodlestan/art-js.git` (new)

**Changes:**

- Create the repository and scaffold the project skeleton.
- Create the records at `$ART_JS/_records` (project, repository, namespace).
- Update knowledge: README, `_guide.md`, `package.json` description.

**Dependencies:**

- None.

### (Scope) Repository: Workspace

**Record:** `$WORKSPACE/_records/repositories/art-js.art`

**Role:** — Workspace repository record to create for the new Art JS repository.

**Changes:**

- Create `$WORKSPACE/_records/repositories/art-js.art` to Repository: Art JS.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; the new Art JS repository is created as a new checkout `$ART_JS` (checkout `checkouts/art-js-building`), and the workspace repository record is created in `$WORKSPACE/_records/repositories/`.

---

## Items:

| Iteration / Instructions                                                                                   | Status |
| ---------------------------------------------------------------------------------------------------------- | ------ |
| Iteration: Create Art JS Repository and Checkout `./instructions/create-art-js-repository-and-checkout.md` | `DONE` |
| Iteration: Scaffold Project Skeleton `./instructions/scaffold-project-skeleton.md`                         | `DONE` |
| Iteration: Create Records at `$ART_JS/_records` `./instructions/create-records-at-art-js-records.md`       | `DONE` |
| Iteration: Create Workspace Repository Record `./instructions/create-workspace-repository-record.md`       | `DONE` |

### Iteration: Create Art JS Repository and Checkout

**ID:** `create-art-js-repository-and-checkout`

**Status:** `DONE`

**Purpose:** Create the new Art JS repository and its checkout.

**Description:** Create the Art JS repository and checkout at `$ART_JS`.

**Instructions:** `./instructions/create-art-js-repository-and-checkout.md`

**Changes:**

- Create the Art JS repository and checkout at `$ART_JS`.

**Dependencies:**

- None.

#### Commits:

| ID                                      | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| --------------------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `create-art-js-repository-and-checkout` | Art JS / `$ART_JS` / `main`    | `NOPUSH` | `91efd3a` | `COMMITTED` |

##### Commit: `create-art-js-repository-and-checkout`

**Message:**

```text
scaffold(art-js): Scaffold project skeleton.
```

> Combined with Iteration: Scaffold Project Skeleton into a single commit.

### Iteration: Scaffold Project Skeleton

**ID:** `scaffold-project-skeleton`

**Status:** `DONE`

**Purpose:** Scaffold the project skeleton in the new repository.

**Description:** Scaffold the project skeleton in `$ART_JS`.

**Instructions:** `./instructions/scaffold-project-skeleton.md`

**Changes:**

- Scaffold the project skeleton in `$ART_JS`.

**Dependencies:**

- Iteration: Create Art JS Repository and Checkout.

#### Commits:

| ID                          | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| --------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `scaffold-project-skeleton` | Art JS / `$ART_JS` / `main`    | `NOPUSH` | `91efd3a` | `COMMITTED` |

##### Commit: `scaffold-project-skeleton`

**Message:**

```text
scaffold(art-js): Scaffold project skeleton.
```

> Combined with Iteration: Create Art JS Repository and Checkout into a single commit.

### Iteration: Create Records at `$ART_JS/_records`

**ID:** `create-records-at-art-js-records`

**Status:** `DONE`

**Purpose:** Create the project, repository, and namespace records for Art JS.

**Description:** Create `$ART_JS/_records` (project, repository, namespace) with the Art JS purpose and description.

**Instructions:** `./instructions/create-records-at-art-js-records.md`

**Changes:**

- Create `$ART_JS/_records/project.art`:
  - **Project.purpose:** "Enable Art files to be authored as programs, with validation, language tooling, and automated projection to target formats."
  - **Project.description:** "Libraries and tools for working with Art MD as a programming language, including records, resources, modules, programs, program builders, validators, projectors, language services, and related tooling."
- Create `$ART_JS/_records/repository.art`:
  - **Repository.purpose:** "Host and manage the Art JS packages and tools, and their knowledge and planning artefacts."
  - **Repository.description:** "Monorepo containing the Art JS roadmap and backlogs, architecture knowledge, and library source code."
- Create `$ART_JS/_records/namespace.art` to Art JS.

**Dependencies:**

- Iteration: Scaffold Project Skeleton.

#### Commits:

| ID                                 | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ---------------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `create-records-at-art-js-records` | Art JS / `$ART_JS` / `main`    | `NOPUSH` | `5b5ca1b` | `COMMITTED` |

##### Commit: `create-records-at-art-js-records`

**Message:**

```text
records(art-js): Add project, repository, and all other records.
```

### Iteration: Create Workspace Repository Record

**ID:** `create-workspace-repository-record`

**Status:** `DONE`

**Purpose:** Register the new Art JS repository in the workspace records.

**Description:** Create `$WORKSPACE/_records/repositories/art-js.art` to Repository: Art JS.

**Instructions:** `./instructions/create-workspace-repository-record.md`

**Changes:**

- Create `$WORKSPACE/_records/repositories/art-js.art` to Repository: Art JS.

**Dependencies:**

- Iteration: Create Records at `$ART_JS/_records`.

#### Commits:

| ID                                   | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ------------------------------------ | --------------------------------- | -------- | --------- | ----------- |
| `create-workspace-repository-record` | Workspace / `$WORKSPACE` / `main` | `NOPUSH` | `d31c0d7` | `COMMITTED` |

##### Commit: `create-workspace-repository-record`

**Message:**

```text
records(workspace): Add art-js repository record.
```

---

## Work

### Next

All iterations complete.

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

**Instructions:** (From `$ART_JS/_guide.md`)

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

- **Extracting placeholder packages** — Covered by the sibling plan `plan-extract-libs-and-cli-placeholders-to-art-js`.
- **Renaming the current repository to Art MD** — Covered by the sibling plan `plan-rename-repository-to-art-md`.

### Evidence

- `scaffold(art-js): Scaffold project skeleton.` — `91efd3a`
- `records(art-js): Add project, repository, and all other records.` — `5b5ca1b`
- `records(workspace): Add art-js repository record.` — `d31c0d7`

### Findings

- **Placeholder packages move here** — bundler, program, validator, bin, dev-server, language-server, tools, and watcher are scaffolds (dist, LICENSE, README only) with no real code.
- **Iterations 1 and 2 combined** — repository creation and scaffold were committed together in a single `scaffold` commit.
- **Branch is `main`** — the Art JS repository was created on `main`, not `building`.

### Decisions

- **Extract all placeholders** — all remaining placeholder packages move to the new Art JS repo; Art MD keeps the md core.
- **Repository vs Project** — the repository is the physical thing (purpose: to host and manage packages and planning artefacts); the project is the product (purpose: to serve its customers).

### Knowledge to Update

- **README, `_guide.md`, `package.json`** — create to Art JS scope.

### Follow Ups

- **Update checkout records** after the repository is created.

### Feedback

- None.
