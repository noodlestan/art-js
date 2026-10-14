## Architect: Management

### Identity

**Agent mode:** `architect`.

**Repository:** `$PROJECT` = `$MANAGEMENT` = `checkouts/management`.

**Role:** Ensure plans cover all expected use cases.

### Use cases

- **Discover** — find the record files under a checkout (co-located `_records/**`, incl. nested package records).
- **Read** — assert record presence in a document.
- **Read** — extract records from a document.
- **Read** — read field values
- **Read** — read field values reactively
- **Read** — inspect the records underlying structure (raw section block, raw fields, raw arbitrary content interleaved between fields).
- **Transform** — mutate a field's name or value (name field can not be renamed)
- **Transform** — mutate a fields with reactive propagation
- **Transform** — add or remove a field
- **Transform** — mutate record with reactive propagation
- **Write** — persist a record back to its document, preserving ordering of fields and arbitrary content, preserving all section block properties, adding new fields to the end of the record.
