# Plan: Archive and Publish

**Id:** `archive-poc-and-publish`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Archive poc-parse package and publish v0.0.2 of constructs, parser, and serializer packages.

**Description:** Mark `@art-js/poc-parse` as private with an archived README, ensure correct publish configuration, bump version to `0.0.2` for constructs, parser, and serializer, and publish to npm.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

Archive the POC parse package and publish version `0.0.2` of the core Art JS libraries.

## Context

### Upstream Work

| Kind      | Path                                                | Role                                                       |
| --------- | --------------------------------------------------- | ---------------------------------------------------------- |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md` | Defines this plan as phase 3 of the Consolidate milestone. |

### Knowledge

- ::READ `art-js/cli/poc-parse/` (Knowledge) — POC parse package source.

## Scope

### Out of Scope

- Publishing primitives (already published in v0.0.1).

### Packages

- Package: Artificial POC Parse — `cli/poc-parse/`
- Package: Artificial Constructs — `libs/constructs/`
- Package: Artificial Parser — `libs/parser/`
- Package: Artificial Serializer — `libs/serializer/`

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `main`.

## Items:

| Iteration / Instructions                                                                        | Status  |
| ----------------------------------------------------------------------------------------------- | ------- |
| Iteration: Archive POC Parse `./plan-archive-poc-and-publish/instructions/archive-poc-parse.md` | `READY` |
| Iteration: Publish v0.0.2 `./plan-archive-poc-and-publish/instructions/publish-v0.0.2.md`       | `READY` |

### Iteration: Archive POC Parse

**Id:** `archive-poc-parse`

**Status:** `READY`

**Purpose:** Mark poc-parse as private and document its archival.

**Description:** Set `private: true` in `cli/poc-parse/package.json` and add an archival README notice.

**Instructions:** `./plan-archive-poc-and-publish/instructions/archive-poc-parse.md`

**Changes:**

- Update `cli/poc-parse/package.json` (`private: true`).
- Add archival README in `cli/poc-parse/`.

**Dependencies:**

None.

#### Commits:

| ID                  | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `archive-poc-parse` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `archive-poc-parse`

**Repository:** Art JS

**Message:**

```
chore(art-js): Archive poc-parse package

- Add archival notice to `cli/poc-parse/README.md`
```

### Iteration: Publish v0.0.2

**Id:** `publish-v0.0.2`

**Status:** `READY`

**Purpose:** Bump version to `0.0.2` and publish constructs, parser, and serializer packages.

**Description:** Ensure correct publishConfig, bump package versions to `0.0.2`, run `npm publish`, and verify installability.

**Instructions:** `./plan-archive-poc-and-publish/instructions/publish-v0.0.2.md`

**Changes:**

- Bump version to `0.0.2` in constructs, parser, and serializer `package.json`.
- Execute `npm publish`.

**Dependencies:**

- Iteration: Archive POC Parse

#### Commits:

| ID               | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ---------------- | ------------------------------ | ------------ | ----- | ---------- |
| `publish-v0.0.2` | $PROJECT / `main`              | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `publish-v0.0.2`

**Repository:** Art JS

**Message:**

```
release(art-js): Publish v0.0.2 of constructs, parser, and serializer

- Bump version to 0.0.2 in `libs/constructs/package.json`
- Bump version to 0.0.2 in `libs/parser/package.json`
- Bump version to 0.0.2 in `libs/serializer/package.json`
```

## Work

### Next

Delegate instruction `archive-poc`.

### Blockers

None.

## Coordination

### Not In Scope

- Primitives publish (done in v0.0.1).

### Evidence

- Published packages on npm registry.

### Decisions

- Release as v0.0.2 incorporating all core library refinements and roundtrip fixes.

### Follow Ups

None.
