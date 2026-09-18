# Constructs Serializers

**Purpose:** A living guide for implementing the **serializer side** of a new construct. It is written from the constructs perspective — what a construct serializer needs to provide and what it should do. Serialization is straightforward: a single `toMdast` method that turns a construct record back into an mdast node. The only cross-cutting concern is tags, which must be serialized back in the right place.

**Adding new constructs:** When a new construct is implemented that uses the serializer contract in a way not covered by the scenario below, add a new section here describing the pattern.

## Layout

Serializers live under `src/serializer/`. Each construct gets its own folder under `src/serializer/constructs/`, and shared tag helpers live in `src/serializer/tags/`.

```
src/serializer/
├── constructs/          # one folder per construct serializer
│   └── SectionBlock/
│       ├── createSectionBlockToMdast.ts   # the ConstructSerializerFactory
│       └── index.ts                       # public surface: exports the factory
├── tags/                # tagToMdast, tagsToMdast — shared (#tag) serialization
├── types.ts             # ConstructSerializer, ConstructSerializerFactory
├── index.ts             # internal barrel
└── public.ts            # CONSTRUCT_SERIALIZERS factory list
```

A construct folder is minimal — there is no `private/` split. The `index.ts` exports only the factory:

```ts
// src/serializer/constructs/SectionBlock/index.ts
export { createSectionBlockToMdast } from './createSectionBlockToMdast';
```

The factory returns a `ConstructSerializer` with a single `toMdast(node, children)` method:

```ts
// src/serializer/constructs/SectionBlock/createSectionBlockToMdast.ts
export function createSectionBlockToMdast(): ConstructSerializer {
  return {
    name: 'SectionBlock',
    toMdast(node, _children) {
      // ...build and return the mdast node
    },
  };
}
```

The `tags/` folder holds the shared tag serialization helpers: `tagToMdast` (a single `(#name)` text node) and `tagsToMdast` (joins them into one text node).

## The Serializer Contract

```ts
type ConstructSerializer = {
  readonly name: string;
  toMdast(node: Construct, children: Node[]): Node;
};

type ConstructSerializerFactory = () => ConstructSerializer;
```

Every construct implements `ConstructSerializer` — a single `toMdast(node, children)` method. The `name` is the registry key. The `children` argument is the already-converted nested content; the method produces the construct's own node and places the children where they belong.

## Scenario: Construct with Tags

**Used by:** `SectionBlock`

The only cross-cutting scenario is tags. A construct that supports tags must serialize them back in the right place — for `SectionBlock`, at the end of its heading node.

```ts
// createSectionBlockToMdast.ts
toMdast(node, _children) {
	const section = node as unknown as SectionBlock;
	const depth = section.depth ?? 1;
	const parsed = fromMarkdown(`# ${section.name}`);
	const heading = parsed.children.find(child => child.type === 'heading');
	const tagNode = section.tags?.length ? tagsToMdast(section.tags) : null;
	const children: RootContent[] =
		heading && 'children' in heading
			? [...heading.children, ...(tagNode ? [tagNode] : [])]
			: [{ type: 'text' as const, value: section.name }, ...(tagNode ? [tagNode] : [])];
	return {
		type: 'heading',
		depth: depth as 1 | 2 | 3 | 4 | 5 | 6,
		children,
	} as Node;
}
```

**Key point:** The construct reuses the shared `tagsToMdast` helper to serialize its `tags` and appends the resulting node at the end of its own node's children — restoring the `# Title (#tag)` syntax. A construct that owns tags should always serialize them via `tagsToMdast` so the `(#tag)` format stays consistent.

## Checklist for a New Construct Serializer

- What mdast node does the construct map to? (heading, paragraph, text, …)
- Where do the already-converted `children` go?
- Does the construct own tags? If so, serialize them with `tagsToMdast` in the right position.
- Add the factory to `CONSTRUCT_SERIALIZERS` in `src/serializer/public.ts`.
