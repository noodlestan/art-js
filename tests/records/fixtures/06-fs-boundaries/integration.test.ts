import { rm } from 'node:fs/promises';
import { join, relative } from 'node:path';

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

describe('Case 06 — Filesystem boundary failures', () => {
	let workingDirectory: string;
	let filesystemRecords: ReturnType<typeof createFSRecordsAdapter>;
	let recordsDocument: ReturnType<typeof createRecordsDocument<FSRecordFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

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

	describe('GIVEN a base path that does not exist', () => {
		it('SHOULD discover no record files', async () => {
			const missingBasePath = join(workingDirectory, 'missing');
			const adapter = createFSRecordsAdapter({
				basePath: missingBasePath,
				patterns: recordsPatterns,
			});

			await expect(adapter.discoverRecordFiles()).resolves.toEqual([]);
		});
	});

	describe('GIVEN a record file path that does not exist', () => {
		it('SHOULD reject reading it with ENOENT', async () => {
			const filename = join(workingDirectory, '_records', 'missing.art');
			const missingFile: FSRecordFile = {
				filename,
				basePath: workingDirectory,
				path: relative(workingDirectory, filename),
			};

			await expect(recordsDocument.read(missingFile)).rejects.toMatchObject({
				code: 'ENOENT',
			});
		});
	});

	describe('WHEN saving after the records directory has been removed', () => {
		let document: RecordsDocumentCollection;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const artistFile = findRecordFileByPath(files, '_records/artist.art');

			expect(artistFile).toBeDefined();
			if (artistFile === undefined) {
				throw new Error('_records/artist.art was not discovered');
			}

			document = await recordsDocument.read(artistFile);
			const records = await document.extract();
			const artist: ArtRecord | undefined = findRecordByName(records, 'Artist: Nina Simone');

			expect(artist).toBeDefined();
			if (artist === undefined) {
				throw new Error('Artist: Nina Simone was not extracted');
			}

			// eslint-disable-next-line dot-notation
			artist['artist'] = 'Nina Simone';

			await rm(join(workingDirectory, '_records'), { recursive: true, force: true });
		});

		it('SHOULD reject the save with ENOENT', async () => {
			await expect(document.save()).rejects.toMatchObject({ code: 'ENOENT' });
		});
	});
});
