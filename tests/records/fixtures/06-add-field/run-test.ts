// Case 06 — Setting a missing field appends it to the section.
//
// Hardcoded use case from `knowledge/design/records.md`: setting a missing
// field appends a new inline field, and `save()` persists the document through
// the record's source.
//
// Fields are written with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature` and ArtRecord resolves unknown fields
// through its string index signature.
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
		`fixture must start with Born and Years active: ${getFieldNames(artist).join(', ')}`,
	);
	// eslint-disable-next-line dot-notation
	assert(artist['Artist'] === undefined, 'fixture must start without an Artist field');

	// eslint-disable-next-line dot-notation
	artist['Artist'] = 'Nina Simone';
	assert(
		// eslint-disable-next-line dot-notation
		artist['Artist'] === 'Nina Simone',
		// eslint-disable-next-line dot-notation
		`field did not read back: ${String(artist['Artist'])}`,
	);
	const names = getFieldNames(artist);
	assert(
		names[names.length - 1] === 'Artist',
		`a missing field must be appended last: ${names.join(', ')}`,
	);

	await artist.save();

	const content = await readFile(join(workingDirectory, '_records', 'artist.art'), 'utf-8');
	assert(content.includes('**Artist:** Nina Simone'), 'saved file must contain the Artist field');
}
