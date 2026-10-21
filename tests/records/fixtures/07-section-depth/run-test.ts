// Case 07 — record.__section exposes the complete SectionBlock and its depth.
//
// Hardcoded use case from `knowledge/design/records.md`: consumers change
// section properties through `record.__section`, then call `record.save()`.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { findRecordByName } from '../../src/findRecordByName.js';
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
	const artistFile = findRecordFileByPath(files, '_records/artist.art');
	assert(artistFile !== undefined, '_records/artist.art was not discovered');

	const document = await recordsDocument.read(artistFile);
	const records = await document.extract();
	const artist = findRecordByName(records, 'Artist: Nina Simone');
	assert(artist !== undefined, 'Artist: Nina Simone was not extracted');

	assert(
		artist.__section.construct === 'SectionBlock',
		`record.__section must be a SectionBlock: ${artist.__section.construct}`,
	);

	artist.__section.depth = 3;
	await artist.save();

	const content = await readFile(join(workingDirectory, '_records', 'artist.art'), 'utf-8');
	assert(
		/^### Artist: Nina Simone$/m.test(content),
		'saved heading must be written at depth 3 (###)',
	);
	assert(
		!/^## Artist: Nina Simone$/m.test(content),
		'saved heading must no longer be written at depth 2 (##)',
	);
}
