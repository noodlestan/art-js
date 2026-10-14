# Design: Records

**Purpose:** Describe the design of `@art-js/records` — what consumers use and how they use it (the public API), and how it works and is decomposed internally (the internal contracts).

**Scope:** the `@art-js/records` package in `$PROJECT/libs/records/`. Upstream contracts belong to `@art-md`; filesystem and CLI concerns belong to `@art-lib/fs-records` and the Art Work CLI.

## The model at a glance

A **record** is a section of an Art MD document: identity is its heading text, data is its field blocks. The package wraps documents into capsules consumers can read, mutate, and write back — on content strings, never the filesystem.

```ts
ArtRecord { name }                          // identity: the whole heading text, verbatim
   ↓ wrapped in
ArtRecordCapsule<T>                         // the record handle
   ↓ created per document by
Records<T> { assertPresence, extract, update, serialize }
```

## Consumer API

### What consumers use

| Entry point              | Signature                                                        | Use                                                   |
| ------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------- |
| `createRecords`          | `createRecords<T>(source: ArtDocumentSource): Records<T>`        | open a document's records                             |
| `Records.assertPresence` | `(name: string): boolean`                                        | exact heading-text presence check                     |
| `Records.extract`        | `(): ArtRecordCapsule<T>[]`                                      | one capsule per section, no filtering                 |
| `Records.update`         | `(capsule, options?: WriteBackOptions): string`                  | guarded splice over existing content                  |
| `Records.serialize`      | `(capsule): string`                                              | content for a new file                                |
| `assertRecordPresence`   | `(document: ArtDocument, name: string): boolean`                 | free-function form                                    |
| `extractRecords`         | `(document: ArtDocument): ArtRecordCapsule<T>[]`                 | free-function form                                    |
| `writeRecord`            | `(content: string, capsule, options?: WriteBackOptions): string` | the splice primitive                                  |
| `createProxyObject`      | `(capsule, resolver: FieldResolver): T`                          | transparent field access (opt-in by construction)     |
| `createFieldResolver`    | `<T extends ArtRecord>(record: T): FieldResolver`                | default field mapping — consumers never hand-roll one |

### How consumers use it

```ts
// read
const records = createRecords<MyRecord>(source);
if (records.assertPresence('Checkout: Art Work')) {
  /* … */
}
for (const capsule of records.extract()) console.log(capsule._id.name);

// mutate + write back over existing content (safe path)
const content = records.update(capsule, { guard: true });

// create a new file's content
const fresh = records.serialize(newCapsule);
// → the consumer persists the string (FSContentSource.writeContent)
```

### Identity rules

- `name` is the **whole heading text**, verbatim: `## Checkout: Art Work` → `{ name: 'Checkout: Art Work' }`.
- **Records carries no kind and parses nothing.** Every `SectionBlock` is a record; the package never splits, filters, or interprets headings. Kind detection, `Kind: Name` parsing, and kind→type mapping are consumer responsibilities (a future `art-js/resources` layer). _CEO decision, 2026-10-14._
- `field.modifiedValue` is records-domain tracking state owned by the resolver; constructs stay a pure parse model.

## Internal decomposition

```
libs/records/src/
├── record/       ArtRecord identity + SectionBlock bridge (name copy, no parsing)
├── capsule/      ArtRecordCapsule<T> — identity transport, lazy hydration
├── extract/      presence assertion + extraction into capsules
├── write-back/   RecordPosition anchors, opt-in hash guard, the line-splice
├── proxy/        FieldResolver + createFieldResolver + createProxyObject
└── records/      the Records<T> facade tying extract + write-back together
```

Module dependency chain (mirrors the implementation order): `record` → `capsule` → `extract` + `write-back` → `proxy` (resolver + proxy share `FieldResolver`) → `records` facade + `index.ts` wiring. The facade depends on `extract`/`write-back` — **not** on the proxy.

## Internal contracts

- **Bridge is a copy, not a parse.** `createArtRecord(block): ArtRecord` = `{ name: block.name }`. The upstream constructs release must be the one where `name` is the complete heading (the parser used to split headings; the kind-free release is a hard dependency).
- **Lazy, pull-based capsules.** `_id` (identity) is eager; `_maybeRecord`/`raw()` hydrate lazily from `_source: ArtDocumentSource`. Nothing is computed until a consumer pulls.
- **Write-back is a pure line-splice.** `writeRecord(content, capsule, options?)` replaces exactly the anchored record section (`RecordPosition{startLine, endLine?}`); everything outside the anchors passes through byte-identical — tables, comments, ordering, blank lines, the final newline. No codec, no I/O. This byte-for-byte guarantee is the splice's own; upstream round-trip fidelity is structural only (CommonMark normalisation applies to `serialize` output).
- **Hash guard is opt-in.** `WriteBackOptions.guard` defaults off. Guarded writes refuse (typed error) when content no longer matches the capsule's snapshot; the adapter re-reads after each `writeContent()`, so line anchors computed against the given content stand and the guard covers out-of-band drift.
- **One serializer.** `serialize(capsule)` builds a `SectionBlock` (`name` = full heading text) and calls `codec.serialize`. `@art-md/codec` is the ecosystem's only markdown emitter; this package never builds markdown strings itself.
- **Safe vs unsafe split.** `update` = guarded write over existing content; `serialize` = unguarded, for newly created files (no prior bytes to protect).
- **Single responsibility boundary.** No filesystem access, no codec implementation, no re-exports of `@art-md` symbols — `src/index.ts` exports only this package's own surface.

## Dependencies

```
@art-lib/fs-records, Art Work CLI
          ↓ consume
     @art-js/records
          ↓ contracts        ↓ implementation
 @art-md/primitives   @art-md/codec        (+ @art-md/constructs for SectionBlock/FieldBlock/FieldInline)
```

- **Contracts only from upstream** — `ArtContentSource`, `ArtDocumentSource` come from `@art-md/primitives`; construct types from `@art-md/constructs` (kind-free release, hard requirement).
- **Consumers import contracts from `@art-md/primitives` directly** — this package re-exports nothing of theirs.
- **Downstream** — `@art-lib/fs-records` persists strings (`FSContentSource.writeContent()`); the Art Work CLI loops per document.
