# Plan: Design Lib Records

**ID:** `design-lib-records`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a comprehensive design of the records library API ahead of implementation.

**Description:** Design the `@art-js/records` packages and other required primitives (source, transport, structure), the extraction and presence-assertion API, write-back API with an optional content-modified guard, and `ProxyObject`-based transparent field access. Define how records map to and from `@art-js/constructs` data shapes and how downstream consumers (`$ART_LIB` FS records adapter and `$ART_WORK` CLI) adopt the abstractions.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$ART_LIB/_backlog/4-next/add-fs-records-adapter/plan.md` (Plan) — `$ART_LIB` provider plan defining FS-backed concrete extensions of the abstractions designed here.

::READ `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md` (Plan) — `$ART_WORK` consumer plan showing real consumption patterns for the abstractions designed here.

---

## Path Variables

| Variable     | Resolved Path                            | Purpose                                           |
| ------------ | ---------------------------------------- | ------------------------------------------------- |
| `$WORKSPACE` | Current working directory                | Workspace root directory                          |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains`             | Domain resources directory                        |
| `$ART_JS`    | `$WORKSPACE/checkouts/art-js-planning`   | Art JS planning repository — this plan lives here |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-planning`  | Art Lib repository — downstream provider          |
| `$ART_WORK`  | `$WORKSPACE/checkouts/art-work-planning` | Art Work repository — downstream consumer         |

## Summary

Design the `@art-js/records` package API, including abstract record primitives (source, DTO, structure), record extraction/presence assertion, write-back with content-modified guard, and ProxyObject field access. Ground the design in downstream `$ART_LIB` (FS-backed adapter) and `$ART_WORK` (CLI) use cases. Produce type signatures, module layout, and iteration instructions ready for delegation to the implementation plan `plan-create-lib-records`.

## Context

### Upstream Work

| Kind                  | Path                                                       | Role                                                            |
| --------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| Parking Lot           | `$ART_JS/_backlog/_parking-lot.md`                         | Tracks short-term actionables, pending questions, and blockers. |
| Architecture Briefing | `$ART_JS/_roadmap/_architect.md`                           | Art JS principles, NFRs, milestones.                            |
| Milestone             | `$ART_JS/_roadmap/3-now/milestone-art-js-one/milestone.md` | Coordinates this plan within the Art JS One milestone.          |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_JS/architecture/components.md` — Modular pipeline for parsing and serialising a markdown dialect (Art-MD). Components are organised into core libraries (`libs/`) and CLI tools (`cli/`).

::READ `$ART_JS/architecture/overview.md` — Supporting Packages, Md-Art-Md Roundtrip,

## Scope

Design the `@art-js/codec`, `@art-js/source`, and `@art-js/records` packages in `$ART_JS`.

The design covers:

1. Abstract content and document sources.
2. Parser and serializer aggregated in a configured codec.
3. Records

## Execution Context

Design work is performed in `$ART_JS`. The resulting types and API will be implemented in `$ART_JS/libs/records/`. Downstream adoption occurs in `$ART_LIB/libs/fs-records/` and `$ART_WORK/cli/work/src/`.

---

## Items:

| Iteration / Instructions          | Status     |
| --------------------------------- | ---------- |
| Iteration: Design Lib Records API | `PLANNING` |
| Iteration: Update Knowledge       | `PLANNING` |

### Iteration: Design Lib Records API

**ID:** `design-lib-records-api`

**Status:** `PLANNING`

**Purpose:** Design the API in an attachment document.

**Changes:**

Create attachment file `./plan__design.md`.

#### Commits:

| ID                       | Repository / Checkout / Branch  | Policy       | Hash | Status     |
| ------------------------ | ------------------------------- | ------------ | ---- | ---------- |
| `design-lib-records-api` | Art JS / `$ART_JS` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `design-lib-records-api`

**Message:**

```text
plan(art-records): API design for @art-js/codec, @art-js/source, and @art-js/records.
```

### Iteration: Update Knowledge

**ID:** `update-knowledge`

**Status:** `PLANNING`

**Purpose:** Update knowledge files to accomodate the growing package structure.

**Changes:**

- `$ART_JS/architecture/components.md` - Add the new components and their responsibility.
- `$ART_JS/architecture/overview.md` - replace `### Where the Ecosystem Is Glued Together` with `### Code Entry Point`; add `## Sources` - describe in `### Source Abstractions` and `### FS Adapter Implementation`

- None.

#### Commits:

| ID                    | Repository / Checkout / Branch  | Policy       | Hash | Status     |
| --------------------- | ------------------------------- | ------------ | ---- | ---------- |
| `design-proxy-object` | Art JS / `$ART_JS` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `design-proxy-object`

**Message:**

```text
feat(records): Design ProxyObject transparent field access.
```

---

## Work

### Next

Draft instructions for Iteration: Define Core Record Primitives.

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

- **Implementation of packages** — Covered by the sibling plan `plan-create-lib-records`, `plan-create-lib-records`, `plan-create-lib-records`.
- **FS-specific discovery logic** — Belongs in `$ART_LIB` plan `add-fs-records-adapter`.
- **CLI command implementation** — Belongs in `$ART_WORK` plan `plan-art-work-cli-global-install`.

### Evidence

- **Type signatures reviewed** against `$ART_LIB` and `$ART_WORK`.

### Findings

- **ArtRecord coincides with SectionBlock** — Both have `kind` and `name`. The bridge layer (`construct-bridge.ts`) will map `SectionBlock` → `ArtRecord` by extracting these fields.

### Decisions

- **ProxyObject delegates unknown properties to FieldResolver** — Properties defined on `T` (`kind`, `name`) are returned from the record identity; all other accesses go through `resolveField`.

### Knowledge to Update

- None.

### Follow Ups

- **Downstream adoption in `$ART_LIB`** — Update `add-fs-records-adapter` to import from `@art-js/records` once published.
- **Downstream adoption in `$ART_WORK`** — Update `plan-art-work-cli-global-install` to use `@art-js/records` types in `WorkspaceContext` and record loaders.

### Feedback

- None.
