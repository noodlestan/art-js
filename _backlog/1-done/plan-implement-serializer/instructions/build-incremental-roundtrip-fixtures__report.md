# Report: `build(md-art-roundtrip): add incremental parser and serializer fixtures`

**Plan:** `implement-serializer`

**Commit.id:** `build-incremental-roundtrip-fixtures`

**Commit:** `31abbb7` — `build(md-art-roundtrip): add incremental parser and serializer fixtures`

**Status:** COMPLETED

## Summary

Cleaned up stale WIP comments, fixed the SectionBlock serializer escaping bug, promoted the `_011` formatting fixture, and added 9 new incremental fixtures covering list+link, list+formatting, section+list, section+code, field-block+formatting, field-block+code, and tag constructs.

## Part 1: Clean Up Stale WIP Comments

| Fixture                                        | WIP Comment                                 | Action                                                      |
| ---------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| `004-natural-block-with-list.md`               | (already clean)                             | No action needed                                            |
| `005-natural-block-with-ordered-spead-list.md` | (already clean)                             | No action needed                                            |
| `006-natural-block-with-code.md`               | (already clean)                             | No action needed                                            |
| `007-natural-block-with-nested-code.md`        | (already clean)                             | No action needed                                            |
| `030-field-inline-simple.md`                   | (already clean)                             | No action needed                                            |
| `031-field-inline-with-inline-formatting.md`   | (already clean)                             | No action needed                                            |
| `032-field-inline-with-multiple-lines.md`      | `WIP: Only how is included in field value.` | Removed WIP line, regenerated snapshot, roundtrip confirmed |

## Part 2: Fix `_011-section-block-with-formatting.md`

**Problem:** SectionBlock serializer escaped markdown syntax in heading names (`# Hello _World_! How are **you**?` → `# Hello \_World\_! How are \*\*you\*\*?`).

**Root cause:** `SectionBlock.toMdast()` emitted `{ type: 'text', value: section.name }` — a single text node. `mdast-util-to-markdown` escapes underscores and asterisks inside text nodes.

**Fix:** In `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockToMdast.ts`, parse `section.name` via `fromMarkdown()` to produce proper mdast heading children (emphasis, strong, text) instead of a single text node.

**Files changed:**

- `libs/constructs/src/constructs/SectionBlock/createSectionBlockToMdast.ts` — Added `fromMarkdown` import, parse heading name, extract inline children
- `libs/constructs/src/constructs/SectionBlock/createSectionBlockToMdast.test.ts` — Added `stripPositions` helper, added inline formatting test case

**Verification:**

- `npm run lint` (constructs) — PASS
- `npx vitest run` (constructs) — 10 tests PASS
- `npm run build` (constructs) — PASS
- Promoted `_011-section-block-with-formatting.md` → `011-section-block-with-formatting.md`
- `npm run test-parser -- --fixture 011-section-block-with-formatting --write` — PASS
- `npm run test-serializer -- --fixture 011-section-block-with-formatting` — LOSSLESS ROUNDTRIP

## Part 3: New Incremental Fixtures

### `008-natural-block-with-list-and-link.md`

**Constructs:** List items containing links (inline `link` nodes with `url` and `title` attributes)

**AST observations:**

- NaturalBlock (paragraph) — "A list with links:"
- NaturalBlock (list, unordered, spread=false) — 3 listItems
  - ListItem 1: paragraph with text("Visit "), link(url="https://example.com", children=[text("Example")]), text(" today")
  - ListItem 2: multi-line — paragraph with text("Read the "), link(url="https://docs.example.com", children=[text("docs")]), text("\nfor more info")
  - ListItem 3: paragraph with text("Contact "), link(url="mailto:hello@example.com", children=[text("us")])

**Serializer:** LOSSLESS ROUNDTRIP

### `009-natural-block-with-list-and-formatting.md`

**Constructs:** List items with emphasis, strong, and inline code

**AST observations:**

- NaturalBlock (paragraph) — "A list with formatting:"
- NaturalBlock (list, unordered, spread=false) — 3 listItems
  - ListItem 1: paragraph with strong("Bold"), text(" item with "), emphasis("emphasis")
  - ListItem 2: paragraph with text("Regular item with "), inlineCode("code")
  - ListItem 3: paragraph with emphasis("Emphasized"), text(" item with "), strong("strong"), text(" text")

**Serializer:** LOSSLESS ROUNDTRIP

### `011-section-block-with-formatting.md` (promoted from `_011`)

**Constructs:** SectionBlock with inline formatting in heading name

**AST observations:**

- SectionBlock(name="Hello _World_! How are **you**?", depth=1) — children: []

**Serializer:** LOSSLESS ROUNDTRIP (after fix in Part 2)

### `014-section-block-with-list.md`

**Constructs:** SectionBlock containing a list

**AST observations:**

- SectionBlock(name="Shopping List", depth=1)
  - NaturalBlock (list, unordered) — 3 listItems
    - ListItem 1: paragraph "Milk"
    - ListItem 2: multi-line — paragraph "Eggs\nOrganic preferred"
    - ListItem 3: paragraph "Bread"

**Serializer:** LOSSLESS ROUNDTRIP

### `015-section-block-with-code.md`

**Constructs:** SectionBlock containing a code block

**AST observations:**

- SectionBlock(name="Code Example", depth=1)
  - NaturalBlock (code, lang="typescript") — function body

**Serializer:** LOSSLESS ROUNDTRIP

### `024-field-block-with-formatting.md`

**Constructs:** FieldBlock capturing a paragraph with emphasis, strong, and inline code

**AST observations:**

- FieldBlock(name="Description")
  - NaturalBlock (paragraph) — text("This is a "), emphasis("formatted"), text(" description with "), strong("bold"), text(" and "), inlineCode("code"), text(".")

**Serializer:** LOSSLESS ROUNDTRIP

### `025-field-block-with-code.md`

**Constructs:** FieldBlock capturing a code block

**AST observations:**

- FieldBlock(name="Code Example")
  - NaturalBlock (code, lang="typescript") — `const x = 42;`

**Serializer:** LOSSLESS ROUNDTRIP

### `040-tag-simple.md`

**Constructs:** SectionBlock with tag in heading name

**AST observations:**

- SectionBlock(name="Section", depth=1, tags=[Tag(name="tagged")]) — children: []

**Serializer:** ROUNDTRIP DIFF — tags are not serialized back. SectionBlock.toMdast() only outputs `section.name`, not `section.tags`. Expected: `# Section (#tagged)`, actual: `# Section`.

### `041-tag-in-section.md`

**Constructs:** SectionBlock with tag and body content

**AST observations:**

- SectionBlock(name="Feature Implementation", depth=1, tags=[Tag(name="feature")])
  - NaturalBlock (paragraph) — "Details about the feature."

Note: Double space in `name` because tag removal leaves extra whitespace.

**Serializer:** ROUNDTRIP DIFF — same tag serialization issue as 040. Expected: `# Feature (#feature) Implementation`, actual: `# Feature  Implementation`.

### `042-tag-in-field-inline.md`

**Constructs:** FieldInline with tag syntax in value (stored as plain text, not Tag construct)

**AST observations:**

- SectionBlock(name="Hello World", depth=1)
  - FieldInline(name="Greeting") — value: [text("Hello (#friend) there.")]

**Serializer:** LOSSLESS ROUNDTRIP — tag stored as plain text roundtrips correctly.

## Regression Report

No previously-passing fixtures broke during this work. All 18 original numbered fixtures continue to pass both parser and serializer tests.

## Verification Results

**Parser (test-parser):**

```
Found 42 fixture(s) with snapshots. Testing...
All fixtures passed! (42/42)
```

**Serializer (test-serializer):**

```
Found 42 fixture(s) with snapshots. Testing...
26 LOSSLESS ROUNDTRIP, 2 ROUNDTRIP DIFF (040, 041 — expected tag serialization gap)
Skipped: 14 fixtures (underscore-prefixed)
```

**Constructs:**

```
npm run lint — PASS
npx vitest run — 10 tests PASS
npm run build — PASS
```

**Pre-commit hooks:** All passed (clean, extract, ci).

## Known Limitations

1. **Tags in SectionBlock headings don't roundtrip** (040, 041): `SectionBlock.toMdast()` only serializes `section.name`, not `section.tags`. The `(#tagname)` syntax is stripped from the name during parsing but not restored during serialization.
2. **Tags in prose are not extracted**: The Tag factory only runs on block-level nodes; inline text nodes containing `(#tagname)` are not processed by the Tag construct parser. They pass through as plain text (042).
