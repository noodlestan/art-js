// Case 12 — Adding a record to an existing, populated document.
//
// Hardcoded use case from `libs/records/knowledge/overview.md`:
// recordsDocument.read(file) returns a collection whose addRecord()
// appends a source-bound handle to the document's children. The default
// is a first sectionBlock at h1 (depth 1); content that precedes that
// h1 stays in place.
import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';

export async function runTest(): Promise<void> {
	const workingDirectory = await copyFixtureCase(getFixtureDirectory(import.meta.url));

	const filename = join(workingDirectory, '_records', 'artist.art');
	const relativePath = relative(workingDirectory, filename);
	const destinationFile: FSRecordFile = {
		filename,
		basePath: workingDirectory,
		path: relativePath,
	};

	const codecOptions: PartialArtCodecConfig = {};
	const codec: ArtCodec = createArtCodec(codecOptions);
	const filesystemRecordsOptions = { basePath: workingDirectory, patterns: recordsPatterns };
	const filesystemRecords = createFSRecordsAdapter(filesystemRecordsOptions);
	function createContentSource(file: FSRecordFile) {
		return filesystemRecords.createContentSource(file);
	}
	const recordsDocumentOptions = { codec, createContentSource };
	const recordsDocument = createRecordsDocument<FSRecordFile>(recordsDocumentOptions);

	const document = await recordsDocument.read(destinationFile);
	assert(
		await document.hasRecord('Artist: Nina Simone'),
		'the pre-existing record must be present before the addition',
	);

	const record = document.addRecord();
	record.name = 'Song: Feeling Good';
	// eslint-disable-next-line dot-notation
	record['Artist'] = 'Nina Simone';
	// eslint-disable-next-line dot-notation
	record['Released'] = 'June 1965';
	assert(
		record.__section.depth === 1,
		`the default record section depth is 1: ${record.__section.depth}`,
	);
	await record.save();

	const content = await readFile(filename, 'utf-8');
	const existingHeadingPosition = content.indexOf('## Artist: Nina Simone');
	const addedHeadingPosition = content.indexOf('# Song: Feeling Good');
	assert(existingHeadingPosition >= 0, 'the pre-existing heading must survive the save');
	assert(
		addedHeadingPosition > existingHeadingPosition,
		'the new record heading must be appended after the pre-existing content',
	);
	assert(/^# Song: Feeling Good$/m.test(content), 'the added record must be a heading-1 section');
	assert(
		content.includes(
			'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
		),
		'the pre-existing fields must survive the save',
	);
	assert(
		content.includes('**Released:** June 1965'),
		'the added record must carry the supplied Released field',
	);
}
