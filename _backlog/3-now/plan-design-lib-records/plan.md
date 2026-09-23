# Plan: Design Lib Records

**ID:** `design-lib-records`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a comprehensive design of the records library API ahead of implementation.

**Description:** Design the `@art-js/records` package API: the record model wrapping `SectionBlock`, the extraction and presence-assertion API, write-back API with an optional content-modified guard, and `ProxyObject`-based transparent field access. Define how records map to and from `@art-js/constructs` data shapes and how downstream consumers (`$ART_LIB` FS records adapter and `$ART_WORK` CLI) adopt the abstractions.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$ART_LIB/_backlog/4-next/add-fs-records-adapter/plan.md` (Plan) — `$ART_LIB` provider plan defining FS-backed concrete extensions of the abstractions designed here.

::READ `$ART_WORK/_backlog/4-next/plan-art-work-cli-global-install/plan.md` (Plan) — `$ART_WORK` consumer plan showing real consumption patterns for the abstractions designed here.

---

## Path Variables

| Variable     | Resolved Path                            | Purpose                                                   |
| ------------ | ---------------------------------------- | --------------------------------------------------------- |
| `$WORKSPACE` | Current working directory                | Workspace root directory                                  |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains`             | Domain resources directory                                |
| `$PROJECT`   | Provided with prompt                     | Where work execution is taking place.                     |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-planning`  | Art Lib repository — downstream provider                  |
| `$ART_WORK`  | `$WORKSPACE/checkouts/art-work-planning` | Art Work repository — downstream consumer                 |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md-planning`   | Art MD repository — codec and source contracts (upstream) |

## Summary

Design the `@art-js/records` package API, including abstract record primitives (source, DTO, structure), record extraction/presence assertion, write-back with content-modified guard, and ProxyObject field access. Ground the design in downstream `$ART_LIB` (FS-backed adapter) and `$ART_WORK` (CLI) use cases. Produce type signatures, module layout, and iteration instructions ready for delegation to the implementation plan `plan-create-lib-records`.

### New Package: Records

**Canonical Name:** `@art-js/records`

**Purpose:** Provide record identity, locating, extraction, update and serialisation for Art records.

**Description:** Record modelling extracted from `SectionBlock` and `Field` constructs. Extraction and presence-assertion API, write-back with positioning anchors and an optional content-hash guard, and optional `ProxyObject`-based transparent field access. Primary types: `ArtRecord`, `ArtRecordCapsule`, `Records`.

### Summary of Changes

| File                                  | Change                                                                                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$PROJECT/architecture/records.md`    | **Created** — high-level architecture doc: role in the ecosystem, responsibilities, principles used (with the goal in mind), and dependencies with other packages. No filesystem layout diagram.        |
| `$PROJECT/architecture/components.md` | **Updated** — move `### Records (@art-js/records)` from `## Planned Packages` to `## Core Libraries (libs/)` with `**Status:** SCAFFOLD`; remove the duplicate `### Records (@art-js/modules)` section. |
| `./plan__design.md`                   | **Updated** — full spec of the `@art-js/records` package: layout, files to create with types and factories.                                                                                             |

## Context

### Upstream Work

| Kind                  | Path                                                          | Role                                                                         |
| --------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Parking Lot           | `$PROJECT/_backlog/_parking-lot.md`                           | Tracks short-term actionables, pending questions, and blockers.              |
| Architecture Briefing | `$PROJECT/_roadmap/_architect.md`                             | Art JS principles, NFRs, milestones.                                         |
| Milestone             | `$PROJECT/_roadmap/4-next/milestone-art-records/milestone.md` | Coordinates this plan within the Art Records milestone.                      |
| Milestone             | `$ART_MD/_roadmap/3-now/milestone-art-codec/milestone.md`     | Upstream codec and source contracts (`@art-md/primitives`, `@art-md/codec`). |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$PROJECT/architecture/components.md` — Modular pipeline for parsing and serialising a markdown dialect (Art-MD). Components are organised into core libraries (`libs/`) and CLI tools (`cli/`).

::READ `$PROJECT/architecture/index.md` — Architecture document index.

::READ `$ART_MD/architecture/codec.md` — Codec and source contracts: `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, operation contexts, and dependency direction.

## Scope

Design the `@art-js/records` package in `$PROJECT`.

The design covers:

1. Record model wrapping `SectionBlock` — `ArtRecord` identity (`kind`, `name`), `ArtRecordCapsule` transporting record identity and its `ArtDocumentSource`.
2. Extraction and presence-assertion API — assert records in content and extract them with fields, examples, etc.
3. Write-back with positioning anchors and an optional content-hash guard.
4. Optional `ProxyObject`-based transparent field access.

The codec and source contracts (`ArtCodec`, `ArtContentSource`, `ArtDocumentSource`) are declared in `@art-md/primitives` and implemented in `@art-md/codec` upstream in `$ART_MD` by `Milestone: Art Codec` at `$ART_MD/_roadmap/3-now/milestone-art-codec/milestone.md`. No new `@art-md/source` package is created.

## Execution Context

Design work is performed in `$PROJECT`. The resulting types and API will be implemented in `$PROJECT/libs/records/`. Downstream adoption occurs in `$ART_LIB/libs/fs-records/` and `$ART_WORK/cli/work/src/`.

---

## Unit Tests

Unit tests to create in `$PROJECT/libs/records/`:

- `src/record/` — `ArtRecord` identity: `kind` and `name` present; bridge mapping from `SectionBlock` extracts `kind`/`name`.
- `src/capsule/` — `ArtRecordCapsule`: exposes identity via `_id` before source hydration; exposes the record via `_maybeRecord`/`raw()` after hydration; `_source` is the `ArtDocumentSource`.
- `src/extract/` — presence assertion returns true/false for records present/absent in content; extraction returns capsules with fields and examples.
- `src/write-back/` — write-back lands at the positioning anchors; content-hash guard: safe write refuses when content changed, unsafe write proceeds.
- `src/proxy/` — `ProxyObject`: `kind`/`name` returned from record identity; unknown fields resolve through `FieldResolver`; setters route to `field.value` and track `field.modifiedValue`.

---

## Items:

| Iteration / Instructions          | Status  |
| --------------------------------- | ------- |
| Iteration: Design Lib Records API | `READY` |
| Iteration: Scaffold Lib Records   | `READY` |

### Iteration: Design Lib Records API

**ID:** `design-lib-records-api`

**Status:** `READY`

**Purpose:** Produce the records architecture knowledge and the full package spec.

**Changes:**

- Create `$PROJECT/architecture/records.md` — high-level purpose (role in the ecosystem), responsibilities, principles used (with the goal in mind), and dependencies with other packages. No filesystem layout diagram.
- Update `$PROJECT/architecture/components.md` — move `### Records (@art-js/records)` from `## Planned Packages` to `## Core Libraries (libs/)` with `**Status:** SCAFFOLD`; remove the duplicate `### Records (@art-js/modules)` section.
- Update `./plan__design.md` — full spec of the `@art-js/records` package: layout, files to create with types and factories.

#### Commits:

| ID                       | Repository / Checkout / Branch   | Policy       | Hash | Status     |
| ------------------------ | -------------------------------- | ------------ | ---- | ---------- |
| `design-lib-records-api` | Art JS / `$PROJECT` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `design-lib-records-api`

**Message:**

```text
knowledge(art-js): records API spec and components update.
```

### Iteration: Scaffold Lib Records

**ID:** `scaffold-lib-records`

**Status:** `READY`

**Purpose:** Scaffold the `@art-js/records` package skeleton and register it in the project records and knowledge.

**Changes:**

- Create `$PROJECT/libs/records/` package skeleton:
  - `_guide.md`, `_records/package.art`, `_records/npm-deployment.art`
  - `.npmignore`, `.prettierignore`, `LICENSE-MIT`, `package.json`, `README.md`
  - `src/index.ts`, `tsconfig.json`, `tsconfig.vite.json`, `vite.config.ts`, `vitest.config.ts`
- Update `$PROJECT/_records/project.art` — add `Package: Records` to Resources.
- Update `$PROJECT/README.md` — add `@art-js/records` row to the Packages table.
- Update `$PROJECT/_guide.md` — add Records to the Projects table.

#### Commits:

| ID                     | Repository / Checkout / Branch   | Policy       | Hash | Status     |
| ---------------------- | -------------------------------- | ------------ | ---- | ---------- |
| `scaffold-lib-records` | Art JS / `$PROJECT` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `scaffold-lib-records`

**Message:**

```text
scaffold(records): create @art-js/records package skeleton.
```

---

## Work

### Next

Delegate Iteration: Design Lib Records API and Iteration: Scaffold Lib Records.

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

**Instructions:** (From `$PROJECT/_guide.md`)

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

- **Implementation of packages** — Covered by the sibling plan `plan-create-lib-records`.
- **Codec and source contracts** — Declared in `@art-md/primitives` and implemented in `@art-md/codec` in `$ART_MD` by `Milestone: Art Codec`.
- **FS-specific discovery logic** — Belongs in `$ART_LIB` plan `add-fs-records-adapter`.
- **CLI command implementation** — Belongs in `$ART_WORK` plan `plan-art-work-cli-global-install`.

### Evidence

- **Type signatures reviewed** against `$ART_LIB` and `$ART_WORK`.

### Findings

- **ArtRecord coincides with SectionBlock** — Both have `kind` and `name`. The bridge layer (`construct-bridge.ts`) will map `SectionBlock` → `ArtRecord` by extracting these fields.

### Decisions

- **ProxyObject delegates unknown properties to FieldResolver** — Properties defined on `T` (`kind`, `name`) are returned from the record identity; all other accesses go through `resolveField`.

### Knowledge to Update

- **`$PROJECT/architecture/records.md`** — create as the records architecture doc (Design iteration).
- **`$PROJECT/architecture/components.md`** — move Records to Core Libraries with SCAFFOLD (Design iteration).

### Follow Ups

- **Downstream adoption in `$ART_LIB`** — Update `add-fs-records-adapter` to import from `@art-js/records` once published.
- **Downstream adoption in `$ART_WORK`** — Update `plan-art-work-cli-global-install` to use `@art-js/records` types in `WorkspaceContext` and record loaders.

### Feedback

- None.
