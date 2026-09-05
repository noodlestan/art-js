# Milestone: Modules

**ID:** `modules`

**Status:** `DRAFT`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Provide an API to interpret content as modules and records as resources, linking resources to its definition if available in the module scope.

**Description:** Build a modules library that wraps content and/or ast sources of truth and exposes records as resources when a structure is involved. Works on content strings, not the filesystem.

## Summary

TBD

## Source Tasks

- Briefing: `_backlog/_architect.md`.

## Phases

| Index | Name                      | Status  |
| ----- | ------------------------- | ------- |
| #1    | TBD       |  |

### Phase: 1 — TBD

**Goal:** TBD

**Description:** TBD

**Status:** `DRAFT`

**Dependencies:**

- TBD

## Items

The following items are not yet captured in a work item document:

- None.


## Work

### Next

Define the record model and confirm the package location, then plan the implementation.

### Blockers

None.

## Operating Instructions

### Setting Up

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Verifying Completion

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

## Follow ups

- Decide safe vs unsafe write-back functions and the default for the hash guard.
- Decide whether `ProxyObject` field access is the default or opt-in.

## Feedback

No sub-agent reports yet.
