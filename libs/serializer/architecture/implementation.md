# Serializer Implementation

> **Adding new patterns:** This file documents how the serializer converts `ArtDocument` records back to mdast. When a new construct uses the serializer contract in a way not covered below, add a new example section. See [Constructs Implementation](../../constructs/architecture/serializers.md) for detailed construct-side `toMdast` examples.

## Serializer Entry Point

`serialize(document)` converts an `ArtDocument` to a markdown string:

1. Build the default config via `createDefaultSerializerConfig()`.
2. Convert the document to an mdast `Root` via `artAstToMdast(config, document)`.
3. Render the root to markdown with `toMarkdown(root, { bullet: '-', emphasis: '_' })`.

```ts
export function serialize(document: ArtDocument): string {
  const config = createDefaultSerializerConfig();
  const root = artAstToMdast(config, document) as Root;
  return toMarkdown(root, { bullet: '-', emphasis: '_' });
}
```

The serializer is the inverse of the parser: the parser reads markdown into an `ArtDocument`, the serializer writes an `ArtDocument` back out to markdown.

## ArtAst to Mdast

`artAstToMdast(config, document)` converts an `ArtDocument` to an mdast `Root` node. It has three phases: build the registry, visit the construct tree, and wrap the results in a root.

### Build the Registry

The serializer dispatches through a registry built from the config. Each factory is called once, producing a `ConstructSerializer` adapter keyed by its `name`:

```ts
const registry = new Map<string, ConstructSerializer>();
for (const factory of config.constructs) {
  const toMdast = factory();
  registry.set(toMdast.name, toMdast);
}
```

If two factories produce the same name, the last one wins.

### Visit — Recursive Conversion

The `visit` function processes one construct node and returns an array of mdast nodes. It is recursive and **bottom-up**: children are converted before their parent, so the `childNodes` passed to `toMdast` are already mdast nodes, not `Construct` records.

```ts
function visit(node: SerialisableNode): Node[] {
  // 1. Gather raw children from node.children or node.value
  // 2. Filter for construct-shaped objects (have a 'construct' property)
  // 3. Recurse: flatMap(visit) — children converted first
  // 4. Look up adapter: registry.get(node.construct)
  // 5. Call toMdast(node, childNodes) — produces the main mdast node
  // 6. If mainNode is a root, unwrap its children
  // 7. Apply sibling placement rules (see below)
  // 8. Return the resulting node array
}
```

**Child gathering.** Children come from either `node.children` or `node.value`, depending on the construct's data shape. Only objects with a `construct` property are treated as nested constructs — plain values (strings, numbers) are ignored:

```ts
let rawChildren: unknown[] = [];
if ('children' in node && Array.isArray(node.children)) {
  rawChildren = node.children;
} else if ('value' in node && Array.isArray(node.value)) {
  rawChildren = node.value;
}

const nestedConstructs = rawChildren.filter(
  (c): c is SerialisableNode => typeof c === 'object' && c !== null && 'construct' in c,
);
const childNodes: Node[] = nestedConstructs.flatMap(visit);
```

**Factory lookup.** Each construct is looked up in the registry by its `construct` string. An unknown construct throws `Error('Unknown construct: ${node.construct}')` — meaning a construct exists in the `ArtDocument` but was not registered in the config.

**Why `flatMap`?** `visit` returns an array of mdast nodes (a construct may produce several sibling nodes), so recursion must flatten one level. `flatMap(visit)` both recurses and flattens, producing a single flat list of converted children.

### Sibling Placement

The serializer handles two output patterns:

**Inline children** — the `toMdast` result contains the children inline (e.g. `FieldInline` puts children inside the paragraph's `children` array). The visit function returns just `mainNodes`.

**Sibling children** — for block constructs with nested content (`SectionBlock`, `FieldBlock`), the children are returned as **siblings** after the main node:

```ts
if (
  'children' in node &&
  Array.isArray(node.children) &&
  node.children.length > 0 &&
  (node.construct === 'SectionBlock' || node.construct === 'FieldBlock')
) {
  return [...mainNodes, ...childNodes];
}
```

This matches markdown's flat structure: a heading is followed by its body content as sibling nodes, not as mdast children. The `toMdast` method for these constructs produces only the heading or label node — the serializer handles the sibling placement.

### Build the Root Node

All top-level results are collected into a single mdast root:

```ts
const mdastChildren = document.children.flatMap(child => visit(child as SerialisableNode));
return { type: 'root', children: mdastChildren } as Node;
```
