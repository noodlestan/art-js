// Case 15 — Appending and prepending records under an existing parent record.
//
// Hardcoded use case from `libs/records/knowledge/overview.md`:
// addRecord({ appendTo }) and addRecord({ prependTo }) add child records
// at parent depth + 1; the appended record closes the parent section, the
// prepended one opens it.
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
	const records = await document.extract();
	function isNinaSimoneArtist(record: ArtRecord): boolean {
		return record.name === 'Artist: Nina Simone';
	}
	const artist = records.find(isNinaSimoneArtist);
	assert(artist !== undefined, 'the parent record must be present');

	const appendedSong = document.addRecord({ appendTo: artist });
	appendedSong.name = 'Song: Feeling Good';
	assert(
		appendedSong.__section.depth === 3,
		`an appended child sits at parent depth + 1: ${appendedSong.__section.depth}`,
	);
	// eslint-disable-next-line dot-notation
	appendedSong['Artist'] = 'Nina Simone';
	// eslint-disable-next-line dot-notation
	appendedSong['Released'] = 'June 1965';

	const prependedModule = document.addRecord({ prependTo: artist });
	prependedModule.name = 'Module';
	assert(
		prependedModule.__section.depth === 3,
		`a prepended child sits at parent depth + 1: ${prependedModule.__section.depth}`,
	);

	await document.save();

	const content = await readFile(filename, 'utf-8');
	const artistHeadingPosition = content.indexOf('## Artist: Nina Simone');
	const moduleHeadingPosition = content.indexOf('### Module');
	const songHeadingPosition = content.indexOf('### Song: Feeling Good');
	assert(artistHeadingPosition >= 0, 'the parent heading must survive the save');
	assert(
		moduleHeadingPosition > artistHeadingPosition,
		'the prepended child must sit inside the parent section',
	);
	assert(
		songHeadingPosition > moduleHeadingPosition,
		'the appended child must follow the prepended child',
	);
	assert(
		content.includes('**Released:** June 1965'),
		'the appended child must carry the supplied Released field',
	);
	assert(
		content.trimEnd().endsWith('**Released:** June 1965'),
		'the appended child must close the parent section',
	);
}
