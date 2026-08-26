# Fixture Tests

## Overview

Two test scripts exercise the parser and serializer against a shared fixture suite:

```
test-parser    →  source.md → art.json  (forward: parser snapshot vs checked-in snapshot)
test-serializer → art.json → parsed.md  (return: serializer output vs source.md)
```

Both scripts discover fixtures by scanning `$PACKAGE_PARSER/test/fixtures/` for `.md` / `.art` files that have a matching `.md.json` / `.art.json` snapshot.

## Fixture Anatomy

```
test/fixtures/
  000-hello-world.md              ← source input
  000-hello-world.md.json         ← parser snapshot (accepted baseline)
  000-hello-world.debug.json      ← debug snapshot (transient, not committed)
  000-hello-world.parsed.md       ← serializer debug output (transient, not committed)

  _markdown.md                    ← underscore prefix = exploratory, parser-only
  _markdown.md.json               ← snapshot exists, parser tests it
                                    serializer SKIPS underscore fixtures
```

**Numbered fixtures** (`000-*`, `010-*`, ...) are roundtrip acceptance criteria. Both parser and serializer test them.

**Underscore fixtures** (`_markdown.md`, `_011-...`) are parser-only exploratory material. The serializer intentionally skips them (line 25 of `test-serializer.ts`). They may have intentionally stale snapshots.

## CLI Flags

### test-parser

```bash
npm run test-parser                          # test all fixtures against snapshots
npm run test-parser -- --fixture 030         # test only fixtures matching "030"
npm run test-parser -- --fixture 030 --write # regenerate snapshot for "030"
npm run test-parser -- --fixture 030 --debug-write  # write .debug.json (does NOT overwrite accepted snapshot)
```

### test-serializer

```bash
npm run test-serializer                              # test all numbered fixtures
npm run test-serializer -- --fixture 030             # test only fixtures matching "030"
npm run test-serializer -- --fixture 030 --debug-write  # write .parsed.md for visual diff
```

**Note:** `test-serializer` currently always returns exit code 0 (WIP in source). Check the summary output for failures — do not rely on exit code.

---

## Use Cases

### Write snapshot for a new fixture

1. Create `test/fixtures/{name}.md` with minimal markdown.
2. Generate the accepted snapshot:
   ```bash
   npm run test-parser -- --fixture {name} --write
   ```
3. Inspect `test/fixtures/{name}.md.json` — verify construct names, nesting, values.
4. Run roundtrip check:
   ```bash
   npm run test-serializer -- --fixture {name}
   ```
5. If there is a diff, inspect it:
   ```bash
   npm run test-serializer -- --fixture {name} --debug-write
   ```
   Compare `{name}.parsed.md` against `{name}.md` side by side.

### Update snapshot(s) when iterating

**Caution:** `--write` overwrites the accepted snapshot. Always review the diff before committing.

1. Make code changes in parser/constructs/serializer.
2. Regenerate affected snapshots:
   ```bash
   npm run test-parser -- --fixture {name} --write
   ```
3. Review the diff in `{name}.md.json` — ensure the new AST shape is correct.
4. Run full suite to check for regressions:
   ```bash
   npm run test-parser
   npm run test-serializer
   ```
5. If other fixtures broke, investigate and fix before committing.

### Debugging parser for one fixture

Use `--debug-write` to produce a transient `.debug.json` without overwriting the accepted snapshot:

```bash
npm run test-parser -- --fixture {name} --debug-write
```

Open `test/fixtures/{name}.debug.json` and compare against `{name}.md.json`. Differences show what the current parser produces vs what was accepted.

### Debugging serializer for one fixture

Use `--debug-write` to produce a `.parsed.md` showing what the serializer renders:

```bash
npm run test-serializer -- --fixture {name} --debug-write
```

Open `test/fixtures/{name}.parsed.md` and diff against `test/fixtures/{name}.md`. This shows the roundtrip delta — what the serializer writes back vs the original source.

### Run full regression

```bash
npm run test-parser
npm run test-serializer
```

Both must pass (zero failures in summary) before committing.
