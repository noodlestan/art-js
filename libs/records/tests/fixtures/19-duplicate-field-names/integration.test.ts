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

describe('Case 19 — Duplicate field names keep the first occurrence and promote on removal', () => {
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

	describe('GIVEN the Playlist: Road Trip record extracted from playlist.art', () => {
		let playlist: ArtRecord;

		beforeEach(async () => {
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

			playlist = extractedPlaylist;
		});

		it('SHOULD read the first purpose and list the name once while keeping both fields', () => {
			// eslint-disable-next-line dot-notation
			expect(playlist['purpose']).toBe('First');
			expect(getFieldNames(playlist)).toEqual(['purpose']);
			expect(Object.keys(playlist).filter(key => key === 'purpose')).toEqual(['purpose']);
			expect(JSON.stringify(playlist.__section)).toContain('"name":"Purpose"');
			expect(JSON.stringify(playlist.__section)).toContain('"name":"purpose"');
		});

		describe('WHEN deleting purpose', () => {
			beforeEach(() => {
				// eslint-disable-next-line dot-notation
				delete playlist['purpose'];
			});

			it('SHOULD promote the duplicate under its own label', () => {
				// eslint-disable-next-line dot-notation
				expect(playlist['purpose']).toBe('Second');
				expect(getFieldNames(playlist)).toEqual(['purpose']);
				expect(JSON.stringify(playlist.__section)).toContain('"name":"purpose"');
				expect(JSON.stringify(playlist.__section)).not.toContain('"name":"Purpose"');
			});

			describe('AND saving the playlist record', () => {
				let content: string;

				beforeEach(async () => {
					await playlist.save();

					const savedContent = filesystemRecords.getFileContent('_records/playlist.art');

					if (savedContent === undefined) {
						throw new Error('_records/playlist.art was not saved');
					}

					content = savedContent;
				});

				it('SHOULD keep the promoted label in the written document', () => {
					expect(content).toContain('**purpose:** Second');
					expect(content).not.toContain('**Purpose:**');
				});

				it('SHOULD read back the promoted value after a reload', async () => {
					const reloaded = await extractTestRecord(content, 'Playlist: Road Trip');

					// eslint-disable-next-line dot-notation
					expect(reloaded.record['purpose']).toBe('Second');
				});
			});
		});
	});
});
