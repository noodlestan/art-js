# Instructions: `implement-copy-on-write-repair`

**Plan:** `obscured-field-repair`

**Iteration Id:** `implement-copy-on-write-repair`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather evidence of changes and outcomes, or blocker details.
3. Use the `render-template` skill with `$DOMAINS/plans/templates/instructions-report.tart` to write the report to `./instructions/implement-copy-on-write-repair__report.md`.
4. Include any `DIRECTIVE FEEDBACK:` in the report.
5. Send the report back to the delegator.
6. Keep the chat response terse: a happy face and up to 3 bullets.

## Path Variables

| Variable     | Resolved Path                | Purpose                                    |
| ------------ | ---------------------------- | ------------------------------------------ |
| `$WORKSPACE` | Current workspace root       | Workspace setup and operating instructions |
| `$PROJECT`   | `checkouts/art-js`           | Project checkout                           |
| `$PACKAGE`   | `$PROJECT/libs/records`      | `@art-js/records` package                  |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Work and plan templates                    |

## Working Agreements

The plan workflow runs on three working agreements:

1. **This instructions file is self-contained.** Everything needed is in this file plus its mandatory reading; do not rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The report file carries the full trail: evidence, changes, verification results, blockers, and feedback.
3. **User interaction is minimal.** The chat response is a light confirmation. If something blocks the work, report the blocker instead.

## Goals

Implement the specified copy-on-write repair API, preserve section and anchor identity during apply, and make all superseded collection handles fail reliably—including methods captured before replacement.

## Mandatory Reading

- ::READ `$PROJECT/_backlog/3-now/plan-obscured-field-repair/plan.md` — scope, decisions, iteration changes, and commit blueprint.
- ::READ `$PACKAGE/knowledge/design/fields.md` — field API and copy-on-write contract.
- ::READ `$PACKAGE/knowledge/design/records.md` — record, collection, and anchor contracts.
- ::READ `$PACKAGE/knowledge/adr/fields.art` — adopted field decisions.
- ::READ `$PACKAGE/knowledge/adr/records.art` — collection, handle, and anchor decisions.
- ::READ `$PACKAGE/knowledge/index.md` — package knowledge index.
- ::READ `$PACKAGE/_guide.md` — package layout and operating instructions.
- ::READ `$PROJECT/_guide.md` — project conventions and verification.
- ::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.
- ::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — unit-test conventions.
- ::READ `$PACKAGE/src/record/private/capsule/createRecordProxy.ts` and `createRecordCapsule.ts` — handle operations and proxy boundary.
- ::READ `$PACKAGE/src/record/createRecord.ts` — standalone record lifecycle and save behavior.
- ::READ `$PACKAGE/src/record/types.ts` — public record type.
- ::READ `$PACKAGE/src/records-document/private/createRecordsCollection.ts`, `types.ts`, and `sections/findAnchorLocation.ts` — collection, handle creation, and anchor resolution.
- ::READ `$PACKAGE/src/record/private/field-index/createFieldIndex.test.ts` — reserved-label contract test.
- ::READ `$PACKAGE/tests/record-helpers/recordFieldPromotion.test.ts` — duplicate-field and section-mutation contract tests.
- ::READ the existing relevant fixtures and test helpers before modifying them.

Follow any further mandatory reading in these files. If a required file cannot be read, stop and report a blocker.

---

## Operating Instructions

### Setting Up

Run from `$WORKSPACE`:

```bash
npm ci
```

### Verifying Step

Run from `$PACKAGE`:

```bash
npm run lint
npm run build
npm run test:unit
npm run test:integration
```

### Verifying Completion

Run from `$PROJECT`:

```bash
npm run ci
```

---

## Changes

- Step 1 / 4 — Implement snapshots, helpers, and the reduced field API.
- Step 2 / 4 — Add collection-managed replacement and handle generations.
- Step 3 / 4 — Update tests, fixtures, and README.
- Step 4 / 4 — Commit `implement-copy-on-write-repair`.

## Steps

### Step 1 / 4 — Implement the field API boundary and helpers

In `$PACKAGE/src/record/types.ts`, capsule/proxy code, and public exports:

- Remove `setFieldMarkdownByLabel`, `setFieldValueByLabel`, `getFieldMarkdownByLabel`, `getFieldTextByLabel`, and `getFieldValueByLabel` from `ArtRecord`, its capsule, proxy functions/descriptors, and the reserved-name set.
- Keep `relabelField` on `ArtRecord`.
- Export exactly `getObscuredFields(section)` and `renameObscuredField(section, field, newName)` as standalone `@art-js/records` helpers.
- Implement the helper rules: require membership by identity; if a member field is not obscured, throw `TypeError('Field is not obscured; use record.renameField instead')`. Before mutation, require a canonical, non-reserved `newName`, require `nameToLabel(newName)` to re-parse under the codec field-label pattern, and require no other field in the section to derive that key. Change only the stored label; rejected operations leave the working copy untouched.
- Make each `record.__section` access return a fresh deep clone of the live section.

### Step 2 / 4 — Implement collection apply and generation lifecycle

In `$PACKAGE/src/records-document/private/createRecordsCollection.ts` and the record proxy boundary:

- Track the current `GenerationToken` per live `SectionBlock` in a `WeakMap<SectionBlock, GenerationToken>`. Track each record handle’s section and captured token in a `WeakMap<ArtRecord, HandleEntry>`.
- Route both `extract()` and `addRecord()` through `createRecordHandle`, so handles for the same live section share its current token.
- Centralize lifecycle enforcement at the proxy boundary. Guard property access and proxy traps, and wrap every exposed method—including `save()`—so lifecycle is checked when the operation is invoked. A previously captured method reference must therefore throw after token rotation.
- Collection-managed handles use the per-section generation token. Standalone `createRecord()` handles receive a private always-active token (or equivalent always-active guard) that is never registered with a collection or rotated; their normal reads, writes, and saves remain usable.
- Use the current-token check in collection operations that consume registered handles, including `replaceRecordSection` and anchor resolution for `addRecord`. Because standalone handles have no collection handle entry, `replaceRecordSection` rejects one with `The record is not part of this document`; placement rejects it with the unchanged `The placement anchor is not part of this document` error. A superseded same-collection handle throws:
  `Error('Record handle has been superseded; use the handle returned by replaceRecordSection')`.
- In `replaceRecordSection(record, section)`, verify the handle is current and collection-owned; validate that the incoming root is a `SectionBlock`, and require `section.name === live.name` and `section.depth === live.depth`. Reject a changed name with the existing immutable-name error and a depth mismatch with a stable error. Do not require a non-empty name: a new `addRecord()` handle may have an empty name until set.
- Run field-index validation and stage cloned `tags` and `children` before mutating the live section. Then copy only those mutable fields into the existing section object. Do not assign to frozen `name` or `depth`, and do not replace the section object.
- After successful content-copy, rotate the section’s generation token, re-extract with a fresh capsule/token, and return the new handle. All previous handles for that section become stale through the same token comparison.

### Step 3 / 4 — Update tests, fixtures, and README

- Test fresh, deep, current snapshots and verify snapshot mutation does not alter live record state.
- Test that `renameObscuredField` rejects a visible field with `TypeError: Field is not obscured; use record.renameField instead`.
- Test current/collection ownership, matching name/depth, reserved-label rejection, staged-copy atomicity, preserved section identity, applied content on the returned handle, and save/reload behavior.
- Test repeated `extract()` handles share a token and all fail after replacement.
- Test an `addRecord()` handle and handles extracted for that section share a token and all fail after replacement.
- Test stale property access, enumeration, method invocation, `save()`, `replaceRecordSection`, and anchor placement. Capture a method before replacement and verify invoking it afterward throws the specified error.
- Test standalone `createRecord()` handles remain usable for reads, writes, and saves, while `replaceRecordSection` throws `The record is not part of this document` and anchor placement throws `The placement anchor is not part of this document`.
- Preserve foreign-anchor behavior and verify anchors remain usable through the returned handle.
- Rewrite tests that mutate `record.__section` to assert snapshot immunity and use internal capsule/context seams for live-section contract tests; do not add test-only public exposure.
- Update fixture names and reserved-name counts to ten handle members and nine reachable collision labels.
- Update README to describe the current public API and snapshot contract.
- Do not edit files under `$PACKAGE/knowledge/` in this iteration; final knowledge reconciliation belongs to `finalize-repair-knowledge`.
- Do not edit the changelog in this iteration; that belongs to `finalize-repair-knowledge`.

---

#### Commit: `implement-copy-on-write-repair`

**Policy:** `NOPUSH` — commit; do not push.

**Message:**

```text
build(records): Repair obscured fields on a copy.

- Snapshot `__section` and ship `replaceRecordSection` with the section helpers.
- Drop the five by-label members and reseat anchors on the WeakMap bridge.
- Rewrite the repair fixtures and the live-section contract tests.
```

## Final Verification

- Verify the API boundary, token rotation, captured-method behavior, and frozen-property apply contract match the plan.
- Run all package and project verification commands in “Operating Instructions.”
- Verify the commit was created under `NOPUSH` and was not pushed.
- Report completion or a blocker according to “How to Report Back to the Delegator.”
