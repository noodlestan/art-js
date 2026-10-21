// Case 06 — renameField() changes the label in place and preserves position.
//
// Hardcoded use case from `knowledge/design/records.md`: renaming a field
// changes its label in place and preserves its position; the record heading is
// identity and cannot be renamed after extraction.
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
		`unexpected fixture fields: ${getFieldNames(artist).join(', ')}`,
	);
	assert(artist.name === 'Artist: Nina Simone', 'the record heading is identity');

	artist.renameField('Born', 'Artist');
	assert(
		getFieldNames(artist).join(',') === 'Artist,Years active',
		`renameField must preserve position: ${getFieldNames(artist).join(', ')}`,
	);
	assert(
		// eslint-disable-next-line dot-notation
		artist['Artist'] === 'Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
		// eslint-disable-next-line dot-notation
		`renamed field must keep its value: ${String(artist['Artist'])}`,
	);
	// eslint-disable-next-line dot-notation
	assert(artist['Born'] === undefined, 'the old field name must be gone');

	// eslint-disable-next-line dot-notation
	artist['Artist'] = 'Nina Simone';
	await artist.save();

	const content = await readFile(join(workingDirectory, '_records', 'artist.art'), 'utf-8');
	assert(content.includes('**Artist:** Nina Simone'), 'saved file must contain the renamed field');
	assert(!content.includes('**Born:**'), 'saved file must not contain the old field label');
}
