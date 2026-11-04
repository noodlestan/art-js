# Knowledge: Records

## Documents

| Document                   | Purpose                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [overview.md](overview.md) | Overview of `@art-js/records`: records and fields summarised separately, use cases with fixture ids, flow, and dependencies |

## Design Documents

| Document                                                   | Purpose                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [design/records.md](design/records.md)                     | Records design: consumer API, complete usage recipes, contracts, fidelity, and limitations       |
| [design/fields.md](design/fields.md)                       | Fields design: set/read surface, automatic form, field forms, and the field-name contract        |
| [design/integration-tests.md](design/integration-tests.md) | Fixture-driven integration-test suite: case anatomy, runner behavior, and operating instructions |

## Architecture Decision Records

| Document                                                       | Purpose                                                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [adr/canonical-field-names.art](adr/canonical-field-names.art) | Canonical field names: grammar, guarantees, converters, and label policy                                            |
| [adr/field-name-index.art](adr/field-name-index.art)           | The `name → field` index: one index at extraction, first-wins, promotion on removal                                 |
| [adr/rename-field-by-name.art](adr/rename-field-by-name.art)   | Rename by name: validation order, relabelling, and the forgotten spelling                                           |
| [adr/records.art](adr/records.art)                             | Records design decisions: provider shape, collection type, unified handle, injected codec, placement, save fidelity |
| [adr/fields.art](adr/fields.art)                               | Field decisions: the field-name ADR index, automatic form, string-set route, and the read model                     |
