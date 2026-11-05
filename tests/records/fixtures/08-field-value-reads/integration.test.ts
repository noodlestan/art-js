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

describe('Case 08 — Reading a field as markdown, text, and raw value', () => {
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

	describe('GIVEN the extracted artist record', () => {
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

		it('SHOULD return markdown from the accessor and the markdown read, and stripped text from the text read', () => {
			// eslint-disable-next-line dot-notation
			expect(artist['greeting']).toBe('Hello, are _you_ there _world_?');
			expect(artist.getFieldMarkdown('greeting')).toBe('Hello, are _you_ there _world_?');
			expect(artist.getFieldText('greeting')).toBe('Hello, are you there world?');
		});

		it('SHOULD keep the code span in the markdown read and strip it in the text read', () => {
			expect(artist.getFieldMarkdown('location')).toBe('`art-works`');
			expect(artist.getFieldText('location')).toBe('art-works');
		});

		it('SHOULD return a deep clone of the value without the label', () => {
			const value = artist.getFieldValue('greeting');

			expect(value).toBeDefined();
			expect(Array.isArray(value)).toBe(true);
			expect(JSON.stringify(value)).not.toContain('Greeting');
			expect(artist.getFieldValue('greeting')).toEqual(value);
		});

		it('SHOULD return undefined on all three reads for a missing name', () => {
			expect(artist.getFieldMarkdown('missing')).toBeUndefined();
			expect(artist.getFieldText('missing')).toBeUndefined();
			expect(artist.getFieldValue('missing')).toBeUndefined();
		});

		it('SHOULD list the field names without the handle members', () => {
			expect(getFieldNames(artist)).toEqual(['greeting', 'location', 'purpose']);
		});

		it('SHOULD persist the authored markup unchanged after a save', async () => {
			// eslint-disable-next-line dot-notation
			artist['purpose'] = 'Updated Records API';
			await artist.save();

			const content = await readFile(filename, 'utf-8');

			expect(content).toContain('**Greeting:** Hello, are _you_ there _world_?');
			expect(content).toContain('**Location:** `art-works`');
			expect(content).toContain('**Purpose:** Updated Records API');
		});
	});
});
