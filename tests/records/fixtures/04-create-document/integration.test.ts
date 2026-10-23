import { access, mkdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { type ArtRecord, createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { findRecordFileByPath } from '../../src/findRecordFileByPath.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';
import { makeTempDir, removeTempDirs } from '../../src/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 04 — Creating a new record file', () => {
	let workingDirectory: string;
	let filename: string;
	let destinationFile: FSRecordFile;
	let filesystemRecords: ReturnType<typeof createFSRecordsAdapter>;
	let recordsDocument: ReturnType<typeof createRecordsDocument<FSRecordFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const recordsDirectory = join(workingDirectory, '_records');
		await mkdir(recordsDirectory, { recursive: true });

		filename = join(recordsDirectory, 'album.art');
		destinationFile = {
			filename,
			basePath: workingDirectory,
			path: relative(workingDirectory, filename),
		};

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

	describe('GIVEN a destination file that does not exist', () => {
		it('SHOULD confirm the file is absent before saving', async () => {
			await expect(access(filename)).rejects.toMatchObject({ code: 'ENOENT' });
		});

		describe('WHEN creating a document, adding an Album record, and saving', () => {
			let content: string;

			beforeEach(async () => {
				const document = await recordsDocument.create(destinationFile);
				const record: ArtRecord = document.addRecord();

				record.name = 'Album: I Put a Spell on You';
				// eslint-disable-next-line dot-notation
				record['Artist'] = 'Nina Simone';

				await record.save();

				content = await readFile(filename, 'utf-8');
			});

			it('SHOULD create the file with a depth-1 heading', () => {
				expect(content).toMatch(/^# Album: I Put a Spell on You$/m);
			});

			it('SHOULD persist the supplied field', () => {
				expect(content).toContain('**Artist:** Nina Simone');
			});

			it('SHOULD make the new file discoverable', async () => {
				const files = await filesystemRecords.discoverRecordFiles();

				expect(findRecordFileByPath(files, '_records/album.art')).toBeDefined();
			});
		});
	});
});
