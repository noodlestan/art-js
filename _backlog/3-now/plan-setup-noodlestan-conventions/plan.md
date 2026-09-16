# Plan: Setup Noodlestan Conventions

**Id:** `setup-noodlestan-conventions`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Install Noodlestan convention packages and configure the Art JS project guide to reference them.

**Description:** Add `@noodlestan/conventions-typescript` as a dev dependency and configure `_guide.md` to reference installed conventions. Setup only — auditing and applying convention rules is handled in downstream plans.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable       | Resolved Path                      | Purpose                                   |
| -------------- | ---------------------------------- | ----------------------------------------- |
| `$WORKSPACE`   | Current working directory          | Workspace root directory                  |
| `$PROJECT`     | Provided with prompt               | Repository root for all code changes      |
| `$CONVENTIONS` | `$WORKSPACE/checkouts/conventions` | Conventions source code and pilot project |

## Summary

Install Noodlestan convention packages in Art JS and configure the project guide to reference them, establishing the setup pattern for convention adoption.

## Context

### Upstream Work

| Kind      | Path                                                                      | Role                                                               |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md`                       | Defines this plan as part of phase 2 of the Consolidate milestone. |
| Plan      | `$CONVENTIONS/_backlog/6-plan/plan-pilot-project-adoption-art-js/plan.md` | Upstream pilot project adoption plan for Art JS.                   |

### Knowledge

- ::READ `$PROJECT/_guide.md` (Knowledge) — Project guide to update.
- ::READ `$PROJECT/package.json` (Knowledge) — Root package configuration.

## Scope

### Out of Scope

- Publishing or modifying convention packages themselves (handled in `$CONVENTIONS`).
- Adopting JSX or SolidJS conventions (Art JS does not use these technologies).

### Packages

- Package: Art JS Root — `$PROJECT/`

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                       | Status |
| ------------------------------------------------------------------------------ | ------ |
| Iteration: Install Convention Packages `./instructions/install-conventions.md` | `DONE` |
| Iteration: Configure Guides `./instructions/configure-guides.md`               | `DONE` |

### Iteration: Install Convention Packages

**Id:** `install-conventions`

**Status:** `DONE`

**Purpose:** Install `@noodlestan/conventions-typescript` as a dev dependency in Art JS.

**Description:** Add the `@noodlestan/conventions-typescript` package to the root `package.json` devDependencies, run `npm install` to verify installation, and ensure the package is available at `./node_modules/@noodlestan/conventions-typescript/`.

**Instructions:** `./instructions/install-conventions.md`

**Changes:**

- Add `@noodlestan/conventions-typescript` to `$PROJECT/package.json` devDependencies.
- Run `npm install` to verify installation.

**Dependencies:**

None.

#### Commits:

| ID                    | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| --------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `install-conventions` | $PROJECT / `main`              | `AUTONOMOUS` | `aeb8a32` | `COMMITTED` |

##### Commit: `install-conventions`

**Repository:** Art JS

**Message:**

```
configs(art-js): Install @noodlestan/conventions-typescript

- Add `@noodlestan/conventions-typescript` to devDependencies
```

### Iteration: Configure Guides

**Id:** `configure-guides`

**Status:** `DONE`

**Purpose:** Configure Art JS `_guide.md` to reference installed Noodlestan conventions.

**Description:** Update `$PROJECT/_guide.md` to include a conventions reference section that points to the installed `@noodlestan/conventions-typescript` index, explaining how agents should read and apply convention rules.

**Instructions:** `./instructions/configure-guides.md`

**Changes:**

- Add `## Conventions` section to `$PROJECT/_guide.md` referencing `./node_modules/@noodlestan/conventions-typescript/art/index.md`.
- Explain how to read and apply convention rules from the installed packages.

**Dependencies:**

- Iteration: Install Convention Packages

#### Commits:

| ID                 | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------ | ------------------------------ | ------------ | --------- | ----------- |
| `configure-guides` | $PROJECT / `main`              | `AUTONOMOUS` | `eaae335` | `COMMITTED` |

##### Commit: `configure-guides`

**Repository:** Art JS

**Message:**

```
guides(art-js): Reference Noodlestan conventions in project guide

- Add Conventions section to `_guide.md`
- Reference `@noodlestan/conventions-typescript` index
```

## Work

### Next

All iterations delegated and integrated.

### Blockers

None.

## Coordination

### Not In Scope

- Modifying convention packages.
- Adopting JSX or SolidJS conventions.

### Evidence

- `@noodlestan/conventions-typescript` installed in `node_modules`.
- `_guide.md` references convention indexes.

### Decisions

- Adopt only TypeScript conventions initially; JSX and SolidJS are not applicable to Art JS.

### Follow Ups

- Evaluate additional convention packages as the project evolves.
