import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import type { ArtContentSource } from '@art-md/primitives';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type RecordsDocumentCollection, createRecordsDocument } from '../../../src/index.js';
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

describe('Case 01 — Setup: codec, adapter, and records provider', () => {
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

	describe('GIVEN the records adapter', () => {
		async function discoverArtistFile(): Promise<AdapterMockFile> {
			const files = await filesystemRecords.discoverRecordFiles();
			const artistFilename = join(workingDirectory, '_records', 'artist.art');
			const artistFile = files.find(file => file.filename === artistFilename);

			expect(artistFile).toBeDefined();
			if (artistFile === undefined) {
				throw new Error('discovery did not return _records/artist.art');
			}

			return artistFile;
		}

		describe('WHEN discovering record files', () => {
			let artistFile: AdapterMockFile;

			beforeEach(async () => {
				artistFile = await discoverArtistFile();
			});

			it('SHOULD discover the artist record file', () => {
				expect(artistFile).toBeDefined();
			});

			it('SHOULD report no discovery error for the artist file', () => {
				expect(artistFile.error).toBeUndefined();
			});
		});

		describe('WHEN creating a content source for the artist file', () => {
			let contentSource: ArtContentSource;

			beforeEach(async () => {
				const artistFile = await discoverArtistFile();
				contentSource = filesystemRecords.createContentSource(artistFile);
			});

			it('SHOULD create an adapter-backed source', () => {
				expect(contentSource.type).toBe('mock');
			});

			it('SHOULD identify the artist file by URI', () => {
				expect(contentSource.uri.endsWith('/_records/artist.art')).toBe(true);
			});
		});

		describe('WHEN reading the artist file through the records provider', () => {
			let document: RecordsDocumentCollection;

			beforeEach(async () => {
				const artistFile = await discoverArtistFile();
				document = await recordsDocument.read(artistFile);
			});

			it('SHOULD return a document with an extract function', () => {
				expect(typeof document.extract).toBe('function');
			});

			it('SHOULD return a document with a save function', () => {
				expect(typeof document.save).toBe('function');
			});
		});
	});
});
