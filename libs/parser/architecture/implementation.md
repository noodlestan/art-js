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

Each mdast node passes through two paths, in order:

```ts
function visitNode(node):
  1. tryConstructs(node)      → loops constructs: pre-processor first, then factory detect+create
  2. handleNaturalBlock(node) → fallback for unclaimed block types
```

`tryConstructs` iterates constructs in a single pass. For each construct, the **pre-processor** is tried first; if it returns a record, the node is claimed. Otherwise, for constructs after the default one, **factory detection** runs — the first matching `detect()` wins and its `create()` builds the record. If no construct claims the node and it is a block type, the **default construct** (`NaturalBlock`) handles it.

`tryConstructs` returns `{ records, handler }` — the record(s) to append and an optional handler to invoke.

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
