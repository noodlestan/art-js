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

describe('Case 15 — Appending and prepending records under an existing parent record', () => {
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

	describe('GIVEN a document containing Artist: Nina Simone', () => {
		let document: RecordsDocumentCollection;
		let parent: ArtRecord;

		beforeEach(async () => {
			document = await recordsDocument.read(destinationFile);
			const records = await document.extract();
			const foundParent = findRecordByName(records, 'Artist: Nina Simone');

			expect(foundParent).toBeDefined();
			if (foundParent === undefined) {
				throw new Error('the parent record must be present');
			}

			parent = foundParent;
		});

		function appendSong(): ArtRecord {
			const appendedSong = document.addRecord({ appendTo: parent });
			appendedSong.name = 'Song: Feeling Good';
			// eslint-disable-next-line dot-notation
			appendedSong['Artist'] = 'Nina Simone';
			// eslint-disable-next-line dot-notation
			appendedSong['Released'] = 'June 1965';
			return appendedSong;
		}

		function prependModule(): ArtRecord {
			const prependedModule = document.addRecord({ prependTo: parent });
			prependedModule.name = 'Module';
			return prependedModule;
		}

		it('SHOULD find the parent record', () => {
			expect(parent.name).toBe('Artist: Nina Simone');
		});

		describe('WHEN appending Song: Feeling Good to the parent', () => {
			let appendedSong: ArtRecord;

			beforeEach(() => {
				appendedSong = appendSong();
			});

			it('SHOULD place the child one level deeper', () => {
				expect(appendedSong.__section.depth).toBe(3);
			});
		});

		describe('WHEN prepending Module to the parent', () => {
			let prependedModule: ArtRecord;

			beforeEach(() => {
				prependedModule = prependModule();
			});

			it('SHOULD place the child one level deeper', () => {
				expect(prependedModule.__section.depth).toBe(3);
			});
		});

		describe('WHEN saving the document', () => {
			let content: string;

			beforeEach(async () => {
				appendSong();
				prependModule();
				await document.save();

				const savedContent = filesystemRecords.getFileContent('_records/artist.art');

				if (savedContent === undefined) {
					throw new Error('_records/artist.art was not saved');
				}

				content = savedContent;
			});

			it('SHOULD preserve the parent heading', () => {
				expect(content).toContain('## Artist: Nina Simone');
			});

			it('SHOULD place the prepended child inside the parent section', () => {
				const artistHeadingPosition = content.indexOf('## Artist: Nina Simone');
				const moduleHeadingPosition = content.indexOf('### Module');

				expect(artistHeadingPosition).toBeGreaterThanOrEqual(0);
				expect(moduleHeadingPosition).toBeGreaterThan(artistHeadingPosition);
			});

			it('SHOULD place the appended child after the prepended child', () => {
				const moduleHeadingPosition = content.indexOf('### Module');
				const songHeadingPosition = content.indexOf('### Song: Feeling Good');

				expect(moduleHeadingPosition).toBeGreaterThanOrEqual(0);
				expect(songHeadingPosition).toBeGreaterThan(moduleHeadingPosition);
			});

			it("SHOULD persist the appended child's Released field", () => {
				expect(content).toContain('**Released:** June 1965');
			});

			it('SHOULD close the parent section with the appended child', () => {
				expect(content.trimEnd().endsWith('**Released:** June 1965')).toBe(true);
			});
		});
	});
});
