// Case 07 — Deleting a field removes it from the section.
//
// Hardcoded use case from `knowledge/design/records.md`: deleting a field
// removes it, and the capsule is the single mutation seam behind the public
// record proxy.
//
// Fields are deleted with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature`.
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
import { getFieldNames } from '../../src/getFieldNames.js';
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
		getFieldNames(artist).join(',') === 'Born,Years active',
		`unexpected fixture fields: ${getFieldNames(artist).join(', ')}`,
	);

	// eslint-disable-next-line dot-notation
	const removed = delete artist['Born'];
	assert(removed === true, 'deleting an existing field must report true');
	// eslint-disable-next-line dot-notation
	assert(artist['Born'] === undefined, 'the deleted field must read as undefined');
	assert(
		getFieldNames(artist).join(',') === 'Years active',
		`only Years active must remain: ${getFieldNames(artist).join(', ')}`,
	);

	await artist.save();

	const content = await readFile(join(workingDirectory, '_records', 'artist.art'), 'utf-8');
	assert(!content.includes('**Born:**'), 'saved file must not contain Born');
	assert(content.includes('**Years active:**'), 'saved file must keep Years active');
}
