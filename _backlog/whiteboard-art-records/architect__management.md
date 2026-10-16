## Architect: Management

### Identity

**Agent mode:** `architect`.

**Repository:** `$PROJECT` = `$MANAGEMENT` = `checkouts/management`.

**Role:** Ensure plans cover all expected use cases.

### Use cases

1. **Discover** — find the record files.
2. **Read** — assert record presence in a document.
3. **Read** — extract records from a document.
4. **Read** — read field values
5. **Read** — read field values reactively
6. **Read** — inspect the records underlying structure (raw section block, raw fields, raw arbitrary content interleaved between fields).
7. **Transform** — mutate a field's name or value (name field can not be renamed)
8. **Transform** — mutate a fields with reactive propagation
9. **Transform** — add or remove a field
10. **Transform** — mutate record with reactive propagation
11. **Write** — persist a record back to its document, preserving ordering of fields and arbitrary content, preserving all section block properties, adding new fields to the end of the record.
