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

describe('Case 03 — Composing a document with siblings and nested children', () => {
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

	describe('GIVEN artist.art containing Artist: Nina Simone', () => {
		let document: RecordsDocumentCollection;
		let anchor: ArtRecord;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const artistFile = findRecordFileByPath(files, '_records/artist.art');

			expect(artistFile).toBeDefined();
			if (artistFile === undefined) {
				throw new Error('_records/artist.art was not discovered');
			}

			document = await recordsDocument.read(artistFile);
			const records = await document.extract();
			const foundAnchor = findRecordByName(records, 'Artist: Nina Simone');

			expect(foundAnchor).toBeDefined();
			if (foundAnchor === undefined) {
				throw new Error('Artist: Nina Simone was not extracted');
			}

			anchor = foundAnchor;
		});

		describe('WHEN adding siblings and children, then saving', () => {
			let content: string;

			beforeEach(async () => {
				const album = document.addRecord({ before: anchor });
				album.name = 'Album: I Put a Spell on You';
				// eslint-disable-next-line dot-notation
				album['Artist'] = 'Nina Simone';

				const moduleRecord = document.addRecord({ after: anchor });
				moduleRecord.name = 'Module';

				const song = document.addRecord({ appendTo: anchor });
				song.name = 'Song: Feeling Good';
				// eslint-disable-next-line dot-notation
				song['Released'] = 'June 1965';

				const notes = document.addRecord({ prependTo: anchor });
				notes.name = 'Notes';

				await document.save();

				content = await readFile(filename, 'utf-8');
			});

			it('SHOULD keep the anchor heading', () => {
				expect(content).toContain('## Artist: Nina Simone');
			});

			it('SHOULD place the before sibling at the anchor level before it', () => {
				const albumPosition = content.indexOf('## Album: I Put a Spell on You');
				const anchorPosition = content.indexOf('## Artist: Nina Simone');

				expect(albumPosition).toBeGreaterThanOrEqual(0);
				expect(albumPosition).toBeLessThan(anchorPosition);
			});

			it('SHOULD place the after sibling at the anchor level after it', () => {
				const anchorPosition = content.indexOf('## Artist: Nina Simone');
				const modulePosition = content.indexOf('## Module');

				expect(anchorPosition).toBeGreaterThanOrEqual(0);
				expect(modulePosition).toBeGreaterThan(anchorPosition);
			});

			it('SHOULD place the children one level deeper inside the anchor section', () => {
				const anchorPosition = content.indexOf('## Artist: Nina Simone');
				const notesPosition = content.indexOf('### Notes');
				const songPosition = content.indexOf('### Song: Feeling Good');
				const modulePosition = content.indexOf('## Module');

				expect(anchorPosition).toBeGreaterThanOrEqual(0);
				expect(notesPosition).toBeGreaterThan(anchorPosition);
				expect(songPosition).toBeGreaterThan(notesPosition);
				expect(modulePosition).toBeGreaterThan(songPosition);
			});

			it('SHOULD persist the appended child fields and the anchor fields', () => {
				expect(content).toContain('**Released:** June 1965');
				expect(content).toContain(
					'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
				);
			});
		});
	});
});
