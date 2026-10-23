# CHANGELOG

## 0.0.1

### Added

- `createRecordsDocument({ codec, createContentSource })` — creates a records provider attached to a document.
- `createRecord()` — creates a record for insertion into a document.
- Document operations: `read(file)`, `create(file)`, `hasRecord(name)`, `extract()`, and `addRecord()`.
- Record operations: proxy-based field access, `renameField()`, and `save()`.
- Section metadata through `record.__section`, including construct and depth.
- Record placement using `before`, `after`, `appendTo`, and `prependTo` validated anchors.
- Persistence through the consumer-provided codec and adapter, example: `@art-lib/fs-records`.

### Tested

- Fixture-based integration scenarios covering provider setup, all use cases, and main branches.
- Integration tests covering provider setup, main use cases, and adapter boundaries.
- Separate `test:unit` and `test:integration` scripts.

### Documented

- Create `libs/records` knowledge resources.
- Design, use-case, and integration-test documentation covering the public API and fixture scenarios.
