# Records - Integration Tests

**Purpose:** Describe the end-to-end fixture suite that exercises the `@art-js/records` API through the codec and the `@art-lib/fs-records` adapter (package `@art-js/test-records`).

## Overview

Each fixture case is a directory under `$ROOT/tests/records/fixtures/` holding one Vitest file and the record files its scenario needs:

```text
$ROOT/tests/records/fixtures/
  02-field-operations/
    integration.test.ts
    _records/artist.art
```

The test copies its case to a temporary working directory, configures the codec and the filesystem adapter against that copy, exercises the Records API, and asserts the result. The checked-in fixture files are never modified.

Vitest discovers cases with the `fixtures/**/integration.test.ts` pattern. Every case runs independently; a failure in one does not stop the others.

## Scenario Design

Cases are scenarios, not one assertion per API call:

- Start with a read-only case that sets up the provider, discovers files, locates a record, and reads it.
- Group compatible mutations in one fixture, save once, and assert the final file. Avoid manipulating the same field twice.
- Keep assertions on function returns only when they localise a likely failure; the final file state is the acceptance criterion.
- Keep filesystem-specific unhappy paths in this suite: missing files, removed directories, discovery filters. API-level throws belong to the in-package suite under `$ROOT/libs/records/tests`, which uses an in-memory adapter.

## Test Anatomy

Tests read as a scenario:

- `describe('Case NN — ...')` names the case.
- `describe('GIVEN ...')` establishes the state and creates the helpers for that state.
- `describe('WHEN ...')` performs the action under test.
- `it('SHOULD ...')` asserts the expected outcome.

Setup runs in `beforeEach`; temporary directories are tracked in a module-level array and removed in `afterEach`, so a failing test still cleans up.

```ts
const tempDirs: string[] = [];

afterEach(async () => {
  await removeTempDirs(tempDirs);
});

describe('Case 02 — Renaming, adding, and deleting fields in one save', () => {
  let filename: string;
  let filesystemRecords: ReturnType<typeof createFSRecordsAdapter>;
  let recordsDocument: ReturnType<typeof createRecordsDocument<FSRecordFile>>;

  beforeEach(async () => {
    const fixtureDir = getFixtureDirectory(import.meta.url);
    const tempDir = makeTempDir(tempDirs);
    const workingDirectory = await copyFixtureCase(fixtureDir, tempDir);
    filename = join(workingDirectory, '_records', 'artist.art');

    const codec = createArtCodec({});
    filesystemRecords = createFSRecordsAdapter({
      basePath: workingDirectory,
      patterns: recordsPatterns,
    });

    function createContentSource(file: FSRecordFile) {
      return filesystemRecords.createContentSource(file);
    }

    recordsDocument = createRecordsDocument<FSRecordFile>({ codec, createContentSource });
  });

  describe('GIVEN the Artist: Nina Simone record', () => {
    let artist: ArtRecord;

    beforeEach(async () => {
      const files = await filesystemRecords.discoverRecordFiles();
      const artistFile = findRecordFileByPath(files, '_records/artist.art');

      if (artistFile === undefined) {
        throw new Error('_records/artist.art was not discovered');
      }

      const document = await recordsDocument.read(artistFile);
      const records = await document.extract();
      artist = findRecordByName(records, 'Artist: Nina Simone') as ArtRecord;
    });

    describe('WHEN renaming Born, adding Artist, and deleting Years active, then saving', () => {
      let content: string;

      beforeEach(async () => {
        artist.renameField('Born', 'Birth name');
        artist['Artist'] = 'Nina Simone';
        delete artist['Years active'];

        await artist.save();
        content = await readFile(filename, 'utf-8');
      });

      it('SHOULD persist the renamed field with its original value', () => {
        expect(content).toContain('**Birth name:** Eunice Kathleen Waymon');
        expect(content).not.toContain('**Born:**');
      });

      it('SHOULD persist the added field and remove the deleted one', () => {
        expect(content).toContain('**Artist:** Nina Simone');
        expect(content).not.toContain('**Years active:**');
      });
    });
  });
});
```

Assertions are the acceptance criteria: there are no snapshots.

## CLI

Run from `$ROOT/tests/records/`:

```bash
npm run test        # run the Vitest suite
npm run test -- 02  # run cases whose path contains "02"
npm run lint        # Prettier, ESLint, and TypeScript checks
npm run build       # build the test package
npm run ci          # lint, build, and tests
```

The legacy script runner (`npm run test:script`) is still wired, but no case uses it and it discovers nothing.

## Use Cases

### Add a fixture case

1. Create `$ROOT/tests/records/fixtures/$CASE/integration.test.ts`.
2. Add only the record files the scenario needs under that case's `_records/`.
3. Copy the case to a temporary directory and configure the codec and adapter against it.
4. Exercise the API, save once, and assert the final file state.
5. Run `npm run test -- $CASE`, then the full suite.

### Update a fixture or scenario

Change the case's `.art` files or its assertions, then run that case and the full suite. Because tests run on a temporary copy, saving inside a test never updates the checked-in fixture; change the fixture itself when the accepted starting state should change.

### Skip a case

Prefixing a directory with `_` only excludes its files from the legacy script runner; Vitest still discovers `fixtures/**/integration.test.ts`. Use `describe.skip` or `it.skip` when a case must stay out of the run, and remove it before committing.
