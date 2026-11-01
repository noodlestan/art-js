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

describe('Case 08 — renameField() changes the label in place and preserves position', () => {
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

	describe('GIVEN the Artist: Nina Simone record', () => {
		let artist: ArtRecord;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const artistFile = findRecordFileByPath(files, '_records/artist.art');

			expect(artistFile).toBeDefined();
			if (artistFile === undefined) {
				throw new Error('_records/artist.art was not discovered');
			}

			const document = await recordsDocument.read(artistFile);
			const records = await document.extract();
			const extractedArtist = findRecordByName(records, 'Artist: Nina Simone');

			expect(extractedArtist).toBeDefined();
			if (extractedArtist === undefined) {
				throw new Error('Artist: Nina Simone was not extracted');
			}

			artist = extractedArtist;
		});

		it('SHOULD start with born and yearsActive', () => {
			expect(getFieldNames(artist)).toEqual(['born', 'yearsActive']);
		});

		describe('WHEN renaming born to artist', () => {
			beforeEach(() => {
				artist.renameField('born', 'artist');
			});

			it('SHOULD preserve the field position', () => {
				expect(getFieldNames(artist)).toEqual(['artist', 'yearsActive']);
			});

			it('SHOULD preserve the original value', () => {
				// eslint-disable-next-line dot-notation
				expect(artist['artist']).toBe(
					'Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
				);
			});

			it('SHOULD remove the old field name', () => {
				// eslint-disable-next-line dot-notation
				expect(artist['born']).toBeUndefined();
			});

			describe('WHEN setting artist to Nina Simone and saving', () => {
				let content: string;

				beforeEach(async () => {
					// eslint-disable-next-line dot-notation
					artist['artist'] = 'Nina Simone';
					await artist.save();

					const savedContent = filesystemRecords.getFileContent('_records/artist.art');

					if (savedContent === undefined) {
						throw new Error('_records/artist.art was not saved');
					}

					content = savedContent;
				});

				it('SHOULD persist the renamed field and new value', () => {
					expect(content).toContain('**Artist:** Nina Simone');
					expect(content).not.toContain('**Born:**');
				});
			});
		});
	});
});
