# Overview: Records

**Purpose:** Summarise what `@art-js/records` does and where it fits. The record model and usage flows are specified in [`design/records.md`](design/records.md); the field API is specified in [`design/fields.md`](design/fields.md).

`@art-js/records` turns Art MD sections into source-bound record handles. Two concerns run through the package and are documented separately: **records** — identity, extraction, section structure, and saving through the source; **fields** — the values set on and read from a handle.

## Responsibilities

### Records

- Check record presence and extract every section from one document.
- Expose structural access through `record.__section`.
- Save mutations through the source associated with the document.
- Delegate handle operations to an internal capsule, so a reactive variant can replace it without changing the public handle.
- Leave file discovery and the implementation of reading/writing to source providers such as `@art-lib/fs-records`.
- Accept a consumer-created codec and per-file content-source factory; Records builds the document source for each file.

### Fields

- Set a field from a markdown string or an Art AST construct; the block/inline shape follows the value rather than the caller ([`design/fields.md`](design/fields.md)).
- Read a field back as markdown through the default accessor, as text, or as its raw Art AST construct.
- Address fields by canonical name through the `name → field` index, and rename or delete them by name.

## Use Cases

Each use case is exercised by a fixture directory under `$PACKAGE/tests/fixtures/` whose id is listed in the Fixture column. Vitest discovers cases with `fixtures/**/integration.test.ts`; a fixture may cover several related routes and asserts the final file state after one save.

| Use case                                                      | Target | Route                                                                  | Fixture                                               |
| ------------------------------------------------------------- | ------ | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| Set up the records provider (codec, adapter, provider)        | v0.0.1 | `createRecordsDocument({ codec, createContentSource })`                | `01-setup-provider`                                   |
| Discover record files                                         | v0.0.1 | `@art-lib/fs-records` adapter                                          | `02-discover-record-files`                            |
| Check that a record exists and extract its sections           | v0.0.1 | `recordsDocument.hasRecord(name)`, `await recordsDocument.extract()`   | `03-read-assert-extract`                              |
| Read fields by canonical field name                           | v0.0.1 | [Fields — Reading Field Values](design/fields.md)                      | `04-field-read`                                       |
| Write an existing field                                       | v0.0.1 | [Fields — Setting Field Values](design/fields.md)                      | `05-write-field`                                      |
| Add a field                                                   | v0.0.1 | [Fields — Setting Field Values](design/fields.md)                      | `06-add-field`                                        |
| Remove a field                                                | v0.0.1 | [Fields — Field and Section Behaviour](design/fields.md)               | `07-remove-field`                                     |
| Rename a field by name                                        | v0.0.1 | [Fields — Field Names](design/fields.md)                               | `08-rename-field-in-place`                            |
| Inspect section structure and depth                           | v0.0.1 | `record.__section`                                                     | `09-section-depth`                                    |
| Persist every in-memory record of a document with one save    | v0.0.1 | `await record.save()` / collection `save()`                            | `10-save-document-collection`                         |
| Create a new record in a new file                             | v0.0.1 | `await recordsDocument.create(file)`, then `addRecord()`               | `11-create-new-record`                                |
| Add a record to an existing, populated document               | v0.0.1 | `recordsDocument.read(file)`, then `addRecord()`                       | `12-add-record-to-existing-document`                  |
| Insert a record before or after a sibling record              | v0.0.1 | `addRecord({ before: record })` / `addRecord({ after: record })`       | `13-add-sibling-record`                               |
| Reject sibling placement with a foreign anchor                | v0.0.1 | `addRecord({ before: foreign })` throws and inserts nothing            | `14-add-sibling-record-throws-on-foreign-anchor`      |
| Append or prepend a record under a parent record              | v0.0.1 | `addRecord({ appendTo: record })` / `addRecord({ prependTo: record })` | `15-add-record-under-parent`                          |
| Reject parent placement with a foreign anchor                 | v0.0.1 | `addRecord({ appendTo: foreign })` throws and inserts nothing          | `16-add-record-under-parent-throws-on-foreign-anchor` |
| Batch save across documents                                   | v0.0.1 | per-document `save()` via `Promise.all`                                | `17-batch-save`                                       |
| Update by canonical name, keeping the loaded label            | v0.0.1 | [Fields — Field Names](design/fields.md)                               | `18-canonical-name-round-trip`                        |
| Resolve duplicate field names: first wins, promote on removal | v0.0.1 | [Fields — Field Names](design/fields.md)                               | `19-duplicate-field-names`                            |
| Abort extraction when a label resolves to a reserved name     | v0.0.1 | [Fields — Reserved names](design/fields.md)                            | `20-reserved-label-throws`                            |

### WIP: use-case and fixture alignment

- "Set up the records provider" is a recipe rather than a consumer outcome; every fixture performs it, and `01-setup-provider` covers it end to end.
- The reactive use cases have no fixtures until the reactive capsule variant lands (v1).

## Flow

1. The adapter discovers files and creates one content source per file.
2. The consumer creates a codec and binds it with the content source in an `ArtDocumentSource`.
3. `createRecordsDocument({ codec, createContentSource })` returns a provider; both `read(file)` and `create(file)` return a `RecordsDocumentCollection`.
4. A caller extracts and mutates records from a collection returned by `read(file)`, or adds records — with optional placement — to a collection returned by either `read(file)` or `create(file)`; section properties are accessible through `record.__section`, with `depth` read-only.
5. `record.save()` and collection `save()` delegate serialization and persistence to the document source.

## Dependencies

- `@art-md/primitives` — content, document-source, and codec contracts.
- `@art-md/constructs@0.0.5` — section and field constructs; source contracts are `@art-md/primitives@0.0.5`.
- `@art-md/codec` — runtime codec created by the consumer and injected into the records provider; not instantiated by `@art-js/records`.
- `@art-lib/fs-records` — optional filesystem-backed discovery and content sources.

## Notes

- `record.save()` is a source-bound operation, not a `string`-returning use case; serialization happens inside the injected `ArtDocumentSource`.
- v0.0.1 fidelity is whole-document codec serialization with structural (not byte) identity: whitespace, CRLF, and the final newline may be normalised. Granular writes and write guards are deferred (MANAGEMENT decision, 2026-10-19). See the design document's "Persistence and Fidelity" section.
- Design decisions live in [`adr/records.art`](adr/records.art) and [`adr/fields.art`](adr/fields.art).

## Pending
