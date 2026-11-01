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
import { findRecordByName, findRecordFileByPath } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 09 — record.__section exposes the complete SectionBlock and its depth', () => {
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

		it('SHOULD expose a SectionBlock', () => {
			expect(artist.__section.construct).toBe('SectionBlock');
		});

		it('SHOULD preserve the parsed section depth', () => {
			expect(artist.__section.depth).toBe(2);
		});

		describe('WHEN adding owner = foo and saving', () => {
			let content: string;

			beforeEach(async () => {
				// eslint-disable-next-line dot-notation
				artist['owner'] = 'foo';
				await artist.save();

				const savedContent = filesystemRecords.getFileContent('_records/artist.art');

				if (savedContent === undefined) {
					throw new Error('_records/artist.art was not saved');
				}

				content = savedContent;
			});

			it('SHOULD preserve the heading depth', () => {
				expect(content).toMatch(/^## Artist: Nina Simone$/m);
				expect(content).not.toMatch(/^### Artist: Nina Simone$/m);
			});

			it('SHOULD persist the added field', () => {
				expect(content).toContain('**Owner:** foo');
			});

			it('SHOULD preserve the existing section fields', () => {
				expect(content).toContain(
					'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
				);
			});
		});
	});
});
