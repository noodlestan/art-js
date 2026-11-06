# @art-js/records

> Record identity, discovery, extraction, update and serialisation for Markdown records.

Record identity, discovery, extraction, update and serialisation for Markdown documents.

This package is part of the [Art JS toolkit](../../README.md) toolkit.

## Usage

Fields are addressed by **canonical field names** — `/^[a-z][a-zA-Z0-9]*$/` — derived once from the stored document label at extraction. A value update never rewrites the label; new fields and renames write labels derived with `nameToLabel`, and `relabelField(name, label)` repairs a stored label in place while the field keeps its name, position, tags, and value. The five value methods also have `…ByLabel` twins that read and write by exact stored label, reaching a field shadowed by an earlier duplicate.

Given a provider created with `createRecordsDocument({ codec, createContentSource })` (see the [design document](knowledge/design/records.md)):

```ts
const document = await documentRecords.read(packageFile);
const records = await document.extract();
const packageRecord = records.find(record => record.name === 'Package: Records');

if (packageRecord === undefined) {
  throw new Error('Package: Records section not found');
}

packageRecord.purpose; // reads the `**Purpose:**` field by name
packageRecord.canonicalName; // reads `**Canonical Name:** @art-js/records` by name
packageRecord.__section; // the complete SectionBlock

packageRecord.repository = 'art-js'; // appends `**Repository:** art-js`
packageRecord.renameField('repository', 'checkout'); // relabels it `**Checkout:** art-js`
packageRecord.relabelField('canonicalName', 'Canonical name'); // rewrites only the stored label
packageRecord.setFieldMarkdownByLabel('Canonical name', '@art-js/records'); // value write by stored label
packageRecord.getFieldValueByLabel('Canonical name'); // the value's Art AST, by stored label
await packageRecord.save(); // writes the document once
```

A field label that resolves to a reserved name aborts `extract()` with a `TypeError`; `record.name`, `record.__section`, `record.save()`, `record.renameField()`, and `record.relabelField()` stay handle members. The reserved set holds the fifteen handle-member names — `name`, `save`, `renameField`, `__section`, the five name-addressed value methods, `relabelField`, and the five `…ByLabel` twins — and the fourteen labels reachable from a document (`Name`, `Save`, `Rename Field`, `Set Field Markdown`, `Set Field Value`, `Get Field Markdown`, `Get Field Text`, `Get Field Value`, `Relabel Field`, `Set Field Markdown By Label`, `Set Field Value By Label`, `Get Field Markdown By Label`, `Get Field Text By Label`, `Get Field Value By Label`) abort with `TypeError: Field label "{label}" resolves to reserved name "{name}"`.

## Migrating from 0.0.x

- `record.Repository` → `record.repository` — fields resolve by canonical field name, never by the stored label.
- `record['Canonical Name']` → `record.canonicalName` — labels are converted once with `labelToName`.
- `renameField` now takes names: `record.renameField('repository', 'checkout')` relabels the field via `nameToLabel(toName)` and forgets the old spelling.
- New fields derive their label from their name: `record.brandNew = 'x'` writes `**Brand New:** x`.

## Development

Make sure you read the [Art JS README](../../README.md) first.

### Build Targets

This library is packaged for use in bundlers such as Vite and Astro. The main entry point is the Typescript source code.

### Scripts

- **$** `npm run dev` — Watch mode for development
- **$** `npm run build` — Build the library
- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues
- **$** `npm run build:clean` — Remove build artifacts
- **$** `npm run ci` — Run CI pipeline
- **$** `npm run test` — Run tests

## Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
