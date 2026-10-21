# Records - Integration Tests

**Purpose:** Describe the fixture suite that exercises the `@art-js/records` API through the codec and filesystem-records adapter.

## Overview

The integration-test package runs one `run-test.ts` per fixture case. Each test uses its case's record files, exercises a Records API use case, and asserts the result:

```
fixture case directory → run-test.ts → Records API → assertions
                         _records/*.art ─┘
```

The runner discovers case directories under `$PROJECT/tests/records/fixtures/`, orders them by name, imports each `runTest()`, and runs them sequentially. It catches failures per case, reports each result and duration, then continues with the next case.

Each case is copied to a temporary working directory before it runs. Tests may mutate and save records there without changing the checked-in fixture files.

## Fixture Anatomy

```
$PROJECT/tests/records/fixtures/
  01-setup-provider/
    run-test.ts
    _records/artist.art

  02-discover-record-files/
    run-test.ts
    _records/artist.art
    _records/song.art
    outside.art                    ← not under _records/, must not be discovered

  03-read-assert-extract/
    run-test.ts
    _records/artist.art            ← Module, Artist, and nested Song sections

  04-field-read/
    run-test.ts
    _records/song.art

  05-set-missing-field/
    run-test.ts
    _records/artist.art

  06-rename-field-in-place/
    run-test.ts
    _records/artist.art

  07-section-depth/
    run-test.ts
    _records/artist.art

  08-delete-field/
    run-test.ts
    _records/artist.art

  09-create-new-record/
    run-test.ts
    _records/                       ← created by the test in its working copy

  10-batch-save/
    run-test.ts
    _records/artist.art
    _records/song.art

  11-save-document-collection/
    run-test.ts
    _records/artist.art              ← Artist and Song sections in one document
```

`run-test.ts` exports `runTest(): Promise<void>`. It uses the fixture path derived from its own module URL, copies that case to a temporary directory, configures the codec and filesystem adapter, runs the scenario, and asserts outcomes. Fixture tests throw on failure; the runner owns the per-case `try/catch`.

The checked-in records use the Artist and Song domain. Case 03 uses the supplied Module/Artist/nested Song content to cover nested extraction and a field-less section. Case 09 creates its destination record file in the temporary directory.

Directory names beginning with `_` are skipped by the runner and reported as skipped. Use that prefix only to hold a known failing case out of the active run; remove it when the case is ready to run.

## CLI

Run from `$PROJECT/tests/records/`:

```bash
npm run test                  # run all fixture cases
npm run test -- 07            # run cases whose directory name contains "07"
npm run lint                  # Prettier, ESLint, and TypeScript checks
npm run build                 # build the test package
npm run ci                    # lint, build, and test
```

The optional test argument is a substring filter on the fixture-case directory name. There are no parser snapshots: the fixture test's assertions are the acceptance criteria.

## Use Cases

### Add a fixture case

1. Create `$PROJECT/tests/records/fixtures/$CASE/run-test.ts`, where `$CASE` is the fixture-case directory name.
2. Add only the record files needed by the scenario under that case's `_records/` directory.
3. Export `runTest(): Promise<void>` from `run-test.ts`; configure the codec and filesystem adapter against that case's temporary working copy.
4. Exercise the API and assert the expected behavior. Let assertion failures throw for the runner to report; do not catch them in the fixture.
5. Run the case and the full suite.

```bash
npm run test -- $CASE
npm run test
```

### Update a fixture or scenario

1. Change the case's `.art` records or its `run-test.ts` assertions.
2. Run that fixture with the substring filter and check the reported result.
3. Run the full test suite to detect regressions in other cases.

Because each case runs on a temporary copy, tests that save records do not update the checked-in fixture. Change the fixture itself when the accepted starting state should change.

### Diagnose a failing case

Run only that case:

```bash
npm run test -- 05
```

The report identifies the case, duration, and thrown error. If one case fails, the runner continues and reports the outcomes of the remaining cases.

### Temporarily skip a fixture

Agents may create forward-looking fixture cases before the corresponding implementation is complete. The test can describe the expected behavior while the implementation is in progress; prefix the fixture-case directory with `_` to commit it as skipped until it is ready to run.

For example, rename:

```text
fixtures/12-add-album/
```

to:

```text
fixtures/_12-add-album/
```

The runner reports the skipped case and does not import its `run-test.ts`:

```text
Discovered 12 fixture test director(ies).
Skipped 1 case(s) prefixed with "_": _12-add-album.

Results:    11 test(s) run
Passed:     11
Failed:     0
Skipped:    1
```

Remove the prefix when the implementation is ready. An agent may also prefix a previously passing fixture temporarily during refactoring, but **must not commit that skip**: restore the fixture name and resolve all issues before committing.

### Run full suite

```bash
npm run ci
```

The lint, build, and test stages must all complete successfully.

The test summary must report zero failures.
