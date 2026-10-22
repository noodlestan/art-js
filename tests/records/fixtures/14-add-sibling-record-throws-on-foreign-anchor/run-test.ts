// Case 14 (foreign anchor) — Sibling placement rejects anchors from another document.
//
// Hardcoded use case from `libs/records/knowledge/overview.md`:
// addRecord({ before }) and addRecord({ after }) require an anchor whose
// section is part of the collection's document; a record extracted from
// another file is rejected and nothing is inserted.
import { join, relative } from 'node:path';

import { type ArtRecord, createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { captureThrownMessage } from '../../src/captureThrownMessage.js';
import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';

export async function runTest(): Promise<void> {
	const workingDirectory = await copyFixtureCase(getFixtureDirectory(import.meta.url));

	const artistFilename = join(workingDirectory, '_records', 'artist.art');
	const artistFile: FSRecordFile = {
		filename: artistFilename,
		basePath: workingDirectory,
		path: relative(workingDirectory, artistFilename),
	};
	const songFilename = join(workingDirectory, '_records', 'song.art');
	const songFile: FSRecordFile = {
		filename: songFilename,
		basePath: workingDirectory,
		path: relative(workingDirectory, songFilename),
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

	const foreignDocument = await recordsDocument.read(artistFile);
	const foreignRecords = await foreignDocument.extract();
	function isNinaSimoneArtist(record: ArtRecord): boolean {
		return record.name === 'Artist: Nina Simone';
	}
	const foreignArtist = foreignRecords.find(isNinaSimoneArtist);
	assert(foreignArtist !== undefined, 'the foreign anchor must exist in its own document');
	const anchorRecord = foreignArtist;

	const document = await recordsDocument.read(songFile);
	const recordCount = (await document.extract()).length;

	function addBefore(): void {
		document.addRecord({ before: anchorRecord });
	}
	const beforeMessage = captureThrownMessage(addBefore);
	assert(
		beforeMessage === 'The placement anchor is not part of this document',
		`addRecord({ before }) must reject a foreign anchor: ${beforeMessage}`,
	);

	function addAfter(): void {
		document.addRecord({ after: anchorRecord });
	}
	const afterMessage = captureThrownMessage(addAfter);
	assert(
		afterMessage === 'The placement anchor is not part of this document',
		`addRecord({ after }) must reject a foreign anchor: ${afterMessage}`,
	);

	const updatedCount = (await document.extract()).length;
	assert(updatedCount === recordCount, 'a rejected placement must not insert a section');
}
