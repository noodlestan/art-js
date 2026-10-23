import {
	type ArtRecord,
	type RecordsDocumentCollection,
	createRecordsDocument,
} from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { findRecordByName } from '../../src/findRecordByName.js';
import { findRecordFileByPath } from '../../src/findRecordFileByPath.js';
import { getFieldNames } from '../../src/getFieldNames.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';
import { makeTempDir, removeTempDirs } from '../../src/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 01 — Discovering, locating, and reading record files', () => {
	let workingDirectory: string;
	let filesystemRecords: ReturnType<typeof createFSRecordsAdapter>;
	let recordsDocument: ReturnType<typeof createRecordsDocument<FSRecordFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codecOptions: PartialArtCodecConfig = {};
		const codec: ArtCodec = createArtCodec(codecOptions);

		const filesystemRecordsOptions = { basePath: workingDirectory, patterns: recordsPatterns };
		filesystemRecords = createFSRecordsAdapter(filesystemRecordsOptions);

		function createContentSource(file: FSRecordFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<FSRecordFile>(recordsDocumentOptions);
	});

	function findFile(files: FSRecordFile[], path: string): FSRecordFile {
		const file = findRecordFileByPath(files, path);

		expect(file).toBeDefined();
		if (file === undefined) {
			throw new Error(`${path} was not discovered`);
		}

		return file;
	}

	describe('GIVEN the record files directory', () => {
		let files: FSRecordFile[];

		beforeEach(async () => {
			files = await filesystemRecords.discoverRecordFiles();
		});

		it('SHOULD discover every .art file under _records/', () => {
			const paths = files.map(file => file.path).sort();

			expect(paths).toEqual(['_records/artist.art', '_records/song.art']);
		});

		it('SHOULD exclude markdown files and files outside _records/', () => {
			const paths = files.map(file => file.path);

			expect(paths).not.toContain('_records/draft.md');
			expect(paths).not.toContain('outside.art');
		});

		it('SHOULD expose files that can be located by path', () => {
			expect(findRecordFileByPath(files, '_records/artist.art')).toBeDefined();
			expect(findRecordFileByPath(files, '_records/song.art')).toBeDefined();
		});
	});

	describe('GIVEN artist.art', () => {
		let document: RecordsDocumentCollection;
		let records: ArtRecord[];

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			document = await recordsDocument.read(findFile(files, '_records/artist.art'));
			records = await document.extract();
		});

		it('SHOULD recognise headings by their complete name', async () => {
			expect(await document.hasRecord('Module')).toBe(true);
			expect(await document.hasRecord('Artist: Nina Simone')).toBe(true);
			expect(await document.hasRecord('Song: Feeling Good')).toBe(true);
		});

		it('SHOULD extract records in document order', () => {
			expect(records.map(record => record.name)).toEqual([
				'Module',
				'Artist: Nina Simone',
				'Song: Feeling Good',
			]);
		});

		it('SHOULD preserve the nesting depth of each record', () => {
			expect(records.map(record => record.__section.depth)).toEqual([1, 2, 3]);
		});
	});

	describe('GIVEN song.art', () => {
		let song: ArtRecord;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const document = await recordsDocument.read(findFile(files, '_records/song.art'));
			const records = await document.extract();
			const extractedSong = findRecordByName(records, 'Song: Feeling Good');

			expect(extractedSong).toBeDefined();
			if (extractedSong === undefined) {
				throw new Error('Song: Feeling Good was not extracted');
			}

			song = extractedSong;
		});

		it('SHOULD read field names case-sensitively', () => {
			// eslint-disable-next-line dot-notation
			expect(song['Artist']).toBe('Nina Simone');
			// eslint-disable-next-line dot-notation
			expect(song['artist']).toBeUndefined();
		});

		it('SHOULD list the fields in file order', () => {
			expect(getFieldNames(song)).toEqual(['Artist', 'Released']);
		});

		it('SHOULD preserve the Writter(s) label and list values', () => {
			const sectionContent = JSON.stringify(song.__section);

			expect(sectionContent).toContain('Writter(s):');
			expect(sectionContent).toContain('Leslie Bricusse');
			expect(sectionContent).toContain('Anthony Newley');
		});
	});
});
