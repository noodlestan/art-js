import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	type ArtRecord,
	type RecordsDocumentCollection,
	createRecordsDocument,
} from '../../../src/index.js';
import {
	type AdapterMock,
	type AdapterMockFile,
	createAdapterMock,
} from '../../helpers/adapter/index.js';
import { copyFixtureCase, getFixtureDirectory } from '../../helpers/fixtures/index.js';
import { findRecordByName, findRecordFileByPath } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 17 — Batch saving across files, one save per document', () => {
	let workingDirectory: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

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
		};

		filesystemRecords = createAdapterMock({ basePath: workingDirectory, files: fixtureFiles });

		function createContentSource(file: AdapterMockFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<AdapterMockFile>(recordsDocumentOptions);
	});

	describe('GIVEN two readable record files', () => {
		let readableFiles: AdapterMockFile[];

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			readableFiles = files.filter(file => file.error === undefined);
		});

		function getReadableFile(path: string): AdapterMockFile {
			const file = findRecordFileByPath(readableFiles, path);

			expect(file).toBeDefined();
			if (file === undefined) {
				throw new Error(`${path} was not discovered`);
			}

			return file;
		}

		it('SHOULD discover both files', () => {
			expect(readableFiles).toHaveLength(2);
			expect(findRecordFileByPath(readableFiles, '_records/artist.art')).toBeDefined();
			expect(findRecordFileByPath(readableFiles, '_records/song.art')).toBeDefined();
		});

		describe('WHEN reading and extracting both documents', () => {
			let records: ArtRecord[];

			beforeEach(async () => {
				const documents: RecordsDocumentCollection[] = await Promise.all([
					recordsDocument.read(getReadableFile('_records/artist.art')),
					recordsDocument.read(getReadableFile('_records/song.art')),
				]);
				const recordGroups = await Promise.all(documents.map(document => document.extract()));
				records = recordGroups.flat();
			});

			it('SHOULD extract two records across the files', () => {
				expect(records).toHaveLength(2);
				expect(findRecordByName(records, 'Artist: Nina Simone')).toBeDefined();
				expect(findRecordByName(records, 'Song: Feeling Good')).toBeDefined();
			});
		});

		describe('WHEN mutating both records and saving each document once', () => {
			let artistContent: string;
			let songContent: string;

			beforeEach(async () => {
				const artistFile = getReadableFile('_records/artist.art');
				const songFile = getReadableFile('_records/song.art');
				const artistDocument = await recordsDocument.read(artistFile);
				const songDocument = await recordsDocument.read(songFile);

				const artist = findRecordByName(await artistDocument.extract(), 'Artist: Nina Simone');
				const song = findRecordByName(await songDocument.extract(), 'Song: Feeling Good');

				expect(artist).toBeDefined();
				expect(song).toBeDefined();
				if (artist === undefined || song === undefined) {
					throw new Error('the records to mutate were not extracted');
				}

				// eslint-disable-next-line dot-notation
				artist['born'] = 'Eunice Kathleen Waymon';
				// eslint-disable-next-line dot-notation
				song['artist'] = 'Nina Simone';

				await Promise.all([artistDocument.save(), songDocument.save()]);

				const savedArtistContent = filesystemRecords.getFileContent('_records/artist.art');
				const savedSongContent = filesystemRecords.getFileContent('_records/song.art');

				if (savedArtistContent === undefined || savedSongContent === undefined) {
					throw new Error('the mutated files were not saved');
				}

				artistContent = savedArtistContent;
				songContent = savedSongContent;
			});

			it('SHOULD persist the Artist mutation to artist.art', () => {
				expect(artistContent).toContain('**Born:** Eunice Kathleen Waymon');
			});

			it('SHOULD persist the Song mutation to song.art', () => {
				expect(songContent).toContain('**Artist:** Nina Simone');
			});
		});
	});
});
