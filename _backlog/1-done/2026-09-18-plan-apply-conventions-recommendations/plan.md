# Plan: Apply Conventions Recommendations

**Id:** `apply-conventions-recommendations`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Apply the convention fixes recommended in the per-package adoption reports and consolidate process insights.

**Description:** Load each package's adoption report produced by the audit plan, apply the recommended changes to the package source code, commit one package at a time, and consolidate the adoption process insights for the conventions repo.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable       | Resolved Path                      | Purpose                                 |
| -------------- | ---------------------------------- | --------------------------------------- |
| `$WORKSPACE`   | Current working directory          | Workspace root directory                |
| `$PROJECT`     | `checkouts/art-js-planning`        | Art JS repository root for code changes |
| `$CONVENTIONS` | `$WORKSPACE/checkouts/conventions` | Conventions source code and audit skill |

## Summary

Apply convention fixes recommended by the per-package adoption audits, one commit per package, and consolidate process insights for the conventions repo.

## Context

### Upstream Work

| Kind      | Path                                                                      | Role                                                               |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-consolidate/milestone.md`              | Defines this plan as part of phase 2 of the Consolidate milestone. |
| Plan      | `$PROJECT/_backlog/3-now/plan-audit-conventions-adoption/plan.md`         | Produces the per-package adoption reports (prerequisite).          |
| Plan      | `$CONVENTIONS/_backlog/6-plan/plan-pilot-project-adoption-art-js/plan.md` | Upstream pilot project adoption plan for Art JS.                   |

### Required Skills

- `audit-conventions` — Audit convention setup and adoption across packages. Required for Auditing.

### Knowledge

- ::READ `.agents/skills/audit-conventions/SKILL.md` (Skill) — Audit Conventions skill with Setup and Adoption commands.
- ::READ `.agents/domains/conventions/index.md` (Knowledge) — Conventions domain index.

## Scope

### Out of Scope

- Installing convention packages (handled in plan-setup-noodlestan-conventions).
- Auditing conventions setup and adoption (handled in plan-audit-conventions-adoption).

### Packages

- Package: Artificial Primitives — `$PROJECT/libs/primitives/`
- Package: Artificial Constructs — `$PROJECT/libs/constructs/`
- Package: Artificial Parser — `$PROJECT/libs/parser/`
- Package: Artificial Serializer — `$PROJECT/libs/serializer/`

### Deployments

None.

## Attachments

- `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/adoption-process-insights.md` (Report) — Process insights and recommendations.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                                       | Status |
| -------------------------------------------------------------------------------------------------------------- | ------ |
| Iteration: Apply Conventions Audit Recommendations `./instructions/apply-conventions-audit-recommendations.md` | `DONE` |
| Iteration: Consolidate Process Insights `./instructions/consolidate-process-insights.md`                       | `DONE` |

### Iteration: Apply Conventions Audit Recommendationse

**Id:** `apply-conventions-audit-recommendations`

**Status:** `DONE`

**Purpose:** Apply the convention fixes recommended in the per-package adoption reports.

**Description:** Load each package's adoption report attachment from the audit plan, apply the recommended changes to the package source code, and commit one package at a time.

**Instructions:** `./instructions/apply-conventions-audit-recommendations.md`

**Changes:**

- For each package: read `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-{package-name}.md` attachment from the audit plan and apply recommended changes to the package source code.
- Commit per package with message "conventions(typescript): Apply noodlestan conventions" and up to 5 bullet points summarising the changes.
- For `@art-js/constructs`: additionally extract shared tag/natural-expression helpers to `src/shared/`, barrel test helpers (primitives + constructs), move the Document shape type to primitives, delete redundant type tests, and extract non-exported private helpers to construct `helpers/` folders.

**Dependencies:**

- Plan: `_backlog/3-now/plan-audit-conventions-adoption/plan.md`

#### Commits:

| ID                                     | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| -------------------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `apply-conventions-primitives`         | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `0f6bb4e` | `COMMITTED` |
| `apply-conventions-constructs`         | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `d006c14` | `COMMITTED` |
| `refactor-constructs-normalise-layers` | Art JS / `$PROJECT` / `main`   | `MANUAL`     | `587ad7f` | `COMMITTED` |
| `refactor-constructs-separate-layers`  | Art JS / `$PROJECT` / `main`   | `MANUAL`     | `1118f34` | `COMMITTED` |
| `refactor-constructs-public-api`       | Art JS / `$PROJECT` / `main`   | `MANUAL`     | `c1aabec` | `COMMITTED` |
| `update-parser-knowledge`              | Art JS / `$PROJECT` / `main`   | `MANUAL`     | `45f6d75` | `COMMITTED` |
| `apply-conventions-serializer`         | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `78fa011` | `COMMITTED` |

##### Commit: `apply-conventions-primitives`

**Repository:** Art JS

**Message:**

```
conventions(primitives): Apply noodlestan conventions in @art-js/primitives.

- Normalize primitive type declarations and module imports.
- Clarify parser context naming and expand source position literals.
```

##### Commit: `apply-conventions-constructs`

**Repository:** Art JS

**Message:**

```
conventions(constructs): Apply noodlestan conventions in @art-js/constructs.

- Extract Document shape type to primitives.
- Replace interface declarations with explicit type aliases.
- Relocate construct private functions into small module type files.
- Route cross-module type imports through public module barrels.
- Add explicit control-flow blocks and descriptive local names.
- Extract shared tag/natural-expression helpers, add barrels to test helpers.
```

##### Commit: `refactor-constructs-normalise-layers`

**Repository:** Art JS

**Message:**

```
refactor(art-js): normalise constructs into processor/FromNode/factory layers

- move ArtDocument and parser-visit-context test helpers into primitives
- processor: validation + delegate only
- helpers: create<Construct>FromNode extracts, calls factory, sets position after
- factory: create<Construct> builds from data (FromData suffix dropped)
- applied to FieldBlock, FieldInline, NaturalBlock, SectionBlock
- NaturalBlock factory preserves passthrough mdast fields via `attributes`
- tests mock only the direct collaborator and assert call + result identity
- removed dead findTagableMock and documentContextMock helpers
```

##### Commit: `refactor-constructs-separate-layers`

**Repository:** Art JS

**Message:**

```
refactor(constructs): Separate constructs in 3 layers: constructs(factories), parsers, and serializers.

- Extract factories to constructs/{Construct}/factory.
- Extract parsers to parser/constructs/{Construct}.
- Extract serializers to serializer/constructs/{Construct}.
- Move helpers to parser/{group}.
- Separate index and public.ts interfaces for constructs, parsers, and serializers.
```

##### Commit: `refactor-constructs-public-api`

**Repository:** Art JS

**Message:**

```
refactor(art-js): Expose only public items from constructs; Adapt parser and serializer config.

- Route package root through constructs/parser/serializer public.ts barrels.
- Nest factories under `factories/construcuts` for symmetry.
- Expose createArtDocumentFromNode from the parser public surface.
- Add CONSTRUCT_PARSERS / DEFAULT_CONSTRUCT_PARSER and CONSTRUCT_SERIALIZERS registries.
- Rename parser createDefaultConfig to createDefaultParserConfig and consume the registries.
- Adapt serializer default config to consume CONSTRUCT_SERIALIZERS.
```

##### Commit: `update-parser-knowledge`

**Repository:** Art JS

**Message:**

```
knowledge(parser): Update @art-js/parser architecture knowledge.
```

##### Commit: `apply-conventions-serializer`

**Repository:** Art JS

**Message:**

```
conventions(serializer): Apply noodlestan conventions in @art-js/serializer.

- Convert SerializerConfig to a type; extract SerialisableNode named type.
- Replace nested ternary and chained array methods in artAstToMdast.
- Move serializer.ts into serializer/ module directory; drop redundant type test.
- Update serializer architecture knowledge.
```

### Iteration: Consolidate Process Insights

**Id:** `consolidate-process-insights`

**Status:** `DONE`

**Purpose:** Document the convention adoption process, audit-conventions skill feedback, and recommendations for other projects.

**Description:** Create `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/adoption-process-insights.md` describing this plan's execution, the adoption process followed, feedback from using the audit-conventions skill, and recommendations for rolling out to other projects. This is the input the conventions repo needs for its "Document Adoption Process" iteration.

**Instructions:** `./instructions/consolidate-process-insights.md`

**Changes:**

- Read all plan attachments (setup audit report, per-package adoption reports from the audit plan).
- Create `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/adoption-process-insights.md` describing: this plan, the adoption process followed, feedback from using the audit-conventions skill, and recommendations for rolling out to other projects.

**Dependencies:**

- Iteration: Apply Conventions Audit Recommendations

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------------------ | ------------------------------ | ------------ | --------- | ----------- |
| `consolidate-process-insights` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `9aff5c0` | `COMMITTED` |

##### Commit: `consolidate-process-insights`

**Repository:** Art JS

**Message:**

```
knowledge(conventions): Document conventions adoption process insights.

- Summarise adoption process and audit-conventions skill feedback.
- Provide recommendations for rolling out to other projects.
```

## Work

### Next

Delegate instruction `apply-conventions-audit-recommendations`.

### Blockers

None.

## Coordination

### Not In Scope

- Installing convention packages (handled in plan-setup-noodlestan-conventions).
- Auditing conventions setup and adoption (handled in plan-audit-conventions-adoption).

### Evidence

- Applied convention fixes in package source code.
- Process insights document (`$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/adoption-process-insights.md`).

### Decisions

- One commit per package for applying recommendations.
- Process insights feed into the conventions repo's "Document Adoption Process" iteration.

### Follow Ups

- Feed process insights to conventions repo for "Document Adoption Process" iteration.
- Evaluate additional convention packages as the project evolves.
