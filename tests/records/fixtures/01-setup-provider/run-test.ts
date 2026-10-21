// Case 01 — Setup: codec, FS adapter, and records provider.
//
// Hardcoded use case from `knowledge/design/records.md`: Art Work creates the
// codec and injects it into the records provider. The provider receives a
// callback that creates one content source for each file.
import { join } from 'node:path';

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
	function isArtistRecordFile(file: FSRecordFile): boolean {
		const artistFilename = join(workingDirectory, '_records', 'artist.art');
		return file.filename === artistFilename;
	}
	const artistFile = files.find(isArtistRecordFile);
	assert(artistFile !== undefined, 'discovery did not return _records/artist.art');
	assert(artistFile.error === undefined, `discovery error: ${String(artistFile.error)}`);

	const contentSource = filesystemRecords.createContentSource(artistFile);
	assert(contentSource.type === 'fs', 'the content source must be filesystem backed');
	assert(
		contentSource.uri.endsWith('/_records/artist.art'),
		`unexpected content source uri: ${contentSource.uri}`,
	);

	const document = await recordsDocument.read(artistFile);
	assert(typeof document.extract === 'function', 'extract must be a function');
	assert(typeof document.save === 'function', 'save must be a function');
}
