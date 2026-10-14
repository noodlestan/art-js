# Art JS - Records

**Purpose:** Explain how the records library gives the Art JS ecosystem one model for Markdown documents: identity, locating, extraction, update, and serialisation. It is anchored on the primary types `ArtRecord`, `ArtRecordCapsule`, and `Records`, and explains how a record is identified in a document, extracted into a capsule, updated, and serialised back to content.

## The Model at a Glance

- `ArtRecord` (`src/record/types.ts`) — record identity: `name`, the section's whole heading text, verbatim. Records carries no kind and parses nothing — every `SectionBlock` is a record; heading interpretation belongs to consumers (see `$PROJECT/knowledge/design/records.md`).
- `ArtRecordCapsule<T>` (`src/capsule/types.ts`) — transports a record identity together with the `ArtDocumentSource` that contains it. Identity (`_id`) is available regardless of hydration state; the hydrated record is exposed through `_maybeRecord` and `raw()`.
- `Records<T>` (`src/records/types.ts`) — collection-level API over a document source: `assertPresence`, `extract`, `update`, and `serialize`.

## Responsibilities

- **Record modelling** — records are modelled from the `SectionBlock`, `FieldBlock`, and `FieldInline` constructs the codec already produces (identity parsed from heading text); the library never re-parses markdown itself.
- **Extraction and presence assertion** — assert that a record with a given `name` (exact heading text) exists in a document, and extract every section as a record (with fields, examples, etc.) into capsules.
- **Write-back** — write a record back into content at its positioning anchors (`RecordPosition`), with an optional content-hash guard (opt-in) that refuses the write when the underlying content changed since the capsule was extracted. Write-back operates on content strings; persistence belongs to content sources downstream.
- **Transparent field access (optional)** — a `ProxyObject` over a capsule: properties defined on the record type (`name`) come from the record identity; all other accesses resolve through a `FieldResolver`, and setters route data to `field.value` while tracking `field.modifiedValue`. Field mapping is records-domain: the package ships a default `FieldResolver` factory so consumers never hand-roll resolvers.
- **Safe vs unsafe write-back** — `Records.update(capsule, {guard?})` writes over existing content with the opt-in hash guard; `Records.serialize(capsule)` is unguarded, for newly created record files. `serialize` reaches `codec.serialize` — the codec is the ecosystem's one markdown emitter; this package never builds markdown strings itself (see `$PROJECT/knowledge/design/records.md`).

## How a Record Flows

1. A content source provides raw content; the codec parses it into an `ArtDocument` (see the upstream codec and source contracts).
2. `extractRecords(document)` maps `SectionBlock` constructs to `ArtRecord` identities and wraps each one in an `ArtRecordCapsule` over the document source.
3. Consumers read fields through the capsule directly, or through the optional proxy object for transparent access.
4. `Records.update(capsule)` / `writeRecord(content, capsule)` produce updated content at the record's positioning anchors; the opt-in content-hash guard protects against writing over modified content.
5. The consumer writes the content back through its content source — records never touch the filesystem.

## Principles

Grounded in the design decisions in force in [index.md](index.md) — [adr/compiler.md](adr/compiler.md) and [adr/configuration.md](adr/configuration.md) — and in the roadmap briefing `_roadmap/_architect.md`:

- **Contracts before implementation** — records are written against the codec contracts (`ArtCodec`, `ArtContentSource`, `ArtDocumentSource`) declared in `@art-md/primitives`; the configured implementation in `@art-md/codec` is a consumed dependency, never redefined here.
- **Lazy hydration, pull-based** — following the reactive pull pipeline decision, a capsule carries identity eagerly and hydrates the record lazily from its document source; nothing is computed until a consumer pulls it.
- **Deterministic round-trips** — extraction and write-back are pure functions over document and content values: identical inputs produce identical output. The byte-for-byte guarantee on existing files comes from the line-splice itself (codec never invoked); upstream `@art-md` guarantees **structural** round-trip fidelity only — whitespace normalisation per CommonMark applies to `serialize` output on new files.
- **Records are the source of truth** — the library models what a document declares without inventing a parallel store, in line with the config-as-source-of-truth decision and the records-first stance of the roadmap briefing.
- **Small core library, no I/O** — the package stays a focused core library: filesystem concerns live downstream in `@art-lib/fs-records`, and CLI orchestration lives in the Art Work CLI.

## Dependencies

```
@art-lib/fs-records, Art Work CLI
          ↓ consume
    @art-js/records
          ↓ contracts        ↓ implementation
 @art-md/primitives   @art-md/codec
```

- **Upstream contracts** — `@art-md/primitives` declares `ArtCodec`, `ArtContentSource`, and `ArtDocumentSource`; the records library is written against these contracts only.
- **Upstream implementation** — `@art-md/codec` provides the configured codec used to parse and serialise the documents that records are extracted from and written back to.
- **Downstream provider** — `@art-lib/fs-records` (`$ART_LIB`) implements FS-backed content sources and the FS records adapter over these abstractions.
- **Downstream consumer** — the Art Work CLI (`$ART_WORK`) consumes the abstractions for workspace record discovery, reading, and updating.
