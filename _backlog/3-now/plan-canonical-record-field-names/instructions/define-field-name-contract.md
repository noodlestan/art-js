# Instructions: `define-field-name-contract`

**Plan:** `canonical-record-field-names`

**Iteration Id:** `define-field-name-contract`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/define-field-name-contract__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `define-field-name-contract`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                                 |
| ------------ | ------------------------- | --------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory                |
| `$PROJECT`   | `checkouts/art-js`        | Art JS checkout where the work executes |
| `$PACKAGE`   | `$PROJECT/libs/records`   | The `@art-js/records` package           |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `define-field-name-contract`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Add the field name contract of `@art-js/records` as four pure, unit-tested modules under `$PACKAGE/src/record/private`: the canonical field name grammar, the label → name converter, the name → label converter, and the full reserved-name predicate. Every later iteration of the plan references these definitions, so they must be pinned by tests before any proxy behaviour changes. Commit as `build(records): Add field name helpers.`

This iteration changes **no proxy or serialization behaviour** — it only adds modules and widens a predicate whose call sites are all shielded by the proxy's own-property checks.

## Mandatory Reading

::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — Conventions: TypeScript.

::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — Conventions: Unit Tests.

- reference: `../plan__pseudo.md` — algorithm reference: worked traces, invariants, and the two directions for all four modules.
- reference: `../plan__tests.md` — how to derive the test cases, the sibling-fixture setup, and the `it.each` mechanism. **The case lists are not written there on purpose — deriving them exhaustively is part of this iteration's work.**
- design: `$PACKAGE/knowledge/design/records.md` — field and section behaviour, reserved names.
- guide: `$PACKAGE/_guide.md` — package layout and operating instructions.
- guide: `$PROJECT/_guide.md` — repository layout and operating instructions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root, and again from the `$PROJECT` root — the workspace is not a build root, every project repo builds standalone:

```bash
npm ci # to install dependencies.
```

### Verifying Step

**Purpose:** Validate lint, tests and build for a package step.

**Instructions:** (From `$PACKAGE/_guide.md`)

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run build # to produce a full build
```

### Verifying Completion

**Purpose:** Confirm the work item satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root:

```bash
npm run ci # lint, test and build
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there — or reuse the blueprint message provided at the commit step, which is already authored.

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 5 — Add `FieldName` type and `isCanonicalFieldName` with tests
- Step 2 / 5 — Add `labelToName` with tests
- Step 3 / 5 — Add `nameToLabel` with tests
- Step 4 / 5 — Widen `isReservedFieldName` with tests
- Step 5 / 5 — Commit `add-field-name-helpers`

## Steps

### Step `1 / 5` — Add `FieldName` type and `isCanonicalFieldName` with tests

**Goal:** expose the canonical field name grammar as one predicate so every later validation references a single definition.

**Files:**

- MODIFY `$PACKAGE/src/record/private/types.ts` — add `export type FieldName = string;` as the first type in the file (it has no dependencies).
- CREATE `$PACKAGE/src/record/private/isCanonicalFieldName.ts`
- CREATE `$PACKAGE/src/record/private/isCanonicalFieldName.fixtures.ts`
- CREATE `$PACKAGE/src/record/private/isCanonicalFieldName.test.ts`

**Execution:**

Add the type, then the predicate. The grammar is the complete validity test for a name supplied through the API — there is no second, algorithmic test:

```ts
// $PACKAGE/src/record/private/isCanonicalFieldName.ts
import type { FieldName } from './types.js';

const CANONICAL_FIELD_NAME_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

export function isCanonicalFieldName(name: FieldName): boolean {
  return CANONICAL_FIELD_NAME_PATTERN.test(name);
}
```

The import is required — `verbatimModuleSyntax` in the package tsconfig means a type used in a signature must be imported with `import type`.

**Expected outcome:** `isCanonicalFieldName` accepts `userId`, `aBA`, `id`, `repo2Branch`, `a333`, `name`, `save`, `renameField` and rejects `3A33`, `333A`, `010`, `ação`, `Canonical Name`, `__x`, `__section`, `''`. Note `name`, `save`, and `renameField` are syntactically valid — reservation is a separate predicate (Step 4); do not encode reservation here.

**Tests:** co-locate `$PACKAGE/src/record/private/isCanonicalFieldName.fixtures.ts` and `.test.ts`, following `./plan__tests.md` — sibling fixture file, imported, driven through `it.each` with `%s` interpolation so a failure reads `WHEN name "%s" provided`. Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps; separate setup, invocation, and assertion blocks with empty lines:

```ts
import { describe, expect, it } from 'vitest';

import { isCanonicalFieldName } from './isCanonicalFieldName.js';
import { canonicalNameCases } from './isCanonicalFieldName.fixtures.js';

describe('isCanonicalFieldName', () => {
  it.each(canonicalNameCases)('GIVEN name "%s" provided THEN canonical is %s', (name, expected) => {
    expect(isCanonicalFieldName(name)).toBe(expected);
  });
});
```

The fixture rows are yours to derive — every accept and reject class listed in the pseudo code's section 1, not just the examples shown above.

**Verify:** `npm run test:unit` from `$PACKAGE` is green.

### Step `2 / 5` — Add `labelToName` with tests

**Goal:** generate a field name from a stored label in one pass, without ever validating or rewriting the label.

**Files:**

- CREATE `$PACKAGE/src/record/private/labelToName.ts`
- CREATE `$PACKAGE/src/record/private/labelToName.fixtures.ts`
- CREATE `$PACKAGE/src/record/private/labelToName.test.ts`

**Execution:** one pass over the trimmed label's Unicode code points (`for...of` iterates code points, not UTF-16 units). Rules, in order:

1. A word character is `[\p{L}\p{M}\p{N}]` — combining marks stay attached to their base letter.
2. Any character outside that class ends the current word (punctuation and symbols are separators, uniformly).
3. An uppercase letter starts a new word when the preceding character is not uppercase; consecutive uppercase letters stay together.
4. The first word is lowercased; each later word has its first character capitalized and its remainder lowercased; join with no separator.
5. No words produced — an empty, whitespace-only, or separator-only label — throws `TypeError`.

Do **not** extract a shared word-splitting helper with a mode flag: `labelToName` and `nameToLabel` split by different rules. Keep each loop inside its own function.

```ts
// $PACKAGE/src/record/private/labelToName.ts
import type { FieldName } from './types.js';

const WORD_CHARACTER_PATTERN = /[\p{L}\p{M}\p{N}]/u;
const UPPERCASE_LETTER_PATTERN = /\p{Lu}/u;

export function labelToName(label: string): FieldName {
  const words: string[] = [];
  let currentWord = '';

  for (const character of label.trim()) {
    if (!WORD_CHARACTER_PATTERN.test(character)) {
      if (currentWord !== '') {
        words.push(currentWord);
        currentWord = '';
      }
      continue;
    }

    if (
      currentWord !== '' &&
      UPPERCASE_LETTER_PATTERN.test(character) &&
      !UPPERCASE_LETTER_PATTERN.test(currentWord.at(-1) ?? '')
    ) {
      words.push(currentWord);
      currentWord = '';
    }

    currentWord += character;
  }

  if (currentWord !== '') {
    words.push(currentWord);
  }

  if (words.length === 0) {
    throw new TypeError('Field label must contain at least one word character');
  }

  return words.map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word))).join('');

  function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
```

`capitalize` is a closure inside the function (a closure does not qualify for extraction): use `charAt(0)` for the first character — `word[0]` is `string | undefined` under `noUncheckedIndexedAccess` and will not compile. No non-null assertions, no `any`.

**Expected outcome** — these are the plan's rule table, assert every row:

| Label            | Field name      |
| ---------------- | --------------- |
| `Purpose`        | `purpose`       |
| `Canonical Name` | `canonicalName` |
| `Canonical-Name` | `canonicalName` |
| `user_id`        | `userId`        |
| `a[b]c`          | `aBC`           |
| `f(x)`           | `fX`            |
| `IDField`        | `idfield`       |
| `NPM Package`    | `npmPackage`    |
| `aB-a`           | `aBA`           |
| `aBC`            | `aBc`           |
| `3A33`           | `3A33`          |
| `333A`           | `333A`          |
| `A333`           | `a333`          |
| `0-1-0`          | `010`           |
| `2Branch`        | `2Branch`       |
| `Repo 2 Branch`  | `repo2Branch`   |
| `Ação`           | `ação`          |

RULE: `labelToName` does **not** validate — `3A33` and `010` are legitimate extracted names even though they fail `isCanonicalFieldName`. Do not reject them.

RULE: `labelToName` is not idempotent and must not be required to be — a field name is never fed back in as a label. Do **not** add a test asserting `labelToName(labelToName(label)) === labelToName(label)`.

**Tests:** co-locate `labelToName.fixtures.ts` and `labelToName.test.ts`, following `./plan__tests.md`. Two fixture families:

- the plan's rule table (every row of **Rule table** above), driven through `it.each` with `%s` so failures read `WHEN label "%s" provided`;
- your own derivation — one family per rule in the **Execution** list above, covering boundary and negative cases (empty, whitespace-only, and separator-only input must throw `TypeError`).

Do **not** write `labelToName(labelToName(x)) === labelToName(x)` — it is not idempotent and is not required to be.

**Verify:** `npm run test:unit` from `$PACKAGE` is green.

### Step `3 / 5` — Add `nameToLabel` with tests

**Goal:** generate a label from a field name, one pass, so a name written by a consumer is immediately addressable through the same name.

**Files:**

- CREATE `$PACKAGE/src/record/private/nameToLabel.ts`
- CREATE `$PACKAGE/src/record/private/nameToLabel.fixtures.ts`
- CREATE `$PACKAGE/src/record/private/nameToLabel.test.ts`

**Execution:** split before **every** uppercase letter (this differs from Step 2 — an uppercase run yields one word per letter), capitalize each word's first character, keep each remainder **as-is**, join with a single space. No validation and no guard: callers pass a name that already passed `isCanonicalFieldName`.

```ts
// $PACKAGE/src/record/private/nameToLabel.ts
import type { FieldName } from './types.js';

const UPPERCASE_LETTER_PATTERN = /\p{Lu}/u;

export function nameToLabel(name: FieldName): string {
  const words: string[] = [];
  let currentWord = '';

  for (const character of name) {
    if (UPPERCASE_LETTER_PATTERN.test(character) && currentWord !== '') {
      words.push(currentWord);
      currentWord = '';
    }
    currentWord += character;
  }

  if (currentWord !== '') {
    words.push(currentWord);
  }

  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
```

Use `charAt(0)`, not `word[0]` — `noUncheckedIndexedAccess` makes indexed access `string | undefined`.

**Expected outcome:**

| Field name             | Label                    |
| ---------------------- | ------------------------ |
| `userId`               | `User Id`                |
| `id`                   | `Id`                     |
| `aBA`                  | `A B A`                  |
| `aBC`                  | `A B C`                  |
| `repo2Branch`          | `Repo2 Branch`           |
| `canonicalName`        | `Canonical Name`         |
| `npmPackageDeployment` | `Npm Package Deployment` |
| `a333`                 | `A333`                   |
| `3A33`                 | `3 A33`                  |
| `333A`                 | `333 A`                  |

**Round-trip rule (direction B — the only round trip this plan requires):** for each of `userId`, `aBA`, `id`, `aBC`, `repo2Branch`, `canonicalName`, `npmPackageDeployment`, `a333`:

```ts
expect(labelToName(nameToLabel(name))).toBe(name);
```

The reverse direction — an extracted label reproducing itself — is explicitly **not** required and must not be tested: `IDField` → `idfield` and the stored label stays `IDField`.

**Tests:** co-locate `nameToLabel.fixtures.ts` and `nameToLabel.test.ts`, following `./plan__tests.md`:

- the plan's **Expected outcome** table above, through `it.each` with `%s`;
- direction B round trips — `labelToName(nameToLabel(name)) === name` — driven through `it.each`, **plus** an exhaustive enumeration: every string up to length 5 over an alphabet of one lowercase, one uppercase, and one digit, keeping only what `isCanonicalFieldName` accepts. That is the highest-value assertion in this iteration and costs milliseconds.

Do **not** assert `nameToLabel(labelToName(label)) === label` for an extracted label — direction A does not round-trip, by design.

**Verify:** `npm run test:unit` from `$PACKAGE` is green.

### Step `4 / 5` — Widen `isReservedFieldName` with tests

**Goal:** make reservation cover the handle member names as well as the `__` prefix, without changing observable behaviour in this iteration.

**Files:**

- MODIFY `$PACKAGE/src/record/private/isReservedFieldName.ts`
- CREATE `$PACKAGE/src/record/private/isReservedFieldName.fixtures.ts`
- CREATE `$PACKAGE/src/record/private/isReservedFieldName.test.ts`

**Execution:**

```ts
// $PACKAGE/src/record/private/isReservedFieldName.ts
import type { FieldName } from './types.js';

const RESERVED_FIELD_NAMES: readonly string[] = ['name', 'save', 'renameField', '__section'];

export function isReservedFieldName(name: FieldName): boolean {
  return name.startsWith('__') || RESERVED_FIELD_NAMES.includes(name);
}
```

**Why this iteration stays green:** `isReservedFieldName` is called only from `assertFieldName` and `getExposedFieldNames`. Both are reached by proxy traps only after `Reflect.has` has been checked, and `name`, `save`, `renameField`, `__section` are all own properties of the proxy target — so no trap can deliver them to the predicate, and excluding them from the exposed-name list changes neither `Object.keys` nor `in`. State this reasoning in your report; if you find a path that contradicts it, REPORT A BLOCKER instead of proceeding.

**Expected outcome:** `isReservedFieldName` returns true for `name`, `save`, `renameField`, `__section`, `__private`, `__` and false for `userId`, `purpose`, `brandNew`, `owner`, `3A33`.

**Tests:** co-locate `isReservedFieldName.fixtures.ts` and `isReservedFieldName.test.ts`, following `./plan__tests.md`. Derive the reserved set (including the `__` prefix at several lengths) and a non-reserved set, drive both through `it.each`, and add a cross-predicate assertion that `name` and `save` are **both** canonical and reserved — so only the combination of the two predicates rejects them.

**Do not modify** `$PACKAGE/src/record/createRecord.test.ts`. Its existing assertion must still pass unchanged:

```ts
expect(() => {
  // eslint-disable-next-line dot-notation
  record['__private'] = 'value';
}).toThrow('Record field names starting with "__" are reserved');
```

**Verify:** `npm run test:unit` from `$PACKAGE` is green, including that untouched test, then run the **Verifying Step** instructions from the Operating Instructions section.

### Step `5 / 5` — Commit `add-field-name-helpers`

#### Commit: `add-field-name-helpers`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
build(records): Add field name helpers.

- Add the canonical field name grammar and the two converters.
- Add the reserved field name predicate.
- Cover the name grammar, generated-label round trips, and extracted names.
```

Stage the three new modules, the four fixture files, the four co-located test files, and the two modified files (`types.ts`, `isReservedFieldName.ts`) — 13 files in total — then commit from `$PROJECT`. The `pre-commit` hook declared in `$PROJECT/lefthook.yml` runs `npm run clean`, `npm run extract`, and `npm run ci` (prettier over the repo, then `turbo run ci` across all packages) — a hook failure fails the commit; fix the reported failure and retry. Do **not** push.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit must exist locally and must **not** be pushed.
- Verify the four modules exist under `$PACKAGE/src/record/private/`: `isCanonicalFieldName.ts`, `labelToName.ts`, `nameToLabel.ts`, `isReservedFieldName.ts`, each with a co-located `.fixtures.ts` and `.test.ts`.
- Verify every test file drives its cases through `it.each`, and that each test title interpolates its input with `%s` — confirm by inspecting a failure title, which must read `WHEN label "…" provided THEN name is "…"`.
- Verify the fixture files contain data only: no assertions, no loops, no imports.
- Verify the exhaustive direction B enumeration is present — every grammar-valid name up to length 5 over a mixed-case-plus-digit alphabet, not just the hand-written rows.
- Verify neither forbidden assertion appears: no `labelToName(labelToName(x))`, and no `nameToLabel(labelToName(label)) === label` over an extracted label.
- Verify `FieldName` is declared in `$PACKAGE/src/record/private/types.ts`.
- Verify no helper was exported from `$PACKAGE/src/index.ts` or `$PACKAGE/src/api/index.ts` — these modules stay private to `record/private`.
- Verify the rule table in Step 2 and the round-trip table in Step 3 are asserted by the tests.
- Verify `labelToName` and `nameToLabel` each contain a single pass over their input — no loop that re-applies a converter to its own output.
- Execute the **Verifying Step** instructions from the Operating Instructions section.
- Report according to the "How to Report Back to the Delegator" instructions.
