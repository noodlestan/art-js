// Case 04 — Field reads resolve by exact field name.
//
// Hardcoded use case from `knowledge/design/records.md`: a field property such
// as `record.Artist` resolves by exact field name against the section's
// FieldInline or FieldBlock children.
//
// Fields are read with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature` and ArtRecord resolves unknown fields
// through its string index signature. Each bracket access carries an
// `eslint-disable-next-line dot-notation`, the one rule that contradicts it.
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
	const songFile = findRecordFileByPath(files, '_records/song.art');
	assert(songFile !== undefined, '_records/song.art was not discovered');

	const document = await recordsDocument.read(songFile);
	const records = await document.extract();
	const song = findRecordByName(records, 'Song: Feeling Good');
	assert(song !== undefined, 'Song: Feeling Good was not extracted');

	// eslint-disable-next-line dot-notation
	const artist = song['Artist'];
	assert(artist === 'Nina Simone', `Artist field read returned: ${JSON.stringify(artist)}`);
	assert(
		// eslint-disable-next-line dot-notation
		song['artist'] === undefined,
		'field lookup must match the field name exactly, including case',
	);

	// eslint-disable-next-line dot-notation
	const released = song['Released'];
	assert(released === 'June 1965', `Released field read returned: ${JSON.stringify(released)}`);

	// eslint-disable-next-line dot-notation
	const fieldNames = getFieldNames(song);
	assert(fieldNames.join(',') === 'Artist,Released', `unexpected fields: ${fieldNames.join(', ')}`);
	const sectionContent = JSON.stringify(song.__section);
	assert(
		sectionContent.includes('Writter(s):'),
		'section must preserve the supplied Writter(s) label',
	);
	assert(sectionContent.includes('Leslie Bricusse'), 'section must preserve Leslie Bricusse');
	assert(sectionContent.includes('Anthony Newley'), 'section must preserve Anthony Newley');

	// eslint-disable-next-line dot-notation
	assert(song['missing'] === undefined, 'an unknown field must read as undefined');
	assert('Artist' in song, "'Artist' must resolve through the section fields");
	assert(!('missing' in song), "'missing' must not resolve through the section fields");
}
