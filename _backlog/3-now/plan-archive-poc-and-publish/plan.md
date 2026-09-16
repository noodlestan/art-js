# Plan: Archive and Publish

**Id:** `archive-poc-and-publish`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Remove the poc-parse package and prepare v0.0.2 of primitives, constructs, parser, and serializer packages for manual publish.

**Description:** Delete `cli/poc-parse/` and all breaking references to it, ensure correct publish configuration, bump version to `0.0.2` for primitives, constructs, parser, and serializer, and prepare the packages for manual publish to npm.

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

- Executing `npm publish` (performed manually by the user after review).

### Packages

- Package: Artificial POC Parse — `cli/poc-parse/`
- Package: Artificial Primitives — `libs/primitives/`
- Package: Artificial Constructs — `libs/constructs/`
- Package: Artificial Parser — `libs/parser/`
- Package: Artificial Serializer — `libs/serializer/`

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `building`.

## Items:

| Iteration / Instructions                                                                        | Status  |
| ----------------------------------------------------------------------------------------------- | ------- |
| Iteration: Archive POC Parse `./plan-archive-poc-and-publish/instructions/archive-poc-parse.md` | `READY` |
| Iteration: Publish v0.0.2 `./plan-archive-poc-and-publish/instructions/publish-v0.0.2.md`       | `READY` |

### Iteration: Archive POC Parse

**Id:** `archive-poc-parse`

**Status:** `READY`

**Purpose:** Remove `cli/poc-parse/` from the monorepo.

**Description:** Delete `cli/poc-parse/` and all breaking references to it.

**Instructions:** `./plan-archive-poc-and-publish/instructions/archive-poc-parse.md`

**Changes:**

- Remove `cli/poc-parse/` and leave a small note at the bottom of `architecture/components.md` with a last known commit hash.

**Dependencies:**

None.

#### Commits:

| ID                  | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ------------------- | ------------------------------ | ------------ | ----- | ---------- |
| `archive-poc-parse` | $PROJECT / `building`          | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `archive-poc-parse`

**Repository:** Art JS

**Message:**

```
chore(art-js): Archive poc-parse package

- Add archival notice to `architecture/components.md`
```

### Iteration: Publish v0.0.2

**Id:** `publish-v0.0.2`

**Status:** `READY`

**Purpose:** Bump version to `0.0.2` for primitives, constructs, parser, and serializer packages.

**Description:** Ensure correct publishConfig, add CHANGELOG, bump package versions to `0.0.2`.

**Instructions:** `./plan-archive-poc-and-publish/instructions/publish-v0.0.2.md`

**Changes:**

- Bump version to `0.0.2` in primitives, constructs, parser, and serializer `package.json`.
- Create CHANGELOG.md in primitives, constructs, parser, and serializer packages.

**Dependencies:**

- Iteration: Archive POC Parse

#### Commits:

| ID               | Repository / Checkout / Branch | Policy       | Hash  | Status     |
| ---------------- | ------------------------------ | ------------ | ----- | ---------- |
| `publish-v0.0.2` | $PROJECT / `building`          | `AUTONOMOUS` | (TBD) | `AUTHORED` |

##### Commit: `publish-v0.0.2`

**Repository:** Art JS

**Message:**

```
release(art-js): Prepare v0.0.2 of primitives, constructs, parser, and serializer
```

## Work

### Next

Delegate instruction `archive-poc-parse`.

### Blockers

None.

## Coordination

### Not In Scope

- Executing `npm publish` (performed manually by the user after review).

### Evidence

- Version bumps to `0.0.2` and CHANGELOGs in primitives, constructs, parser, and serializer.

### Decisions

- Release as v0.0.2 incorporating all core library refinements and roundtrip fixes.

### Follow Ups

None.
