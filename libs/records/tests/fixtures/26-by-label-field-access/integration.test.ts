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
import {
	extractTestRecord,
	findRecordByName,
	findRecordFileByPath,
	getFieldNames,
} from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 26 — Reading and writing a shadowed field by its stored label', () => {
	let workingDirectory: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codec = createArtCodec({});
		const fixtureFiles = {
			'_records/playlist.art': await readFile(
				join(workingDirectory, '_records', 'playlist.art'),
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

	function getSavedContent(): string {
		const savedContent = filesystemRecords.getFileContent('_records/playlist.art');

		if (savedContent === undefined) {
			throw new Error('_records/playlist.art was not saved');
		}

		return savedContent;
	}

	async function extractPlaylist(): Promise<ArtRecord> {
		const files = await filesystemRecords.discoverRecordFiles();
		const playlistFile = findRecordFileByPath(files, '_records/playlist.art');

		expect(playlistFile).toBeDefined();
		if (playlistFile === undefined) {
			throw new Error('_records/playlist.art was not discovered');
		}

		const document = await recordsDocument.read(playlistFile);
		const records = await document.extract();
		const extractedPlaylist = findRecordByName(records, 'Playlist: Road Trip');

		expect(extractedPlaylist).toBeDefined();
		if (extractedPlaylist === undefined) {
			throw new Error('Playlist: Road Trip was not extracted');
		}

		return extractedPlaylist;
	}

	describe('GIVEN the extracted playlist record holding the Id/ID pair', () => {
		let playlist: ArtRecord;

		beforeEach(async () => {
			playlist = await extractPlaylist();
		});

		it('WHEN reading by name and by label THEN the name reads first-wins and the label reaches the shadowed field', () => {
			// eslint-disable-next-line dot-notation
			expect(playlist['id']).toBe('First');
			expect(playlist.getFieldMarkdown('id')).toBe('First');
			expect(playlist.getFieldMarkdownByLabel('ID')).toBe('Second');
			expect(playlist.getFieldTextByLabel('ID')).toBe('Second');
			expect(playlist.getFieldValueByLabel('ID')).toHaveLength(1);
			expect(getFieldNames(playlist)).toEqual(['id', 'purpose']);
		});

		it('WHEN reading a label no field carries THEN all three reads return undefined', () => {
			expect(playlist.getFieldMarkdownByLabel('Missing')).toBeUndefined();
			expect(playlist.getFieldTextByLabel('Missing')).toBeUndefined();
			expect(playlist.getFieldValueByLabel('Missing')).toBeUndefined();
		});

		it('WHEN writing a label no field carries THEN it throws and no field is created', () => {
			const childrenBefore = playlist.__section.children.length;

			expect(() => {
				playlist.setFieldMarkdownByLabel('Missing', 'Updated');
			}).toThrow('Field not found: Missing');
			expect(() => {
				playlist.setFieldValueByLabel('Missing', []);
			}).toThrow('Field not found: Missing');

			expect(playlist.__section.children).toHaveLength(childrenBefore);
			expect(getFieldNames(playlist)).toEqual(['id', 'purpose']);
		});

		it('WHEN writing the shadowed field by label THEN only that field changes and both labels survive a save', async () => {
			playlist.setFieldMarkdownByLabel('ID', 'Second Updated');

			expect(playlist.getFieldMarkdownByLabel('ID')).toBe('Second Updated');
			// eslint-disable-next-line dot-notation
			expect(playlist['id']).toBe('First');
			expect(playlist.getFieldMarkdown('purpose')).toBe('Records API');

			await playlist.save();

			const content = getSavedContent();

			expect(content).toContain('**Id:** First');
			expect(content).toContain('**ID:** Second Updated');
			expect(content).toContain('**Purpose:** Records API (#wip)');

			const reloaded = await extractTestRecord(content, 'Playlist: Road Trip');

			// eslint-disable-next-line dot-notation
			expect(reloaded.record['id']).toBe('First');
			expect(reloaded.record.getFieldMarkdownByLabel('ID')).toBe('Second Updated');
			expect(getFieldNames(reloaded.record)).toEqual(['id', 'purpose']);
		});
	});
});
