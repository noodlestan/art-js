# Convention Adoption Process Insights

**Plan:** `apply-conventions-recommendations`

**Iteration Id:** `consolidate-process-insights`

**Purpose:** Document the convention adoption process, `audit-conventions` skill feedback, and recommendations for other projects. This is the input the conventions repo needs for its "Document Adoption Process" iteration.

## 1. This Plan

`apply-conventions-recommendations` is the third and final plan in the Art JS convention adoption sequence, following `setup-noodlestan-conventions` (install + configure) and `audit-conventions-adoption` (audit setup + per-package adoption).

**Purpose:** Apply the convention fixes recommended in the per-package adoption reports and consolidate process insights.

**Iterations:**

| Iteration                                 | Status | Outcome                                            |
| ----------------------------------------- | ------ | -------------------------------------------------- |
| `apply-conventions-audit-recommendations` | DONE   | Applied fixes per package, one commit per package. |
| `consolidate-process-insights`            | READY  | This document.                                     |

**What was audited:** setup at the project root plus adoption in four packages — `@art-js/primitives`, `@art-js/constructs`, `@art-js/parser`, `@art-js/serializer`.

**What was fixed:** convention violations in each package (interface→type, barrel imports, block if/else, abbreviations, inline types, chained array methods, redundant type tests, module layout).

**What was produced:** per-package adoption reports, applied fixes (one commit per package), and this process-insights document.

## 2. Adoption Process

The end-to-end process followed across the three plans:

1. **Install packages** — add `@noodlestan/conventions-typescript` to `package.json` devDependencies and `npm install`.
2. **Configure guides** — add a `## Conventions` section to the root `_guide.md` (and each package `_guide.md`) referencing the installed convention index, with prose explaining how to read and apply rules.
3. **Audit setup** — run the `audit-conventions` skill's setup command at the project root; verify packages declared, guides reference conventions, prose present, source files resolve.
4. **Fix setup** — apply any setup findings (e.g. correct a stale convention source path).
5. **Audit adoption** — run the skill's adoption command per package; save each report as an attachment.
6. **Apply recommendations** — read each adoption report, apply the fixes to the package source, commit one package at a time.
7. **Consolidate insights** — write this document.

### What worked well

- **One commit per package** kept each change reviewable and isolated; a failure in one package did not block the others.
- **Reports as attachments** gave the apply plan a stable, self-contained input — the apply worker did not need to re-run audits.
- **Setup audit before adoption audits** caught configuration problems (stale source path) before they polluted per-package results.
- **The `audit-conventions` skill commands** produced consistent, tabular reports that were easy to consume downstream.

### What was friction

- **Manual per-package repetition.** The audit plan defined one iteration per package, each requiring a manual skill invocation and a separate commit. For a monorepo with many packages this does not scale.
- **Setup path drift.** The root `_guide.md` initially referenced `art/typescript.md`; the installed package exposes `art/index.md`. The setup audit caught this, but it shows the guide reference and the package layout can drift and need verification.
- **Report format variance.** Reports were produced by hand-guided skill runs, so the "Excluded Findings" and "Recommended Layout" sections were added ad hoc rather than by a deterministic command. This made the apply step depend on human judgement about what was a convention fix vs. an opportunistic refactor.
- **No apply automation.** Applying fixes was entirely manual: read report → edit files → verify → commit. Nothing in the skill or a command automated the apply step.

## 3. Audit Conventions Skill Feedback

The `audit-conventions` skill exposes two commands: **Audit Conventions Adoption** and **Audit Conventions Setup**.

### What was used

- **Command: Audit Conventions Setup** — used once at the project root. Produced the setup report table (check / status / issue). Worked well and was easy to interpret.
- **Command: Audit Conventions Adoption** — used once per package. Produced the findings table (convention / file / line / issue). The per-convention grouping was clear and actionable.

### What worked well

- The **tabulated output** (convention name, file/line, issue) mapped directly onto the apply step — each row was a discrete, addressable fix.
- The **`%base-path` input** made it trivial to scope an audit to a single package.
- The **setup checks** (declared, installed, referenced, resolvable) were the right set and caught the real setup drift.

### What was confusing / missing

- **Routine path mismatch.** The skill's `::READ` directives point at `$DOMAINS/conventions/routines/*.art`, but the routines actually live in `$DOMAINS/conventions/processes/*.art`. The skill cannot resolve its own mandatory reading. This must be fixed.
- **No report-file command.** The skill presents reports in chat but has no command to write them to a file (e.g. `_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-{package}.md`). The plan had to instruct saving the report manually.
- **No "audit all packages" command.** Each package required a separate manual invocation. A single command that discovers packages and produces one report per package would remove the repetition.
- **No apply command.** The skill audits but does not apply. The apply step (read report → fix → verify → commit) is entirely manual and unautomated.
- **No exclusion mechanism.** The "Excluded Findings" sections (test files, closure functions, All Caps Constants scope) were added by hand. The skill should support declaring exclusions so reports are reproducible.
- **No discovery of new conventions.** The skill audits against conventions already referenced in guides. It does not surface conventions that exist in the installed package but are not yet referenced — so a project can silently miss adopting a convention it has installed.

## 4. Recommendations for Other Projects

### Prerequisites

- Install the convention package(s) and reference the **index** (`art/index.md`), not a specific convention file, in `_guide.md`.
- Add a `## Conventions` section to the root guide **and** each package guide, with prose explaining how to read and apply rules.
- Run the setup audit before any adoption audit.

### Recommended order of operations

1. Install → configure guides → audit setup → fix setup.
2. Audit adoption per package (or all packages at once once automated).
3. Apply fixes one package at a time, committing per package.
4. Consolidate process insights and feed them back to the conventions repo.

### Common pitfalls

- **Stale convention source path** in `_guide.md` (referencing `typescript.md` when the package exposes `index.md`).
- **Missing package-level guide sections** — packages inherit the root guide but should still reference it explicitly.
- **Conflating convention fixes with refactors.** Keep the apply step scoped to the audit findings; do opportunistic refactoring separately (as Art JS did) so the convention commits stay reviewable.
- **Not verifying after apply.** Run lint/test/build (the pre-commit hook) after each package's fixes.

### Suggested improvements to the `audit-conventions` skill

- Fix the routine path (`processes/` not `routines/`).
- Add a **report-file** command that writes the report to a path.
- Add an **audit-all-packages** command that discovers packages and produces one report per package.
- Add an **apply** command that reads a report and applies the fixes.
- Add an **exclusions** input so reports are reproducible.
- Add a **discover-new-conventions** command that surfaces installed-but-unreferenced conventions.

## 5. Suggested Automation: Processes, Routines, Skills, and Commands

The adoption process is currently plan-driven and manual. The following automation would let a project adopt conventions without authoring a three-plan sequence each time.

### 5.1 New routines (in the Conventions domain)

- **Routine: Audit All Packages** — given a monorepo root, discover packages (e.g. `libs/*/`), run the adoption audit per package, and write one report per package to `_backlog/1-done/2026-09-18-audit-conventions/conventions-adoption-{package}.md`.
- **Routine: Apply Convention Report** — given a report file and a base path, apply each finding, verify (lint/test/build), and commit with a `conventions({package})` message.
- **Routine: Update Package Knowledge** — after applying fixes, update the package's `architecture/` docs to reflect the changes (e.g. renamed modules, moved types, new barrels).

### 5.2 New skill: `apply-conventions`

A dedicated skill (mirroring `audit-conventions`) with commands that automate the apply step:

- **Command: Apply Convention Report** — read a report, apply the fixes, verify, and commit per package.
- **Command: Apply All Reports** — iterate over all adoption reports in `_audit/conventions/`, applying and committing one package at a time.
- **Command: Update Package Knowledge** — update a package's architecture docs to reflect applied changes.

### 5.3 New command on `audit-conventions`

- **Command: Audit All Packages** — discover packages and produce one adoption report per package, writing each to `_audit/conventions/`.

### 5.4 New command: `write-conventions-adoption-plan`

A `write-plan`-style command that generates the full adoption plan from a single invocation, doing:

1. **Audit per package** — using the `audit-conventions` skill command (or the new Audit All Packages command).
2. **Apply per package** — using the new `apply-conventions` skill command.
3. **Update package knowledge** — using the Update Package Knowledge command.

This collapses the three-plan sequence (setup, audit, apply) into one plan whose iterations are generated from the discovered packages, with one commit per package and a final `consolidate-process-insights` iteration.

### 5.5 Isolated commands (no plan context)

For teams that do not use the plan workflow, expose the same steps as standalone commands:

- `audit-conventions setup <base-path>` — setup audit.
- `audit-conventions adoption <base-path>` — adoption audit for one package.
- `audit-conventions adoption-all <root>` — adoption audit for all packages.
- `apply-conventions report <report-file> <base-path>` — apply one report.
- `apply-conventions all <audit-dir>` — apply all reports, one commit per package.
- `apply-conventions knowledge <package>` — update package knowledge after apply.

These give the same guarantees (one commit per audit, one commit per package, reports as files) without requiring a plan to be authored.
