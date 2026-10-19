// Case 01 — Setup: codec, FS adapter, and records provider.
//
// Hardcoded use case from `knowledge/design/records.md`: Art Work creates the
// codec and injects it into the records provider. The provider receives a
// callback that creates one content source for each file.
import { join } from 'node:path';

import { createArtDocumentRecords } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { RECORDS_PATTERNS, copyFixtureCase, fixtureDirOf } from '../../src/fixtures.js';

export async function runTest(): Promise<void> {
	const workDir = await copyFixtureCase(fixtureDirOf(import.meta.url));

	const codecOptions: PartialArtCodecConfig = {};
	const codec: ArtCodec = createArtCodec(codecOptions);
	const fsRecords = createFSRecordsAdapter({ basePath: workDir, patterns: RECORDS_PATTERNS });
	const documentRecords = createArtDocumentRecords<FSRecordFile>({
		codec,
		createContentSource: file => fsRecords.createContentSource(file),
	});

	const files = await fsRecords.discoverRecordFiles();
	const projectFile = files.find(
		file => file.filename === join(workDir, '_records', 'project.art'),
	);
	assert(projectFile !== undefined, 'discovery did not return _records/project.art');
	assert(projectFile.error === undefined, `discovery error: ${String(projectFile.error)}`);

	const contentSource = fsRecords.createContentSource(projectFile);
	assert(contentSource.type === 'fs', 'the content source must be filesystem backed');
	assert(
		contentSource.uri.endsWith('/_records/project.art'),
		`unexpected content source uri: ${contentSource.uri}`,
	);

	const document = await documentRecords.read(projectFile);
	assert(typeof document.assertPresence === 'function', 'assertPresence must be a function');
	assert(typeof document.extract === 'function', 'extract must be a function');
	assert(typeof document.save === 'function', 'save must be a function');
}
