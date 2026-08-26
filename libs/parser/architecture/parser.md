# Parser Principles & Construct API

## Design Principles

### Block / Phrasing Boundary

MDAST distinguishes block-level nodes (headings, paragraphs, lists, code) from phrasing children (text, emphasis, links, inline code). The parser models this boundary deliberately:

```
NaturalBlock        → block content (paragraph, list, code, heading, ...)
NaturalExpression   → phrasing content (text, emphasis, strong, link, inlineCode, ...)
```

`NaturalBlock` handles block-level structure. `NaturalExpression` handles inline/phrasing content within blocks. Attributes (e.g. list-item `checked`, `spread`) are retained generically — no special cases per node type.

### Inline Constructs Consume the Full Paragraph Tail

When an inline construct (e.g. `FieldInline`) claims a paragraph, it must consume **every** child after the field label. Phrasing children become `NaturalExpression` records, preserving their mdast `type`, attributes, value, and recursive children.

```
**Greeting:** Hello, are _you_ there?

FieldInline
  name: "Greeting"
  value:
    NaturalExpression { type: "text",    value: "Hello, are " }
    NaturalExpression { type: "emphasis", children: [text("you")] }
    NaturalExpression { type: "text",    value: " there?" }
```

This leaves room for future constructs (e.g. `Tag`) to claim or transform an inline child instead of silently losing its structure.

### Block Constructs Own Their Capture Boundary

Block constructs (e.g. `FieldBlock`) capture following natural blocks into their `value`. The capture closes when a boundary record arrives:

```
FieldBlock:
  capture the following NaturalBlock values in field.value
  stop when the next FieldBlock, FieldInline, or SectionBlock begins
```

The active context calls `beforeRecord(record)` — if a boundary record arrives, the context returns to its parent. The builder remains construct-agnostic.

### Natural Conversion Is Recursive

Natural conversion recurses through all mdast children and retains generic attributes. No restrictive special cases per node type — list-item attributes, code metadata, and other mdast fields pass through.

---

## Construct Parser API

Each construct registers a `ConstructParser` with up to three hooks:

```
ConstructParser
  preProcess?(node, context) → record | null     ← claims full node immediately
  detect?(node, context)     → boolean            ← "can I handle this node?"
  create?(node, context)     → record             ← build the AST record
  handle?(record, node, ctx) → VisitContext        ← post-creation mutation / nesting
```

### Dispatch Order

```
1. preProcessors run first (FieldInline, FieldBlock use this path)
2. If no preprocessor claims the node, factories run (detect → create)
3. If no factory matches, NaturalBlock fallback
4. After record creation, beforeRecord() lets the active context close
5. Handler runs if present (SectionBlock, FieldBlock use this path)
```

### Example: FieldBlock

```
preProcess → detects "**Name:**" paragraph, returns FieldInline (same-line content)
             or returns null (content on next line → factory path)

detect      → matches paragraph starting with **Name:** where content continues on next line
create      → returns { construct: "FieldBlock", name, value: [] }
handle      → pushes nested VisitContext; subsequent NaturalBlocks append to field.value
              closes when next FieldBlock / FieldInline / SectionBlock arrives via beforeRecord()
```

### Example: FieldInline

```
preProcess → detects "**Name:**" paragraph where content follows on the SAME line
             consumes the entire paragraph tail as value (array of NaturalExpression)
             returns the FieldInline record — no handler needed (leaf construct)
```

### Example: SectionBlock

```
detect      → matches heading nodes (# Name)
create      → returns { construct: "SectionBlock", name, depth }
handle      → pushes nested VisitContext for child content
              heading depth drives nesting (depth 2 nests under depth 1)
```

---

## Serializer: `toMdast()` Pipeline

Each serializer adapter is selected by the construct name. `toMdast(node, children)` converts one AST construct into mdast nodes.

```
SectionBlock.toMdast    → heading node (depth + parsed name children)
FieldBlock.toMdast      → paragraph with strong "Name:" (children follow as siblings)
FieldInline.toMdast     → paragraph with strong "Name:" + space + inline value children
NaturalBlock.toMdast    → re-parses stored value via fromMarkdown(), replaces paragraph children
NaturalExpression.toMdast → reconstructs mdast node from type, attributes, value, children
```

**Rule:** Read the relevant `create*ToMdast.ts` files before diagnosing a roundtrip mismatch. Never "fix" a fixture by changing its expected output without understanding the construct conversion.

---

## Key Files

| File                                                                                    | Role                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------ |
| `$PACKAGE_PARSER/src/builder.ts`                                                        | Parser dispatch order and context handling |
| `$PACKAGE_PARSER/src/config/createDefaultConfig.ts`                                     | Enabled constructs and their order         |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldInline/createFieldInlinePreProcessor.ts`       | Inline field detection and capture         |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldInline/createFieldInlineToMdast.ts`            | Inline field rendering                     |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockPreProcessor.ts` | Block field detection                      |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockHandler.ts`      | Block field nesting/context                |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockCreator.ts`      | Block field factory                        |
| `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockParser.ts`           | Section factory and handler wiring         |
| `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockCreator.ts`  | Section AST creation                       |
| `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockHandler.ts`  | Section nesting behavior                   |
