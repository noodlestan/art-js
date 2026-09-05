# Plan: Refactoring and Test Coverage

**ID:** `refactoring-and-test-coverage`

**Status:** `PREPARING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

## Summary

Refactoring and test coverage across the migrated `@art-js/artificial-*` packages, hardening the codebase before archive and publish. Executed within the Artificial repository (`checkouts/artificial`) as phase 9 of the MD Art Roundtrip milestone — draft; commit strategy and implementation instructions to be defined during planning.

## Source Tasks

- Milestone: `_roadmap/4-now/milestone-consolidate/milestone.md` — defines this plan as phase 2 of the Consolidate milestone, between gap closure (phase 1) and archive and publish (phase 3).

## Items

Things to investitage:

- in libs/parser/src/builder.ts both `tryPreProcessors` and `maybeHandleFactory` are very very similar they seem to do the same thing evaluate if constructs could use one or the other and obtain the same results => if there is a difference we need to make it work through a param? or an other constructor hook and merge the 2

Things to rename:

- `createNestedContext()` => createParserContext
- sections ? is it really just sections? if so, ok

Things to refactor:

- `createNestedContext()` depends on a global variable

Patterns:

- libs/parser/src/constants.ts is unscoped move to libs/parser/src/mdast/constants.ts
- libs/parser/src/constants.ts contains a function extract to libs/parser/src/mdast/isBlockType.ts

## Follow ups

None.

## Feedback

No sub-agent reports yet.
