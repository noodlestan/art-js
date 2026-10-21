// Case 02 — Finding records: discovery filters filenames, not headings.
//
// Hardcoded use case from `knowledge/design/records.md`: discover without a
// kind filter, then interpret the complete heading name after parsing. Files
// that do not match `**/_records/**/*.art` must not be discovered.
import { join } from 'node:path';

import { createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { findRecordFileByPath } from '../../src/findRecordFileByPath.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';

export async function runTest(): Promise<void> {
	const workingDirectory = await copyFixtureCase(getFixtureDirectory(import.meta.url));

	const codecOptions: PartialArtCodecConfig = {};
	const codec: ArtCodec = createArtCodec(codecOptions);
	const filesystemRecordsOptions = { basePath: workingDirectory, patterns: recordsPatterns };
	const filesystemRecords = createFSRecordsAdapter(filesystemRecordsOptions);
	function createContentSource(file: FSRecordFile) {
		return filesystemRecords.createContentSource(file);
	}
	const recordsDocumentOptions = { codec, createContentSource };
	const recordsDocument = createRecordsDocument<FSRecordFile>(recordsDocumentOptions);

	const files = await filesystemRecords.discoverRecordFiles();
	function getRecordFilePath(file: FSRecordFile): string {
		return file.path;
	}
	const paths = files.map(getRecordFilePath).sort();

	assert(paths.length === 2, `expected 2 record files, got ${paths.length}: ${paths.join(', ')}`);
	assert(paths[0] === '_records/artist.art', `unexpected path: ${String(paths[0])}`);
	assert(paths[1] === '_records/song.art', `unexpected path: ${String(paths[1])}`);
	function isMarkdownPath(path: string): boolean {
		return path.endsWith('.md');
	}
	const markdownPathFound = paths.some(isMarkdownPath);
	assert(!markdownPathFound, `a non-.art file was discovered: ${paths.join(', ')}`);
	function isOutsideRecordsPath(path: string): boolean {
		return path === 'outside.art';
	}
	const outsideRecordsPathFound = paths.some(isOutsideRecordsPath);
	assert(outsideRecordsPathFound === false, 'a record outside _records/ was discovered');

	const artistFile = findRecordFileByPath(files, '_records/artist.art');
	assert(artistFile !== undefined, '_records/artist.art was not discovered');
	assert(artistFile.error === undefined, `discovery error: ${String(artistFile.error)}`);
	assert(
		artistFile.filename === join(workingDirectory, '_records', 'artist.art'),
		`filename must be absolute: ${artistFile.filename}`,
	);
	assert(artistFile.basePath === workingDirectory, `basePath mismatch: ${artistFile.basePath}`);

	const document = await recordsDocument.read(artistFile);
	assert(await document.hasRecord('Artist: Nina Simone'), 'Artist: Nina Simone must be present');
}
