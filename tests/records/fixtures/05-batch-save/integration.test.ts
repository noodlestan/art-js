import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

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
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';
import { makeTempDir, removeTempDirs } from '../../src/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 05 — Batch saving mutations across documents', () => {
	let workingDirectory: string;
	let artistFilename: string;
	let songFilename: string;
	let filesystemRecords: ReturnType<typeof createFSRecordsAdapter>;
	let recordsDocument: ReturnType<typeof createRecordsDocument<FSRecordFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);
		artistFilename = join(workingDirectory, '_records', 'artist.art');
		songFilename = join(workingDirectory, '_records', 'song.art');

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

	function findRequiredRecord(records: ArtRecord[], name: string): ArtRecord {
		const record = findRecordByName(records, name);

		expect(record).toBeDefined();
		if (record === undefined) {
			throw new Error(`${name} was not extracted`);
		}

		return record;
	}

	describe('GIVEN artist.art with two records and song.art', () => {
		let artistDocument: RecordsDocumentCollection;
		let songDocument: RecordsDocumentCollection;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();

			artistDocument = await recordsDocument.read(findFile(files, '_records/artist.art'));
			songDocument = await recordsDocument.read(findFile(files, '_records/song.art'));
		});

		describe('WHEN mutating both documents and saving each once', () => {
			let artistContent: string;
			let songContent: string;

			beforeEach(async () => {
				const artistRecords = await artistDocument.extract();
				const artist = findRequiredRecord(artistRecords, 'Artist: Nina Simone');
				const songInArtist = findRequiredRecord(artistRecords, 'Song: Feeling Good');
				const song = findRequiredRecord(await songDocument.extract(), 'Song: Feeling Good');

				// eslint-disable-next-line dot-notation
				artist['Active'] = '1954–2003';
				// eslint-disable-next-line dot-notation
				songInArtist['Album'] = 'I Put a Spell on You';
				// eslint-disable-next-line dot-notation
				song['Producer'] = 'Hal Mooney';

				await Promise.all([artistDocument.save(), songDocument.save()]);

				artistContent = await readFile(artistFilename, 'utf-8');
				songContent = await readFile(songFilename, 'utf-8');
			});

			it('SHOULD write every mutated record in artist.art with one save', () => {
				expect(artistContent).toContain('**Active:** 1954–2003');
				expect(artistContent).toContain('**Album:** I Put a Spell on You');
			});

			it('SHOULD preserve untouched records and fields in artist.art', () => {
				expect(artistContent).toContain(
					'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
				);
				expect(artistContent).toContain('**Released:** June 1965');
				expect(artistContent).toContain('- Leslie Bricusse');
			});

			it('SHOULD write song.art independently', () => {
				expect(songContent).toContain('**Producer:** Hal Mooney');
				expect(songContent).toContain('**Released:** June 1965');
				expect(songContent).toContain('- Anthony Newley');
			});
		});
	});
});
