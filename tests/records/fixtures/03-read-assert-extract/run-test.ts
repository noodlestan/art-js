// Case 03 — Reading and extracting: hasRecord() and extract().
//
// Hardcoded use case from `knowledge/design/records.md`: extract() returns one
// proxy handle for each Artist and nested Song SectionBlock.
// The heading name is the complete heading text.
import { createRecordsDocument } from '@art-js/records';
import type { ArtRecord } from '@art-js/records';
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
	assert(await document.hasRecord('Artist: Nina Simone'), 'Artist: Nina Simone must be present');
	assert(await document.hasRecord('Song: Feeling Good'), 'Song: Feeling Good must be present');
	assert(!(await document.hasRecord('Artist: Missing')), 'Artist: Missing must not be present');

	const records = await document.extract();
	function getRecordName(record: ArtRecord): string {
		return record.name;
	}
	const names = records.map(getRecordName);
	assert(names.length === 3, `expected 3 records, got ${names.length}: ${names.join(', ')}`);
	assert(
		names[0] === 'Module',
		`the field-less Module section must be extracted first: ${names.join(', ')}`,
	);
	assert(
		names.includes('Artist: Nina Simone'),
		`missing Artist: Nina Simone in: ${names.join(', ')}`,
	);
	assert(
		names.includes('Song: Feeling Good'),
		`missing Song: Feeling Good in: ${names.join(', ')}`,
	);

	const moduleRecord = findRecordByName(records, 'Module');
	const artistRecord = findRecordByName(records, 'Artist: Nina Simone');
	const songRecord = findRecordByName(records, 'Song: Feeling Good');
	assert(moduleRecord !== undefined, 'Module record was not extracted');
	assert(artistRecord !== undefined, 'Artist: Nina Simone was not extracted');
	assert(songRecord !== undefined, 'Song: Feeling Good was not extracted');
	const artistDepth = artistRecord.__section.depth;
	const songDepth = songRecord.__section.depth;
	assert(artistDepth !== undefined && songDepth !== undefined, 'section depths must be present');
	assert(
		getFieldNames(moduleRecord).length === 0,
		`the Module section must be field-less: ${getFieldNames(moduleRecord).join(', ')}`,
	);
	assert(songDepth > artistDepth, 'the Song section must be nested');

	for (const record of records) {
		assert(
			record.__section.name === record.name,
			`section name does not match record name: ${record.__section.name}`,
		);
		assert(typeof record.save === 'function', `record ${record.name} has no save()`);
	}
}
