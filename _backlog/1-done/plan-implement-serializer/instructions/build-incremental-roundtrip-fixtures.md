# Instructions: `build(md-art-roundtrip): add incremental parser and serializer fixtures`

**Plan:** `implement-serializer`

**Commit.id:** `build-incremental-roundtrip-fixtures`

**Commit.message:** `build(md-art-roundtrip): add incremental parser and serializer fixtures`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute this instruction. Your mode must be `worker` before you start changing files.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** execute the instruction in the "## How to Report Back" section and STOP processing any other instructions.
- RULE: Do not rename or remove existing fixtures.
- RULE: Do not create fixture files beginning with `_`; the serializer test intentionally skips those files.
- RULE: Keep each fixture tiny and focused on the construct combination it names.
- RULE: After each fixture, inspect its generated AST snapshot before creating the next fixture.
- RULE: If a command reports errors, attempt to fix them; if the error persists, STOP and report a blocker.
- RULE: If ANY already-passing fixture test starts failing during your work, you MUST highlight in your report: what broke, during which new fixture implementation, and how you fixed it to pass both the existing tests and the new one.

## Path Variables

| Variable              | Resolved Path                 | Purpose                                           |
| --------------------- | ----------------------------- | ------------------------------------------------- |
| `$PROJECT`            | `$WORKSPACE/checkouts/art-js` | project repository root                           |
| `$PACKAGE_PARSER`     | `$PROJECT/libs/parser/`       | parser package and fixture suite                  |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/libs/constructs/`   | construct implementations and unit tests          |
| `$PACKAGE_SERIALIZER` | `$PROJECT/libs/serializer/`   | serializer implementation used by roundtrip tests |

## Working Agreements

1. **This instruction is self-contained.** Everything needed is in this file plus its mandatory reading.
2. **The report is self-contained.** Record every fixture, AST observation, command result, fix, and remaining oddity in the rendered report.
3. **User interaction is minimal.** Report only completion or a blocker in chat; keep the execution trail in the report.

## Goals

Clean up stale WIP comments from numbered fixtures where the described issues have been resolved, fix the `_011-section-block-with-formatting.md` serializer escaping bug, and add new incremental fixtures that combine constructs not yet covered by the existing fixture suite.

## Mandatory Reading

- `$PACKAGE_PARSER/architecture/parser.md` — parser design principles, block/phrasing boundary, construct API, and serializer pipeline.
- `$PACKAGE_PARSER/architecture/fixture-tests.md` — test infrastructure, fixture anatomy, CLI flags, and use cases.
- `$PACKAGE_PARSER/test/fixtures/` — fixture inputs and snapshots used by the two-way tests.
- `$PACKAGE_PARSER/scripts/test-parser.ts` — parser test runner.
- `$PACKAGE_PARSER/scripts/test-serializer.ts` — serializer test runner.

## Test Infrastructure

The test suite is split into two scripts:

- `npm run test-parser` — parses fixtures, compares snapshots in memory, writes snapshots with `--write`.
- `npm run test-serializer` — serializes snapshots, diffs against source markdown, reports roundtrip overhead.

**Key flags:**

| Flag               | Script          | Purpose                                                                               |
| ------------------ | --------------- | ------------------------------------------------------------------------------------- |
| `--write`          | test-parser     | Regenerate `.md.json` snapshots from current parser output                            |
| `--fixture {name}` | both            | Scope to a single fixture (partial match on basename)                                 |
| `--debug-write`    | test-parser     | Write `{fixture}.debug.json` for inspection without overwriting the accepted snapshot |
| `--debug-write`    | test-serializer | Write `{fixture}.parsed.md` for visual diff comparison                                |

**Important:** `test-serializer` currently always returns exit code 0 (see the WIP comment in `test-serializer.ts`). Check the summary output for any failures; do not rely on exit code alone.

**Focused testing workflow:**

```bash
cd $PACKAGE_PARSER

# Parse a single fixture and compare against its snapshot:
npm run test-parser -- --fixture {number}

# Parse a single fixture and overwrite its snapshot:
npm run test-parser -- --fixture {number} --write

# Parse a single fixture and write a debug snapshot (does NOT overwrite accepted snapshot):
npm run test-parser -- --fixture {number} --debug-write

# Serialize a single fixture and check roundtrip:
npm run test-serializer -- --fixture {number}

# Serialize a single fixture and write .parsed.md for visual comparison:
npm run test-serializer -- --fixture {number} --debug-write
```

## Setup

Run from `$PROJECT`:

```bash
npm ci
```

## Changes

### Part 1: Clean up stale WIP comments

The following numbered fixtures have WIP comments describing issues that have since been resolved. For each one:

1. Remove the WIP comment line from the `.md` file.
2. Run `npm run test-parser -- --fixture {number} --write` to regenerate the snapshot without the WIP paragraph.
3. Run `npm run test-serializer -- --fixture {number}` to confirm roundtrip still passes.
4. Run `npm run test-serializer -- --fixture {number} --debug-write` and inspect `.parsed.md` if needed.

| Fixture                                        | WIP Comment                                 | Status                                                     |
| ---------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| `004-natural-block-with-list.md`               | List items do not have `type`               | Resolved — snapshot has `type: "listItem"`                 |
| `005-natural-block-with-ordered-spead-list.md` | List items do not have `type`               | Resolved — snapshot has `type: "listItem"`                 |
| `006-natural-block-with-code.md`               | Code blocks not captured                    | Resolved — snapshot has `type: "code"` with `lang`         |
| `007-natural-block-with-nested-code.md`        | Code blocks not captured                    | Resolved — snapshot has `type: "code"` with `lang: "meta"` |
| `030-field-inline-simple.md`                   | Value is empty array. Expected "Hello you." | Resolved — snapshot has `value` with `NaturalExpression`   |
| `031-field-inline-with-inline-formatting.md`   | Only **you** is included in the field value | Resolved — snapshot has all inline children                |
| `032-field-inline-with-multiple-lines.md`      | Only how is included in field value         | Resolved — snapshot has all inline children                |

### Part 2: Fix `_011-section-block-with-formatting.md`

**Problem:** The SectionBlock serializer escapes markdown syntax in heading names. `# Hello _World_! How are **you**?` serializes as `# Hello \_World\_! How are \*\*you\*\*?`.

**Root cause:** `SectionBlock.toMdast()` emits `{ type: 'text', value: section.name }`. The `mdast-util-to-markdown` library escapes underscores and asterisks inside text nodes.

**Fix:** In `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockToMdast.ts`, parse `section.name` via `fromMarkdown()` to produce proper mdast heading children instead of a single text node. This preserves inline formatting (emphasis, strong, links) through the roundtrip.

After fixing:

1. Create a numbered `011-section-block-with-formatting.md` fixture (promoting from `_011`).
2. Generate its snapshot and verify parser output.
3. Run `npm run test-serializer -- --fixture 011-section-block-with-formatting` and confirm the heading roundtrips correctly.
4. Run full `npm run test-parser` and `npm run test-serializer` to confirm no regressions.

### Part 3: Add new incremental fixtures

Add these fixtures in order. For each one:

1. Create `$PACKAGE_PARSER/test/fixtures/{name}.md`.
2. Generate its snapshot: `npm run test-parser -- --fixture {name} --write`.
3. Inspect the `.md.json` snapshot — record construct names, nesting, captured values.
4. Run `npm run test-serializer -- --fixture {name}` — confirm roundtrip passes.
5. Run `npm run test-serializer -- --fixture {name} --debug-write` — inspect `.parsed.md` if there is a diff.
6. **Regression check:** After each new fixture, run `npm run test-parser` and `npm run test-serializer` on the full suite. If any previously-passing fixture breaks, investigate, fix, and report what broke and how you fixed it.

**Proposed fixtures:**

| #   | Fixture                                         | Constructs Combined                       |
| --- | ----------------------------------------------- | ----------------------------------------- |
| 1   | `008-natural-block-with-list-and-link.md`       | List items containing links               |
| 2   | `009-natural-block-with-list-and-formatting.md` | List items with emphasis/strong           |
| 3   | `014-section-block-with-list.md`                | SectionBlock containing a list            |
| 4   | `015-section-block-with-code.md`                | SectionBlock containing a code block      |
| 5   | `024-field-block-with-formatting.md`            | FieldBlock capturing formatted paragraphs |
| 6   | `025-field-block-with-code.md`                  | FieldBlock capturing code blocks          |
| 7   | `040-tag-simple.md`                             | `(#tagname)` in prose                     |
| 8   | `041-tag-in-section.md`                         | Tag inside a SectionBlock body            |
| 9   | `042-tag-in-field-inline.md`                    | Tag inside a FieldInline value            |

## Verification

After every fixture:

```bash
cd $PACKAGE_PARSER
npm run test-parser -- --fixture {name} --write
npm run test-serializer -- --fixture {name}
```

Use `--debug-write` to create a `.debug.json` parser snapshot or `.parsed.md` serializer output for comparison; do not confuse either debug output with the checked-in acceptance snapshot.

When a construct fix is made:

```bash
cd $PACKAGE_CONSTRUCTS
npm run test
npm run lint
npm run build
```

Final verification:

```bash
cd $PACKAGE_PARSER
npm run test-parser
npm run test-serializer

cd $PACKAGE_CONSTRUCTS
npm run lint
npm run build
npm run test

cd $PROJECT
git status
npm run ci
```

Confirm that all numbered fixtures are tested, no new fixture begins with `_`, each `.md.json` snapshot matches the inspected AST, and the report contains the per-fixture construct observations and any fixes.

## How to Report Back to the Delegator

1. State whether reporting completion or a BLOCKER.
2. Render the report next to this instruction as `build-incremental-roundtrip-fixtures__report.md`.
3. Include a compact row or bullet for every fixture: source file, detected constructs, AST oddities, serializer result, and any code/test fix.
4. If any previously-passing fixture broke during your work, include a dedicated section: **Regression Report** — what broke, during which new fixture implementation, root cause, and how you fixed it.
5. Include the actual parser script name used (`test-parser`) and final verification results.
6. Keep the chat response terse: state completion or the blocker and point to the report.
