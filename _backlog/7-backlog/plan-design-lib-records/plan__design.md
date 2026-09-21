# Design: Lib Records

## Intro

### Responsibilities

| Layer          | Package               | Primary types                                                           | Responsibility                                                  |
| -------------- | --------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| Codec          | `@art-md/codec`       | `Codec`, `ArtCodecConfig`                                               | Parse and serialise `ArtDocument` using configured constructs   |
| Content source | `@art-md/source`      | `ContentSource`, `ArtDocumentSource`                                    | Acquire/cache raw content, then parse/cache an `ArtDocument`    |
| Records        | `@art-js/records`     | `ArtRecord`, `ArtRecordCapsule`, `Records`                              | Record identity, locating, extraction, update and serialisation |
| FS adapter     | `@art-cli/fs-records` | `FSContentSource`, `FSRecordFile`, `FSRecordPosition`, `FSRecordsStore` | Filesystem discovery and content acquisition                    |
| Consumer       | ArtWork               | `NamespaceRecord`                                                       | Use-case-specific record structures and orchestration           |

### Boundaries

```
FSContentSource
      ↓ content
ContentSource
      ↓ ArtDocument
ArtDocumentSource
      ↓ record identity
ArtRecordCapsule
```

## Packages

### `@art-js/records`

#### `ArtRecord`

**Responsibility:** identity shared by all Art records.

```ts
export interface ArtRecord {
  kind: string;
  name: string;
}
```

#### `ArtRecordCapsule`

**Responsibility:** transport a record identity and the ArtDocumentSource that contains the record

The capsule exposes record identity regardless of source hydration state.

```ts
export interface ArtRecordCapsule<T extends ArtRecord> {
  readonly _source: ArtDocumentSource;
  readonly _maybeRecord: T | undefined;
  readonly _id: ArtRecord;
  [fieldName: string]: unknown;
}
```

Design the ProxyObject-based transparent field access that lets consumers read and write record fields directly from the capsule.

---

### `@art-cli/fs-source`

#### `FSContentFile`

**Responsibility:** filesystem-specific file identity.

```ts
export interface FSContentFile {
  readonly filename: string;
  readonly basePath: string;
}
```

#### `FSContentSource`

**Responsibility:** concrete filesystem implementation of ArtContentSource.

It owns filesystem reads and writes.

It does not know about ArtRecord, record kinds, or record extraction.

```ts
export interface FSContentSource extends ArtContentSource {
  readonly type: 'fs';
  readonly file: FSContentFile;
}
```

#### `createFSContentSource()`

**Responsibility:** Implement `ArtContentSource` with filesystem handing.

```ts
export function createFSContentSource(): ArtContentSource;
```

### `@art-cli/fs-records`

#### `FSRecordPosition`

**Responsibility:** filesystem-specific file identity.

```ts
export interface FSRecordPosition {
  readonly startLine: number;
  readonly endLine?: number;
}
```

#### `FSRecordsStore`

**Responsibility:** filesystem-specific discovery and assembly of the source/records pipeline.

`findRecordFiles()` returns content sources, not record sources.

Any filesystem-level kind/name discovery optimisation remains WIP and must not redefine the responsibility of FSContentSource.

```ts
export interface FSRecordsStore {
  findRecordFiles(basePath: string): Promise<FSContentSource[]>;

  readRecords<T extends ArtRecord>(
    sources: FSContentSource[],
    kinds?: string[],
  ): Promise<ArtRecordCapsule<T>[]>;
}
```
