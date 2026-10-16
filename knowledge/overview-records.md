# Overview: Records

**Purpose:** What the records library is, what each version is for. Design, API contracts, and examples live in `$PROJECT/knowledge/design/records.md`.

Records give the Art JS ecosystem one way to work with Markdown documents as data: a section of a document becomes a record you can read, change, and write back — with everything you did not touch preserved exactly. The library works on content strings; reading files and saving them belongs to the layers around it.

## Responsibilities

- Model records directly from what the codec parses — no second parser, no interpretation of headings.
- Assert a record exists, and extract records out of a document.
- Expose field reading and mutation through one controlled path, so changes can be tracked.
- Write changes back by editing only the affected lines, byte-identical everywhere else.
- Stay a small core library: no filesystem, no CLI, no markdown rendering of its own.

## Use Cases

Target: MANAGEMENT's v1 list (`$PROJECT/_backlog/whiteboard-art-records/architect__management.md`).

| #   | Use case                                                                                              | Target | Route                                                                                                    |
| --- | ----------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| 1   | Discover record files under a checkout                                                                | v0.0.1 | `$ART_LIB` adapter — not this package                                                                    |
| 2   | Assert record presence in a document                                                                  | v0.0.1 | `Records.assertPresence(name)`                                                                           |
| 3   | Extract records from a document                                                                       | v0.0.1 | `Records.extract()` — every section, any depth                                                           |
| 4   | Read field values                                                                                     | v0.0.1 | `capsule.raw()` / proxy getters                                                                          |
| 5   | Read field values reactively                                                                          | v1     | v0.0.1 reads are live through the capsule (no snapshots); subscriptions arrive with the reactive capsule |
| 6   | Inspect the raw structure (section, fields, interleaved content)                                      | v0.0.1 | `capsule.raw()` exposes the original `SectionBlock`                                                      |
| 7   | Mutate a field's name or value (record name immutable)                                                | v0.0.1 | proxy setter / `FieldResolver`                                                                           |
| 8   | Mutate fields with reactive propagation                                                               | v1     | attaches at the `FieldResolver` chokepoint — see design doc                                              |
| 9   | Add or remove a field                                                                                 | v0.0.1 | `setField` (new name) appends; `deleteField` removes                                                     |
| 10  | Mutate the record with reactive propagation                                                           | v1     | same chokepoint as 8                                                                                     |
| 11  | Write back preserving field order, interleaved content, and section properties; new fields at the end | v0.0.1 | field-level line splicing                                                                                |

v1 items (5, 8, 10) keep a reserved path: every read flows through the capsule and every mutation through the `FieldResolver`, so reactive behaviour attaches there without redesigning the API. See `$PROJECT/knowledge/design/records.md` for the reactive contract.

## How a Record Flows

1. A content source provides raw content; the codec parses it into an `ArtDocument`.
2. Extraction wraps each section in a capsule over the document source.
3. Consumers read fields through the capsule or the view, and mutate them through the view.
4. Writing back splices only the changed lines into content; the capsule refreshes from the result.
5. The consumer persists the string — records never touches the filesystem.

### Example

Example record in a markdown file.

```md
## Project: Art JS

**Author:** Noodlestan Collective

**Repository:** Repository: Art JS
```

Resulting Art AST

```
construct: "Document"
children:
  - construct: "SectionBlock"
    name: "Project: Art JS"
    children:
      - construct: "FieldInline"
        name: "Author"
        children: [ <NaturalExpression(Text)> ]
        position:
            start:
              line: 3
              column: 1
              offset: 20
            end:
              line: 3
              column: 34
              offset: 53
      - construct: "FieldInline"
        name: "Repository"
        ...
```

Snapshot of the record state (not its API):

```
_id:
  value: "Project: Art JS"
Author:
  value: "Noodlestan Collective"
Repository:
  value: "Repository: Art JS"
```

## Principles

Grounded in the design decisions in force in [index.md](index.md) — [adr/compiler.md](adr/compiler.md) and [adr/configuration.md](adr/configuration.md) — and in the roadmap briefing `_roadmap/_architect.md`:

- **Contracts before implementation** — records are written against the codec contracts (`ArtCodec`, `ArtContentSource`, `ArtDocumentSource`) declared in `@art-md/primitives`; the configured implementation in `@art-md/codec` is a consumed dependency, never redefined here.
- **Lazy hydration, pull-based** — following the reactive pull pipeline decision, a capsule carries identity eagerly and hydrates the record lazily from its document source; nothing is computed until a consumer pulls it.

## Dependencies

```
@art-lib/fs-records, Art Work CLI
          ↓ consume
    @art-js/records
          ↓ contracts        ↓ implementation
 @art-md/primitives   @art-md/codec
```

- **Upstream contracts** — `@art-md/primitives` declares `ArtContentSource` and `ArtDocumentSource`; records is written against these contracts only.
- **Upstream implementation** — `@art-md/codec` parses and serialises the documents records works on.
- **Downstream provider** — `@art-lib/fs-records` (`$ART_LIB`) implements FS-backed content sources.
- **Downstream consumer** — the Art Work CLI (`$ART_WORK`) uses the abstractions for workspace record discovery, reading, and updating.
