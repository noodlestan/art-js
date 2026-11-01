# CHANGELOG

## 0.1.0

### Changed

- **Field Access:** Address record fields by canonical field name instead of exact label — `record['Canonical Name']` becomes `record.canonicalName`; label-based reads return `undefined` and label-based writes throw `TypeError`.
- **Labels:** Preserve the loaded Markdown label on every value update and derive a new field's label from `nameToLabel(name)`.
- **Collisions:** Resolve duplicate field names first-wins, promote a shadowed duplicate when its holder is deleted or renamed, and abort extraction when a label resolves to a reserved name (`name`, `save`, `renameField`, `__section`, `__`-prefixed).

### Added

- **Field Names:** Add the canonical field name grammar `/^[a-z][a-zA-Z0-9]*$/` with the `labelToName`, `nameToLabel`, `isCanonicalFieldName`, and `isReservedFieldName` helpers.
- **Rename:** Convert `renameField(fromName, toName)` to a name-to-name operation that validates `toName` against the grammar and rejects a collision before mutating.

### Documented

- **Migration:** Document the breaking change and the migration note — `record.Repository` → `record.repository`, `record['Canonical Name']` → `record.canonicalName`.

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
