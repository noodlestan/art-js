# Milestone: Extract From MD

**ID:** `milestone-extract-from-art-md`

**Status:** `PLANNING`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Separate Art MD (the art language) and Art JS (libraries for extracting, validating, and projecting art) so that knowledge, roadmaps, and backlogs can have a more focused scope.

**Description:** Renames the current Art JS repository to Art MD, extracts all remaining placeholder packages into a new Art JS repository, and updates the Artificials umbrella project and the Noodlestan website to reflect the new repository layout.

## Mandatory Reading

::READ `$DOMAINS/roadmaps/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

This section lists the path variables used throughout the Milestone file and its downstream work items. All file references in the Milestone and downstream work items MUST use these variables — never bare filesystem paths.

| Variable          | Resolved Path               | Purpose                               |
| ----------------- | --------------------------- | ------------------------------------- |
| `$WORKSPACE`      | Current working directory   | Workspace root directory.             |
| `$PROJECT`        | Provided with prompt        | Where work execution is taking place. |
| `$ART_MD`         | `checkouts/art-md-planning` | Repository: Art MD checkout.          |
| `$ARTIFICIALS`    | `checkouts/artificials`     | Repository: Artificials checkout.     |
| `$NOODLESTAN_WEB` | `checkouts/noodlestan-web`  | Repository: Noodlestan Web checkout.  |

## Summary

Rename the current Art JS repository to Art MD, extract all remaining placeholder packages (libs and cli) into a new Art JS repository, and update the Artificials umbrella project and the Noodlestan website, so that Art MD hosts only the md core packages and Art JS hosts the tooling placeholders.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Milestone.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Milestone.

| Kind        | Path                               | Role                                                      |
| ----------- | ---------------------------------- | --------------------------------------------------------- |
| Briefing    | `$ART_MD/_backlog/_architect.md`   | Art JS backlog briefing: approach and milestone sequence. |
| Briefing    | `$ART_MD/_roadmap/_architect.md`   | Art JS roadmap briefing: follow-ups and work sequence.    |
| Parking Lot | `$ART_MD/_roadmap/_parking-lot.md` | Roadmap WIP tracker: pending items and follow-ups.        |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Milestone.

- `write-milestone` — Writes this milestone. Required for Planning Work Item.
- `write-plan` — Writes the downstream plans. Required for Planning Work Item.
- `render-template` — Renders milestone and plan artefacts. Required for Drafting, Refining.

### Domains

This section lists all domains involved in the Milestone.

| Domain / Path                                         | Description                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md`         | Coordinates long-horizon work across projects by capturing milestones.    |
| Domain: Plans `$DOMAINS/plans/index.md`               | Structures high-level implementation plans with delegatable instructions. |
| Domain: Work `$DOMAINS/work/index.md`                 | Defines the abstract work-item model shared by planning domains.          |
| Domain: Repositories `$DOMAINS/repositories/index.md` | Represents project repositories registered with a workspace.              |
| Domain: Projects `$DOMAINS/projects/index.md`         | Represents projects owning repositories and packages.                     |
| Domain: Workspaces `$DOMAINS/workspaces/index.md`     | Represents the workspace and its checkouts.                               |

### Resource Kinds in Scope

This section lists the kinds of resources included in the work scope of the Milestone.

| Kind       | Domain       | Structure Record Path                             |
| ---------- | ------------ | ------------------------------------------------- |
| Repository | Repositories | `$DOMAINS/repositories/structures/repository.art` |
| Project    | Projects     | `$DOMAINS/projects/structures/project.art`        |

### Workflows

This section lists all workflows involved in the Milestone.

| Workflow / Path                                                      | Purpose                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Roadmapping `$DOMAINS/roadmaps/workflows/roadmapping/workflow.art`   | Organize roadmap creation and maintenance and coordination of downstream work items.    |
| Planning Work `$DOMAINS/work/workflows/planning-work/workflow.art`   | Create and manage work items lifecycle, collecting operational instructions.            |
| Executing Work `$DOMAINS/work/workflows/executing-work/workflow.art` | Organizes work execution in order to produce completed, verified outcomes and feedback. |

### Workflow Operations

This section lists all workflow operations involved in the Milestone.

| Workflow / Operation / Path                                                                                         | Purpose                                                       |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Planning Work / Planning Work Item `$DOMAINS/work/workflows/planning-work/planning-work-item/operation.art`         | Draft, refine, and validate work items.                       |
| Planning Work / Writing Commit Message `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art` | Write standardized commit messages.                           |
| Executing Work / Setting Up `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`                       | Prepare the execution environment.                            |
| Executing Work / Verifying Completion `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`   | Confirm the work item is completed and satisfies its outcome. |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ART_MD/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/_records/repositories/art-js.art` (Record) — Current repository record; renamed to Art MD by this milestone. Relevant for Planning Work Item.
::READ `$WORKSPACE/_records/repositories/artificials.art` (Record) — Umbrella repository record to consolidate. Relevant for Planning Work Item.
::READ `$WORKSPACE/_records/repositories/noodlestan-web.art` (Record) — Website repository record to update. Relevant for Planning Work Item.
::READ `$ART_MD/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.

## Scope

This section describes the working scope coordinated by the Milestone.

Changes in 4 repositories: the current Art JS repo is renamed to Art MD; a new Art JS repo is created and scaffolded; the placeholder libs and cli packages move from Art MD to Art JS; the Artificials umbrella and the Noodlestan website are updated to reflect the new layout.

### (Scope) Repository: Artificials

**Record:** `$ARTIFICIALS/_records/repository.art`

**Role:** Repo for the umbrella project coordinating the art projects; needs consolidation to list Art MD and Art JS.

**Partial:**

- `owner` — Project: Artificials
- `remote` — `git@github.com:noodlestan/artificials.git`

**Changes:**

- Consolidate the list of owned projects and repositories to include Art MD and Art JS.

**Dependencies:**

- None.

### (Scope) Repository: Art MD

**Record:** `$WORKSPACE/_records/repositories/art-js.art` (to be renamed)

**Role:** Created by this milestone by renaming the existing Art JS repository; hosts the md core packages (parser, serializer, constructs, primitives, spec, pipeline-tests).

**Partial:**

- `owner` — Project: Art MD (renamed from Project: Art JS)
- `remote` — `git@github.com:noodlestan/art-md.git` (already updated)

**Changes:**

- Update records at `$ART_MD/_records` rename repository, remote, adapt purposes and descriptions to new scope.
- Update knowledge: README, `_guide.md`, `package.json` description.
- Remove the placeholder packages extracted to Art JS.

**Operations:**

- Rename the git remote and repository.

**Dependencies:**

- None.

### (Scope) Repository: Art JS

**Record:** To be created at `$WORKSPACE/_records/repositories/art-js.art`

**Role:** Created and scaffolded by this milestone; receives the extracted placeholder packages.

**Partial:**

- `owner` — Project: Art JS
- `remote` — `git@github.com:noodlestan/art-js.git` (new)

**Changes:**

- Create the repository and scaffold the project skeleton.
- Create the records at `$PROJECT/_records` (project, repository, namespace) with purposes and descriptions adapted to new scope.
- Update knowledge: README, `_guide.md`, `package.json` description.
- Receive the extracted placeholder packages from Art MD.

**Dependencies:**

- Repository: Art MD — rename must complete before extraction.

### (Scope) Repository: Noodlestan Web

**Record:** `$WORKSPACE/_records/repositories/noodlestan-web.art`

**Role:** Website to update to reflect the new repository layout.

**Partial:**

- `owner` — Project: Noodlestan Web
- `remote` — `git@github.com:noodlestan/noodlestan-web.git`

**Changes:**

- Update website content referencing the Art JS / Art MD repositories.

**Dependencies:**

- Repository: Art JS — extraction must complete before the website update.

## Execution Context

Execution occurs from `$WORKSPACE/`; The new Art JS repository is created as a new checkout, and the Artificials and Noodlestan Web checkouts are updated in their own repositories.

---

## Phases

This section describes the ordered phases used to organise downstream work, identifying blocking dependencies across resources of different owners.

| Index | Name    | Status |
| ----- | ------- | ------ |
| 1     | Migrate | `DONE` |

### Phase: 1 — Migrate

**Goal:** Create the new Art JS repository and move the placeholder packages into it.

**Description:** Create and scaffold the new Art JS repository, then extract the placeholder libs and cli packages from Art MD into Art JS.

**Status:** `DONE`

**Dependencies:**

- None.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the milestone.

| Phase | Resource / Record                                                                                                            | Status |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1     | Plan: Create Art JS Repository `_backlog/1-done/plan-create-art-js-repository/plan.md`                                       | `DONE` |
| 1     | Plan: Extract Libs and CLI Placeholders to Art JS `_backlog/1-done/plan-extract-libs-and-cli-placeholders-to-art-js/plan.md` | `DONE` |

---

## Work

### Next

Plan the repository rename to Art MD (Phase 1).

### Blockers

None.

---

## Operating Instructions

### Setting Up

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

Run from the workspace root:

```bash
npm ci # to install workspace dependencies.
npm run art-work clone {repo.name} # to create a new checkout of a known repository.
npm run art-work branch {branch.name} {checkout.location} # to create a working branch.
```

### Verifying Completion

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

---

## Coordination

### Not In Scope

- **Implementing placeholder packages** — the extracted packages move as scaffolds; implementation is future work in Art JS.
- **Extracting the md core packages** — parser, serializer, constructs, primitives, spec, and pipeline-tests stay in Art MD.

### Evidence

- None yet.

### Findings

- **Placeholder packages** — bundler, program, validator, bin, dev-server, language-server, tools, and watcher are scaffolds (dist, LICENSE, README only) with no real code.
- **Md core packages** — parser, serializer, constructs, primitives, and pipeline-tests carry the real code and dependencies.

### Decisions

- **Extract all placeholders** — all remaining placeholder packages move to the new Art JS repo; Art MD keeps the md core.
- **Rename first** — the current repo is renamed to Art MD before extraction begins.
- **Repository vs Project** — the repository is the physical thing (purpose: to host and manage packages and planning artefacts); the project is the product (purpose: to serve its customers). Purpose states what something is for; description states what it is made of.

### Knowledge to Update

- Included in the plans.

### Follow Ups

- Update checkout records after the rename and extraction.

### Feedback

No sub-agent reports yet.
