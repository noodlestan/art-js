// Case 13 — Inserting sibling records before and after an existing record.
//
// Hardcoded use case from `libs/records/knowledge/overview.md`:
// addRecord({ before }) and addRecord({ after }) insert a record at the
// anchor's depth within the same parent.
import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { type ArtRecord, createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';

export async function runTest(): Promise<void> {
	const workingDirectory = await copyFixtureCase(getFixtureDirectory(import.meta.url));

	const filename = join(workingDirectory, '_records', 'song.art');
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
	const records = await document.extract();
	function isFeelingGoodSong(record: ArtRecord): boolean {
		return record.name === 'Song: Feeling Good';
	}
	const song = records.find(isFeelingGoodSong);
	assert(song !== undefined, 'the anchor record must be present');

	const artist = document.addRecord({ before: song });
	artist.name = 'Artist: Nina Simone';
	assert(
		artist.__section.depth === 2,
		`a sibling inserted before keeps the anchor depth: ${artist.__section.depth}`,
	);
	// eslint-disable-next-line dot-notation
	artist['Born'] = 'Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.';

	const moduleRecord = document.addRecord({ after: song });
	moduleRecord.name = 'Module';
	assert(
		moduleRecord.__section.depth === 2,
		`a sibling inserted after keeps the anchor depth: ${moduleRecord.__section.depth}`,
	);

	await document.save();

	const content = await readFile(filename, 'utf-8');
	const artistHeadingPosition = content.indexOf('## Artist: Nina Simone');
	const songHeadingPosition = content.indexOf('## Song: Feeling Good');
	const moduleHeadingPosition = content.indexOf('## Module');
	assert(artistHeadingPosition >= 0, 'the before-insert must be written');
	assert(songHeadingPosition >= 0, 'the anchor heading must survive the save');
	assert(moduleHeadingPosition >= 0, 'the after-insert must be written');
	assert(
		artistHeadingPosition < songHeadingPosition,
		'the before-insert must precede the anchor heading',
	);
	assert(
		moduleHeadingPosition > songHeadingPosition,
		'the after-insert must follow the anchor heading',
	);
	assert(
		content.includes(
			'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
		),
		'the before-insert must carry the supplied Born field',
	);
	assert(content.includes('**Released:** June 1965'), 'the anchor fields must survive the save');
	assert(content.includes('- Leslie Bricusse'), 'the anchor list field must survive the save');
}
