# Design: Lib Records

## Intro

### Responsibilities

| Layer                | Package               | Primary types                                                             | Responsibility                                                       |
| -------------------- | --------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Codec contracts      | `@art-md/primitives`  | `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`                       | Declare the codec and source contracts (no `@art-md/source` package) |
| Codec implementation | `@art-md/codec`       | `ArtCodecConfig`, `createArtCodec()`                                      | Configured codec implementation and overloaded parse/serialize       |
| Records              | `@art-js/records`     | `ArtRecord`, `ArtRecordCapsule`, `Records`                                | Record identity, locating, extraction, update and serialisation      |
| FS adapter           | `@art-lib/fs-records` | `FSContentSource`, `FSRecordFile`, `FSRecordPosition`, `FSRecordsAdapter` | Filesystem discovery and content acquisition                         |
| Consumer             | ArtWork               | `NamespaceRecord`                                                         | Use-case-specific record structures and orchestration                |

### Boundaries

```
FSContentSource
      ↓ content
ArtContentSource
      ↓ ArtDocument
ArtDocumentSource
      ↓ record identity
ArtRecordCapsule
```

## Package: `@art-js/records`

### Layout

```
libs/records/
├── _guide.md
├── _records/
│   ├── package.art
│   └── npm-deployment.art
├── .npmignore
├── .prettierignore
├── LICENSE-MIT
├── package.json
├── README.md
├── src/
│   ├── index.ts
│   ├── record/
│   │   ├── types.ts
│   │   └── createArtRecord.ts
│   ├── capsule/
│   │   ├── types.ts
│   │   └── createArtRecordCapsule.ts
│   ├── records/
│   │   ├── types.ts
│   │   └── createRecords.ts
│   ├── extract/
│   │   ├── types.ts
│   │   ├── assertRecordPresence.ts
│   │   └── extractRecords.ts
│   ├── write-back/
│   │   ├── types.ts
│   │   └── writeRecord.ts
│   └── proxy/
│       ├── types.ts
│       └── createProxyObject.ts
├── tsconfig.json
├── tsconfig.vite.json
├── vite.config.ts
└── vitest.config.ts
```

### Files

#### `src/record/types.ts` — `ArtRecord`

**Responsibility:** identity shared by all Art records.

```ts
export interface ArtRecord {
  kind: string;
  name: string;
}
```

#### `src/record/createArtRecord.ts` — factory

**Responsibility:** create an `ArtRecord` identity from a `SectionBlock` (bridge layer).

```ts
export function createArtRecord(block: SectionBlock): ArtRecord;
```

#### `src/capsule/types.ts` — `ArtRecordCapsule`

**Responsibility:** transport a record identity and the `ArtDocumentSource` that contains the record. Exposes record identity regardless of source hydration state.

```ts
export interface ArtRecordCapsule<T extends ArtRecord> {
  readonly _source: ArtDocumentSource;
  readonly _maybeRecord: T | undefined;
  readonly _id: ArtRecord;
  raw(): T | undefined;
  [fieldName: string]: unknown;
}
```

#### `src/capsule/createArtRecordCapsule.ts` — factory

**Responsibility:** wrap an extracted record and its source into a capsule.

```ts
export function createArtRecordCapsule<T extends ArtRecord>(
  source: ArtDocumentSource,
  maybeRecord?: T,
): ArtRecordCapsule<T>;
```

#### `src/records/types.ts` — `Records`

**Responsibility:** collection-level API for locating, extracting, updating and serialising records.

```ts
export interface Records<T extends ArtRecord> {
  assertPresence(kind: string, name: string): boolean;
  extract(kinds?: string[]): ArtRecordCapsule<T>[];
  update(capsule: ArtRecordCapsule<T>, options?: WriteBackOptions): string;
  serialize(capsule: ArtRecordCapsule<T>): string;
}
```

#### `src/records/createRecords.ts` — factory

**Responsibility:** create the `Records` API over a document source.

```ts
export function createRecords<T extends ArtRecord>(source: ArtDocumentSource): Records<T>;
```

#### `src/extract/types.ts` — extraction options

**Responsibility:** options for extraction and presence assertion.

```ts
export interface ExtractOptions {
  kinds?: string[];
}
```

#### `src/extract/assertRecordPresence.ts` — function

**Responsibility:** assert the presence of a record in a document.

```ts
export function assertRecordPresence(document: ArtDocument, kind: string, name: string): boolean;
```

#### `src/extract/extractRecords.ts` — function

**Responsibility:** extract records from a document with fields, examples, etc.

```ts
export function extractRecords<T extends ArtRecord>(
  document: ArtDocument,
  options?: ExtractOptions,
): ArtRecordCapsule<T>[];
```

#### `src/write-back/types.ts` — write-back types

**Responsibility:** positioning anchors and write-back options.

```ts
export interface RecordPosition {
  readonly startLine: number;
  readonly endLine?: number;
}

export interface WriteBackOptions {
  guard?: boolean; // content-hash guard, opt-in
}
```

#### `src/write-back/writeRecord.ts` — function

**Responsibility:** write a record back into content at its positioning anchors, with an optional content-hash guard. Works on content strings, not the filesystem.

```ts
export function writeRecord(
  content: string,
  capsule: ArtRecordCapsule<ArtRecord>,
  options?: WriteBackOptions,
): string;
```

#### `src/proxy/types.ts` — `FieldResolver`

**Responsibility:** resolve and set record fields for transparent access.

```ts
export interface FieldResolver {
  resolveField(fieldName: string): unknown;
  setField(fieldName: string, value: unknown): void;
}
```

#### `src/proxy/createProxyObject.ts` — factory

**Responsibility:** create a `ProxyObject` over a capsule. Properties defined on `T` (`kind`, `name`) are returned from the record identity; all other accesses go through `resolveField`. Setters route data to the encapsulated `field.value` and track `field.modifiedValue` when modified.

```ts
export function createProxyObject<T extends ArtRecord>(
  capsule: ArtRecordCapsule<T>,
  resolver: FieldResolver,
): T;
```

#### `src/index.ts` — public exports

**Responsibility:** export the public API.

```ts
export type { ArtRecord } from './record/types';
export { createArtRecord } from './record/createArtRecord';
export type { ArtRecordCapsule } from './capsule/types';
export { createArtRecordCapsule } from './capsule/createArtRecordCapsule';
export type { Records } from './records/types';
export { createRecords } from './records/createRecords';
export type { ExtractOptions } from './extract/types';
export { assertRecordPresence } from './extract/assertRecordPresence';
export { extractRecords } from './extract/extractRecords';
export type { RecordPosition, WriteBackOptions } from './write-back/types';
export { writeRecord } from './write-back/writeRecord';
export type { FieldResolver } from './proxy/types';
export { createProxyObject } from './proxy/createProxyObject';
```
