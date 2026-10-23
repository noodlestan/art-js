import { join, relative } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type ArtRecord, createRecordsDocument } from '../../../src/index.js';
import {
	type AdapterMock,
	type AdapterMockFile,
	createAdapterMock,
} from '../../helpers/adapter/index.js';
import { copyFixtureCase, getFixtureDirectory } from '../../helpers/fixtures/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 11 — Creating a new record in a new destination file', () => {
	let filename: string;
	let destinationFile: AdapterMockFile;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		const workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		filename = join(workingDirectory, '_records', 'artist.art');
		destinationFile = {
			filename,
			basePath: workingDirectory,
			path: relative(workingDirectory, filename),
		};

		const codec = createArtCodec({});
		filesystemRecords = createAdapterMock({ basePath: workingDirectory, files: {} });

		function createContentSource(file: AdapterMockFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<AdapterMockFile>(recordsDocumentOptions);
	});

	describe('GIVEN a destination file that does not exist', () => {
		it('SHOULD confirm the file is absent before saving', () => {
			expect(filesystemRecords.getFileContent('_records/artist.art')).toBeUndefined();
		});

		describe('WHEN creating a document and adding a record', () => {
			let record: ArtRecord;

			beforeEach(async () => {
				const document = await recordsDocument.create(destinationFile);
				record = document.addRecord();
			});

			it('SHOULD initialise the record with an empty name', () => {
				expect(record.name).toBe('');
			});

			it('SHOULD initialise the record with a SectionBlock', () => {
				expect(record.__section.construct).toBe('SectionBlock');
			});

			it('SHOULD default the section depth to 1', () => {
				expect(record.__section.depth).toBe(1);
			});

			describe('WHEN saving the record without a name', () => {
				it('SHOULD reject the save', async () => {
					await expect(record.save()).rejects.toBeInstanceOf(Error);
				});
			});

			describe('WHEN assigning a name and Born field, then saving', () => {
				let content: string;

				beforeEach(async () => {
					record.name = 'Artist: Nina Simone';
					// eslint-disable-next-line dot-notation
					record['Born'] =
						'Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.';
					await record.save();

					const savedContent = filesystemRecords.getFileContent('_records/artist.art');

					if (savedContent === undefined) {
						throw new Error('_records/artist.art was not saved');
					}

					content = savedContent;
				});

				it('SHOULD create the destination file with the record heading', () => {
					expect(content).toMatch(/^# Artist: Nina Simone$/m);
				});

				it('SHOULD persist the supplied Born field', () => {
					expect(content).toContain(
						'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
					);
				});
			});
		});
	});
});
