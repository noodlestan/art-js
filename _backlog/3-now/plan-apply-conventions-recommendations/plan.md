# Plan: Apply Conventions Recommendations

**Id:** `apply-conventions-recommendations`

**Status:** `READY`

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
| Plan      | `$PROJECT/_backlog/3-now/plan-audit-conventions-adoption/plan.md`        | Produces the per-package adoption reports (prerequisite).          |
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

- `$PROJECT/_audit/conventions/plan__adoption-process-insights.md` (Report) — Process insights and recommendations.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                                                                              | Status  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Iteration: Apply Conventions Audit Recommendations `./instructions/apply-conventions-audit-recommendations.md` | `READY` |
| Iteration: Consolidate Process Insights `./instructions/consolidate-process-insights.md`                       | `READY` |

### Iteration: Apply Conventions Audit Recommendations

**Id:** `apply-conventions-audit-recommendations`

**Status:** `READY`

**Purpose:** Apply the convention fixes recommended in the per-package adoption reports.

**Description:** Load each package's adoption report attachment from the audit plan, apply the recommended changes to the package source code, and commit one package at a time.

**Instructions:** `./instructions/apply-conventions-audit-recommendations.md`

**Changes:**

- For each package: read `$PROJECT/_audit/conventions/plan__conventions-adoption-{package-name}.md` attachment from the audit plan and apply recommended changes to the package source code.
- Commit per package with message "conventions(typescript): Apply noodlestan conventions" and up to 5 bullet points summarising the changes.

**Dependencies:**

- Plan: `_backlog/3-now/plan-audit-conventions-adoption/plan.md`

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ------------------------------ | ------------------------------ | ------------ | ----- | ---------- |
| `apply-conventions-primitives` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | (TBD) | `AUTHORED` |
| `apply-conventions-constructs` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | (TBD) | `AUTHORED` |
| `apply-conventions-parser`     | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | (TBD) | `AUTHORED` |
| `apply-conventions-serializer` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `apply-conventions-primitives`

**Repository:** Art JS

**Message:**

```
conventions(typescript): Apply noodlestan conventions.

- Apply adoption audit recommendations for @art-js/primitives.
```

##### Commit: `apply-conventions-constructs`

**Repository:** Art JS

**Message:**

```
conventions(typescript): Apply noodlestan conventions.

- Apply adoption audit recommendations for @art-js/constructs.
```

##### Commit: `apply-conventions-parser`

**Repository:** Art JS

**Message:**

```
conventions(typescript): Apply noodlestan conventions.

- Apply adoption audit recommendations for @art-js/parser.
```

##### Commit: `apply-conventions-serializer`

**Repository:** Art JS

**Message:**

```
conventions(typescript): Apply noodlestan conventions.

- Apply adoption audit recommendations for @art-js/serializer.
```

### Iteration: Consolidate Process Insights

**Id:** `consolidate-process-insights`

**Status:** `READY`

**Purpose:** Document the convention adoption process, audit-conventions skill feedback, and recommendations for other projects.

**Description:** Create `$PROJECT/_audit/conventions/plan__adoption-process-insights.md` describing this plan's execution, the adoption process followed, feedback from using the audit-conventions skill, and recommendations for rolling out to other projects. This is the input the conventions repo needs for its "Document Adoption Process" iteration.

**Instructions:** `./instructions/consolidate-process-insights.md`

**Changes:**

- Read all plan attachments (setup audit report, per-package adoption reports from the audit plan).
- Create `$PROJECT/_audit/conventions/plan__adoption-process-insights.md` describing: this plan, the adoption process followed, feedback from using the audit-conventions skill, and recommendations for rolling out to other projects.

**Dependencies:**

- Iteration: Apply Conventions Audit Recommendations

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ------------------------------ | ------------------------------ | ------------ | ----- | ---------- |
| `consolidate-process-insights` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `consolidate-process-insights`

**Repository:** Art JS

**Message:**

```
docs(art-js): Document conventions adoption process insights.

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
- Process insights document (`$PROJECT/_audit/conventions/plan__adoption-process-insights.md`).

### Decisions

- One commit per package for applying recommendations.
- Process insights feed into the conventions repo's "Document Adoption Process" iteration.

### Follow Ups

- Feed process insights to conventions repo for "Document Adoption Process" iteration.
- Evaluate additional convention packages as the project evolves.
