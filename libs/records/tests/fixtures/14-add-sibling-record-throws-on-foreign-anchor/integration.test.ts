import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	type ArtRecord,
	type RecordsDocumentCollection,
	createRecordsDocument,
} from '../../../src/index.js';
import { type AdapterMockFile, createAdapterMock } from '../../helpers/adapter/index.js';
import { copyFixtureCase, getFixtureDirectory } from '../../helpers/fixtures/index.js';
import { captureThrownMessage, findRecordByName } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 14 — Sibling placement rejects anchors from another document', () => {
	let artistFile: AdapterMockFile;
	let songFile: AdapterMockFile;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		const workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const artistFilename = join(workingDirectory, '_records', 'artist.art');
		artistFile = {
			filename: artistFilename,
			basePath: workingDirectory,
			path: relative(workingDirectory, artistFilename),
		};

		const songFilename = join(workingDirectory, '_records', 'song.art');
		songFile = {
			filename: songFilename,
			basePath: workingDirectory,
			path: relative(workingDirectory, songFilename),
		};

		const codec = createArtCodec({});
		const fixtureFiles = {
			'_records/artist.art': await readFile(artistFilename, 'utf-8'),
			'_records/song.art': await readFile(songFilename, 'utf-8'),
		};

		const filesystemRecords = createAdapterMock({
			basePath: workingDirectory,
			files: fixtureFiles,
		});

		function createContentSource(file: AdapterMockFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<AdapterMockFile>(recordsDocumentOptions);
	});

	describe('GIVEN an Artist: Nina Simone record extracted from artist.art', () => {
		let foreignAnchor: ArtRecord;

		beforeEach(async () => {
			const foreignDocument = await recordsDocument.read(artistFile);
			const foreignRecords = await foreignDocument.extract();
			const foreignArtist = findRecordByName(foreignRecords, 'Artist: Nina Simone');

			expect(foreignArtist).toBeDefined();
			if (foreignArtist === undefined) {
				throw new Error('the foreign anchor must exist in its own document');
			}

			foreignAnchor = foreignArtist;
		});

		describe('AND a document read from song.art', () => {
			let document: RecordsDocumentCollection;
			let recordCount: number;

			beforeEach(async () => {
				document = await recordsDocument.read(songFile);
				recordCount = (await document.extract()).length;
			});

			it('SHOULD reject the foreign anchor when inserting before it', () => {
				const message = captureThrownMessage(() => {
					document.addRecord({ before: foreignAnchor });
				});

				expect(message).toBe('The placement anchor is not part of this document');
			});

			it('SHOULD reject the foreign anchor when inserting after it', () => {
				const message = captureThrownMessage(() => {
					document.addRecord({ after: foreignAnchor });
				});

				expect(message).toBe('The placement anchor is not part of this document');
			});

			it('SHOULD leave the document unchanged after both rejected insertions', async () => {
				captureThrownMessage(() => {
					document.addRecord({ before: foreignAnchor });
				});
				captureThrownMessage(() => {
					document.addRecord({ after: foreignAnchor });
				});

				const updatedCount = (await document.extract()).length;

				expect(updatedCount).toBe(recordCount);
			});
		});
	});
});
