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

describe('Case 10 — One save writes every in-memory record of a document', () => {
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

	describe('GIVEN the Artist: Nina Simone and Song: Feeling Good records', () => {
		let artistFile: AdapterMockFile;
		let document: RecordsDocumentCollection;
		let records: ArtRecord[];

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const discoveredFile = findRecordFileByPath(files, '_records/artist.art');

			expect(discoveredFile).toBeDefined();
			if (discoveredFile === undefined) {
				throw new Error('_records/artist.art was not discovered');
			}

			artistFile = discoveredFile;
			document = await recordsDocument.read(artistFile);
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

		it('SHOULD discover the artist file', () => {
			expect(artistFile.path).toBe('_records/artist.art');
		});

		it('SHOULD extract both records from the document', () => {
			expect(findRecordByName(records, 'Artist: Nina Simone')).toBeDefined();
			expect(findRecordByName(records, 'Song: Feeling Good')).toBeDefined();
		});

		describe('WHEN mutating fields on both records', () => {
			let content: string;

			beforeEach(async () => {
				// eslint-disable-next-line dot-notation
				findRecord('Artist: Nina Simone')['Years active'] = '1954–2003';
				// eslint-disable-next-line dot-notation
				findRecord('Song: Feeling Good')['Artist'] = 'Nina Simone';

				await document.save();

				const savedContent = filesystemRecords.getFileContent(artistFile.path);

				if (savedContent === undefined) {
					throw new Error('_records/artist.art was not saved');
				}

				content = savedContent;
			});

			it('SHOULD save both mutations with one document save', () => {
				expect(content).toContain('**Years active:** 1954–2003');
				expect(content).toContain('**Artist:** Nina Simone');
			});
		});
	});
});
