# Plan: Create Knowledge Resources

**Id:** `create-knowledge-resources`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Seed the art-js repository architecture documentation: ecosystem overview, component index, lib and cli package overviews, and update knowledge references in the guide.

**Description:** Create `architecture/components.md` (major components), `architecture/lib/index.md` (libs: responsibilities, dependencies, build, distribution, test strategy), `architecture/cli/index.md` (clis: same). Update `architecture/index.md` to index the sub-indexes. Update `_guide.md` knowledge references. The existing `architecture/art-md-fixture-tests.md` and `architecture/art-md-roundtrip.md` (from the previous plan) remain as-is.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |
| `$ARCH`      | `$PROJECT/architecture/`  | Repo-level architecture directory    |

## Summary

Seed the art-js repository architecture documentation: ecosystem overview, component index, and knowledge references in the guide. Architecture documents convey knowledge beyond facts — interpretation, patterns, and decisions — written as prose grouped by role, not flat fact tables.

## Context

### Upstream Work

| Kind      | Path                                                     | Role                                                                                                  |
| --------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Milestone | `_backlog/3-now/milestone-md-art-roundtrip/milestone.md` | Defines this plan as phase 7; "Documentation to produce" section lists the architecture docs to seed. |
| Briefing  | `_backlog/_architect.md`                                 | Approach (POC-first, schema-first in TS, mdast substrate) and milestone sequence.                     |

### Knowledge

- ::READ `architecture/index.md` (Knowledge) — Current repo-level architecture index (already has fixture-tests and roundtrip).
- ::READ `libs/parser/architecture/parser.md` (Knowledge) — Parser design principles (layered architecture, context, detection patterns).
- ::READ `architecture/art-md-roundtrip.md` (Knowledge) — Roundtrip pipeline architecture.
- ::READ `architecture/art-md-fixture-tests.md` (Knowledge) — Roundtrip pipeline testing.

## Scope

### Out of Scope

- Out of scope: ADR migration from root to `libs/parser/` — already done (`libs/parser/architecture/` exists with `index.md` and `parser.md`).
- Out of scope: detailed per-package architecture (deferred to future plans).

### Packages

- Package: Artificial Parser — `@art-js/parser`; located at `$PROJECT/libs/parser/`.
- Package: Artificial Serializer — `@art-js/serializer`; located at `$PROJECT/libs/serializer/`.
- Package: Artificial Constructs — `@art-js/constructs`; located at `$PROJECT/libs/constructs/`.
- Package: Artificial Primitives — `@art-js/primitives`; located at `$PROJECT/libs/primitives/`.
- Package: Artificial Bundler — `@art-js/bundler`; located at `$PROJECT/libs/bundler/`.
- Package: Artificial Program — `@art-js/program`; located at `$PROJECT/libs/program/`.
- Package: Artificial Validator — `@art-js/validator`; located at `$PROJECT/libs/validator/`.
- Package: Bin — `@art-js/bin`; located at `$PROJECT/cli/bin/`.
- Package: Pipeline Test CLI — `@art-js/pipeline-test-cli`; located at `$PROJECT/cli/pipeline-tests/`.
- Package: Dev Server — `@art-js/dev-server`; located at `$PROJECT/cli/dev-server/`.
- Package: Language Server — `@art-js/language-server`; located at `$PROJECT/cli/language-server/`.
- Package: Watcher — `@art-js/watcher`; located at `$PROJECT/cli/watcher/`.
- Package: Tools — `@art-js/tools`; located at `$PROJECT/cli/tools/`.

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                                                                         | Status  |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Iteration: Seed Architecture Index And Components Doc `./plan-create-knowledge-resources/instructions/seed-architecture-index-and-components.md` | `READY` |
| Iteration: Write Ecosystem Overview `./plan-create-knowledge-resources/instructions/write-ecosystem-overview.md`                                 | `READY` |
| Iteration: Update Knowledge References `./plan-create-knowledge-resources/instructions/update-knowledge-references.md`                           | `READY` |

### Iteration: Seed Architecture Index And Components Doc

**Id:** `seed-architecture-index-and-components`

**Status:** `READY`

**Purpose:** Create the repo-level architecture components document and update the architecture index to include lib and cli sub-indexes.

**Description:** Create `$ARCH/components.md` listing the major components of the art-js ecosystem (parser, serializer, constructs, primitives, bundler, program, validator, bin, pipeline-tests, dev-server, language-server, watcher, tools). Update `$ARCH/index.md` to add the components document and the two sub-indexes (lib, cli) as links.

**Instructions:** `./plan-create-knowledge-resources/instructions/seed-architecture-index-and-components.md`

**Changes:**

- Create `$ARCH/components.md` listing the major components of the art-js ecosystem.
- Update `$ARCH/index.md` to add components.md, lib/index.md, and cli/index.md as links.

**Dependencies:**

None.

#### Commits:

| ID                                       | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ---------------------------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `seed-architecture-index-and-components` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `seed-architecture-index-and-components`

**Repository:** Art JS

**Message:**

```
knowledge(art-js): Seed architecture index and components.
```

### Iteration: Write Ecosystem Overview

**Id:** `write-ecosystem-overview`

**Status:** `READY`

**Purpose:** Write the art-js ecosystem overview as prose, conveying knowledge beyond facts: how the packages fit together, their roles, patterns, and decisions — not a flat table of package metadata.

**Description:** Write `$ARCH/overview.md` (or fold into `$ARCH/index.md`) as prose, grouping packages by their role in the ecosystem rather than by cli/lib. No tables, no cli/lib separation. Each package is described by its role and how it participates in the ecosystem, in a sentence or two.

**Instructions:** `./plan-create-knowledge-resources/instructions/write-ecosystem-overview.md`

**Changes:**

- Write a prose ecosystem overview for `$ARCH`, grouping packages by role (supporting, roundtrip, planned) rather than cli/lib.
- No tables — use prose and grouped lists.

**Notes:**

- Architecture documents convey knowledge beyond facts: interpretation, patterns, and decisions. Do NOT produce flat fact tables of package metadata.
- No cli/lib separation — group by role in the ecosystem.
- Some `cli/` packages are only scaffolded (e.g. `dev-server`, `language-server`, `watcher`, `tools`). If a package's role is not obvious, list it under "Planned Packages" without speculative prose about what it may become.
- Example structure:

  ```md
  ## Supporting Packages

  - `@art-js/primitives` — {role}

  ## Md-Art-Md Roundtrip

  {description}

  - `@art-js/constructs` — {role}
  - `@art-js/parser` — {role}
  - `@art-js/serializer` — {role}

  ## Planned Packages

  - ...
  ```

**Dependencies:**

None.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| -------------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `write-ecosystem-overview` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `write-ecosystem-overview`

**Repository:** Art JS

**Message:**

```
knowledge(art-js): Write ecosystem overview.
```

### Iteration: Update Knowledge References

**Id:** `update-knowledge-references`

**Status:** `READY`

**Purpose:** Update `_guide.md` knowledge references to include the new architecture documents. \_guide includes only indexes with terse description of what they index.

**Description:** Update `_guide.md` to add `architecture/lib/index.md` and `architecture/cli/index.md` to the knowledge references section.

**Instructions:** `./plan-create-knowledge-resources/instructions/update-knowledge-references.md`

**Changes:**

- Update `_guide.md` knowledge references to include lib and cli architecture indexes.

**Dependencies:**

None.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ----------------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `update-knowledge-references` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `update-knowledge-references`

**Repository:** Art JS

**Message:**

```
docs(art-js): Update knowledge references.
```

## Work

### Next

Write instructions for the `PLANNING` iterations to make them `READY` for delegation.

### Blockers

None.

## Coordination

### Not In Scope

- **ADR migration** — Already done (`libs/parser/architecture/` exists).
- **Detailed per-package architecture** — Deferred to future plans.

### Evidence

- `libs/parser/architecture/` exists with `index.md` and `parser.md`.
- `architecture/art-md-fixture-tests.md` and `architecture/art-md-roundtrip.md` exist (from previous plan).

### Decisions

- **Prose, not tables** — Architecture docs convey knowledge beyond facts; no flat fact tables.
- **Group by role, not cli/lib** — Packages are grouped by their ecosystem role (supporting, roundtrip, planned).
- **Three iterations** — Seed index + components, write ecosystem overview, update references. Each is a separate commit.

### Follow Ups

None.
