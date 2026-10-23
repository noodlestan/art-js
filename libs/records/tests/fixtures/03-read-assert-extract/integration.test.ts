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
import {
	findRecordByName,
	findRecordFileByPath,
	getFieldNames,
} from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 03 — Reading and extracting: hasRecord() and extract()', () => {
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
		};

		filesystemRecords = createAdapterMock({ basePath: workingDirectory, files: fixtureFiles });

		function createContentSource(file: AdapterMockFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<AdapterMockFile>(recordsDocumentOptions);
	});

	async function readArtistDocument(): Promise<RecordsDocumentCollection> {
		const files = await filesystemRecords.discoverRecordFiles();
		const artistFile = findRecordFileByPath(files, '_records/artist.art');

		expect(artistFile).toBeDefined();
		if (artistFile === undefined) {
			throw new Error('_records/artist.art was not discovered');
		}

		return recordsDocument.read(artistFile);
	}

	describe('GIVEN the artist document', () => {
		let document: RecordsDocumentCollection;

		beforeEach(async () => {
			document = await readArtistDocument();
		});

		describe('WHEN checking record existence', () => {
			it('SHOULD recognise Artist: Nina Simone', async () => {
				expect(await document.hasRecord('Artist: Nina Simone')).toBe(true);
			});

			it('SHOULD recognise the nested Song: Feeling Good', async () => {
				expect(await document.hasRecord('Song: Feeling Good')).toBe(true);
			});

			it('SHOULD reject a missing artist', async () => {
				expect(await document.hasRecord('Artist: Missing')).toBe(false);
			});
		});

		describe('WHEN extracting records', () => {
			let records: ArtRecord[];

			beforeEach(async () => {
				records = await document.extract();
			});

			it('SHOULD extract three records', () => {
				expect(records).toHaveLength(3);
			});

			it('SHOULD extract Module first', () => {
				expect(records[0]?.name).toBe('Module');
			});

			it('SHOULD extract Artist: Nina Simone', () => {
				expect(findRecordByName(records, 'Artist: Nina Simone')).toBeDefined();
			});

			it('SHOULD extract Song: Feeling Good', () => {
				expect(findRecordByName(records, 'Song: Feeling Good')).toBeDefined();
			});
		});

		describe('GIVEN the extracted records', () => {
			let records: ArtRecord[];

			beforeEach(async () => {
				records = await document.extract();
			});

			function findRecord(name: string): ArtRecord {
				const record = findRecordByName(records, name);

				expect(record).toBeDefined();
				if (record === undefined) {
					throw new Error(`${name} was not extracted`);
				}

				return record;
			}

			it('SHOULD expose each record by its complete name', () => {
				expect(findRecordByName(records, 'Module')).toBeDefined();
				expect(findRecordByName(records, 'Artist: Nina Simone')).toBeDefined();
				expect(findRecordByName(records, 'Song: Feeling Good')).toBeDefined();
			});

			it('SHOULD extract Module without fields', () => {
				expect(getFieldNames(findRecord('Module'))).toEqual([]);
			});

			it('SHOULD preserve section nesting', () => {
				const artistDepth = findRecord('Artist: Nina Simone').__section.depth;
				const songDepth = findRecord('Song: Feeling Good').__section.depth;

				expect(artistDepth).toBeDefined();
				expect(songDepth).toBeDefined();
				expect(songDepth).toBeGreaterThan(artistDepth);
			});

			it('SHOULD keep section names consistent with record names', () => {
				for (const record of records) {
					expect(record.__section.name).toBe(record.name);
				}
			});

			it('SHOULD expose save() on every record', () => {
				for (const record of records) {
					expect(typeof record.save).toBe('function');
				}
			});
		});
	});
});
