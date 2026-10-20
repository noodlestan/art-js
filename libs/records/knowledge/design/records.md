# Design: Records

**Status:** v0.0.1 design — implemented in `$PROJECT/libs/records`, exercised by the integration fixtures in `$PROJECT/tests/records`; CI green.

**Purpose:** Define the record API consumers use to read documents, receive source-bound record proxies, mutate them, and save through their source.

**Scope:** `@art-js/records` owns record extraction, proxy handles, capsule creation, and save orchestration. It does not implement filesystem access. It consumes generic Art MD document sources, which may be backed by files, memory, a network, or another I/O system.

## Usage

Every code block below is a complete, runnable module: all imports come from named packages, and the source provenance (codec, adapter, content sources) is explicit. The examples run from a checkout root and use the Art Lib FS adapter for discovery and filesystem-backed content sources.

### Setup

Art Work creates the codec and injects it into the records provider. The provider receives a callback that creates one content source per file. The Art Lib adapter handles discovery and filesystem access; it does not extract record semantics.

```ts
import {
  createFSRecordsAdapter,
  type FSRecordFile,
  type FSRecordsPattern,
} from '@art-lib/fs-records';
import { createRecordsDocument } from '@art-js/records';
import { createArtCodec, type PartialArtCodecConfig } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

const checkoutRoot = process.cwd();
const patterns: FSRecordsPattern[] = [
  {
    base: '.',
    pattern: '**/_records/**/*.art',
    ignored: ['node_modules/', '.git/', 'dist/'],
    excluded: [],
    gitignore: true,
  },
];
const fsRecords = createFSRecordsAdapter({ basePath: checkoutRoot, patterns });
const codecOptions: PartialArtCodecConfig = {};
const codec: ArtCodec = createArtCodec(codecOptions);
const documentRecords = createRecordsDocument<FSRecordFile>({
  codec,
  createContentSource: (file: FSRecordFile) => fsRecords.createContentSource(file),
});
```

Art Work may replace the empty codec options with its configured options; it still creates the codec instance and passes it in. `@art-js/records` never creates a codec itself.

### Finding Records

`discoverRecordFiles()` filters filenames, not headings. Discover without a kind filter, then interpret the complete heading name after parsing.

```ts
import { join } from 'node:path';
import {
  createFSRecordsAdapter,
  type FSRecordFile,
  type FSRecordsPattern,
} from '@art-lib/fs-records';
import { createRecordsDocument } from '@art-js/records';
import { createArtCodec, type PartialArtCodecConfig } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

const checkoutRoot = process.cwd();
const patterns: FSRecordsPattern[] = [
  {
    base: '.',
    pattern: '**/_records/**/*.art',
    ignored: ['node_modules/', '.git/', 'dist/'],
    excluded: [],
    gitignore: true,
  },
];
const fsRecords = createFSRecordsAdapter({ basePath: checkoutRoot, patterns });
const codecOptions: PartialArtCodecConfig = {};
const codec: ArtCodec = createArtCodec(codecOptions);
const documentRecords = createRecordsDocument<FSRecordFile>({
  codec,
  createContentSource: (file: FSRecordFile) => fsRecords.createContentSource(file),
});

const files = await fsRecords.discoverRecordFiles();
const projectFilename = join(checkoutRoot, '_records', 'project.art');
const projectFile = files.find(
  file => file.filename === projectFilename && file.error === undefined,
);
if (projectFile === undefined) {
  throw new Error(`Record file not found: ${projectFilename}`);
}

const projectDocument = await documentRecords.read(projectFile);
const present = await projectDocument.assertPresence('Project: Art JS');
if (!present) {
  throw new Error('Project: Art JS section not found');
}
const records = await projectDocument.extract();
const project = records.find(record => record.name === 'Project: Art JS');
if (project === undefined) {
  throw new Error('Project: Art JS section not found');
}

console.log(project.__section);
```

`read(file)` creates the per-file source and parses its document. `extract()` returns one proxy handle per `SectionBlock`, at any depth, including field-less sections. The heading name is the complete heading text; Records carries no `kind` and filters no sections. Consumers filter discovery results by `FSRecordFile.error?` before reading, per the Art Lib degrade-not-fail contract.

### Mutating and Saving Records

The extracted record is already a proxy and retains its document source. Consumers change fields through property access, change section properties through `record.__section`, then call `record.save()`.

```ts
import { join } from 'node:path';
import {
  createFSRecordsAdapter,
  type FSRecordFile,
  type FSRecordsPattern,
} from '@art-lib/fs-records';
import { createRecordsDocument } from '@art-js/records';
import { createArtCodec, type PartialArtCodecConfig } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

const checkoutRoot = process.cwd();
const patterns: FSRecordsPattern[] = [
  {
    base: '.',
    pattern: '**/_records/**/*.art',
    ignored: ['node_modules/', '.git/', 'dist/'],
    excluded: [],
    gitignore: true,
  },
];
const fsRecords = createFSRecordsAdapter({ basePath: checkoutRoot, patterns });
const codecOptions: PartialArtCodecConfig = {};
const codec: ArtCodec = createArtCodec(codecOptions);
const documentRecords = createRecordsDocument<FSRecordFile>({
  codec,
  createContentSource: (file: FSRecordFile) => fsRecords.createContentSource(file),
});

const files = await fsRecords.discoverRecordFiles();
const projectFilename = join(checkoutRoot, '_records', 'project.art');
const projectFile = files.find(
  file => file.filename === projectFilename && file.error === undefined,
);
if (projectFile === undefined) {
  throw new Error(`Record file not found: ${projectFilename}`);
}

const projectDocument = await documentRecords.read(projectFile);
const records = await projectDocument.extract();
const project = records.find(record => record.name === 'Project: Art JS');
if (project === undefined) {
  throw new Error('Project: Art JS section not found');
}

project.owner = 'foo';
project.renameField('owner', 'maintainer');
project.maintainer = 'foo';
project.__section.depth = 3;
await project.save();
```

Setting a missing field appends it to the section. Renaming a field changes its label in place. Deleting a field (`delete record.owner`) removes it. The record heading is identity and cannot be renamed after extraction. `save()` writes the containing document once through the record's bound source; other in-memory edits to that document are included in the same write.

### Creating New Records

A new record is created through its document collection. `read(file)` requires the file to exist — it parses the document — so the provider also offers `create(file)`, which binds the file's content source to an empty in-memory document without touching disk. Art Work creates the destination directory first.

```ts
import { mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import {
  createFSRecordsAdapter,
  type FSRecordFile,
  type FSRecordsPattern,
} from '@art-lib/fs-records';
import { createRecordsDocument } from '@art-js/records';
import { createArtCodec, type PartialArtCodecConfig } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

const checkoutRoot = process.cwd();
const recordsDirectory = join(checkoutRoot, '_records');
await mkdir(recordsDirectory, { recursive: true });

const filename = join(recordsDirectory, 'project.art');
const destinationFile: FSRecordFile = {
  filename,
  basePath: checkoutRoot,
  path: relative(checkoutRoot, filename),
};

const patterns: FSRecordsPattern[] = [
  {
    base: '.',
    pattern: '**/_records/**/*.art',
    ignored: ['node_modules/', '.git/', 'dist/'],
    excluded: [],
    gitignore: true,
  },
];
const fsRecords = createFSRecordsAdapter({ basePath: checkoutRoot, patterns });
const codecOptions: PartialArtCodecConfig = {};
const codec: ArtCodec = createArtCodec(codecOptions);
const documentRecords = createRecordsDocument<FSRecordFile>({
  codec,
  createContentSource: (file: FSRecordFile) => fsRecords.createContentSource(file),
});

const projectDocument = await documentRecords.create(destinationFile);
const record = projectDocument.addRecord();
record.name = 'Project: Art JS';
record.__section.depth = 2;
record.owner = 'foo';
await record.save();
```

`addRecord()` appends a record handle with an empty `SectionBlock` to the collection. Its `name` is assignable until the first save and immutable afterwards, matching extracted records. `save()` serializes the document containing the added record and writes the new file; the destination directory must exist. In v0.0.1, creation targets new or empty files — adding a record to a populated document is not supported.

### Batch Saving Records

The Art Lib FS adapter has no `batch()` method. Batch across files by creating one document collection per file and saving each collection once. Each collection writes through its own source.

```ts
import {
  createFSRecordsAdapter,
  type FSRecordFile,
  type FSRecordsPattern,
} from '@art-lib/fs-records';
import { createRecordsDocument } from '@art-js/records';
import { createArtCodec, type PartialArtCodecConfig } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

const checkoutRoot = process.cwd();
const patterns: FSRecordsPattern[] = [
  {
    base: '.',
    pattern: '**/_records/**/*.art',
    ignored: ['node_modules/', '.git/', 'dist/'],
    excluded: [],
    gitignore: true,
  },
];
const fsRecords = createFSRecordsAdapter({ basePath: checkoutRoot, patterns });
const codecOptions: PartialArtCodecConfig = {};
const codec: ArtCodec = createArtCodec(codecOptions);
const documentRecords = createRecordsDocument<FSRecordFile>({
  codec,
  createContentSource: (file: FSRecordFile) => fsRecords.createContentSource(file),
});

const files = await fsRecords.discoverRecordFiles();
const readableFiles = files.filter(file => file.error === undefined);
const documents = await Promise.all(readableFiles.map(file => documentRecords.read(file)));
const recordGroups = await Promise.all(documents.map(document => document.extract()));
const allRecords = recordGroups.flat();

for (const record of allRecords) {
  record.owner = 'foo';
}

await Promise.all(documents.map(document => document.save()));
```

Saving each `RecordsDocumentBase` collection once writes each document once — one write per file, regardless of how many of its records changed.

## Public API

These are the exact exports of `src/index.ts`.

```ts
import type {
  ArtCodec,
  ArtContentSource,
  ArtDocument,
  ArtDocumentSource,
} from '@art-md/primitives';
import type { SectionBlock } from '@art-md/constructs';

export type RecordSection = Omit<SectionBlock, 'name'> & {
  readonly name: string;
};

export interface ArtRecord {
  name: string;
  __section: RecordSection;
  renameField(oldName: string, newName: string): void;
  save(): Promise<void>;
  [fieldName: string]: unknown;
}

export interface ArtRecordCapsuleContext {
  readonly section: SectionBlock;
  readonly source: ArtDocumentSource;
  readonly document?: ArtDocument;
  readonly save: () => Promise<void>;
}

export interface ArtRecordCapsule {
  readonly section: RecordSection;
  getName(): string;
  setName(name: string): void;
  getField(name: string): string | undefined;
  setField(name: string, value: unknown): void;
  renameField(oldName: string, newName: string): void;
  deleteField(name: string): boolean;
  fieldNames(): string[];
  save(): Promise<void>;
}

export type ArtRecordCapsuleFactory = (context: ArtRecordCapsuleContext) => ArtRecordCapsule;

export interface CreateRecordsDocumentOptions<TFile> {
  codec: ArtCodec;
  createContentSource(file: TFile): ArtContentSource;
  capsuleFactory?: ArtRecordCapsuleFactory;
}

export interface RecordsDocument<TFile> {
  read(file: TFile): Promise<RecordsDocumentBase>;
  create(file: TFile): Promise<RecordsDocumentBase>;
}

export interface RecordsDocumentBase {
  assertPresence(name: string): Promise<boolean>;
  extract(): Promise<ArtRecord[]>;
  addRecord(): ArtRecord;
  save(): Promise<void>;
}

export function createRecordsDocument<TFile>(
  options: CreateRecordsDocumentOptions<TFile>,
): RecordsDocument<TFile>;
```

### Reserved names

Handle members (`name`, `__section`, `save`, `renameField`) are reserved on the record proxy; a field must not carry one of those names. The `__` prefix is reserved for handle members: no field may be named `__*`. This keeps every handle accessor collision-free against dynamic field properties. `record.name` is typed writable and guarded at runtime for extracted and saved records; `record.__section.name` is typed readonly.

## Record and Capsule Model

One public `ArtRecord` type covers both extracted and newly created records. There is no `NewArtRecord` subtype and no `setSource()`: the source is provided when the record is created — by extraction or by `addRecord()` — and is immutable afterwards.

The capsule is the single mutation seam. `ArtRecordCapsuleContext` gives a capsule implementation its `SectionBlock`, bound source, optional containing document, and a save callback. The default capsule is plain state over the section AST; the public proxy delegates field access, `renameField`, and `save()` to it. Both the provider and the default capsule factory accept an optional `capsuleFactory` — the one v0.0.1 concession to a shape that has no current consumer: a reactive capsule (v1) must track reads and mutations internally, and injecting it after v0.0.1 would change the public `ArtRecord` shape, so the seam ships now and the default stays plain.

An extracted record's capsule carries its containing document; a record added through `addRecord()` carries no document until its first save creates one. This distinction is internal — it drives the name-mutation guard and the save path only.

## Field and Section Behaviour

A field property such as `record.owner` resolves by exact field name against the section's `FieldInline` or `FieldBlock` children. Setting a missing field appends a new inline field at the end of `section.children`. `renameField()` changes the field label in place and preserves its position. `delete record.owner` removes the construct.

`record.__section` exposes the complete `SectionBlock`, including its properties (`depth`, `tags`) and ordered children. Changing `record.__section.depth` changes the heading level written on save. Field values read back as their natural text representation; fixtures assert inline and block field reads round-trip through the codec.

## Persistence and Fidelity

`record.save()` and `RecordsDocumentBase.save()` both delegate to `ArtDocumentSource.writeDocument()`: the source serializes the whole document with the injected codec, then hands the resulting content to its `ArtContentSource`, which persists it. The records package contains no serialization or I/O implementation of its own and never returns a Markdown string to the consumer.

The v0.0.1 fidelity contract is the Art MD codec contract: **structural round-trip, not byte identity.** All valid Markdown structure — sections, fields, nesting, order — is preserved; extraneous whitespace, CRLF line endings, heading indentation, and the final newline may be normalised per CommonMark. Granular (line-level) writes and write guards are not part of v0.0.1 (MANAGEMENT decision, 2026-10-19): saves are whole-document, and the source contract carries no revision token.

## Codec and Persistence Boundary

Art Work creates the codec and injects it into `createRecordsDocument`. Records creates an `ArtDocumentSource` for each content source. That source uses the supplied codec for parsing and serialization and delegates persistence to its `ArtContentSource`.

`@art-js/records` imports the source, codec, and document contracts from `@art-md/primitives@0.0.5`, and construct types from `@art-md/constructs@0.0.5`. It does not import `@art-md/codec` at runtime or implement filesystem access. Art Work imports the runtime `createArtCodec` factory from `@art-md/codec`.

## Source Layout

```text
libs/records/src/
├── index.ts
├── records-document/                  # public provider and per-document collection
│   ├── types.ts
│   └── createRecordsDocument.ts
├── record/                            # public record handle types
│   └── types.ts
└── private/
    ├── records-document/              # per-file read, section extraction, addRecord
    ├── fields/                        # field lookup and AST mutation
    └── record/                        # capsule factory, proxy, new-record factory
```

`src/index.ts` exports only symbols from public folders under `src/`. It does not export from `src/private/`; the new-record factory that backs `addRecord()` lives there.

## Testing

Integration tests live in `$PROJECT/tests/records` (package `@art-js/test-records`): one fixture directory per use case under `tests/records/fixtures/`, each holding record files plus a `run-test.ts` exporting `runTest()`. A runner discovers the directories, imports each `runTest`, and reports pass/fail; a directory prefixed with `_` is a known failure and is skipped until its code is ready. The fixture id is the directory name; the use-case-to-fixture map is maintained in [`../overview.md`](../overview.md).

Unit tests in `libs/records` stay minimal; behaviour is asserted through the fixture harness, which exercises the codec and the FS adapter end to end.

## Notes

### Assumptions

- One provider is configured once per consumer with a codec and a file-to-content-source factory; each `read(file)` or `create(file)` call returns a collection for exactly that document.
- A `RecordsDocumentBase` instance and all records extracted from it share one parsed document and one source; saving the collection writes that document once.
- The consumer interprets headings. Records carries no `kind` and no heading parsing (CEO decision, 2026-10-14).

### Decisions

- Provider shape: `createRecordsDocument({ codec, createContentSource })` returns a provider; `read(file)` returns the collection for an existing document, `create(file)` for a new one. File discovery stays in `@art-lib/fs-records`.
- One unified `ArtRecord`; source fixed at creation; `record.save()` is the persistence API. No string-returning `update`/`serialize` surface.
- Codec is created by the consumer and injected; Records implements no I/O and instantiates no codec.
- `addRecord()` is the only creation route; the new-record factory is internal (`src/private/`).
- Save fidelity is whole-document codec serialization with structural (not byte) identity (MANAGEMENT, 2026-10-19).

### Limitations

- Saving one `RecordsDocumentBase` collection writes the whole document and may include other in-memory record mutations in that document.
- `create(file)` plus `addRecord()` targets new or empty files; adding a record to a populated document is not supported in v0.0.1.
- A new record requires a non-empty name before save; the destination directory must exist.
- Extracted record names are guarded immutable at runtime (silent in non-strict mode if reassigned); the public type stays writable so the new-record flow can assign it.
