# Design: Lib Records

## Intro

### Responsibilities

| Layer          | Package               | Primary types                                                           | Responsibility                                                  |
| -------------- | --------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| Codec          | `@art-js/codec`       | `Codec`, `ArtCodecConfig`                                               | Parse and serialise `ArtDocument` using configured constructs   |
| Content source | `@art-js/source`      | `ContentSource`, `ArtDocumentSource`                                    | Acquire/cache raw content, then parse/cache an `ArtDocument`    |
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

### `@art-js/codec`

#### `ArtCodecConfig`

**Responsibility:** configuration for a document codec.

```ts
export interface ArtCodecConfig {
  constructs: ConstructRegistry;
}
```

#### `ArtCodec`

**Responsibility:** document-level parsing and serialisation only.

No source I/O. No record knowledge.

```ts
export interface ArtCodec {
  parse(markdown: string): ArtDocument;
  serialize(document: ArtDocument): string;
}
```

#### `createCodec()`

**Responsibility:** create a configured codec.

The package intentionally stays small so alternative/configured codecs can exist independently.

```ts
export function createCodec(config: ArtCodecConfig): ArtCodec;
```

### `@art-js/source`

#### `ArtContentSource`

**Responsibility:** source identity plus lazy/idempotent acquisition and caching of raw content.

It knows nothing about Art documents or records.

```ts
export interface ArtContentSource {
  readonly type: string;
  readonly uri: string;
  readonly maybeContent: string | undefined;
  readContent(): Promise<string>;
  writeContent(content: string): Promise<void>;
}
```

#### `ArtDocumentSource`

**Responsibility:** lazy/idempotent parsing and caching of an `ArtDocument` from a `ArtContentSource`.

It knows nothing about records.

```ts
export interface ArtDocumentSource {
  readonly type: string;
  readonly uri: string;
  readonly maybeDocument: ArtDocument | undefined;
  readDcoument(): Promise<string>;
  writeDocument(doc: ArtDocument): Promise<void>;
}
```

#### `createArtDocumentSource()`

```ts
export function createArtDocumentSource(
  codec: ArtCodec,
  contentSource: ArtContentSource,
): ArtDocumentSource;
```

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
