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
import { findRecordFileByPath } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 20 — A reserved field label aborts record extraction', () => {
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

	describe('GIVEN the artist.art document carrying a Name label', () => {
		let artistFile: AdapterMockFile;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const discoveredFile = findRecordFileByPath(files, '_records/artist.art');

			expect(discoveredFile).toBeDefined();
			if (discoveredFile === undefined) {
				throw new Error('_records/artist.art was not discovered');
			}

			artistFile = discoveredFile;
		});

		it('SHOULD be read with its record still present', async () => {
			const document = await recordsDocument.read(artistFile);

			expect(await document.hasRecord('Artist: Nina Simone')).toBe(true);
		});

		it('SHOULD reject extraction with the reserved-name TypeError and let no record escape', async () => {
			const document = await recordsDocument.read(artistFile);

			let thrownMessage: string | undefined;
			let extractedRecords: ArtRecord[] | undefined;

			try {
				extractedRecords = await document.extract();
			} catch (error) {
				thrownMessage = error instanceof Error ? error.message : String(error);
			}

			expect(thrownMessage).toBe('Field label "Name" resolves to reserved name "name"');
			expect(extractedRecords).toBeUndefined();
		});

		it('SHOULD throw a TypeError from the extract path', async () => {
			const document = await recordsDocument.read(artistFile);

			await expect(document.extract()).rejects.toThrow(TypeError);
		});
	});
});
