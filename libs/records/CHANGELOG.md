# CHANGELOG

## UNRELEASED

### Added

- **Label Repair:** `relabelField(name, label)` rewrites a stored label in place while keeping the field's name, position, tags, and value; the label must re-parse through the codec and re-derive the field's current name.
- **By-Label Access:** `setFieldMarkdownByLabel`, `setFieldValueByLabel`, `getFieldMarkdownByLabel`, `getFieldTextByLabel`, and `getFieldValueByLabel` read and write field values by exact stored label, reaching fields shadowed by an earlier duplicate; reads return `undefined` on a miss, writes throw, neither creates.

### Changed

- **Reserved Names:** the six new handle members join the reserved set (fifteen names); labels resolving to them abort extraction (fourteen reachable collision labels); the `0.2.0` name-addressed surface is unchanged.

## 0.2.0

### Changed

- **Field Reads:** the default accessor returns a field's value as markdown; consumers that displayed the previous markup-stripped output move to `getFieldText`, and `getFieldValue` returns a deep clone of the value's Art AST.
- **Field Writes:** strings parse through `codec.parse` with the block/inline form chosen from the value; the proxy setter and `setFieldValue` accept a construct or a readonly array of constructs; `number`/`boolean` coerce to string; containers (`Document`, `SectionBlock`, `FieldBlock`, `FieldInline`) and other inputs throw `TypeError`.
- **Consolidation:** coverage is gated in CI through `test:ci` at the package convention, the retired zero-case test runner is gone, and the integration docs describe the Vitest suite.

### Added

- **Field Methods:** `setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, and `getFieldValue` on the record handle; the five names are reserved like the existing handle members.

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
