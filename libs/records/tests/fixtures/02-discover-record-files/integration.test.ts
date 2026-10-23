import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type RecordsDocumentCollection, createRecordsDocument } from '../../../src/index.js';
import {
	type AdapterMock,
	type AdapterMockFile,
	createAdapterMock,
} from '../../helpers/adapter/index.js';
import { copyFixtureCase, getFixtureDirectory } from '../../helpers/fixtures/index.js';
import { findRecordFileByPath } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 02 — Finding records: discovery filters filenames, not headings', () => {
	let workingDirectory: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;
	let files: AdapterMockFile[];

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codec = createArtCodec({});
		const fixtureFiles = {
			'_records/artist.art': await readFile(
				join(workingDirectory, '_records', 'artist.art'),
				'utf-8',
			),
			'_records/song.art': await readFile(join(workingDirectory, '_records', 'song.art'), 'utf-8'),
			'_records/draft.md': await readFile(join(workingDirectory, '_records', 'draft.md'), 'utf-8'),
			'outside.art': await readFile(join(workingDirectory, 'outside.art'), 'utf-8'),
		};

		filesystemRecords = createAdapterMock({ basePath: workingDirectory, files: fixtureFiles });

		function createContentSource(file: AdapterMockFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<AdapterMockFile>(recordsDocumentOptions);

		files = await filesystemRecords.discoverRecordFiles();
	});

	function findArtistFile(): AdapterMockFile {
		const artistFile = findRecordFileByPath(files, '_records/artist.art');

		expect(artistFile).toBeDefined();
		if (artistFile === undefined) {
			throw new Error('_records/artist.art was not discovered');
		}

		return artistFile;
	}

	describe('GIVEN the filesystem records adapter', () => {
		describe('WHEN discovering record files', () => {
			let paths: string[];

			beforeEach(() => {
				paths = files.map(file => file.path).sort();
			});

			it('SHOULD discover exactly two record files', () => {
				expect(paths).toHaveLength(2);
			});

			it('SHOULD discover the artist and song records', () => {
				expect(paths).toEqual(['_records/artist.art', '_records/song.art']);
			});

			it('SHOULD exclude non-.art files', () => {
				const markdownPaths = paths.filter(path => path.endsWith('.md'));

				expect(markdownPaths).toEqual([]);
			});

			it('SHOULD exclude records outside _records/', () => {
				expect(paths).not.toContain('outside.art');
			});
		});

		describe('GIVEN the discovered artist record file', () => {
			let artistFile: AdapterMockFile;

			beforeEach(() => {
				artistFile = findArtistFile();
			});

			it('SHOULD have no discovery error', () => {
				expect(artistFile.error).toBeUndefined();
			});

			it('SHOULD have an absolute filename', () => {
				expect(artistFile.filename).toBe(join(workingDirectory, '_records', 'artist.art'));
			});

			it('SHOULD have the configured base path', () => {
				expect(artistFile.basePath).toBe(workingDirectory);
			});
		});

		describe('WHEN reading the artist record file', () => {
			let document: RecordsDocumentCollection;

			beforeEach(async () => {
				document = await recordsDocument.read(findArtistFile());
			});

			it('SHOULD recognise the complete heading name', async () => {
				expect(await document.hasRecord('Artist: Nina Simone')).toBe(true);
			});
		});
	});
});
