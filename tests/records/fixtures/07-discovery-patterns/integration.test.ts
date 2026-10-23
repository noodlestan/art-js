import { type FSRecordsPattern, createFSRecordsAdapter } from '@art-lib/fs-records';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';
import { makeTempDir, removeTempDirs } from '../../src/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 07 — Discovery patterns and filters', () => {
	let workingDirectory: string;
	let filesystemRecords: ReturnType<typeof createFSRecordsAdapter>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const filesystemRecordsOptions = { basePath: workingDirectory, patterns: recordsPatterns };
		filesystemRecords = createFSRecordsAdapter(filesystemRecordsOptions);
	});

	describe('GIVEN the default records pattern', () => {
		let paths: string[];

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();

			paths = files.map(file => file.path).sort();
		});

		it('SHOULD discover .art files under _records/ recursively', () => {
			expect(paths).toEqual([
				'_records/artist.art',
				'_records/ignored/skip.art',
				'_records/nested/deep.art',
				'_records/song.art',
			]);
		});

		it('SHOULD exclude non-.art files and files outside _records/', () => {
			expect(paths).not.toContain('_records/draft.md');
			expect(paths).not.toContain('outside.art');
		});
	});

	describe('GIVEN a pattern with an excluded directory', () => {
		it('SHOULD skip files under the excluded directory', async () => {
			const patterns: FSRecordsPattern[] = recordsPatterns.map(pattern => ({
				...pattern,
				excluded: ['ignored'],
			}));
			const adapter = createFSRecordsAdapter({ basePath: workingDirectory, patterns });

			const files = await adapter.discoverRecordFiles();
			const paths = files.map(file => file.path).sort();

			expect(paths).toEqual([
				'_records/artist.art',
				'_records/nested/deep.art',
				'_records/song.art',
			]);
		});
	});

	describe('WHEN filtering by record kind', () => {
		it('SHOULD return only files containing a matching heading', async () => {
			const files = await filesystemRecords.discoverRecordFiles(['Song']);

			expect(files.map(file => file.path)).toEqual(['_records/song.art']);
		});
	});
});
