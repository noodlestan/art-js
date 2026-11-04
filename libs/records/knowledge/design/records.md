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

project.repository = 'art-js';
project.renameField('repository', 'checkout');
project.maintainer = 'foo';
await project.save();
```

Setting a name that is not in the record's index appends a new inline field at the end of `section.children`. `renameField(fromName, toName)` renames by name: it relabels the field bound to `fromName` to `nameToLabel(toName)` in place, preserving its position, and forgets the old spelling. Deleting a field (`delete record.repository`) removes the construct bound to that name. All three operations address fields by name (see Field Names). The record heading is identity and cannot be renamed after extraction. Section depth is read-only: placement fixes it at creation (see Creating New Records) and the heading level written on save always matches it. `save()` writes the containing document once through the record's bound source; other in-memory edits to that document are included in the same write.

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
record.repository = 'art-js';
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
  record.repository = 'art-js';
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
  { before: ArtRecord } | { after: ArtRecord } | { appendTo: ArtRecord } | { prependTo: ArtRecord };

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

Handle members (`name`, `__section`, `save`, `renameField`) are reserved on the record proxy, and every `__`-prefixed name is reserved for the API. Addressing a field by a reserved name throws a `TypeError` on read, write, and delete, and a document field label that resolves to a reserved name aborts extraction. This keeps every handle accessor collision-free against dynamic field properties. `record.name` is typed writable and guarded at runtime for extracted and saved records. `record.__section.name` and `record.__section.depth` are typed readonly and guarded at runtime. The reachable reserved set, the exact extraction error, and the distinction between reserved **names** and `__`-prefixed **labels** are specified in [Field Names](#field-names).

## Field Names

Records address fields by **field name**, never by the label written in the document. A field name is either derived from the stored label at extraction (`labelToName`) or supplied by the consumer through the API. The stored label itself is never rewritten by a value update.

### Canonical grammar

A canonical field name matches `/^[a-z][a-zA-Z0-9]*$/` — a leading lowercase letter followed by letters and digits (`userId`, `a333`, `repo2Branch`). The grammar is a syntax gate on names **supplied through the API only**: creating a field whose name is not in the index, and renaming to a new name, must pass it. Names derived from document labels are never gated by the grammar — `labelToName` legitimately yields `3A33` or `ação`, and extraction keeps them as-is. The grammar is a syntax test and nothing more: `name`, `save`, and `renameField` are syntactically valid; reservation is a separate predicate (see [Reserved names](#reserved-names)).

### The two guarantees

- **API-created fields always carry a canonical name.** A name that passes the grammar gate is written with the label `nameToLabel(name)`.
- **Extracted fields carry whatever `labelToName` yields.** Extraction never rejects a field because its derived name is not canonical, and never rewrites a stored label retrospectively.

The guarantees are never conflated: a value update through an existing name touches the value only — the stored label, whatever it is, stays in the document.

### labelToName and nameToLabel

`labelToName` (direction A, document → API) is a single left-to-right pass over the label's Unicode code points: every non-word character (`[^\p{L}\p{M}\p{N}]`) is a separator, a lower→upper boundary starts a new word, and an uppercase run stays inside its word; the first word is lowercased and later words are capitalised. A label with no word characters (empty, whitespace, separator-only) throws `TypeError: Field label must contain at least one word character`. It is **not idempotent and never fed its own output**: it maps labels, not names, so `labelToName(labelToName(x))` is undefined behaviour for a label and is never asserted. It is deterministic and pure — no state, no locale sensitivity.

| Input            | Words before join   | Result          | Rule exercised                                         |
| ---------------- | ------------------- | --------------- | ------------------------------------------------------ |
| `Canonical Name` | `Canonical`, `Name` | `canonicalName` | separator + lower→upper                                |
| `aB-a`           | `a`, `B`, `a`       | `aBA`           | lower→upper, then separator, first word lowercased     |
| `aBC`            | `a`, `BC`           | `aBc`           | uppercase run stays one word, rest lowercased          |
| `IDField`        | `IDField`           | `idfield`       | `IDF` never splits; single word lowercased             |
| `NPM Package`    | `NPM`, `Package`    | `npmPackage`    | acronym run kept whole; later word capitalised         |
| `3A33`           | `3`, `A33`          | `3A33`          | digit→upper boundary; first word lowercased is a no-op |
| `0-1-0`          | `0`, `1`, `0`       | `010`           | digits are word characters; separators collapse        |
| `Ação`           | `Ação`              | `ação`          | non-ASCII letters are word characters; single word     |
| `a[b]c`          | `a`, `b`, `c`       | `aBC`           | brackets are separators; three words                   |

`nameToLabel` (direction B, API → document) splits before **every** uppercase letter — unlike `labelToName`, an uppercase run yields one word per letter — and space-joins the words with the first character upper-cased and the remainder **as-is** (`repo2Branch` keeps `epo2` unchanged inside `Repo2`). No validation and no guard: callers pass a name that already passed the grammar.

| Input         | Words             | Result         |
| ------------- | ----------------- | -------------- |
| `userId`      | `user`, `Id`      | `User Id`      |
| `aBC`         | `a`, `B`, `C`     | `A B C`        |
| `repo2Branch` | `repo2`, `Branch` | `Repo2 Branch` |
| `brandNew`    | `brand`, `New`    | `Brand New`    |

**The round trip that must hold** is `labelToName(nameToLabel(name)) === name` for every canonical name: `userId` → `User Id` → `userId`. A **stored label does not round-trip, by design**: `labelToName('IDField')` is `idfield`, `nameToLabel('idfield')` is `Idfield`, and the document still reads `IDField:` because nothing ever rewrote it. Direction A is correct as-is and is never tested as if it round-tripped.

### Reserved names

`isReservedFieldName(name)` is true for any name with a `__` prefix and for the handle-member names `name`, `save`, `renameField`, and `__section`. The two predicates compose rather than overlap: `name` is canonical (syntax) and reserved (collision), and the guard rejects it because it is both.

Only three collisions are reachable from a document: labels `Name`, `Save`, and `Rename Field` resolve to `name`, `save`, and `renameField` and abort extraction with:

```text
TypeError: Field label "Name" resolves to reserved name "name"
```

A `__`-prefixed **name** is reserved for the API gate and never enters the index. A `__`-prefixed **label** is not: `labelToName` treats `_` as a separator, so `__ Owner` converts to the non-reserved name `owner` and loads normally. `labelToName` never emits a `__` prefix, which is why `__section` is unreachable from any label.

### The name → field index

Extraction builds one `name → field` index per record, in document order, mapping `labelToName(label)` to the field construct; the first occurrence of a name wins and later duplicates stay in the section, shadowed. Every access trap is an index lookup — no trap scans section fields or converts a label at access time. Removing the indexed field — by `delete`, or by a `renameField` that vacates the name — promotes the next duplicate, and the promoted field keeps its own stored label (`**Purpose:** Second` promotes under `purpose:` unchanged).

Mutation guards follow the name classes:

- Reserved names throw on read, write, and delete through the proxy.
- The canonical regexp gates creation only: writing a name already in the index updates its value without re-validating the name.
- The delete cells for handle members and for names not in the index report not-removed, surfaced as a `TypeError` by a strict-mode `delete`.

### Derived labels

A new field created through the API is labelled `nameToLabel(name)`: `brandNew` → `Brand New`, `npmPackageDeployment` → `Npm Package Deployment`. The derived label may not match how a consumer would spell the label by hand — a stated limitation of the one-way converter, not a bug.

### Codec constraint

Documents parsed by the Art MD codec only ever carry letter-led labels (`/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`). Arbitrary labels — digit-led, bracketed, non-ASCII-led — exist only in hand-built sections; the converters still handle them and the index still indexes them.

### Decisions

- Canonical field names — grammar, guarantees, converters, and label policy ([`adr/canonical-field-names.art`](../adr/canonical-field-names.art)).
- The `name → field` index — one index at extraction, first-wins, promotion on removal ([`adr/field-name-index.art`](../adr/field-name-index.art)).
- Rename by name — validation order, relabelling, and the forgotten spelling ([`adr/rename-field-by-name.art`](../adr/rename-field-by-name.art)).

## Record Model

One public `ArtRecord` type covers both extracted and newly created records. There is no `NewArtRecord` subtype and no `setSource()`: the source is provided when the record is created — by extraction, by `addRecord()` on a collection, or by `createRecord()` — and is immutable afterwards.

The proxy delegates field access, `renameField`, and `save()` to an internal record capsule. The capsule and its context are implementation details under `src/record/private/`: they are not exported, and `createRecordsDocument()` accepts no capsule factory option. A reactive capsule would be introduced as an internal change to that seam.

Records produced by a collection — through `extract()` or `addRecord()` — share the collection's document and source. `createRecord()` is the standalone factory: it binds a content source to an empty section at depth 1 and, on first save, wraps that section in a document of its own. The collection route is preferred because it shares one document and one source across every record in the file.

## Field and Section Behaviour

A field property such as `record.repository` resolves by field name against the `name → field` index built from the section's `FieldInline` or `FieldBlock` children (see Field Names). Reading a name that is not in the index returns `undefined`. Writing a name that is not in the index appends a new inline field at the end of `section.children`, gated by the canonical grammar and labelled `nameToLabel(name)`; writing a name that is in the index replaces its value in place. `renameField(fromName, toName)` relabels the field bound to `fromName` with `nameToLabel(toName)` and preserves its position; the old spelling is forgotten. `delete record.repository` removes the construct bound to that name.

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

Integration tests live in `$PROJECT/tests/records` (package `@art-js/test-records`): one fixture directory per use case under `tests/records/fixtures/`, each holding record files plus a Vitest `integration.test.ts`. Vitest discovers `fixtures/**/integration.test.ts` and runs each case independently; a failure in one does not stop the others. The fixture id is the directory name; the use-case-to-fixture map is maintained in [`../overview.md`](../overview.md).

Unit tests in `libs/records` stay minimal; behaviour is asserted through the fixture suite, which exercises the codec and the FS adapter end to end. `npm run test:ci` runs the full suite with coverage and gates it at the package convention — lines 90, functions 90, branches 70, statements 90 — measured over `src/`.

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
