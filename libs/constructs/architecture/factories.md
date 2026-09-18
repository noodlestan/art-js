# Construct Factories

**Purpose:** A living guide for implementing the **factory** of a new construct. A factory is the simplest part of the contract — it builds a construct record from plain data. There are no hooks and no scenarios; a factory just maps factory-data to a record.

**Adding new constructs:** When a new construct is implemented, add its factory folder here following the layout below.

## Layout

Factories live under `src/factories/`. Each construct gets its own folder under `src/factories/constructs/`.

```
src/factories/
├── constructs/          # one folder per construct factory
│   └── SectionBlock/
│       ├── index.ts     # public surface: exports createSectionBlock + types
│       ├── types.ts     # the SectionBlock record type
│       └── factory/
│           ├── createSectionBlock.ts   # the factory function
│           └── types.ts                # SectionBlockFactoryData
├── types.ts             # registry maps (BlockConstructMap, InlineConstructMap, ConstructMap)
├── index.ts             # internal barrel
└── public.ts            # FACTORIES list + re-exported types
```

The construct's `index.ts` exports the factory function and both types:

```ts
// src/factories/constructs/SectionBlock/index.ts
export { createSectionBlock } from './factory/createSectionBlock';

export type { SectionBlock } from './types';
export type { SectionBlockFactoryData } from './factory/types';
```

The record type lives in `types.ts`, and the factory-data type (the minimal input) lives in `factory/types.ts`.

## The Factory Contract

```ts
// src/factories/constructs/SectionBlock/factory/types.ts
export type SectionBlockFactoryData = {
  name: string;
  kind?: string;
  depth?: number;
  children?: ConstructBase[];
  tags?: Tag[];
};
```

```ts
// src/factories/constructs/SectionBlock/factory/createSectionBlock.ts
export function createSectionBlock(data: SectionBlockFactoryData): SectionBlock {
  const section: SectionBlock = {
    construct: 'SectionBlock',
    name: data.name,
    children: data.children ?? [],
  };
  if (data.kind) section.kind = data.kind;
  if (data.depth !== undefined) section.depth = data.depth;
  if (data.tags?.length) section.tags = data.tags;
  return section;
}
```

**Key point:** A factory takes factory-data and returns a fully-formed record. It sets the `construct` discriminator, applies defaults for optional fields, and only sets optional properties when present.

## Checklist for a New Construct Factory

- Define the record type in `types.ts`.
- Define the factory-data type in `factory/types.ts`.
- Implement `createX(data): X` in `factory/createX.ts`.
- Export the factory and both types from the construct's `index.ts`.
- Add the factory to `FACTORIES` in `src/factories/public.ts`.
