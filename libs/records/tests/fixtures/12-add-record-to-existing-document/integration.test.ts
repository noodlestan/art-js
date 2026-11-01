import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

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
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 12 — Adding a record to an existing, populated document', () => {
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

	describe('GIVEN an existing document containing Artist: Nina Simone', () => {
		let document: RecordsDocumentCollection;

		beforeEach(async () => {
			document = await recordsDocument.read(destinationFile);
		});

		it('SHOULD contain the pre-existing record before adding another', async () => {
			expect(await document.hasRecord('Artist: Nina Simone')).toBe(true);
		});

		describe('WHEN adding Song: Feeling Good with Artist and Released fields', () => {
			let record: ArtRecord;

			beforeEach(() => {
				record = document.addRecord();
				record.name = 'Song: Feeling Good';
				// eslint-disable-next-line dot-notation
				record['artist'] = 'Nina Simone';
				// eslint-disable-next-line dot-notation
				record['released'] = 'June 1965';
			});

			it('SHOULD default the new record section depth to 1', () => {
				expect(record.__section.depth).toBe(1);
			});

			describe('WHEN saving the new record', () => {
				let content: string;

				beforeEach(async () => {
					await record.save();

					const savedContent = filesystemRecords.getFileContent('_records/artist.art');

					if (savedContent === undefined) {
						throw new Error('_records/artist.art was not saved');
					}

					content = savedContent;
				});

				it('SHOULD preserve the pre-existing heading', () => {
					expect(content).toContain('## Artist: Nina Simone');
				});

				it('SHOULD append the new heading after the existing heading', () => {
					const existingHeadingPosition = content.indexOf('## Artist: Nina Simone');
					const addedHeadingPosition = content.indexOf('# Song: Feeling Good');

					expect(existingHeadingPosition).toBeGreaterThanOrEqual(0);
					expect(addedHeadingPosition).toBeGreaterThan(existingHeadingPosition);
				});

				it('SHOULD create the new record as a heading-1 section', () => {
					expect(content).toMatch(/^# Song: Feeling Good$/m);
				});

				it('SHOULD preserve the pre-existing Born field', () => {
					expect(content).toContain(
						'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
					);
				});

				it("SHOULD persist the new record's Released field", () => {
					expect(content).toContain('**Released:** June 1965');
				});
			});
		});
	});
});
