# Knowledge: Records

## Documents

| Document                   | Purpose                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [overview.md](overview.md) | Overview of `@art-js/records`: records and fields summarised separately, use cases with fixture ids, flow, and dependencies |

## Design Documents

| Document                                                   | Purpose                                                                                                                                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [design/records.md](design/records.md)                     | Records design: consumer API, complete usage recipes, contracts, fidelity, and limitations                                                                                                |
| [design/fields.md](design/fields.md)                       | Fields design: set/read surface, the copy-on-write repair flow and its two helpers (`getObscuredFields`, `renameObscuredField`), automatic form, field forms, and the field-name contract |
| [design/integration-tests.md](design/integration-tests.md) | Fixture-driven integration-test suite: case anatomy, runner behavior, and operating instructions                                                                                          |

## Architecture Decision Records

| Document                           | Purpose                                                                                                                                                                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [adr/records.art](adr/records.art) | Records design decisions: provider shape, collection type, unified handle, injected codec, placement, save fidelity                                                                                                                     |
| [adr/fields.art](adr/fields.art)   | Field decisions: naming, index resolution, rename, automatic form, the string-write route, the read model, and the copy-on-write repair flow (`__section` snapshot, `getObscuredFields`, `renameObscuredField`, `replaceRecordSection`) |
