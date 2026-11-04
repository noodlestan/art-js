# Design: Fields

**Status:** Specification — the expanded field surface below is the target API of `@art-js/records`, written by the `write-fields-spec` iteration of Plan: Expand Fields API and landed by `implement-fields-spec`. Until that iteration ships, [records.md](records.md) documents the implemented v0.0.1 behaviour.

**Purpose:** Specify the complete field API: how a field value is set from a `string` or from an Art AST construct, which form the field takes, how it is read back as markdown, text, or raw construct, and how field names address it.

**Scope:** `@art-js/records` owns the field surface of the record handle: the proxy accessor and proxy setter, `setFieldMarkdown`, `setFieldConstruct`, `getFieldMarkdown`, `getFieldText`, `getFieldConstruct`, `renameField`, `delete`, and the field-name contract. Records, sections, placement, persistence, and the provider model are specified in [records.md](records.md).

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
record.setFieldConstruct('location', location);
```

### Reading Fields

```ts
record.greeting; // markdown — 'Hello, are _you_ there _world_?'
record.getFieldMarkdown('greeting'); // same value the accessor returns
record.getFieldText('greeting'); // text — 'Hello, are you there world?'
record.getFieldConstruct('greeting'); // the FieldInline construct, label included
```

## Setting Field Values

A field value is either a `string` or an Art AST construct. There is no third input shape: no freeform typed-value object, no `{ type, value }` literal on the handle. The form the resulting field takes is never requested by the caller (see [Automatic Form](#automatic-form)).

### Setting from a string

A string is set through `codec.parse(markdown)` — the single string entry point of the API. The parsed fragment's constructs become the field's value, so markdown forms survive the round trip:

- `setFieldMarkdown('greeting', 'Hello, are _you_ there _world_?')` parses to one paragraph whose children are text and emphasis expressions; the field holds those expressions and reads back with its `_…_` markers intact.
- A fenced code string parses to a `NaturalBlock` of `type: 'code'`; the field holds that block and reads back with its fence intact.
- A multi-line string parses to one paragraph whose children span the soft line break; the field holds them exactly as authored.

This replaces the v0.0.1 write, which coerced the value with `String(value)` and stored a single `codec.create('NaturalExpression', { type: 'text', … })` node (a `NaturalBlock` on block fields): markdown syntax was stored literally, so `` **Location:** `art-works` `` lost its backticks on the first update.

To store literal text that contains markdown characters, set a construct instead — `setFieldConstruct` with a text `NaturalExpression` — or escape the characters in the string.

### Setting from an Art AST construct

A field can be set directly from any Art construct the consumer created — `Construct` from `@art-md/constructs`, the open union of every construct. The consumer builds it through `codec.create(name, …args)`, through `codec.getConstructFactory(name)`, or by hand, and passes it as-is; the value is installed without re-encoding it through markdown.

````ts
const code = codec.create<NaturalBlock>('NaturalBlock', {
  type: 'code',
  lang: 'typescript',
  value: '```typescript\nconst x = 42;\n```',
  children: [],
});
record.setFieldConstruct('codeExample', code);
````

A construct that already wraps a value — a `FieldInline`, a `FieldBlock`, or a `Document` — contributes its children, not itself (see [Automatic Form](#automatic-form)).

### The proxy setter

The proxy setter accepts `string | Construct`:

```ts
record.<fieldName> = value; // value: string | Construct
```

- A **string becomes a parsed markdown fragment**: it is routed through `codec.parse`, exactly as `setFieldMarkdown` does. The spec chooses `codec.parse` over `codec.create` for the text node because the string-set contract requires markdown forms to survive (see [Setting from a string](#setting-from-a-string)), and because one string-input mechanism shared by the proxy and the dedicated method means the same input cannot behave differently depending on the route taken.
- A **construct** is routed exactly as `setFieldConstruct` does.
- Any other value — `number`, `boolean`, `undefined`, a plain object — is rejected with a `TypeError`. The v0.0.1 `String(value)` coercion is gone; deleting a field is `delete record.<fieldName>`.

The proxy setter never takes a form argument. Block versus inline follows the value (see [Automatic Form](#automatic-form)).

### setFieldMarkdown and setFieldConstruct

Two dedicated methods make both write routes explicit and callable with a dynamic name:

```ts
setFieldMarkdown(name: string, markdown: string): void;
setFieldConstruct(name: string, construct: Construct): void;
```

- `setFieldMarkdown` parses `markdown` through `codec.parse` and installs the resulting constructs as the field's value. It is the string-set method; the proxy setter with a string delegates here.
- `setFieldConstruct` installs the consumer's construct as the field's value. It is the construct-set method; the proxy setter with a construct delegates here.

Both create the field when `name` is not in the record's index (gated by the canonical grammar, labelled `nameToLabel(name)`), replace the value in place when it is, and throw the reserved-name `TypeError` for reserved names — see [Field and Section Behaviour](#field-and-section-behaviour) and [Reserved names](#reserved-names).

## Automatic Form

A field is a `FieldBlock` (block content on its own lines) or a `FieldInline` (phrasing content on the label's line). The form is **chosen from the value being set** — the caller never selects it, and there is no overload, option, or method that takes a form.

Given `content(value)`:

1. `string` → `codec.parse(value).document.children` — the parsed fragment's children.
2. `Construct` that is a `FieldInline`, `FieldBlock`, or `Document` → `value.children` — the wrapper is unwrapped, so a caller cannot smuggle a form in through a field construct.
3. any other `Construct` → `[value]` — the construct itself is the content.

The form follows from `content`:

1. `content` is empty → `FieldInline` with no children (an empty string clears the value to a bare label line).
2. `content` is exactly one `NaturalBlock` of `type: 'paragraph'` → `FieldInline`, and the paragraph is unwrapped to its `NaturalExpression` children. CommonMark wraps bare phrasing in a paragraph; without this step every plain-string write would become a block field.
3. every child of `content` is a `NaturalExpression` → `FieldInline` with `content` as its children.
4. otherwise (any block-level child: code, list, multiple blocks) → `FieldBlock` with `content` as its children.

Writing to an existing field replaces its children and, when the classification differs, converts the field construct in place between `FieldInline` and `FieldBlock`, preserving `name`, `tags`, and position. Consequences:

- The old value is fully replaced either way, so a block field set to a phrasing-only value becomes an inline field — to keep a field block-shaped, the value must carry block content (a fenced code string, a code `NaturalBlock`).
- Appending a new field to `section.children` uses the same classification; new fields are no longer always inline.

## Reading Field Values

Every read addresses the field's **value** — the label (`name`) is not part of any read result; it is available from [Reading raw](#reading-raw). A name that is not in the index returns `undefined` on all three reads.

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
getFieldConstruct(name: string): FieldInline | FieldBlock | undefined;
```

Returns the field's Art AST construct — the `FieldInline` or `FieldBlock` bound to `name`, or `undefined`. The API does not already expose it: `record.__section` reaches field constructs only by walking `children` structurally, with no per-name accessor. The returned construct is the live one in the section, so its `name`, `tags`, and `children` are the document's own state.

## Field Forms and Fixtures

The three Art MD fixtures at `$ART_MD/libs/constructs/test/fixtures/` are the field-form vocabulary the API must express on read and reproduce on write. Fixture ids are cited as `NNN-slug` with their `.md.json` Art AST snapshots.

| Fixture                                   | Markdown form                                    | Art AST                                             | Read as markdown                          | Read as text                   | Write that reproduces it                                                                                              |
| ----------------------------------------- | ------------------------------------------------ | --------------------------------------------------- | ----------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `025-field-block-with-code`               | `**Code Example:**` plus a fenced code block     | `FieldBlock` → `NaturalBlock` (`code`)              | the code block's markdown, fence included | the code value, fence included | `setFieldMarkdown` with the fenced string, or a code `NaturalBlock` through `setFieldConstruct` → block form (rule 4) |
| `031-field-inline-with-inline-formatting` | `**Greeting:** Hello, are _you_ there _world_?`  | `FieldInline` → text/emphasis expressions           | `Hello, are _you_ there _world_?`         | `Hello, are you there world?`  | `setFieldMarkdown` with the single-line string → one paragraph unwrapped → inline form (rule 2)                       |
| `032-field-inline-with-multiple-lines`    | `**Greeting:** Hello world!\n_How_ are **you**?` | `FieldInline` whose first text child ends with `\n` | `Hello world!\n_How_ are **you**?`        | `Hello world!\nHow are you?`   | `setFieldMarkdown` with the multi-line string → one paragraph unwrapped → inline form (rule 2)                        |

- **Read:** all three serialise their value through `codec.serialize` for the markdown read and through `codec.toText` for the text read; the raw read returns the `FieldBlock`/`FieldInline` itself.
- **Write:** all three are produced by `codec.parse` plus the automatic-form classification — a string or a construct, never a form argument.

## Public Field API

Every name the spec introduces, in one place. These are members of `ArtRecord` (`design/records.md` → Public API); `createRecordsDocument`, `createRecord`, and the collection types are unaffected.

```ts
import type { Construct, FieldBlock, FieldInline } from '@art-md/constructs';

// proxy read:  record[fieldName]                    → string | undefined (markdown)
// proxy write: record[fieldName] = value            → void, value: string | Construct
setFieldMarkdown(name: string, markdown: string): void;
setFieldConstruct(name: string, construct: Construct): void;
getFieldMarkdown(name: string): string | undefined;
getFieldText(name: string): string | undefined;
getFieldConstruct(name: string): FieldInline | FieldBlock | undefined;
renameField(oldName: string, newName: string): void; // existing
// delete record[fieldName]                          // existing
```

Naming follows Conventions: TypeScript — verb-first (`set`, `get`, `rename`, `delete`), `Field` in the middle of every per-field method, no abbreviations, `type` declarations only. The public index signature of `ArtRecord` stays `[fieldName: string]: unknown`; the runtime value behind a field read is a markdown string or `undefined`. Every method above is a handle member and therefore a reserved name (see [Reserved names](#reserved-names)).

## Field Names

Records address fields by **field name**, never by the label written in the document. A field name is either derived from the stored label at extraction (`labelToName`) or supplied by the consumer through the API. The stored label itself is never rewritten by a value update.

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

Handle members are reserved on the record proxy and every `__`-prefixed name is reserved for the API, so every handle accessor stays collision-free against dynamic field properties. `isReservedFieldName(name)` is true for any name with a `__` prefix and for the handle-member names `name`, `save`, `renameField`, `__section`, `setFieldMarkdown`, `setFieldConstruct`, `getFieldMarkdown`, `getFieldText`, and `getFieldConstruct`. Addressing a field by a reserved name throws a `TypeError` on read, write, and delete, and a document field label that resolves to a reserved name aborts extraction. The two predicates compose rather than overlap: `name` is canonical (syntax) and reserved (collision), and the guard rejects it because it is both.

Eight collisions are reachable from a document — the labels `Name`, `Save`, `Rename Field`, `Set Field Markdown`, `Set Field Construct`, `Get Field Markdown`, `Get Field Text`, and `Get Field Construct` resolve to handle-member names and abort extraction with:

```text
TypeError: Field label "Name" resolves to reserved name "name"
```

A `__`-prefixed **name** is reserved for the API gate and never enters the index. A `__`-prefixed **label** is not: `labelToName` treats `_` as a separator, so `__ Owner` converts to the non-reserved name `owner` and loads normally. `labelToName` never emits a `__` prefix, which is why `__section` is unreachable from any label.

### The name → field index

Extraction builds one `name → field` index per record, in document order, mapping `labelToName(label)` to the field construct; the first occurrence of a name wins and later duplicates stay in the section, shadowed. Every access trap is an index lookup — no trap scans section fields or converts a label at access time. Removing the indexed field — by `delete`, or by a `renameField` that vacates the name — promotes the next duplicate, and the promoted field keeps its own stored label (`**Purpose:** Second` promotes under `purpose:` unchanged).

Mutation guards follow the name classes:

- Reserved names throw on read, write, and delete through the proxy.
- The canonical regexp gates creation only: writing a name already in the index updates its value without re-validating the name.
- The delete cells for handle members and for names not in the index report not-removed, surfaced as a `TypeError` by a strict-mode `delete`.

### Derived labels

A new field created through the API is labelled `nameToLabel(name)`: `brandNew` → `Brand New`, `npmPackageDeployment` → `Npm Package Deployment`. The derived label may not match how a consumer would spell the label by hand — a stated limitation of the one-way converter, not a bug.

### Codec constraint

Documents parsed by the Art MD codec only ever carry letter-led labels (`/^[A-Za-z][A-Za-z ]*:(?:\s|$)/`). Arbitrary labels — digit-led, bracketed, non-ASCII-led — exist only in hand-built sections; the converters still handle them and the index still indexes them.

## Field and Section Behaviour

A field property such as `record.repository` resolves by field name against the `name → field` index built from the section's `FieldInline` or `FieldBlock` children (see [Field Names](#field-names)). Reading a name that is not in the index returns `undefined`. Writing a name that is not in the index appends a new field at the end of `section.children` — gated by the canonical grammar, labelled `nameToLabel(name)`, and shaped by the value per [Automatic Form](#automatic-form); writing a name that is in the index replaces its value in place. `renameField(fromName, toName)` relabels the field bound to `fromName` with `nameToLabel(toName)` and preserves its position; the old spelling is forgotten. `delete record.repository` removes the construct bound to that name.

`record.__section` exposes the complete `SectionBlock`, including its properties (`depth`, `tags`) and ordered children; field constructs read through [Reading raw](#reading-raw) are the same objects the section holds.

## Decisions

Field decisions — the field-name index (`canonical-field-names`, `field-name-index`, `rename-field-by-name`), the automatic form rule, the string-set route, and the read model — are recorded in [`adr/fields.art`](../adr/fields.art). Records-level decisions are recorded in [`adr/records.art`](../adr/records.art).
