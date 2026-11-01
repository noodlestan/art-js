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

describe('Case 05 — Writing an existing field replaces its value in place', () => {
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

	describe('GIVEN the artist record file', () => {
		let artistFile: AdapterMockFile;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const discoveredFile = findRecordFileByPath(files, '_records/artist.art');

			expect(discoveredFile).toBeDefined();
			if (discoveredFile === undefined) {
				throw new Error('_records/artist.art was not discovered');
			}

			artistFile = discoveredFile;
		});

		it('SHOULD discover the artist record file', () => {
			expect(artistFile).toBeDefined();
		});

		describe('GIVEN the extracted artist record', () => {
			let artist: ArtRecord;

			beforeEach(async () => {
				const document = await recordsDocument.read(artistFile);
				const records = await document.extract();
				const extractedArtist = findRecordByName(records, 'Artist: Nina Simone');

				expect(extractedArtist).toBeDefined();
				if (extractedArtist === undefined) {
					throw new Error('Artist: Nina Simone was not extracted');
				}

				artist = extractedArtist;
			});

			it('SHOULD extract Nina Simone', () => {
				expect(artist.name).toBe('Artist: Nina Simone');
			});

			it('SHOULD start with born and yearsActive in that order', () => {
				expect(getFieldNames(artist)).toEqual(['born', 'yearsActive']);
			});

			describe('WHEN replacing born with Eunice Kathleen Waymon', () => {
				beforeEach(() => {
					// eslint-disable-next-line dot-notation
					artist['born'] = 'Eunice Kathleen Waymon';
				});

				it('SHOULD read back the replacement value', () => {
					// eslint-disable-next-line dot-notation
					expect(artist['born']).toBe('Eunice Kathleen Waymon');
				});

				it('SHOULD preserve the field order and the loaded label', () => {
					expect(getFieldNames(artist)).toEqual(['born', 'yearsActive']);
					expect(JSON.stringify(artist.__section)).toContain('"name":"Born"');
				});

				describe('WHEN saving the artist record', () => {
					let content: string;

					beforeEach(async () => {
						await artist.save();

						const savedContent = filesystemRecords.getFileContent('_records/artist.art');

						if (savedContent === undefined) {
							throw new Error('_records/artist.art was not saved');
						}

						content = savedContent;
					});

					it('SHOULD persist the replacement value', () => {
						expect(content).toContain('**Born:** Eunice Kathleen Waymon');
					});

					it('SHOULD not persist the replaced value', () => {
						expect(content).not.toContain('Tryon, North Carolina, U.S.');
					});

					it('SHOULD preserve the other field', () => {
						expect(content).toContain('**Years active:** 1954–2003');
					});
				});
			});
		});
	});
});
