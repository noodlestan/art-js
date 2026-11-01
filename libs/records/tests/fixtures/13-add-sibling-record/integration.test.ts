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
import { findRecordByName } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 13 — Inserting sibling records before and after an existing record', () => {
	let filename: string;
	let destinationFile: AdapterMockFile;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		const workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		filename = join(workingDirectory, '_records', 'song.art');
		destinationFile = {
			filename,
			basePath: workingDirectory,
			path: relative(workingDirectory, filename),
		};

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

	describe('GIVEN a document containing Song: Feeling Good', () => {
		let document: RecordsDocumentCollection;
		let anchor: ArtRecord;

		beforeEach(async () => {
			document = await recordsDocument.read(destinationFile);
			const records = await document.extract();
			const foundAnchor = findRecordByName(records, 'Song: Feeling Good');

			expect(foundAnchor).toBeDefined();
			if (foundAnchor === undefined) {
				throw new Error('the anchor record must be present');
			}

			anchor = foundAnchor;
		});

		function addArtistBefore(): ArtRecord {
			const artist = document.addRecord({ before: anchor });
			artist.name = 'Artist: Nina Simone';
			// eslint-disable-next-line dot-notation
			artist['born'] = 'Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.';
			return artist;
		}

		function addModuleAfter(): ArtRecord {
			const moduleRecord = document.addRecord({ after: anchor });
			moduleRecord.name = 'Module';
			return moduleRecord;
		}

		it('SHOULD find the anchor record', () => {
			expect(anchor.name).toBe('Song: Feeling Good');
		});

		describe('WHEN adding Artist: Nina Simone before the anchor', () => {
			let artist: ArtRecord;

			beforeEach(() => {
				artist = addArtistBefore();
			});

			it("SHOULD preserve the anchor's section depth", () => {
				expect(artist.__section.depth).toBe(2);
			});
		});

		describe('WHEN adding Module after the anchor', () => {
			let moduleRecord: ArtRecord;

			beforeEach(() => {
				moduleRecord = addModuleAfter();
			});

			it("SHOULD preserve the anchor's section depth", () => {
				expect(moduleRecord.__section.depth).toBe(2);
			});
		});

		describe('WHEN saving the document', () => {
			let content: string;

			beforeEach(async () => {
				addArtistBefore();
				addModuleAfter();
				await document.save();

				const savedContent = filesystemRecords.getFileContent('_records/song.art');

				if (savedContent === undefined) {
					throw new Error('_records/song.art was not saved');
				}

				content = savedContent;
			});

			it('SHOULD write the before-insert', () => {
				expect(content).toContain('## Artist: Nina Simone');
			});

			it('SHOULD preserve the anchor heading', () => {
				expect(content).toContain('## Song: Feeling Good');
			});

			it('SHOULD write the after-insert', () => {
				expect(content).toContain('## Module');
			});

			it('SHOULD place Artist before Song', () => {
				const artistHeadingPosition = content.indexOf('## Artist: Nina Simone');
				const songHeadingPosition = content.indexOf('## Song: Feeling Good');

				expect(artistHeadingPosition).toBeGreaterThanOrEqual(0);
				expect(artistHeadingPosition).toBeLessThan(songHeadingPosition);
			});

			it('SHOULD place Module after Song', () => {
				const songHeadingPosition = content.indexOf('## Song: Feeling Good');
				const moduleHeadingPosition = content.indexOf('## Module');

				expect(songHeadingPosition).toBeGreaterThanOrEqual(0);
				expect(moduleHeadingPosition).toBeGreaterThan(songHeadingPosition);
			});

			it('SHOULD persist the before-insert Born field', () => {
				expect(content).toContain(
					'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
				);
			});

			it("SHOULD preserve the anchor's Released field", () => {
				expect(content).toContain('**Released:** June 1965');
			});

			it("SHOULD preserve the anchor's list field", () => {
				expect(content).toContain('- Leslie Bricusse');
			});
		});
	});
});
