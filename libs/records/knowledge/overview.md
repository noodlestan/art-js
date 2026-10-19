# Overview: Records

**Purpose:** Summarise what `@art-js/records` does and where it fits. The full API and usage flows are in [`design/records.md`](design/records.md).

`@art-js/records` turns Art MD sections into source-bound record handles. A handle exposes the full section and proxy-based field access; `record.save()` writes its document through the injected source.

## Responsibilities

- Assert presence and extract every section from one document.
- Expose field access on the record handle and structural access through `record.__section`.
- Save mutations through the source associated with the document.
- Accept an injected capsule factory from the first version; the default capsule is plain, and later variants can be reactive.
- Leave file discovery and the implementation of reading/writing to source providers such as `@art-lib/fs-records`.
- Accept a consumer-created codec and per-file content-source factory; Records builds the document source for each file.

## Use Cases

Each use case is exercised by an integration fixture: a directory under `tests/records/fixtures/` (package `@art-js/test-records`) whose id is listed in the Fixture column. A fixture id prefixed with `_` is a known failure — the harness skips it until the code is ready, and it still counts as the intended coverage for that use case. The runner discovers fixture directories, imports each `run-test.ts`, and reports pass/fail.

| Use case                                                         | Target | Route                                                      | Fixture                                            |
| ---------------------------------------------------------------- | ------ | ---------------------------------------------------------- | -------------------------------------------------- |
| Set up the records provider (codec, adapter, provider)           | v0.0.1 | `createArtDocumentRecords({ codec, createContentSource })` | `01-setup-provider`                                |
| Discover record files                                            | v0.0.1 | `@art-lib/fs-records` adapter                              | `02-discover-record-files`                         |
| Assert a heading exists                                          | v0.0.1 | `documentRecords.assertPresence(name)`                     | `03-read-assert-extract`                           |
| Extract document sections                                        | v0.0.1 | `await documentRecords.extract()`                          | `03-read-assert-extract`                           |
| Read fields                                                      | v0.0.1 | `record['owner']` or `record.__section`                    | `04-field-read`                                    |
| Add or remove a field                                            | v0.0.1 | field assignment or `delete record.owner`                  | `_05-set-missing-field`, `08-delete-field`         |
| Mutate a field name or value; keep record name immutable         | v0.0.1 | field proxy and `record.renameField()`                     | `_06-rename-field-in-place`                        |
| Read fields reactively                                           | v1     | reactive proxy                                             | — (v1)                                             |
| Inspect section, fields, and interleaved content                 | v0.0.1 | `record.__section`                                         | `07-section-depth`                                 |
| Mutate fields with reactive propagation                          | v1     | reactive proxy                                             | — (v1)                                             |
| Mutate a record reactively                                       | v1     | reactive proxy                                             | — (v1)                                             |
| Persist changes with field order and section structure preserved | v0.0.1 | `await record.save()`                                      | `07-section-depth`, `_11-save-document-collection` |
| Create a new record in a new file                                | v0.0.1 | `documentRecords.addRecord()`                              | `_09-create-new-record`                            |
| Create into existing document                                    | v1     | document add record                                        | — (v1)                                             |
| Batch save across documents                                      | v0.0.1 | per-document `save()` via `Promise.all`                    | `_10-batch-save`                                   |

### WIP: use-case and fixture alignment

- Skipped fixtures (`_05`, `_06`, `_09`, `_10`, `_11`) are known failures; un-skip each one as its code lands, and update this table when ids change.
- `_09-create-new-record` is written against the retired `createArtRecord` factory; rewrite it against `documentRecords.create(file)` + `addRecord()` when un-skipping.
- The fixture for "Inspect section, fields, and interleaved content" (`07-section-depth`) asserts section construct/depth mutation and save, not interleaved-content inspection; either extend the fixture or split "mutate section properties" into its own use case.
- "Mutate a field name or value" has rename coverage (`_06`) but no fixture mutates an existing field's value; add one or reword the use case.
- "Persist changes" covers both single-record save (`07`) and whole-document save semantics (`_11`); decide whether "one save writes the whole document" deserves its own row.
- "Set up the records provider" is a recipe rather than a consumer outcome; if MANAGEMENT rejects it as a use case, reclassify `01-setup-provider` as a supporting fixture for the read-path use cases.
- The reactive use cases have no fixtures until the reactive capsule variant lands (v1).

## Flow

1. The adapter discovers files and creates one content source per file.
2. The consumer creates a codec and binds it with the content source in an `ArtDocumentSource`.
3. `createArtDocumentRecords({ codec, createContentSource })` returns a provider; `read(file)` returns a collection for an existing document, `create(file)` for a new one.
4. A caller reads or mutates fields through a record handle, or changes section properties through `record.__section`.
5. `record.save()` delegates serialization and persistence to the document source.

## Dependencies

- `@art-md/primitives` — content, document-source, and codec contracts.
- `@art-md/constructs@0.0.5` — section and field constructs; source contracts are `@art-md/primitives@0.0.5`.
- `@art-md/codec` — runtime codec created by the consumer and injected into the records provider; not instantiated by `@art-js/records`.
- `@art-lib/fs-records` — optional filesystem-backed discovery and content sources.

## Notes

- `record.save()` is a source-bound operation, not a `string`-returning use case; serialization happens inside the injected `ArtDocumentSource`.
- v0.0.1 fidelity is whole-document codec serialization with structural (not byte) identity: whitespace, CRLF, and the final newline may be normalised. Granular writes and write guards are deferred (MANAGEMENT decision, 2026-10-19). See the design document's "Persistence and Fidelity" section.
