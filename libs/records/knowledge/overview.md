# Overview: Records

**Purpose:** Summarise what `@art-js/records` does and where it fits. The full API and usage flows are in [`design/records.md`](design/records.md).

`@art-js/records` turns Art MD sections into source-bound record handles. A handle exposes the full section and proxy-based field access; `record.save()` writes its document through the injected source.

## Responsibilities

- Check record presence and extract every section from one document.
- Expose field access on the record handle and structural access through `record.__section`.
- Save mutations through the source associated with the document.
- Delegate field access and saving from the record proxy to an internal capsule, so a reactive variant can replace it without changing the public handle.
- Leave file discovery and the implementation of reading/writing to source providers such as `@art-lib/fs-records`.
- Accept a consumer-created codec and per-file content-source factory; Records builds the document source for each file.

## Use Cases

Each use case is exercised by a fixture directory under `$PACKAGE/tests/fixtures/` whose id is listed in the Fixture column. Vitest discovers cases with `fixtures/**/integration.test.ts`; a fixture may cover several related routes and asserts the final file state after one save.

| Use case                                                      | Target | Route                                                                               | Fixture                                               |
| ------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Set up the records provider (codec, adapter, provider)        | v0.0.1 | `createRecordsDocument({ codec, createContentSource })`                             | `01-setup-provider`                                   |
| Discover record files                                         | v0.0.1 | `@art-lib/fs-records` adapter                                                       | `02-discover-record-files`                            |
| Check that a record exists and extract its sections           | v0.0.1 | `recordsDocument.hasRecord(name)`, `await recordsDocument.extract()`                | `03-read-assert-extract`                              |
| Read fields by canonical field name                           | v0.0.1 | `record['artist']` resolves the `Artist` label; the label itself is `undefined`     | `04-field-read`                                       |
| Write an existing field                                       | v0.0.1 | `record['born'] = value` replaces the value in place                                | `05-write-field`                                      |
| Add a field                                                   | v0.0.1 | `record['artist'] = value` appends a field labelled `Artist`                        | `06-add-field`                                        |
| Remove a field                                                | v0.0.1 | `delete record['born']`                                                             | `07-remove-field`                                     |
| Rename a field by name                                        | v0.0.1 | `record.renameField('born', 'artist')`                                              | `08-rename-field-in-place`                            |
| Inspect section structure and depth                           | v0.0.1 | `record.__section`                                                                  | `09-section-depth`                                    |
| Persist every in-memory record of a document with one save    | v0.0.1 | `await record.save()` / collection `save()`                                         | `10-save-document-collection`                         |
| Create a new record in a new file                             | v0.0.1 | `await recordsDocument.create(file)`, then `addRecord()`                            | `11-create-new-record`                                |
| Add a record to an existing, populated document               | v0.0.1 | `recordsDocument.read(file)`, then `addRecord()`                                    | `12-add-record-to-existing-document`                  |
| Insert a record before or after a sibling record              | v0.0.1 | `addRecord({ before: record })` / `addRecord({ after: record })`                    | `13-add-sibling-record`                               |
| Reject sibling placement with a foreign anchor                | v0.0.1 | `addRecord({ before: foreign })` throws and inserts nothing                         | `14-add-sibling-record-throws-on-foreign-anchor`      |
| Append or prepend a record under a parent record              | v0.0.1 | `addRecord({ appendTo: record })` / `addRecord({ prependTo: record })`              | `15-add-record-under-parent`                          |
| Reject parent placement with a foreign anchor                 | v0.0.1 | `addRecord({ appendTo: foreign })` throws and inserts nothing                       | `16-add-record-under-parent-throws-on-foreign-anchor` |
| Batch save across documents                                   | v0.0.1 | per-document `save()` via `Promise.all`                                             | `17-batch-save`                                       |
| Update by canonical name, keeping the loaded label            | v0.0.1 | `record['canonicalName'] = value` writes back under `Canonical Name:`               | `18-canonical-name-round-trip`                        |
| Resolve duplicate field names: first wins, promote on removal | v0.0.1 | `record['purpose']`, then `delete record['purpose']` promotes the duplicate         | `19-duplicate-field-names`                            |
| Abort extraction when a label resolves to a reserved name     | v0.0.1 | `extract()` throws `TypeError: Field label "Name" resolves to reserved name "name"` | `20-reserved-label-throws`                            |

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

## Pending
