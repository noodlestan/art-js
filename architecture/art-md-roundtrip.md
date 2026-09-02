# Art-MD Roundtrip Pipeline

## Overview

The Art-MD roundtrip pipeline transforms markdown to an AST and back:

```
markdown → parser → AST (art.json) → serializer → markdown
```

This document describes the architecture of the parser and serializer that power the roundtrip.

## Layered Architecture

The parser uses a layered architecture with four component types:

### 1. Pre-processors (`ConstructPreProcessor`)

Detect and transform nodes before factory detection. Example: field detection from paragraphs (a paragraph starting with `**Name:**` becomes a FieldBlock). Pre-processors run before factories and can intercept nodes that need special handling.

```typescript
interface ConstructPreProcessor {
  canPreProcess(node: MdastNode, context: VisitContext): boolean;
  preProcess(node: MdastNode, context: VisitContext): Construct | null;
}
```

### 2. Factories (`ConstructFactory`)

Detect and create records. Each known construct (SectionBlock, FieldBlock, Tag) has a factory with `detect`, `create`, and `shouldVisit` methods.

- `detect` checks if an mdast node qualifies (e.g. heading text matches `# Kind: Name`, strong text matches `**Field:**`).
- `create` builds the art record from the mdast node.
- `shouldVisit` determines whether the factory handles the subtree or the visitor should recurse.
- Unmatched nodes fall back to `NaturalBlock`.

```typescript
interface ConstructFactory {
  detect(node: MdastNode, context: VisitContext): boolean;
  create(node: MdastNode, context: VisitContext): Construct;
  shouldVisit: boolean;
}
```

### 3. Handlers (`ConstructHandler`)

Process records after creation. Example: tag routing (attaching tags to the nearest section). Handlers receive the created record and the context, and can modify the context chain.

```typescript
interface ConstructHandler {
  canHandle(record: Construct): boolean;
  handle(record: Construct, node: MdastNode, context: VisitContext): VisitContext;
}
```

### 4. Injection (`ParserConfig`)

All pre-processors, factories, and handlers are injected into `buildDocument(markdown, config)`. No defaults, no hardcoded constructs. The entry point creates a default config via `createDefaultConfig()`.

```typescript
interface ParserConfig {
  preProcessors: ConstructPreProcessor[];
  factories: ConstructFactory[];
  handlers: ConstructHandler[];
}
```

## Context Architecture

`VisitContext` is a pure container — no construct-specific logic (no `detectField`, no `_section` state). All construct-specific behavior is in pre-processors, factories, and handlers.

```typescript
interface VisitContext {
  capturing(): string | undefined;
  target(): BlockContent[];
  push(record: BlockContent): void;
  parent(): VisitContext | undefined;
  source: string;
  lastEnd: Point | undefined;
}
```

Section tracking uses a `WeakMap<VisitContext, SectionBlock>` — not a context property.

## Construct Detection Patterns

- **SectionBlock**: heading nodes — extract kind/name from `# Kind: Name` pattern
- **FieldBlock**: paragraphs starting with `**Name:**` — detected by pre-processor
- **Tag**: text nodes containing `(#identifier)` — detected by factory
- **NaturalBlock**: fallback for all unmatched nodes

## Position Handling

- `cleanPosition()` strips internal mdast fields, keeping only `line`, `column`, `offset`
- Gap detection preserves whitespace between records as NaturalBlocks
- Section nesting driven by heading depth (1-6)

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

## Dependencies

- `mdast-util-from-markdown` — parses markdown → mdast
- `unist-util-visit` — traverses the tree
- `@art-js/artificial-primitives` — core types
