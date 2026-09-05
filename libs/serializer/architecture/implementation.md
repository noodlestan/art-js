# Serializer Implementation

> **Adding new patterns:** This file documents how the serializer converts `ArtDocument` records back to mdast. When a new construct uses the serializer contract in a way not covered below, add a new example section. See [Constructs Implementation](../../constructs/architecture/implementation.md) for detailed construct-side `toMdast` examples.

## Entry Point

`artAstToMdast(config, document)` converts an `ArtDocument` to an mdast `Root` node:

1. Build a registry from `config.constructs` — instantiate each factory, store in a `Map<string, ConstructToMdast>` keyed by `impl.construct`.
2. Visit each top-level child in `document.children` through the `visit` function.
3. Collect all results and wrap in `{ type: 'root', children: [...] }`.

## Registry Build

```ts
const registry = new Map<string, ConstructToMdast>();
for (const factory of config.constructs) {
  const impl = factory();
  registry.set(impl.construct, impl);
}
```

Four lines. Each factory is called once, producing a `ConstructToMdast` adapter. The `construct` string is the lookup key. If two factories produce the same key, the last one wins.

## The Visit Function

The `visit` function processes one construct node and returns an array of mdast nodes:

```ts
function visit(node): Node[] {
  1. Gather raw children from node.children or node.value
  2. Filter for construct-shaped objects (have a 'construct' property)
  3. Recurse: flatMap(visit) — bottom-up, children converted first
  4. Look up adapter: registry.get(node.construct)
  5. Call toMdast(node, childNodes) — produces the main mdast node
  6. If mainNode is a root, unwrap its children
  7. Apply sibling placement rules (see below)
  8. Return the resulting node array
}
```

The bottom-up order is critical: `childNodes` passed to `toMdast` are already fully converted mdast nodes, not `Construct` records.

## Child Gathering

Children are gathered from either `node.children` or `node.value`, depending on the construct's data shape. Only objects with a `construct` property are treated as nested constructs — plain values (strings, numbers) are ignored.

```ts
const rawChildren =
  'children' in node && Array.isArray(node.children)
    ? node.children
    : 'value' in node && Array.isArray(node.value)
      ? node.value
      : [];

const childNodes = rawChildren
  .filter(c => typeof c === 'object' && c !== null && 'construct' in c)
  .flatMap(visit);
```

## Sibling Placement

The serializer handles two output patterns:

**Inline children** — the `toMdast` result contains the children inline (e.g. `FieldInline` puts children inside the paragraph's `children` array). The visit function returns just `mainNodes`.

**Sibling children** — for block constructs with nested content (`SectionBlock`, `FieldBlock`), the children are returned as **siblings** after the main node:

```ts
if (node.construct === 'SectionBlock' && node.children?.length) {
  return [...mainNodes, ...childNodes];
}
if ((node.construct === 'SectionBlock' || node.construct === 'FieldBlock') && node.value?.length) {
  return [...mainNodes, ...childNodes];
}
```

This matches markdown's flat structure: a heading is followed by its body content as sibling nodes, not as mdast children. The `toMdast` method for these constructs produces only the heading or label node — the serializer handles the sibling placement.

## Root Wrapping

All top-level results are collected into a single mdast root:

```ts
const mdastChildren = document.children.flatMap(child => visit(child));
return { type: 'root', children: mdastChildren };
```

## Error Handling

- **Unknown construct:** throws `Error('Unknown construct: ${node.construct}')`. This means a construct exists in the `ArtDocument` but was not registered in the config.
- **Factory returns undefined:** would crash at registry build time — factories must return a valid `ConstructToMdast`.
