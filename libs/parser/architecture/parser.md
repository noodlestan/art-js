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

Each construct registers a `ConstructParser` with up to two hooks:

```
ConstructParser
  captureNode?(context, node) → record | null     ← claims full node immediately
  handle?(record, node, ctx) → VisitContext        ← post-creation mutation / nesting
```

### Dispatch Order

```
1. Processors run over constructs in order:
   - For each construct, processor.captureNode is tried
   - The default construct is skipped in this loop and handled separately
2. If no construct claims the node, NaturalBlock fallback
3. After record creation, beforeRecord() lets the active context close
4. Handler runs if present (SectionBlock, FieldBlock use this path)
```

### Example: FieldBlock

```
captureNode → detects "**Name:**" paragraph where content continues on next line
              returns { construct: "FieldBlock", name, value: [] }
              or returns null (content on same line → FieldInline territory)
handle      → pushes nested VisitContext; subsequent NaturalBlocks append to field.value
              closes when next FieldBlock / FieldInline / SectionBlock arrives via beforeRecord()
```

### Example: FieldInline

```
captureNode → detects "**Name:**" paragraph where content follows on the SAME line
              consumes the entire paragraph tail as value (array of NaturalExpression)
              returns the FieldInline record — no handler needed (leaf construct)
```

### Example: SectionBlock

```
captureNode → matches heading nodes (# Name)
              returns { construct: "SectionBlock", name, depth }
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

| File                                                                                      | Role                                       |
| ----------------------------------------------------------------------------------------- | ------------------------------------------ |
| `$PACKAGE_PARSER/src/builder.ts`                                                          | Parser dispatch order and context handling |
| `$PACKAGE_PARSER/src/config/createDefaultConfig.ts`                                       | Enabled constructs and their order         |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldInline/createFieldInlineProcessor.ts`            | Inline field detection and capture         |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldInline/createFieldInlineToMdast.ts`              | Inline field rendering                     |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockProcessor.ts`      | Block field detection                      |
| `$PACKAGE_CONSTRUCTS/src/constructs/FieldBlock/private/createFieldBlockIntegrator.ts`     | Block field nesting/context                |
| `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockParser.ts`             | Section processor and handler wiring       |
| `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockProcessor.ts`  | Section AST creation                       |
| `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/private/createSectionBlockIntegrator.ts` | Section nesting behavior                   |
