# Design: Records

**Purpose:** Describe the design of `@art-js/records` in detail — the public API with usage examples, and the internal contracts and decomposition that make it work.

**Scope:** the `@art-js/records` package in `$PROJECT/libs/records/`. Upstream contracts belong to `@art-md`; filesystem and CLI concerns belong to `@art-lib/fs-records` and the Art Work CLI. Use-case targeting lives in `$PROJECT/knowledge/overview-records.md`.

## The record

A record is a section of an Art MD document. Its identity is the whole heading text, its data is its children, and a capsule hands the consumer the original parsed block — heading, depth, tags, fields, interleaved content, and positions. Nothing is copied out of the block and nothing is re-parsed: what the codec parsed is what the record carries.

```ts
// ## Project: Art JS
// **Author:** Noodlestan Collective
const [capsule] = records.extract();

capsule._id.name; // 'Project: Art JS' — identity, always available
capsule.raw(); // the original SectionBlock: name, depth, tags, children, position
capsule.raw()!.children; // FieldInline 'Author', plus anything interleaved between fields
```

`ArtRecord{name}` is a projection of that block for places where a name is enough — presence checks and capsule typing. It never detaches from the block: `capsule.raw()` always returns the full section. Records carries no kind and never interprets headings; consumers decide what a heading means.

Extraction covers every section at any depth, including sections without fields — those are simply records with no data. A record without a heading cannot occur: the codec requires `name`.

## Creating records

Records arrive in two ways, and both produce the same thing: a `SectionBlock`.

**From a document** — parse, then extract:

```ts
const records = createRecords(source);
const capsule = records.extract().find(c => c._id.name === 'Project: Art JS')!;
```

**Synthetic** — build one directly, with the section's level, attributes, and any property you know (unknown properties pass through):

```ts
const record = createArtRecord({
  name: 'Project: Art JS',
  depth: 2, // heading level: 2 → '##'
  tags: ['records'],
  children: [
    /* FieldInline nodes, or parse a markdown snippet with the codec */
  ],
});

const records2 = createRecords(newSource);
records2.update(capsuleOf(record), { guard: false }); // render it into content when ready
```

The name you pass is plain heading text — a string. Formatting inside a heading lives in `children` as AST nodes, never in `name`. If you hold markdown instead of AST, parse the snippet with the codec and use the resulting block.

## Reading

Presence and extraction are one-liners; fields are read through the capsule or the view.

```ts
records.assertPresence('Project: Art JS'); // exact heading-text match

const all = records.extract(); // one capsule per section, any depth

capsule.raw()?.['Author']; // direct read on the hydrated block

const view = createProxyObject(capsule, createFieldResolver(capsule.raw()!));
view['Author']; // same value, resolved through the FieldResolver
```

The view is optional. It exists so field access reads like property access, and so mutations are tracked (below).

## Writing fields

Three kinds of property live on a record, and they behave differently. This distinction is the core of the write model:

```ts
record.name; // READ-ONLY — identity. Assignment has no effect: the capsule seals it.
record.depth = 3; // SECTION PROPERTY — ordinary mutation on the block; the heading line
//                 is re-rendered at the new level on write ('##' → '###')
view['Author'] = 'Noodlestan Collective Ltd'; // FIELD — through the view: tracked, written on update
record['Author'] = 'nope'; // NOT SUPPORTED — raw block has children, not flat fields;
//                          // this sets an unrelated JavaScript property that nothing reads
```

Section properties and fields take different routes on purpose. Section properties (`depth`, `tags`, future attributes) are edited directly on the block — they are structural, few, and the splice knows how to re-render them. Fields are everything else, and they only go through the `FieldResolver`:

```ts
const resolver = createFieldResolver(capsule.raw()!);

resolver.resolveField('Author'); // read → 'Noodlestan Collective'
resolver.setField('Author', 'Noodlestan Collective Ltd'); // update → field.value + field.modifiedValue
resolver.setField('License', 'MIT'); // add → appended at the end of the section
resolver.renameField('License', 'Licence'); // rename → label edited in place, order preserved
resolver.deleteField('Licence'); // delete → the field's lines are removed
```

There is no allow-list, and section properties never reach the resolver: the view routes `name` to identity (read-only) and section properties to the block **before** delegating anything unknown to the resolver. Only field names arrive there, so the resolver needs no guard.

## Writing back

Mutations are in-memory until you ask for content. Two exits, two shapes:

```ts
// update: your content, with only the edited field lines changed
const newContent = records.update(capsule, { guard: true });

// serialize: the record's own section as markdown — for persistence, rendering, exchange
const sectionMarkdown = records.serialize(capsule);
```

`update` is a line-splice: it edits only the lines a changed field owns — a value line, a renamed label, a deleted field, an appended field at the section's end, a re-leveled heading. Field order, arbitrary content interleaved between fields, sibling sections, tables, comments, blank lines, and the final newline all pass through byte-identical. The codec is never involved, and the filesystem is never touched — persistence belongs to the consumer's content source.

`serialize` renders a section that has no original lines to splice — a synthetic record, or any caller that just wants the markdown. It builds the block and calls `codec.serialize`, the ecosystem's one markdown emitter; records never builds markdown strings itself.

`guard: true` refuses the write when the content changed since extraction — the opt-in defence against writing over someone else's edit.

## Capsule factory injection

The capsule is created by a factory, and the factory is injectable — a v0.0.1 requirement. Internal APIs (extraction, write-back, refresh) accept either the factory or an unhydrated capsule instance and work against the capsule interface; which variant is in use is invisible outside:

```ts
const records = createRecords(source, { capsuleFactory: myCapsuleFactory });

// internally: extract() asks the factory for capsules; update() asks the capsule
// for its block and anchors. Nothing else changes between variants.
```

The same seam is what carries the API across to reactive behaviour: one external API, two capsule flavours, chosen at construction — never visible in call sites.

## Reactive (v1)

The reactive contract (defined by MANAGEMENT, 2026-10-15), delivered as a second capsule flavour through the factory seam above:

- a mutation of a field's value re-runs every read of that value;
- enumerating the record's fields (`Object.keys` / `values` / `entries`) subscribes to field add/remove and re-runs on mutation;
- `reactiveScope(() => { view['Author']; })` groups subscriptions and disposes them together;
- plain accessors type as `: string`, reactive accessors as `: Accessor<string>`.

```ts
reactiveScope(() => {
  view['Author']; // subscribes
  view['Author'] = 'New Author'; // every reader of 'Author' re-runs
});
```

v0.0.1 already takes the shape this needs: reads flow through the capsule and mutations through the single `FieldResolver` chokepoint, so subscriptions attach at those two points without API changes.

## Internal decomposition

```
libs/records/src/api/       public surface: the create... factories
libs/records/src/private/
├── record/       identity projection + synthetic section factory
├── capsule/      identity, original block, anchors, hydration, the factory seam
├── extract/      presence and extraction into capsules
├── write-back/   anchors, hash guard, the line-splice
├── proxy/        FieldResolver + the view
└── records/      the per-document facade the factories wire together
```

The dependency chain mirrors the implementation order: `record` → `capsule` → `extract` + `write-back` → `proxy` (resolver and view share `FieldResolver`) → `records` → the public factories. The facade depends on `extract` and `write-back`, never on the proxy.

## Internal contracts

**The section is the record.** Extraction wraps `SectionBlock`s directly; `ArtRecord{name}` projects `block.name` rather than copying it away. The upstream constructs release must be kind-free — the old parser split headings and left `name` incomplete, so that release is a hard dependency.

**Capsules are lazy.** Identity is available immediately; the block hydrates on first pull from the capsule's document source. The hydrated block is the original parse, positions included — everything write-back needs is already carried.

**Write-back splices lines, never renders.** Each change maps to the lines it owns: a value to its value line, a rename to its label, a delete to its lines, an addition to the section's end, a level change to the heading. Everything else is copied through untouched, byte for byte. This fidelity is the splice's own promise; upstream guarantees structural round-trips only.

**Positions come from the AST.** Every construct carries `position: {start, end}` (line, column, offset); the capsule captures per-section and per-field ranges from the parsed block. No content scanning, and no second component that understands markdown.

**Writes apply bottom-up.** Splices run from the highest line range down, so earlier anchors stay valid within one write; mutations never reflow — they only mark the capsule dirty. After a successful write the result is reparsed and the capsule refreshes in place (anchors and field positions re-derived; the record's `name` is immutable, so it is always re-findable). The capsule is never left stale.

**One serializer, no I/O, own symbols.** `serialize` reaches `codec.serialize`; the package performs no filesystem access, implements no codec, and exports only its own symbols — never `@art-md` types.

## Dependencies

```
@art-lib/fs-records, Art Work CLI
          ↓ consume
     @art-js/records
          ↓ contracts        ↓ implementation
 @art-md/primitives   @art-md/codec        (+ @art-md/constructs: SectionBlock, FieldBlock, FieldInline)
```

Consumers import `ArtContentSource` / `ArtDocumentSource` from `@art-md/primitives` directly — records re-exports nothing of theirs. The kind-free `@art-md/constructs` release is a hard requirement of the first version. `@art-lib/fs-records` persists the strings this package produces; the Art Work CLI loops per document.
