# Test Scenarios: `define-field-name-contract`

**Plan:** `canonical-record-field-names`

**Iteration Id:** `define-field-name-contract`

How to design the tests for the four modules. The case lists below are deliberately **not** enumerated — deriving them is the work. What is fixed is the mechanism, the coverage obligations, and the readability requirement on failure.

## 1. Fixture setup: a sibling file, imported

Test data lives in its own file next to the test, never inline in the test file. The test file imports it; the fixture file imports nothing.

```text
$PACKAGE/src/record/private/
├── labelToName.fixtures.ts       ← the cases (no imports, no logic)
├── labelToName.test.ts           ← imports the cases, holds assertions
```

Name the file after the module under test with a `.fixtures.ts` suffix. Export one readonly table per case family — `readonly` tuples or readonly objects, so no test can mutate data another test still needs.

```ts
// $PACKAGE/src/record/private/labelToName.fixtures.ts
export const labelNameCases: ReadonlyArray<readonly [string, string]> = [
  ['Canonical Name', 'canonicalName'],
  // ... the cases you derive in section 3
] as const;
```

Rules:

- The fixture file contains **data only** — no assertions, no loops, no logic, no imports.
- Import it with the `.js` extension the rest of the package uses: `import { labelNameCases } from './labelToName.fixtures.js';`
- If the fixture table is shared by more than one test file, it still stays a sibling of the module under test, not in the helpers tree.
- The tables are immutable by declaration. Nothing is cleared between tests because nothing is ever written to. If you find yourself needing a reset hook, the test is holding state it should not hold.

## 2. Loop sugar: `it.each`, with the input in the description

Drive every case table through `it.each`. **Do not** write one `it()` per row — a case list that grows without the description growing is how failures become unreadable.

```ts
// $PACKAGE/src/record/private/labelToName.test.ts
import { describe, expect, it } from 'vitest';

import { labelToName } from './labelToName.js';
import { labelNameCases } from './labelToName.fixtures.js';

describe('labelToName', () => {
  it.each(labelNameCases)('WHEN label "%s" provided THEN name is "%s"', (label, expected) => {
    expect(labelToName(label)).toBe(expected);
  });
});
```

### The failure-readability requirement — non-negotiable

A failing case must name its own input in the test title, so the report reads without opening the source:

```text
× WHEN label "aB-a" provided THEN name is "aBA"
```

Verified on this repo's vitest: `%s` interpolation produces exactly that. Use printf-style `%s` (one per value, in argument order).

- Prefer `%s`. Object-style `$variable` interpolation works too, but this repo's vitest renders it as `WHEN label "'aB-a'" provided` — the value gets a second pair of quotes. If you use `$variable`, accept that output.
- **Do not** write a bare `it.each(cases)('handles the table', …)`. That satisfies the loop and fails the requirement.
- Every placeholder must be an actual argument of the callback. A title claiming an input it does not interpolate is worse than no title.

## 3. Deriving the cases — exhaustive around every rule

Cover the rules, not a sample of them. For each rule below, decide what inputs prove it holds, where it stops holding, and what it must not do. Include at least:

- **word splitting** — each separator class; runs of separators; separator at start, end, between digits.
- **uppercase boundaries** — lower→upper, digit→upper, upper→upper (must _not_ split), word-initial uppercase, consecutive uppercase runs of length 2, 3, and longer.
- **casing of the first word** — a single-word input that is fully uppercase must still lowercase entirely.
- **digit behaviour** — leading, trailing, interior, digit-only segments; digits never act as separators.
- **Unicode** — non-ASCII letters, combining marks attached to their base character, mixed scripts. Remember the loop walks code points, not UTF-16 units: include a case whose code-point count differs from its `.length`.
- **rejection** — empty, whitespace-only, separator-only input throws `TypeError`; every rejected grammar case for `isCanonicalFieldName`; every reserved and non-reserved name for `isReservedFieldName`.
- **property tests, not just rows** — direction B (`labelToName(nameToLabel(n)) === n`) over an **enumerated** set: generate every string up to length 5 over an alphabet with one lowercase, one uppercase, and one digit, keep only what `isCanonicalFieldName` accepts, and assert all of them. That is 121 names — the first character is fixed to the alphabet's lowercase letter — and costs milliseconds. This is where exhaustiveness pays off — a property loop catches boundary combinations no hand-written table reaches.
- **the cross-predicate case** — `name` and `save` are canonical _and_ reserved; assert both predicates agree, so only their combination rejects.

### Two assertions that must NOT be written

1. `labelToName(labelToName(x)) === labelToName(x)` — `labelToName` is not idempotent and is not required to be. A field name is never fed back in as a label.
2. `nameToLabel(labelToName(label)) === label` for an **extracted** label — direction A does not round-trip. `IDField` → `idfield` → `Idfield` ≠ `IDField`, and the document still says `IDField` because nothing rewrote it.

Both appear in the plan as explicit non-requirements. Asserting them would encode a bug.

## 4. Coverage obligations per module

| Module                 | Must prove                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `isCanonicalFieldName` | every accept and reject class from section 3; reserved names accepted (grammar only)                                            |
| `labelToName`          | every rule table row the plan specifies; every derived case; `TypeError` on empty input; determinism (same input → same output) |
| `nameToLabel`          | every rule table row; remainders preserved unchanged; direction B property loop                                                 |
| `isReservedFieldName`  | the full reserved set, the non-reserved set, the `__` prefix at several lengths                                                 |

## 5. Style

- Test titles start with `WHEN`, `FOR`, or `GIVEN` in all caps — combine with `%s` as in section 2.
- Separate setup, invocation, and assertion blocks with an empty line.
- Co-locate each test with its module: `*.test.ts` next to `*.ts`, so `npm run test:unit` (`vitest run --dir src`) picks them up.
- No mocks, no spies — these are pure functions. A mock in this file is a design smell.
