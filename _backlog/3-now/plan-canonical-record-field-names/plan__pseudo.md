# Pseudo Code: `define-field-name-contract`

**Plan:** `canonical-record-field-names`

**Iteration Id:** `define-field-name-contract`

This file is the algorithm reference for the four modules this iteration adds. It is language-neutral on purpose: implement it in TypeScript under the package conventions, do not translate the notation mechanically.

## 1. `isCanonicalFieldName(name)`

```text
FUNCTION isCanonicalFieldName(name)
    RETURN name MATCHES /^[a-z][a-zA-Z0-9]*$/
END
```

A **syntax** test and nothing more.

- Rejects: leading digit, leading uppercase, any separator, empty string, non-ASCII letters.
- Accepts reserved names — `name`, `save`, `renameField` are syntactically valid. Reservation is a different predicate; do not fold it in here.

```text
isCanonicalFieldName("userId")        → TRUE     isCanonicalFieldName("3A33")     → FALSE
isCanonicalFieldName("a333")          → TRUE     isCanonicalFieldName("010")      → FALSE
isCanonicalFieldName("repo2Branch")   → TRUE     isCanonicalFieldName("ação")     → FALSE
isCanonicalFieldName("name")          → TRUE     isCanonicalFieldName("Canonical Name") → FALSE
isCanonicalFieldName("renameField")   → TRUE     isCanonicalFieldName("__section") → FALSE
```

## 2. `labelToName(label)` — label → field name

Single left-to-right pass. Never applied to its own output.

```text
FUNCTION labelToName(label)
    words  ← empty list
    current ← empty string

    FOR EACH character IN codePoints(trim(label))     // code points, not UTF-16 units
        IF character IS NOT word character            // not in [\p{L}\p{M}\p{N}]
            IF current IS NOT empty: append current to words; current ← ""
            CONTINUE                                 // separator: end of word

        IF current IS NOT empty
           AND character IS uppercase
           AND last(character of current) IS NOT uppercase
            append current to words; current ← ""     // lower→upper boundary

        current ← current + character                 // uppercase run stays in the word

    IF current IS NOT empty: append current to words

    IF words IS EMPTY: THROW TypeError               // empty / whitespace / separator-only

    result ← ""
    FOR i ← 0 TO words.LENGTH - 1
        IF i = 0:  result ← result + lowercase(words[i])
        ELSE:      result ← result + capitalizeFirst(words[i])   // upper first, lower rest
    RETURN result
END
```

`capitalizeFirst(w)` = `upper(first char of w) + lower(remainder of w)`.

### Worked traces

| Input            | Words before join   | Result          | Rule exercised                                                     |
| ---------------- | ------------------- | --------------- | ------------------------------------------------------------------ |
| `Canonical Name` | `Canonical`, `Name` | `canonicalName` | separator + lower→upper                                            |
| `aB-a`           | `a`, `B`, `a`       | `aBA`           | lower→upper, then separator, first word lowercased                 |
| `aBC`            | `a`, `BC`           | `aBc`           | uppercase run stays one word, rest lowercased                      |
| `IDField`        | `IDField`           | `idfield`       | `IDF` never splits (`F` follows uppercase); single word lowercased |
| `NPM Package`    | `NPM`, `Package`    | `npmPackage`    | acronym run kept whole; later word capitalized                     |
| `3A33`           | `3`, `A33`          | `3A33`          | digit→upper boundary; first word `3` lowercased is a no-op         |
| `0-1-0`          | `0`, `1`, `0`       | `010`           | digits are word characters; separators collapse                    |
| `Ação`           | `Ação`              | `ação`          | non-ASCII letters are word characters; single word lowercased      |
| `a[b]c`          | `a`, `b`, `c`       | `aBC`           | brackets are separators; three words                               |

### Invariants

- **One pass.** Complexity is O(n) over the label. No pre-pass, no post-pass, no re-application.
- **Not idempotent by construction.** `labelToName` maps _labels_, not names. `labelToName(labelToName(x))` is undefined behaviour for a label and must never be asserted.
- **No validation.** `3A33` and `010` are legitimate outputs. Grammar checking belongs to `isCanonicalFieldName`.
- **Deterministic and pure.** Same input, same output; no state, no randomness, no locale sensitivity (`toLowerCase`/`toUpperCase` without locale argument).

## 3. `nameToLabel(name)` — field name → label

Single pass. Splits before **every** uppercase letter — unlike `labelToName`, an uppercase run yields one word per letter.

```text
FUNCTION nameToLabel(name)
    words   ← empty list
    current ← empty string

    FOR EACH character IN codePoints(name)
        IF character IS uppercase AND current IS NOT empty
            append current to words; current ← ""     // every uppercase starts a word
        current ← current + character

    IF current IS NOT empty: append current to words

    result ← ""
    FOR each word IN words
        result ← result + upper(first char of word) + rest(word, unchanged)   // remainder kept as-is
        IF not last word: result ← result + " "
    RETURN result
END
```

No validation and no guard: callers pass a name that already passed `isCanonicalFieldName`.

### Worked traces

| Input         | Words             | Result         |
| ------------- | ----------------- | -------------- |
| `userId`      | `user`, `Id`      | `User Id`      |
| `aBA`         | `a`, `B`, `A`     | `A B A`        |
| `aBC`         | `a`, `B`, `C`     | `A B C`        |
| `repo2Branch` | `repo2`, `Branch` | `Repo2 Branch` |
| `3A33`        | `3`, `A333`       | `3 A33`        |
| `a333`        | `a333`            | `A333`         |

Remainders are **not** lowercased — `repo2Branch` keeps `epo2` unchanged inside `Repo2`.

## 4. The two directions

```text
Direction A — EXTRACT (label in the document → field name)
    labelToName(label)
    The stored label is preserved verbatim. The derived name never feeds back into the label.
    "IDField" → name "idfield"; document still says **IDField:**

Direction B — GENERATE (name from the API → new label)
    name → nameToLabel(name) → label → labelToName(label) → name
    This round trip MUST hold for every string accepted by isCanonicalFieldName.
    "userId" → "User Id" → "userId"   ✓
```

**Direction A does not round-trip and must not be tested as if it did.** `labelToName("IDField")` is `idfield`, and `nameToLabel("idfield")` is `Idfield` — the document still reads `IDField` because nothing ever rewrote it. This is correct, not a defect.

## 5. `isReservedFieldName(name)`

```text
FUNCTION isReservedFieldName(name)
    IF name STARTS WITH "__": RETURN TRUE
    IF name IN {"name", "save", "renameField", "__section"}: RETURN TRUE
    RETURN FALSE
END
```

The two predicates compose rather than overlap:

```text
isCanonicalFieldName("name") → TRUE     // syntactically fine
isReservedFieldName("name")  → TRUE     // collides with the handle member
                                  ↓
assertFieldName rejects it because it is BOTH canonical and reserved.
```

## 6. Non-goals for this iteration

- No proxy, trap, index, or serialization change — these four modules are imported by nothing but their own tests until the next iteration.
- No export from `$PACKAGE/src/index.ts` or `$PACKAGE/src/api/index.ts`; the modules stay private to `record/private`.
- No shared "word splitter" helper: `labelToName` and `nameToLabel` split on **different rules**, so a parameterised splitter would be less clear than two local loops.
