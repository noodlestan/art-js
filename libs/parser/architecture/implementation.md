# Parser Implementation

This file documents how the parser visits to mdast tree and invokes the constructs' contract to create the art ast tree.

## Entry Point

`buildDocument(config, markdown)` parses markdown into an `ArtDocument`:

1. Parse source to mdast via `fromMarkdown`.
2. Create root `VisitContext` (`createDocumentContext`).
3. Instantiate `defaultConstruct` and all `config.constructs`.
4. Visit each mdast node through `dispatch`.
5. Return `{ construct: 'Document', children: docContext.target() }`.

## The Visit Loop

Each mdast node passes through three paths, in order:

```ts
function visitNode(node):
  1. tryPreProcessors(node)  → if a record is returned, dispatch and SKIP
  2. maybeHandleFactory(node) → if a factory matches, dispatch and SKIP
  3. handleNaturalBlock(node) → fallback for unclaimed block types
```

**Pre-processors** run first across all constructs. The first to return a record wins. If none claim the node, the **factory** layer runs — `getFactory` asks each construct's `detect()` in order. If no factory matches and the node is a block type, the **default construct** (`NaturalBlock`) handles it.

Each path returns `{ records, handler }` — the record(s) to append and an optional handler to invoke.

## Dispatch and Context

After a record is produced, `dispatch` does three things:

1. **`beforeRecord(record)`** — the active context decides whether to accept the record or close. If it closes, it returns its parent, and `beforeRecord` is called again on the parent. This repeats until a context accepts.
2. **`flushGap(start, lastEnd)`** — fills any source-position gap between the last record and this one with `NaturalBlock` records (preserving unclaimed markdown between constructs).
3. **Handler or push** — if a handler exists, `handler.handle(record, node, context)` runs and returns the new context (possibly nested). Otherwise, `context.push(record)` appends directly.

## Context Stack

`VisitContext` manages the nesting of constructs that own subsequent content:

- **`push(record)`** — appends a record to the context's target array.
- **`createNestedContext(kind, parent, _, targetArray, _, beforeRecord)`** — creates a child context. Subsequent records go into the child's target until it closes.
- **`parent()`** — returns the parent context. Used by handlers and `beforeRecord` to unwind.
- **`beforeRecord(record)`** — called before each record. If the context's boundary function signals closure, it returns `parent()`, and the record is offered to the parent.

The stack unwinds when a boundary construct arrives (e.g. a new `SectionBlock` at a shallower depth closes deeper sections) or when a construct's handler explicitly returns the parent.

## Fallback: NaturalBlock

When no pre-processor or factory claims a block-type node, `handleNaturalBlock` creates a `NaturalBlock` record. This ensures unrecognised markdown is preserved as-is rather than dropped. Paragraph nodes continue visiting their children; other block types return `SKIP`.

## Error Handling

- **Unknown construct in config:** throws at config setup time (factory returns undefined).
- **Malformed markdown:** `fromMarkdown` is lenient — it produces an mdast tree for any input. The parser's job is to classify nodes, not validate syntax.
- **Handler returns null context:** would crash — handlers must always return a valid `VisitContext`.
