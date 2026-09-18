# Plan: Audit Conventions Setup and Adoption

**Id:** `audit-conventions-adoption`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Audit whether conventions are properly set up and adopted across Art JS packages, fix setup issues, and produce per-package adoption reports.

**Description:** Run the `audit-conventions` skill commands to audit conventions setup at the project root and adoption in each package, fix setup issues found by the setup audit, and produce per-package adoption reports consumed by the apply plan.

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

Audit convention setup at the project root and adoption in each Art JS package, fix setup issues, and produce adoption reports for the apply plan.

## Context

### Upstream Work

| Kind      | Path                                                                      | Role                                                               |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-consolidate/milestone.md`              | Defines this plan as part of phase 2 of the Consolidate milestone. |
| Plan      | `$PROJECT/_backlog/3-now/plan-setup-noodlestan-conventions/plan.md`       | Installs convention packages and configures guides (prerequisite). |
| Plan      | `$CONVENTIONS/_backlog/6-plan/plan-pilot-project-adoption-art-js/plan.md` | Upstream pilot project adoption plan for Art JS.                   |

### Required Skills

- `audit-conventions` — Audit convention setup and adoption across packages. Required for Auditing.

### Knowledge

- ::READ `.agents/skills/audit-conventions/SKILL.md` (Skill) — Audit Conventions skill with Setup and Adoption commands.
- ::READ `.agents/domains/conventions/index.md` (Knowledge) — Conventions domain index.

## Scope

### Out of Scope

- Installing convention packages (handled in plan-setup-noodlestan-conventions).
- Configuring \_guide.md convention references (handled in plan-setup-noodlestan-conventions).
- Applying convention fixes to package source code (handled in plan-apply-conventions-recommendations).

### Packages

- Package: Artificial Primitives — `$PROJECT/libs/primitives/`
- Package: Artificial Constructs — `$PROJECT/libs/constructs/`
- Package: Artificial Parser — `$PROJECT/libs/parser/`
- Package: Artificial Serializer — `$PROJECT/libs/serializer/`

### Deployments

None.

## Attachments

- `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-setup-audit.md` (Report) — Setup audit report from iteration 1.
- `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-primitives.md` (Report) — Adoption audit report for primitives.
- `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-constructs.md` (Report) — Adoption audit report for constructs.
- `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-parser.md` (Report) — Adoption audit report for parser.
- `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-serializer.md` (Report) — Adoption audit report for serializer.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                      | Status |
| --------------------------------------------- | ------ |
| Iteration: Audit Conventions Setup (Manual)   | `DONE` |
| Iteration: Fix Conventions Setup (Manual)     | `DONE` |
| Iteration: Audit Primitives Adoption (Manual) | `DONE` |
| Iteration: Audit Constructs Adoption (Manual) | `DONE` |
| Iteration: Audit Parser Adoption (Manual)     | `DONE` |
| Iteration: Audit Serializer Adoption (Manual) | `DONE` |

### Iteration: Audit Conventions Setup

**Id:** `audit-conventions-setup`

**Status:** `DONE`

**Purpose:** Run the Audit Conventions Setup command to check if conventions are properly installed and configured in the Art JS project.

**Description:** Execute Command: Audit Conventions Setup with `$PROJECT` as `%base-path` and save the resulting `%setup-report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-setup-audit.md`.

**Instructions:** MANUAL — Execute using the `audit-conventions` skill.

**Changes:**

- Execute **Command: Audit Conventions Setup** with `$PROJECT` as `%base-path`.
- Save the resulting `%setup-report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-setup-audit.md`.

**Dependencies:**

None.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `audit-conventions-setup` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `f606fb1` | `COMMITTED` |

##### Commit: `audit-conventions-setup`

**Repository:** Art JS

**Message:**

```
conventions(art-js): Audit conventions setup.
```

### Iteration: Fix Conventions Setup

**Id:** `fix-conventions-setup`

**Status:** `DONE`

**Purpose:** Apply the fixes prescribed by the setup audit report.

**Description:** Read `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-setup-audit.md` and apply the prescribed fixes to the project setup (e.g., add missing convention references to `_guide.md`).

**Instructions:** MANUAL — Execute using the `audit-conventions` skill.

**Changes:**

- Read `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-setup-audit.md` attachment.
- Apply prescribed fixes to the project setup (e.g., add missing convention references to `_guide.md`).

**Dependencies:**

- Iteration: Audit Conventions Setup

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ----------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `fix-conventions-setup` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `6720877` | `COMMITTED` |

##### Commit: `fix-conventions-setup`

**Repository:** Art JS

**Message:**

```
fix(art-js): Apply conventions setup fixes.

- Rename reference to `.../art/index.md`.
- Upgrade `@noodlestan/conventions-typescript` to 0.0.2.
```

### Iteration: Audit Primitives Adoption

**Id:** `audit-primitives-adoption`

**Status:** `DONE`

**Purpose:** Audit convention adoption in the @art-js/primitives package.

**Description:** Execute Command: Audit Conventions Adoption with `$PROJECT/libs/primitives/` as `%base-path` and save the resulting `%report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-primitives.md`.

**Instructions:** MANUAL — Execute using the `audit-conventions` skill.

**Changes:**

- Execute **Command: Audit Conventions Adoption** with `$PROJECT/libs/primitives/` as `%base-path`.
- Save the `%report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-primitives.md`.

**Dependencies:**

- Iteration: Fix Conventions Setup

#### Commits:

| ID                          | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| --------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `audit-primitives-adoption` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `6375f15` | `COMMITTED` |

##### Commit: `audit-primitives-adoption`

**Repository:** Art JS

**Message:**

```
conventions(art-js): Audit conventions adoption in @art-js/primitives.
```

### Iteration: Audit Constructs Adoption

**Id:** `audit-constructs-adoption`

**Status:** `DONE`

**Purpose:** Audit convention adoption in the @art-js/constructs package.

**Description:** Execute Command: Audit Conventions Adoption with `$PROJECT/libs/constructs/` as `%base-path` and save the resulting `%report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-constructs.md`.

**Instructions:** MANUAL — Execute using the `audit-conventions` skill.

**Changes:**

- Execute **Command: Audit Conventions Adoption** with `$PROJECT/libs/constructs/` as `%base-path`.
- Save the `%report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-constructs.md`.

**Dependencies:**

- Iteration: Fix Conventions Setup

#### Commits:

| ID                          | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| --------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `audit-constructs-adoption` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `34b2afa` | `COMMITTED` |

##### Commit: `audit-constructs-adoption`

**Repository:** Art JS

**Message:**

```
conventions(art-js): Audit conventions adoption in @art-js/constructs.
```

### Iteration: Audit Parser Adoption

**Id:** `audit-parser-adoption`

**Status:** `DONE`

**Purpose:** Audit convention adoption in the @art-js/parser package.

**Description:** Execute Command: Audit Conventions Adoption with `$PROJECT/libs/parser/` as `%base-path` and save the resulting `%report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-parser.md`.

**Instructions:** MANUAL — Execute using the `audit-conventions` skill.

**Changes:**

- Execute **Command: Audit Conventions Adoption** with `$PROJECT/libs/parser/` as `%base-path`.
- Save the `%report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-parser.md`.

**Dependencies:**

- Iteration: Fix Conventions Setup

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ----------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `audit-parser-adoption` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `8402d78` | `COMMITTED` |

##### Commit: `audit-parser-adoption`

**Repository:** Art JS

**Message:**

```
conventions(art-js): Audit conventions adoption in @art-js/parser.
```

### Iteration: Audit Serializer Adoption

**Id:** `audit-serializer-adoption`

**Status:** `DONE`

**Purpose:** Audit convention adoption in the @art-js/serializer package.

**Description:** Execute Command: Audit Conventions Adoption with `$PROJECT/libs/serializer/` as `%base-path` and save the resulting `%report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-serializer.md`.

**Instructions:** MANUAL — Execute using the `audit-conventions` skill.

**Changes:**

- Execute **Command: Audit Conventions Adoption** with `$PROJECT/libs/serializer/` as `%base-path`.
- Save the `%report` as attachment `$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-serializer.md`.

**Dependencies:**

- Iteration: Fix Conventions Setup

#### Commits:

| ID                          | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| --------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `audit-serializer-adoption` | Art JS / `$PROJECT` / `main`   | `AUTONOMOUS` | `a4388d5` | `COMMITTED` |

##### Commit: `audit-serializer-adoption`

**Repository:** Art JS

**Message:**

```
conventions(art-js): Audit conventions adoption in @art-js/serializer.
```

## Work

### Next

Execute iteration `audit-conventions-setup` using the `audit-conventions` skill.

### Blockers

None.

## Coordination

### Not In Scope

- Installing convention packages (handled in plan-setup-noodlestan-conventions).
- Configuring \_guide.md convention references (handled in plan-setup-noodlestan-conventions).
- Applying convention fixes to package source code (handled in plan-apply-conventions-recommendations).

### Evidence

- Setup audit report (`$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-setup-audit.md`).
- Per-package adoption reports (`$PROJECT/_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-*.md`).
- Applied setup fixes.

### Decisions

- One audit iteration per package, each producing a dedicated adoption report attachment.
- Setup audit and fixes precede per-package adoption audits.
- Adoption reports are consumed by plan-apply-conventions-recommendations.

### Follow Ups

- Feed adoption reports to plan-apply-conventions-recommendations.
- Evaluate additional convention packages as the project evolves.
