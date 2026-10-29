# Design: Records

**Status:** v0.0.1 design — implemented in `$PROJECT/libs/records`, exercised by the integration fixtures in `$PROJECT/tests/records`; CI green.

**Purpose:** Define the record API consumers use to read documents, receive source-bound record proxies, mutate them, and save through their source.

**Scope:** `@art-js/records` owns record extraction, record handles, section placement, and save orchestration. It does not implement filesystem access. It consumes generic Art MD document sources, which may be backed by files, memory, a network, or another I/O system.

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
const present = await projectDocument.hasRecord('Project: Art JS');
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

`read(file)` creates the per-file source and parses its document. `hasRecord(name)` tells whether any section, at any depth, carries that complete heading name. `extract()` returns one proxy handle per `SectionBlock`, at any depth, including field-less sections. The heading name is the complete heading text; Records carries no `kind` and filters no sections. Consumers filter discovery results by `FSRecordFile.error?` before reading, per the Art Lib degrade-not-fail contract.

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
await project.save();
```

Setting a missing field appends it to the section. Renaming a field changes its label in place. Deleting a field (`delete record.owner`) removes it. The record heading is identity and cannot be renamed after extraction. Section depth is read-only: placement fixes it at creation (see Creating New Records) and the heading level written on save always matches it. `save()` writes the containing document once through the record's bound source; other in-memory edits to that document are included in the same write.

### Creating New Records

A new record is created through its document collection. `read(file)` requires the file to exist — it parses the document — so the provider also offers `create(file)`, which binds the file's content source to an empty in-memory document without touching disk. Both return the same collection type, so `addRecord()` is available after either call. Art Work creates the destination directory first.

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
record.owner = 'foo';
await record.save();
```

`addRecord()` creates a record handle with an empty `SectionBlock`, places it in the collection's document, and returns it. Its `name` is assignable until the first save and immutable afterwards, matching extracted records. `save()` serializes the document containing the added record and writes the file; the destination directory must exist, and `create(file)` writes nothing until a save.

#### Placement

`addRecord(position?)` places the new section relative to an anchor and derives the heading depth from that placement:

| Call                               | Anchor        | Position                                | Depth          |
| ---------------------------------- | ------------- | --------------------------------------- | -------------- |
| `addRecord()`                      | document root | end of `document.children`              | `1` (h1)       |
| `addRecord({ before: record })`    | sibling       | immediately before the anchor section   | anchor depth   |
| `addRecord({ after: record })`     | sibling       | immediately after the anchor's subtree  | anchor depth   |
| `addRecord({ appendTo: record })`  | parent        | end of the anchor's children            | anchor depth+1 |
| `addRecord({ prependTo: record })` | parent        | before the anchor's first child section | anchor depth+1 |

New sections are always placed relative to existing sections, never before a container's own fields: `prependTo` inserts before the parent's first child section if one exists and at the end of the parent's children otherwise; appends always target the end. The same rule governs the no-argument document-root default and containers without any sections. A record appended to a document root keeps any preceding content in place, including sections at other depths; a later validator may flag that state (MANAGEMENT, 2026-10-21, 2026-10-22).

Anchors are records extracted from the same collection. Adding to a populated document is supported: read the file with `read(file)`, then call `addRecord()`. Placement never asks the caller for a depth: the new section's depth is derived from the resolved insertion point. Every anchor must belong to the collection's document, meaning its `__section` must be on the document's construct tree. An anchor extracted from another file, returned by `createRecord()` before its first save, or since removed from the tree is _foreign_; all four placements throw `The placement anchor is not part of this document` and insert nothing.

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

Saving each `RecordsDocumentCollection` once writes each document once — one write per file, regardless of how many of its records changed.

## Public API

These are the exact exports of `src/index.ts`.

```ts
import type { SectionBlock } from '@art-md/constructs';
import type { ArtCodec, ArtContentSource } from '@art-md/primitives';

export type RecordSection = Omit<SectionBlock, 'name' | 'depth'> & {
  readonly name: string;
  readonly depth: number;
};

export type ArtRecord = {
  name: string;
  __section: RecordSection;
  renameField(oldName: string, newName: string): void;
  save(): Promise<void>;
  [fieldName: string]: unknown;
};

export type AddRecordPosition =
  | { before: ArtRecord }
  | { after: ArtRecord }
  | { appendTo: ArtRecord }
  | { prependTo: ArtRecord };

export type RecordContext = {
  codec: ArtCodec;
  contentSource: ArtContentSource;
};

export type RecordsDocumentCollection = {
  hasRecord(name: string): Promise<boolean>;
  extract(): Promise<ArtRecord[]>;
  addRecord(position?: AddRecordPosition): ArtRecord;
  save(): Promise<void>;
};

export type RecordsDocument<RecordFile> = {
  read(file: RecordFile): Promise<RecordsDocumentCollection>;
  create(file: RecordFile): Promise<RecordsDocumentCollection>;
};

export type RecordsDocumentContext<RecordFile> = {
  codec: ArtCodec;
  createContentSource(file: RecordFile): ArtContentSource;
};

export function createRecordsDocument<RecordFile>(
  options: RecordsDocumentContext<RecordFile>,
): RecordsDocument<RecordFile>;

export function createRecord(options: RecordContext): ArtRecord;
```

### Reserved names

Handle members (`name`, `__section`, `save`, `renameField`) are reserved on the record proxy; a field must not carry one of those names. The `__` prefix is reserved for handle members: no field may be named `__*`. This keeps every handle accessor collision-free against dynamic field properties. `record.name` is typed writable and guarded at runtime for extracted and saved records. `record.__section.name` and `record.__section.depth` are typed readonly and guarded at runtime.

## Record Model

One public `ArtRecord` type covers both extracted and newly created records. There is no `NewArtRecord` subtype and no `setSource()`: the source is provided when the record is created — by extraction, by `addRecord()` on a collection, or by `createRecord()` — and is immutable afterwards.

The proxy delegates field access, `renameField`, and `save()` to an internal record capsule. The capsule and its context are implementation details under `src/record/private/`: they are not exported, and `createRecordsDocument()` accepts no capsule factory option. A reactive capsule would be introduced as an internal change to that seam.

Records produced by a collection — through `extract()` or `addRecord()` — share the collection's document and source. `createRecord()` is the standalone factory: it binds a content source to an empty section at depth 1 and, on first save, wraps that section in a document of its own. The collection route is preferred because it shares one document and one source across every record in the file.

## Field and Section Behaviour

A field property such as `record.owner` resolves by exact field name against the section's `FieldInline` or `FieldBlock` children. Setting a missing field appends a new inline field at the end of `section.children`. `renameField()` changes the field label in place and preserves its position. `delete record.owner` removes the construct.

`record.__section` exposes the complete `SectionBlock`, including its properties (`depth`, `tags`) and ordered children. `record.__section.depth` is read-only: placement fixes it at creation and the heading level written on save always matches it. Field values read back as their natural text representation; fixtures assert inline and block field reads round-trip through the codec.

## Persistence and Fidelity

`record.save()` and `RecordsDocumentCollection.save()` both delegate to `ArtDocumentSource.writeDocument()`: the source serializes the whole document with the injected codec, then hands the resulting content to its `ArtContentSource`, which persists it. The records package contains no serialization or I/O implementation of its own and never returns a Markdown string to the consumer.

The v0.0.1 fidelity contract is the Art MD codec contract: **structural round-trip, not byte identity.** All valid Markdown structure — sections, fields, nesting, order — is preserved; extraneous whitespace, CRLF line endings, heading indentation, and the final newline may be normalised per CommonMark. Granular (line-level) writes and write guards are not part of v0.0.1 (MANAGEMENT decision, 2026-10-19): saves are whole-document, and the source contract carries no revision token.

## Codec and Persistence Boundary

Art Work creates the codec and injects it into `createRecordsDocument`. Records creates an `ArtDocumentSource` for each content source. That source uses the supplied codec for parsing and serialization and delegates persistence to its `ArtContentSource`.

`@art-js/records` imports the source, codec, and document contracts from `@art-md/primitives@0.0.5`, and construct types from `@art-md/constructs@0.0.5`. It does not import `@art-md/codec` at runtime or implement filesystem access. Art Work imports the runtime `createArtCodec` factory from `@art-md/codec`.

## Source Layout

```text
libs/records/src/
├── index.ts                          # public type exports
├── api/                              # public value exports
├── record/                           # record handle types, standalone factory, section wrapping
│   └── private/                      # capsule, proxy, field lookup and AST mutation
└── records-document/                 # provider and per-document collection
    ├── types.ts
    ├── createRecordsDocument.ts
    └── private/                      # collection factory, section traversal, placement
```

`src/index.ts` re-exports public types from `record/types.ts` and `records-document/types.ts`, plus the value exports from `src/api/`: `createRecordsDocument()` and `createRecord()`. It never exports from a `private/` folder.

## Testing

Integration tests live in `$PROJECT/tests/records` (package `@art-js/test-records`): one fixture directory per use case under `tests/records/fixtures/`, each holding record files plus a `run-test.ts` exporting `runTest()`. A runner discovers the directories, imports each `runTest`, and reports pass/fail; a directory prefixed with `_` is a known failure and is skipped until its code is ready. The fixture id is the directory name; the use-case-to-fixture map is maintained in [`../overview.md`](../overview.md).

Unit tests in `libs/records` stay minimal; behaviour is asserted through the fixture harness, which exercises the codec and the FS adapter end to end.

## Notes

### Assumptions

- One provider is configured once per consumer with a codec and a file-to-content-source factory; each `read(file)` or `create(file)` call returns a collection for exactly that document.
- A `RecordsDocumentCollection` and all records extracted from it share one parsed document and one source; saving the collection writes that document once. Records added through `addRecord()` join that same document and source.
- Placement anchors must belong to the collection's document. A foreign anchor — extracted from another file, a standalone `createRecord()` handle, or a removed section — throws from every placement and inserts nothing.
- The consumer interprets headings. Records carries no `kind` and no heading parsing (CEO decision, 2026-10-14).

### Decisions

- Provider shape: `createRecordsDocument({ codec, createContentSource })` returns a provider; `read(file)` returns the collection for an existing document, `create(file)` for a new one. File discovery stays in `@art-lib/fs-records`.
- One collection type: `read(file)` and `create(file)` both return `RecordsDocumentCollection`, exposing `hasRecord`, `extract`, `addRecord`, and `save` (MANAGEMENT, 2026-10-21).
- One unified `ArtRecord`; source fixed at creation; `record.save()` is the persistence API. No string-returning `update`/`serialize` surface.
- Codec is created by the consumer and injected; Records implements no I/O and instantiates no codec.
- `addRecord(position?)` placement and depth derivation as tabled under Creating New Records; no argument appends to the document root at h1 (MANAGEMENT, 2026-10-21, 2026-10-22).
- `record.__section.depth` is read-only (MANAGEMENT, 2026-10-21).
- No public capsule surface: the capsule and its context stay internal under `src/record/private/`; `createRecord()` is the standalone record factory.
- Save fidelity is whole-document codec serialization with structural (not byte) identity (MANAGEMENT, 2026-10-19).

### Limitations

- Saving one `RecordsDocumentCollection` writes the whole document and may include other in-memory record mutations in that document.
- `create(file)` writes nothing until a save; the destination directory must exist.
- A new record requires a non-empty name before save.
- A record appended to a populated document root may follow content at other depths; a later validator may flag it, but v0.0.1 ships none.
- Extracted record names are guarded immutable at runtime (silent in non-strict mode if reassigned); the public type stays writable so the new-record flow can assign it.
