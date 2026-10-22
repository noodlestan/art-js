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

Each use case is exercised by an integration fixture: a directory under `tests/records/fixtures/` (package `@art-js/test-records`) whose id is listed in the Fixture column. The runner discovers fixture directories, imports each `run-test.ts`, and reports pass/fail.

| Use case                                                              | Target | Route                                                                   | Fixture                                                                             |
| --------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Set up the records provider (codec, adapter, provider)                | v0.0.1 | `createRecordsDocument({ codec, createContentSource })`                 | `01-setup-provider`                                                                 |
| Discover record files                                                 | v0.0.1 | `@art-lib/fs-records` adapter                                           | `02-discover-record-files`                                                          |
| Check that a record exists                                            | v0.0.1 | `recordsDocument.hasRecord(name)`                                       | `03-read-assert-extract`                                                            |
| Extract document sections                                             | v0.0.1 | `await recordsDocument.extract()`                                       | `03-read-assert-extract`                                                            |
| Read fields                                                           | v0.0.1 | `record['Artist']` or `record.__section`                                | `04-field-read`                                                                     |
| Write fields                                                          | v0.0.1 | `record['Artist'] = value`                                              | `05-write-field`                                                                    |
| Add a field                                                           | v0.0.1 | `record['Artist'] = value`                                              | `06-add-field`                                                                      |
| Remove a field                                                        | v0.0.1 | `delete record['Born']`                                                 | `07-remove-field`                                                                   |
| Rename a field and write its value; keep the record heading immutable | v0.0.1 | `record.renameField()` and field assignment                             | `08-rename-field-in-place`                                                          |
| Read fields reactively                                                | v1     | reactive proxy                                                          | — (v1)                                                                              |
| Inspect section structure and depth                                   | v0.0.1 | `record.__section`                                                      | `09-section-depth`                                                                  |
| Mutate fields with reactive propagation                               | v1     | reactive proxy                                                          | — (v1)                                                                              |
| Mutate a record reactively                                            | v1     | reactive proxy                                                          | — (v1)                                                                              |
| Persist changes with field order and section structure preserved      | v0.0.1 | `await record.save()`                                                   | `09-section-depth`, `10-save-document-collection`                                   |
| Create a new record in a new file                                     | v0.0.1 | `await recordsDocument.create(file)`, then `addRecord()`                | `11-create-new-record`                                                              |
| Add a record to an existing document                                  | v0.0.1 | `recordsDocument.read(file)`, then `addRecord()`                        | `12-add-record-to-existing-document`                                                |
| Insert a record before or after a sibling record                      | v0.0.1 | `addRecord({ before: record })` or `addRecord({ after: record })`       | `13-add-sibling-record`, `14-add-sibling-record-throws-on-foreign-anchor`           |
| Append or prepend a record under a parent record                      | v0.0.1 | `addRecord({ appendTo: record })` or `addRecord({ prependTo: record })` | `15-add-record-under-parent`, `16-add-record-under-parent-throws-on-foreign-anchor` |
| Batch save across documents                                           | v0.0.1 | per-document `save()` via `Promise.all`                                 | `17-batch-save`                                                                     |
| Delete a record from a document                                       | v0.0.1 | `deleteRecord()`                                                        | —                                                                                   |

### WIP: use-case and fixture alignment

- "Set up the records provider" is a recipe rather than a consumer outcome; if MANAGEMENT rejects it as a use case, reclassify `01-setup-provider` as a supporting fixture for the read-path use cases.
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
