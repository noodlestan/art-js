# Design: Fields

**Status:** Shipped — the expanded field surface below is the implemented API of `@art-js/records`, landed by `implement-fields-spec` (commit `a87a7a4`); `relabelField` ([Relabeling a Field](#relabeling-a-field)) shipped with `implement-label-repair-api`; the `record.__section` snapshot semantics, the two repair helpers, and the apply API ([Repairing Obscured Fields](#repairing-obscured-fields)) are specified here and land with `implement-copy-on-write-repair`; [records.md](records.md) documents the surrounding records model.

**Purpose:** Specify the complete field API: how a field value is set from a `string` or from Art AST value constructs, which form the field takes, how it is read back as markdown, text, or raw value, how field names address it, and how an obscured field is repaired on a caller-owned copy of its section.

**Scope:** `@art-js/records` owns the field surface of the record handle: the proxy accessor and proxy setter, `setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, `renameField`, `relabelField`, `delete`, and the field-name contract; the copy-on-write repair surface — the `record.__section` snapshot, `getObscuredFields`, `renameObscuredField`, and `RecordsDocumentCollection.replaceRecordSection` — is specified here and lands with `implement-copy-on-write-repair`. Records, sections, placement, persistence, and the provider model are specified in [records.md](records.md).

## Usage

Examples assume a record handle extracted as in [records.md — Usage](records.md#usage) and the consumer-injected `codec` (`ArtCodec`) in scope.

### Setting Fields

```ts
// From a string — parsed through codec.parse, so markdown forms survive.
record.greeting = 'Hello, are _you_ there _world_?';

// From an Art AST construct the consumer created.
const location = codec.create<NaturalExpression>('NaturalExpression', {
  type: 'text',
  value: 'art-works',
});
record.location = location;

// The dedicated methods; the proxy setter delegates to these two.
record.setFieldMarkdown('greeting', 'Hello, are _you_ there _world_?');
record.setFieldValue('location', location);
```

### Reading Fields

```ts
record.greeting; // markdown — 'Hello, are _you_ there _world_?'
record.getFieldMarkdown('greeting'); // same value the accessor returns
record.getFieldText('greeting'); // text — 'Hello, are you there world?'
record.getFieldValue('greeting'); // a deep clone of the field's value (its Art AST)
```

## Setting Field Values

A field value is a `string`, an Art AST value — a construct or a readonly array of constructs — or a `number`/`boolean` (coerced with `String(value)` and then routed exactly as a string). There is no other input shape: no freeform typed-value object, no `{ type, value }` literal on the handle. Anything else — `null`, `undefined`, a plain object, or a container construct (`Document`, `SectionBlock`, `FieldBlock`, `FieldInline`) — is rejected with a `TypeError`. The form the resulting field takes is never requested by the caller (see [Automatic Form](#automatic-form)).

### Setting from a string

A string is set through `codec.parse(markdown)` — the single string entry point of the API. The parsed fragment's constructs become the field's value, so markdown forms survive the round trip:

- `setFieldMarkdown('greeting', 'Hello, are _you_ there _world_?')` parses to one paragraph whose children are text and emphasis expressions; the field holds those expressions and reads back with its `_…_` markers intact.
- A fenced code string parses to a `NaturalBlock` of `type: 'code'`; the field holds that block and reads back with its fence intact.
- A multi-line string parses to one paragraph whose children span the soft line break; the field holds them exactly as authored.

This replaces the v0.0.1 write, which coerced the value with `String(value)` and stored a single `codec.create('NaturalExpression', { type: 'text', … })` node (a `NaturalBlock` on block fields): markdown syntax was stored literally, so `` **Location:** `art-works` `` lost its backticks on the first update.

To store literal text that contains markdown characters, set a value instead — `setFieldValue` with a text `NaturalExpression` — or escape the characters in the string.

### Setting from an Art AST value

A field can be set directly from Art AST the consumer created: a `Construct` from `@art-md/constructs` (the open union of every construct), or a readonly array of them. The consumer builds constructs through `codec.create(name, …args)`, through `codec.getConstructFactory(name)`, or by hand, and passes them as-is; the value is installed without re-encoding it through markdown.

````ts
const code = codec.create<NaturalBlock>('NaturalBlock', {
  type: 'code',
  lang: 'typescript',
  value: '```typescript\nconst x = 42;\n```',
  children: [],
});
record.setFieldValue('codeExample', code);
````

`Document`, `SectionBlock`, `FieldBlock`, and `FieldInline` are **rejected** — they are containers, and installing one would smuggle a nested field, a section, or a whole document past the form rules; `setFieldValue` throws `TypeError: Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline` (see [Automatic Form](#automatic-form)).

### The proxy setter

The proxy setter accepts `string | number | boolean | Construct | readonly Construct[]`:

```ts
record.<fieldName> = value; // value: string | number | boolean | Construct | readonly Construct[]
```

- A **string becomes a parsed markdown fragment**: it is routed through `codec.parse`, exactly as `setFieldMarkdown` does. The spec chooses `codec.parse` over `codec.create` for the text node because the string-set contract requires markdown forms to survive (see [Setting from a string](#setting-from-a-string)), and because one string-input mechanism shared by the proxy and the dedicated method means the same input cannot behave differently depending on the route taken.
- A **construct or readonly array of constructs** is routed exactly as `setFieldValue` does.
- A **number or boolean is coerced with `String(value)`** and then routed as a string, so `record.count = 42` still stores `42` and `record.active = true` still stores `true`, exactly as v0.0.1 did.
- Any other value — `null`, `undefined`, a plain object, an array whose members are not all constructs — is rejected with `TypeError: Field value must be a string, number, boolean, or Art AST value`. An empty array is not rejected: like an empty string it clears the field (see [Automatic Form](#automatic-form)), and `getFieldValue` reads the cleared field back as `[]`. The blanket v0.0.1 `String(value)` coercion is gone; deleting a field is `delete record.<fieldName>`.

The proxy setter never takes a form argument. Block versus inline follows the value (see [Automatic Form](#automatic-form)).

### setFieldMarkdown and setFieldValue

Two dedicated methods make both write routes explicit and callable with a dynamic name:

```ts
setFieldMarkdown(name: string, markdown: string): void;
setFieldValue(name: string, value: Construct | readonly Construct[]): void;
```

- `setFieldMarkdown` parses `markdown` through `codec.parse` and installs the resulting constructs as the field's value. It is the string-set method; the proxy setter with a string delegates here.
- `setFieldValue` installs the consumer's constructs as the field's value. It is the value-set method; the proxy setter with a construct or array delegates here.

Both create the field when `name` is not in the record's index (gated by the canonical grammar, labelled `nameToLabel(name)`), replace the value in place when it is, and throw the reserved-name `TypeError` for reserved names — see [Field and Section Behaviour](#field-and-section-behaviour) and [Reserved names](#reserved-names).

## Automatic Form

A field is a `FieldBlock` (block content on its own lines) or a `FieldInline` (phrasing content on the label's line). The form is **chosen from the value being set** — the caller never selects it, and there is no overload, option, or method that takes a form.

Given `content(value)`:

1. `string` → `codec.parse(value).document.children` — the parsed fragment's children.
2. a single `Construct` → `[value]` — the construct itself is the content.
3. a readonly array of constructs → `value` — each member becomes content in order.

Before any of this, the value is checked for containers: a `Document`, `SectionBlock`, `FieldBlock`, or `FieldInline` — as the value, as an array member, or inside parsed string content (the `**Y:** v` case) — is rejected with `TypeError: Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline`, so neither a nested field nor a whole document can ever become a field's value.

The form follows from `content`:

1. `content` is empty → `FieldInline` with no children (an empty string clears the value to a bare label line).
2. `content` is exactly one `NaturalBlock` of `type: 'paragraph'` → `FieldInline`, and the paragraph is unwrapped to its `NaturalExpression` children. CommonMark wraps bare phrasing in a paragraph; without this step every plain-string write would become a block field.
3. every child of `content` is a `NaturalExpression` → `FieldInline` with `content` as its children.
4. otherwise (any block-level child: code, list, multiple blocks) → `FieldBlock` with `content` as its children.

Writing to an existing field replaces its children and, when the classification differs, converts the field construct in place between `FieldInline` and `FieldBlock`, preserving `name`, `tags`, and position. Consequences:

- The old value is fully replaced either way, so a block field set to a phrasing-only value becomes an inline field — to keep a field block-shaped, the value must carry block content (a fenced code string, a code `NaturalBlock`).
- Appending a new field to `section.children` uses the same classification; new fields are no longer always inline.

## Relabeling a Field

A stored label can be repaired in place. `relabelField` is the repair counterpart to `renameField`: a rename can only ever write the derived `nameToLabel` spelling, so renaming `npmPackageDeployment` persists `Npm Package Deployment` however the consumer would spell it by hand — the house-spelling gap stated in [Derived labels](#derived-labels). A relabel rewrites the stored label while the field keeps its **name**, its **position in `section.children`**, its **tags**, and its **value**:

```ts
relabelField(name: string, label: string): void;
```

- **Address.** The operation takes a field **name** and resolves it through the [`name → field` index](#the-name--field-index), so it always operates on the first-wins holder of that name. A shadowed duplicate is not addressable by it.
- **Validation before mutation.** Everything is validated before anything is written, in this order:
  1. A reserved `name` → `TypeError`.
  2. An absent `name` → the not-found error `renameField` already uses: `Error('Field not found: {name}')`.
  3. Then the three label gates:
     - the label must contain at least one word character — `labelToName`'s own precondition, `TypeError: Field label must contain at least one word character`;
     - the label must re-parse as a field under the codec's `FIELD_TEXT_PATTERN` (`/^[A-Za-z][A-Za-z ]*:(?:\s|$)/` — letter-led, letters and spaces only, with no leading or trailing whitespace), so save → reload keeps the field and its spelling;
     - the label must re-derive the field's current name: `labelToName(label) === name`.

  A rejected relabel leaves the document and the index untouched.

- **Index effect.** Only `field.name` changes; index keys are unchanged — every index key stays identical, no rekey, no promotion, no first-wins shift — and position, tags, and value are untouched. The re-derivation gate is what makes that invariant safe: the capsule rebuilds the index from labels after every structural mutation, so a label that stopped deriving its key would be silently rekeyed by the next unrelated mutation.
- **No grammar, no reservation on labels.** The canonical grammar keeps gating API-supplied names only (see [Canonical grammar](#canonical-grammar)): relabel supplies a label, not a name, so the grammar never applies to it. Reservation never applies to a label either — a label that resolves to a reserved name cannot exist in an indexed record, because extraction aborts on it (see [Reserved names](#reserved-names)).
- **Shadowed duplicates.** Relabel never promotes and never reaches them: it addresses the first-wins holder by name, so a shadowed field keeps its own label and its place in `section.children`. The holder may end up sharing the identical label with a shadowed field — first-wins and the reload still hold, because both fields derive the same name and extraction keeps the first. Their values are reached through the [`record.__section`](#field-and-section-behaviour) snapshot, where they are repaired on the copy (see [Repairing Obscured Fields](#repairing-obscured-fields)).
- **Composition.** `renameField` followed by relabel yields a custom spelling for a renamed field: the rename moves the field onto its new name with the derived label, and the relabel rewrites that label to the consumer's preferred spelling. The gates are exactly what make an arbitrary spelling safe to persist — they prove the spelling survives a reload and still derives the renamed field's name.

## Repairing Obscured Fields

An **obscured field** is a field whose key an earlier sibling already derives: under [`labelToName`](#labeltoname-and-nametolabel) the first occurrence wins the [`name → field` index](#the-name--field-index), so the later field stays in the section, shadowed and unreachable by name. The repair runs on a **copy** — the record's live section never reaches a helper — as one copy-on-write flow:

1. **Grab** a snapshot with `record.__section` — the caller owns it (see [Snapshot semantics](#repairing-obscured-fields) below).
2. **Inspect** the copy: `getObscuredFields(section)` returns the obscured fields in document order.
3. **Repair** the copy: `renameObscuredField(section, field, newName)` rewrites the field's stored label; alternatively drop a duplicate outright by editing the copy's `children` directly.
4. **Apply** the copy: `RecordsDocumentCollection.replaceRecordSection(record, section)`.
5. **Use the returned handle** from that point on — `save()`, further field operations, and the reload all go through it.

Every step except the grab and the apply is section-scoped: no helper takes a record. Exactly two helpers exist:

```ts
import type { FieldBlock, FieldInline, SectionBlock } from '@art-md/constructs';

getObscuredFields(section: SectionBlock): (FieldBlock | FieldInline)[];
renameObscuredField(section: SectionBlock, field: FieldBlock | FieldInline, newName: string): void;
```

- **The snapshot is a plain Art AST the caller owns.** Because it is ordinary Art AST, it may be edited freely, including removing a duplicate field by splicing `section.children`; deletion needs neither a helper nor the record. Every helper in this section takes that copy — never the record.
- **`getObscuredFields(section)`** returns the actual obscured field objects of that section — `FieldBlock` and `FieldInline` constructs from `@art-md/constructs` — in document order; a field is obscured when an earlier sibling derives the same key under `labelToName`. It never mutates anything.
- **`renameObscuredField(section, field, newName)`** validates before mutating, in this order:
  1. `field` must be a member of the given `section` — identity, not shape: a field taken from another copy is rejected;
  2. `newName` must be canonical (`/^[a-z][a-zA-Z0-9]*$/`) and not reserved (see [Reserved names](#reserved-names));
  3. `nameToLabel(newName)` must re-parse as a field under the codec's label pattern (`/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`), so save → reload keeps the field and its spelling;
  4. no other field in `section` may derive `newName`.

  On success only the field's stored label changes to `nameToLabel(newName)` — position, tags, and value untouched. A rejected rename leaves the copy untouched.

- **Apply contract.** `replaceRecordSection(record, section)` lives on `RecordsDocumentCollection`: it resolves the record's live section through the collection, validates the incoming copy, applies it by content-copy — never an object swap, so document membership and anchor identity survive — re-extracts the record with a fresh capsule, and returns the new handle. **The old handle's field surface is dead: every field read, write, enumeration, rename, relabel, and delete through it is invalid; callers must use the returned handle.**
- **Snapshot semantics.** Every `record.__section` access returns a deep clone of the live section: mutations to it never reach the record, it is current at the moment of access, and section-level changes go through `replaceRecordSection`.
- **Coexistence with the shipped surface.** The `0.2.0` surface (`setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, `renameField`, `delete`) and `relabelField` keep every existing signature and behaviour; the proxy accessor and setter routes are untouched.

```ts
const section = record.__section; // the caller's copy
const [shadowed] = getObscuredFields(section);
renameObscuredField(section, shadowed, 'brandNew');
const applied = projectDocument.replaceRecordSection(record, section); // content-copy, fresh capsule
await applied.save(); // the returned handle is the live one from here on
```

## Reading Field Values

Every read addresses the field's **value** — values are addressable by **name**; the label (`name`) and the field container are not part of any read result, and the field **container** and label enumeration remain reachable through a [`record.__section`](#field-and-section-behaviour) **snapshot**; obscured fields are repaired through [Repairing Obscured Fields](#repairing-obscured-fields). A name that is not in the index returns `undefined` on all three reads.

### Reading as markdown

The default proxy accessor returns the value as markdown through `codec.serialize`:

```ts
record.<fieldName>; // string | undefined — markdown
```

The mechanism is fixed: serialise a `Document` whose children are the field's children — `codec.serialize({ construct: 'Document', children: field.children }).content` — and remove the single trailing newline the serializer emits, so `setFieldMarkdown(name, value)` followed by a read returns `value` (modulo the parser's own trailing-newline normalisation).

`getFieldMarkdown(name)` is the explicit form of the same read:

```ts
getFieldMarkdown(name: string): string | undefined;
```

What changes for existing consumers:

- The accessor returned `codec.toText` — markup-stripped text. It now returns markdown, so emphasis, strong, and code-span markers appear: fixture `031` read `Hello, are you there world?` under v0.0.1 and reads `Hello, are _you_ there _world_?` now.
- A code-span value keeps its backticks: `` **Location:** `art-works` `` reads `` `art-works` `` instead of `art-works` — the authored form survives a value update.
- A block field's code content keeps its fence (fixture `025`), and multi-line values keep their line breaks (fixture `032`).
- Consumers that want the previous text behaviour call `getFieldText`; no consumer needs to change for `undefined`-on-missing, which is unchanged.

### Reading as text

```ts
getFieldText(name: string): string | undefined;
```

Returns the rendered text of the field through `codec.toText(field)` — the v0.0.1 accessor's behaviour, preserved as a dedicated method: leaf values concatenated, markup stripped (`Hello, are you there world?` on fixture `031`). `toText` is the codec's text method, not a Markdown renderer: on fixture `025` the code block's `value` includes its fence, so the text read returns the fence as well.

### Reading raw

```ts
getFieldValue(name: string): readonly Construct[] | undefined;
```

Returns a **deep clone of the field's value** — the constructs that make up the value, `undefined` when the name is not in the index, an empty array when the field exists but is empty. The label and tags are not included: values are addressable by name, but the field **container** and label enumeration remain reachable only through a `record.__section` snapshot, with no accessor for them. The clone carries the document's current content, but mutations to it never touch the document or the `name → field` index: the record's own state changes only through set, rename, relabel, and delete.

## Field Forms and Fixtures

The three Art MD fixtures at `$ART_MD/libs/constructs/test/fixtures/` are the field-form vocabulary the API must express on read and reproduce on write. Fixture ids are cited as `NNN-slug` with their `.md.json` Art AST snapshots.

| Fixture                                   | Markdown form                                    | Art AST                                             | Read as markdown                          | Read as text                   | Write that reproduces it                                                                                          |
| ----------------------------------------- | ------------------------------------------------ | --------------------------------------------------- | ----------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `025-field-block-with-code`               | `**Code Example:**` plus a fenced code block     | `FieldBlock` → `NaturalBlock` (`code`)              | the code block's markdown, fence included | the code value, fence included | `setFieldMarkdown` with the fenced string, or a code `NaturalBlock` through `setFieldValue` → block form (rule 4) |
| `031-field-inline-with-inline-formatting` | `**Greeting:** Hello, are _you_ there _world_?`  | `FieldInline` → text/emphasis expressions           | `Hello, are _you_ there _world_?`         | `Hello, are you there world?`  | `setFieldMarkdown` with the single-line string → one paragraph unwrapped → inline form (rule 2)                   |
| `032-field-inline-with-multiple-lines`    | `**Greeting:** Hello world!\n_How_ are **you**?` | `FieldInline` whose first text child ends with `\n` | `Hello world!\n_How_ are **you**?`        | `Hello world!\nHow are you?`   | `setFieldMarkdown` with the multi-line string → one paragraph unwrapped → inline form (rule 2)                    |

- **Read:** all three serialise the field's value through `codec.serialize` for the markdown read and through `codec.toText` for the text read; the raw read returns a deep clone of that value.
- **Write:** all three are produced by `codec.parse` plus the automatic-form classification — a string or a value, never a form argument.

## Public Field API

Every name the spec introduces, in one place. These are members of `ArtRecord` (`design/records.md` → Public API); `createRecordsDocument`, `createRecord`, and the collection types are unaffected.

```ts
import type { Construct } from '@art-md/constructs';

// proxy read:  record[fieldName]                    → string | undefined (markdown)
// proxy write: record[fieldName] = value            → void, value: string | number | boolean | Construct | readonly Construct[]
setFieldMarkdown(name: string, markdown: string): void;
setFieldValue(name: string, value: Construct | readonly Construct[]): void;
getFieldMarkdown(name: string): string | undefined;
getFieldText(name: string): string | undefined;
getFieldValue(name: string): readonly Construct[] | undefined; // deep clone of the field's value
renameField(oldName: string, newName: string): void; // existing
relabelField(name: string, label: string): void; // rewrite the stored label, name unchanged
// delete record[fieldName]                          // existing
```

The two repair helpers — `getObscuredFields(section)` and `renameObscuredField(section, field, newName)` — are standalone value exports rather than `ArtRecord` members; they are specified in [Repairing Obscured Fields](#repairing-obscured-fields).

Naming follows Conventions: TypeScript — verb-first (`set`, `get`, `rename`, `relabel`, `delete`), `Field` in the middle of every per-field method, no abbreviations, `type` declarations only. The public index signature of `ArtRecord` stays `[fieldName: string]: unknown`; the runtime value behind a field read is a markdown string or `undefined`. Every method above is a handle member and therefore a reserved name (see [Reserved names](#reserved-names)).

## Field Names

Records address fields by **field name**, never by the label written in the document. A field name is either derived from the stored label at extraction (`labelToName`) or supplied by the consumer through the API. The stored label itself is never rewritten by a value update: `renameField` and `relabelField` are the two operations that rewrite one — rename with the derived `nameToLabel` spelling, relabel with a gate-checked spelling of the same name (see [Relabeling a Field](#relabeling-a-field)).

### Canonical grammar

A canonical field name matches `/^[a-z][a-zA-Z0-9]*$/` — a leading lowercase letter followed by letters and digits (`userId`, `a333`, `repo2Branch`). The grammar is a syntax gate on names **supplied through the API only**: creating a field whose name is not in the index, and renaming to a new name, must pass it. Names derived from document labels are never gated by the grammar — `labelToName` legitimately yields `3A33` or `ação`, and extraction keeps them as-is. The grammar is a syntax test and nothing more: `name`, `save`, and `renameField` are syntactically valid; reservation is a separate predicate (see [Reserved names](#reserved-names)).

### The two guarantees

- **API-created fields always carry a canonical name.** A name that passes the grammar gate is written with the label `nameToLabel(name)`.
- **Extracted fields carry whatever `labelToName` yields.** Extraction never rejects a field because its derived name is not canonical, and never rewrites a stored label retrospectively.

The guarantees are never conflated: a value update through an existing name touches the value only — the stored label, whatever it is, stays in the document.

### labelToName and nameToLabel

`labelToName` (direction A, document → API) is a single left-to-right pass over the label's Unicode code points: every non-word character (`[^\p{L}\p{M}\p{N}]`) is a separator, a lower→upper boundary starts a new word, and an uppercase run stays inside its word; the first word is lowercased and later words are capitalised. A label with no word characters (empty, whitespace, separator-only) throws `TypeError: Field label must contain at least one word character`. It is **not idempotent and never fed its own output**: it maps labels, not names, so `labelToName(labelToName(x))` is undefined behaviour for a label and is never asserted. It is deterministic and pure — no state, no locale sensitivity.

| Input            | Words before join   | Result          | Rule exercised                                         |
| ---------------- | ------------------- | --------------- | ------------------------------------------------------ |
| `Canonical Name` | `Canonical`, `Name` | `canonicalName` | separator + lower→upper                                |
| `aB-a`           | `a`, `B`, `a`       | `aBA`           | lower→upper, then separator, first word lowercased     |
| `aBC`            | `a`, `BC`           | `aBc`           | uppercase run stays one word, rest lowercased          |
| `IDField`        | `IDField`           | `idfield`       | `IDF` never splits; single word lowercased             |
| `NPM Package`    | `NPM`, `Package`    | `npmPackage`    | acronym run kept whole; later word capitalised         |
| `3A33`           | `3`, `A33`          | `3A33`          | digit→upper boundary; first word lowercased is a no-op |
| `0-1-0`          | `0`, `1`, `0`       | `010`           | digits are word characters; separators collapse        |
| `Ação`           | `Ação`              | `ação`          | non-ASCII letters are word characters; single word     |
| `a[b]c`          | `a`, `b`, `c`       | `aBC`           | brackets are separators; three words                   |

`nameToLabel` (direction B, API → document) splits before **every** uppercase letter — unlike `labelToName`, an uppercase run yields one word per letter — and space-joins the words with the first character upper-cased and the remainder **as-is** (`repo2Branch` keeps `epo2` unchanged inside `Repo2`). No validation and no guard: callers pass a name that already passed the grammar.

| Input         | Words             | Result         |
| ------------- | ----------------- | -------------- |
| `userId`      | `user`, `Id`      | `User Id`      |
| `aBC`         | `a`, `B`, `C`     | `A B C`        |
| `repo2Branch` | `repo2`, `Branch` | `Repo2 Branch` |
| `brandNew`    | `brand`, `New`    | `Brand New`    |

**The round trip that must hold** is `labelToName(nameToLabel(name)) === name` for every canonical name: `userId` → `User Id` → `userId`. A **stored label does not round-trip, by design**: `labelToName('IDField')` is `idfield`, `nameToLabel('idfield')` is `Idfield`, and the document still reads `IDField:` because nothing ever rewrote it. Direction A is correct as-is and is never tested as if it round-tripped.

### Reserved names

Handle members are reserved on the record proxy and every `__`-prefixed name is reserved for the API, so every handle accessor stays collision-free against dynamic field properties. `isReservedFieldName(name)` is true for any name with a `__` prefix and for the ten handle-member names `name`, `save`, `renameField`, `__section`, `setFieldMarkdown`, `setFieldValue`, `getFieldMarkdown`, `getFieldText`, `getFieldValue`, and `relabelField`. Addressing a field by a reserved name throws a `TypeError` on read, write, and delete, and a document field label that resolves to a reserved name aborts extraction. The two predicates compose rather than overlap: `name` is canonical (syntax) and reserved (collision), and the guard rejects it because it is both. The two repair helpers are standalone value exports, not handle members, so they are not reserved (see [Repairing Obscured Fields](#repairing-obscured-fields)).

Nine collisions are reachable from a document — the original eight plus `Relabel Field`. The labels `Name`, `Save`, `Rename Field`, `Set Field Markdown`, `Set Field Value`, `Get Field Markdown`, `Get Field Text`, `Get Field Value`, and `Relabel Field` resolve to handle-member names and abort extraction with:

```text
TypeError: Field label "Name" resolves to reserved name "name"
```

A `__`-prefixed **name** is reserved for the API gate and never enters the index. A `__`-prefixed **label** is not: `labelToName` treats `_` as a separator, so `__ Owner` converts to the non-reserved name `owner` and loads normally. `labelToName` never emits a `__` prefix, which is why `__section` is unreachable from any label.

### The name → field index

Extraction builds one `name → field` index per record, in document order, mapping `labelToName(label)` to the field construct; the first occurrence of a name wins and later duplicates stay in the section, shadowed. Every name-addressed access trap is an index lookup — no name-addressed trap scans section fields or converts a label at access time, and the repair helpers run on caller-owned copies, never on live state (see [Repairing Obscured Fields](#repairing-obscured-fields)). Removing the indexed field — by `delete`, or by a `renameField` that vacates the name — promotes the next duplicate, and the promoted field keeps its own stored label (`**Purpose:** Second` promotes under `purpose:` unchanged).

Mutation guards follow the name classes:

- Reserved names throw on read, write, and delete through the proxy.
- The canonical regexp gates creation only: writing a name already in the index updates its value without re-validating the name.
- The delete cells for handle members and for names not in the index report not-removed, surfaced as a `TypeError` by a strict-mode `delete`.

### Derived labels

A new field created through the API is labelled `nameToLabel(name)`: `brandNew` → `Brand New`, `npmPackageDeployment` → `Npm Package Deployment`. The derived label may not match how a consumer would spell the label by hand — a stated limitation of the one-way converter, not a bug, and the gap [Relabeling a Field](#relabeling-a-field) repairs in place.

### Codec constraint

Documents parsed by the Art MD codec only ever carry letter-led labels (`/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`). Arbitrary labels — digit-led, bracketed, non-ASCII-led — exist only in hand-built sections; the converters still handle them and the index still indexes them.

## Field and Section Behaviour

A field property such as `record.repository` resolves by field name against the `name → field` index built from the section's `FieldInline` or `FieldBlock` children (see [Field Names](#field-names)). Reading a name that is not in the index returns `undefined`. Writing a name that is not in the index appends a new field at the end of `section.children` — gated by the canonical grammar, labelled `nameToLabel(name)`, and shaped by the value per [Automatic Form](#automatic-form); writing a name that is in the index replaces its value in place. `renameField(fromName, toName)` relabels the field bound to `fromName` with `nameToLabel(toName)` and preserves its position; the old spelling is forgotten, and rename is one of the two operations that rewrite a stored label. `relabelField(name, label)` is the other: it keeps the name, the position, the tags, the value, and every index key, and rewrites only the label, gated as specified in [Relabeling a Field](#relabeling-a-field); obscured fields are repaired on a caller-owned snapshot as specified in [Repairing Obscured Fields](#repairing-obscured-fields). `delete record.repository` removes the construct bound to that name.

`record.__section` returns a deep clone of the complete `SectionBlock` — including its properties (`depth`, `tags`) and ordered children — on every access: the snapshot is current at the moment of access and owned by the caller, mutations to it never reach the record, and section-level changes are applied back through `replaceRecordSection` (see [Repairing Obscured Fields](#repairing-obscured-fields)). Field values read through [Reading raw](#reading-raw) are deep clones, never the section's own objects.

## Decisions

Field decisions — naming, index resolution, rename, form selection, the string-write route, the read model, and copy-on-write repair — are recorded in [`adr/fields.art`](../adr/fields.art). Records-level decisions are recorded in [`adr/records.art`](../adr/records.art).
