# Art JS

md-art-md parser/serializer pipeline and supporting packages.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — this file: system overview, layout, setup, verification.
- `_records/project.art` — the project record.
- `_records/repository.art` — the repository record.

## Repository Layout

```
_guide.md           — this file
_backlog/           — plans, instructions, reports
_records/           — project, repository, namespace, and license records
cli/                — CLI packages
libs/               — library packages
spec/               — the artificial language specification
```

## Projects

| Project       | Guide                       | Backlog     |
| ------------- | --------------------------- | ----------- |
| Art JS (root) | `_guide.md`                 | `_backlog/` |
| Bin           | `cli/bin/_guide.md`         | `NONE`      |
| Dev Server    | `cli/dev-server/_guide.md`  | `NONE`      |
| POC Parse     | `cli/poc-parse/_guide.md`   | `NONE`      |
| Watcher       | `cli/watcher/_guide.md`     | `NONE`      |
| Bundler       | `libs/bundler/_guide.md`    | `NONE`      |
| Constructs    | `libs/constructs/_guide.md` | `NONE`      |
| Parser        | `libs/parser/_guide.md`     | `NONE`      |
| Primitives    | `libs/primitives/_guide.md` | `NONE`      |
| Program       | `libs/program/_guide.md`    | `NONE`      |
| Serializer    | `libs/serializer/_guide.md` | `NONE`      |
| Validator     | `libs/validator/_guide.md`  | `NONE`      |
| Spec          | `spec/_guide.md`            | `NONE`      |

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Project:** `_records/project.art`
- **Repository:** `_records/repository.art`
- **Namespace:** `_records/namespace.art`
- **License:** `_records/license.art`

## Knowledge References

This repository maintains an architecture reference at `libs/parser/architecture/index.md`.

## Workflows

Projects in this repository use the following workflows:

| Workflow / Path                                                            | Purpose                                                                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Planning Work** `$DOMAINS/work/workflows/planning-work/workflow.art`     | Create and manage work item lifecycles, collecting operational instructions according to context. |
| **Delegating Work** `$DOMAINS/work/workflows/delegating-work/workflow.art` | Organize work delegation to sub-agents with validation, execution, and verification.              |
| **Executing Work** `$DOMAINS/work/workflows/executing-work/workflow.art`   | Organize work execution by sub-agents to produce completed, verified outcomes and feedback.       |
| **Deploying** `$DOMAINS/work/workflows/executing-work/workflow.art`        | Organizes deployment of artefacts in operations.                                                  |

### Planning Work

- The backlog lives at `_backlog/` with subdirectories such as `/3-now` and `/4-next/`.
- The short-term focus is captured in `_backlog/_parking-lot.md`.
- The requirements, use cases, and principles are captured in `_backlog/_architect.md`.

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Verifying Completion

**Instructions:**

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```
