// Case 10 — One save writes every in-memory record of a document.
//
// Hardcoded use case from `knowledge/design/records.md`: saving one
// RecordsDocumentCollection writes its containing document and may include
// other in-memory record mutations in that document.
//
// Fields are written with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature` and ArtRecord resolves unknown fields
// through its string index signature.
import { readFile } from 'node:fs/promises';

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
	const song = findRecordByName(records, 'Song: Feeling Good');
	assert(artist !== undefined, 'Artist: Nina Simone was not extracted');
	assert(song !== undefined, 'Song: Feeling Good was not extracted');

	// eslint-disable-next-line dot-notation
	artist['Years active'] = '1954–2003';
	// eslint-disable-next-line dot-notation
	song['Artist'] = 'Nina Simone';

	// One save for the whole document collection.
	await document.save();

	const content = await readFile(artistFile.filename, 'utf-8');
	assert(content.includes('**Years active:** 1954–2003'), 'the Artist field must be saved');
	assert(content.includes('**Artist:** Nina Simone'), 'the Song field must be saved');
}
