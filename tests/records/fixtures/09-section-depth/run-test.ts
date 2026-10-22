// Case 09 — record.__section exposes the complete SectionBlock and its depth.
//
// Hardcoded use case from `libs/records/knowledge/overview.md`: persist
// changes with field order and section structure preserved. Section depth is
// read-only: it comes from the parsed heading and saving keeps the heading at
// that depth.
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
	assert(
		artist.__section.depth === 2,
		`an extracted record keeps its parsed depth: ${artist.__section.depth}`,
	);

	// eslint-disable-next-line dot-notation
	artist['owner'] = 'foo';
	await artist.save();

	const content = await readFile(join(workingDirectory, '_records', 'artist.art'), 'utf-8');
	assert(
		/^## Artist: Nina Simone$/m.test(content),
		'saved heading must keep the parsed depth 2 (##)',
	);
	assert(
		!/^### Artist: Nina Simone$/m.test(content),
		'saved heading must not shift to depth 3 (###)',
	);
	assert(content.includes('**owner:** foo'), 'the added field must be written');
	assert(
		content.includes(
			'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
		),
		'the section fields must survive the save',
	);
}
