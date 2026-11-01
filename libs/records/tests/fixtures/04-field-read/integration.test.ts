import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type ArtRecord, createRecordsDocument } from '../../../src/index.js';
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

describe('Case 04 — Field reads resolve by field name', () => {
	let workingDirectory: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codec = createArtCodec({});
		const fixtureFiles = {
			'_records/song.art': await readFile(join(workingDirectory, '_records', 'song.art'), 'utf-8'),
		};

		filesystemRecords = createAdapterMock({ basePath: workingDirectory, files: fixtureFiles });

		function createContentSource(file: AdapterMockFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<AdapterMockFile>(recordsDocumentOptions);
	});

	describe('GIVEN the Song: Feeling Good record', () => {
		let song: ArtRecord;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const songFile = findRecordFileByPath(files, '_records/song.art');

			expect(songFile).toBeDefined();
			if (songFile === undefined) {
				throw new Error('_records/song.art was not discovered');
			}

			const document = await recordsDocument.read(songFile);
			const records = await document.extract();
			const extractedSong = findRecordByName(records, 'Song: Feeling Good');

			expect(extractedSong).toBeDefined();
			if (extractedSong === undefined) {
				throw new Error('Song: Feeling Good was not extracted');
			}

			song = extractedSong;
		});

		describe('WHEN reading artist', () => {
			it('SHOULD resolve the field name to the loaded label value', () => {
				// eslint-disable-next-line dot-notation
				expect(song['artist']).toBe('Nina Simone');
			});

			it('SHOULD not resolve the loaded label itself', () => {
				// eslint-disable-next-line dot-notation
				expect(song['Artist']).toBeUndefined();
			});
		});

		describe('WHEN reading released', () => {
			it('SHOULD return the release date', () => {
				// eslint-disable-next-line dot-notation
				expect(song['released']).toBe('June 1965');
			});
		});

		describe('WHEN listing field names', () => {
			it('SHOULD preserve field order and return the extracted names', () => {
				expect(getFieldNames(song)).toEqual(['artist', 'released']);
			});
		});

		describe('WHEN inspecting the section', () => {
			it('SHOULD preserve the supplied Writter(s) label', () => {
				expect(JSON.stringify(song.__section)).toContain('Writter(s):');
			});

			it("SHOULD preserve the writers' names", () => {
				const sectionContent = JSON.stringify(song.__section);

				expect(sectionContent).toContain('Leslie Bricusse');
				expect(sectionContent).toContain('Anthony Newley');
			});
		});

		describe('WHEN reading an unknown field', () => {
			it('SHOULD return undefined', () => {
				// eslint-disable-next-line dot-notation
				expect(song['missing']).toBeUndefined();
			});
		});

		describe('WHEN checking field membership', () => {
			it('SHOULD recognise an existing field name', () => {
				expect('artist' in song).toBe(true);
			});

			it('SHOULD reject the loaded label', () => {
				expect('Artist' in song).toBe(false);
			});

			it('SHOULD reject an unknown field', () => {
				expect('missing' in song).toBe(false);
			});
		});
	});
});
