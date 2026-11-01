import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { type ArtRecord, createRecordsDocument } from '@art-js/records';
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

describe('Case 02 — Renaming, adding, and deleting fields in one save', () => {
	let workingDirectory: string;
	let filename: string;
	let filesystemRecords: ReturnType<typeof createFSRecordsAdapter>;
	let recordsDocument: ReturnType<typeof createRecordsDocument<FSRecordFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);
		filename = join(workingDirectory, '_records', 'artist.art');

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

		describe('WHEN renaming born, adding artist, and deleting yearsActive, then saving', () => {
			let content: string;

			beforeEach(async () => {
				artist.renameField('born', 'birthName');
				// eslint-disable-next-line dot-notation
				artist['artist'] = 'Nina Simone';
				// eslint-disable-next-line dot-notation
				delete artist['yearsActive'];

				await artist.save();

				content = await readFile(filename, 'utf-8');
			});

			it('SHOULD persist the renamed field with its original value', () => {
				expect(content).toContain(
					'**Birth Name:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
				);
				expect(content).not.toContain('**Born:**');
			});

			it('SHOULD persist the added field', () => {
				expect(content).toContain('**Artist:** Nina Simone');
			});

			it('SHOULD delete the removed field', () => {
				expect(content).not.toContain('**Years active:**');
			});

			it('SHOULD preserve the heading and the field order', () => {
				expect(content).toMatch(/^## Artist: Nina Simone$/m);
				expect(content.indexOf('**Birth Name:**')).toBeLessThan(content.indexOf('**Artist:**'));
			});
		});
	});
});
