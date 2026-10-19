// Case 11 — One save writes every in-memory record of a document.
//
// Hardcoded use case from `knowledge/design/records.md`: saving one
// DocumentRecords collection writes its containing document and may include
// other in-memory record mutations in that document.
//
// Fields are written with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature` and ArtRecord resolves unknown fields
// through its string index signature.
import { readFile } from 'node:fs/promises';

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
	const projectFile = files.find(file => file.path === '_records/project.art');
	assert(projectFile !== undefined, '_records/project.art was not discovered');

	const document = await documentRecords.read(projectFile);
	const records = await document.extract();
	const project = records.find(record => record.name === 'Project: Art JS');
	const repository = records.find(record => record.name === 'Repository: Art JS');
	assert(project !== undefined, 'Project: Art JS was not extracted');
	assert(repository !== undefined, 'Repository: Art JS was not extracted');

	// eslint-disable-next-line dot-notation
	project['maintainer'] = 'foo';
	// eslint-disable-next-line dot-notation
	repository['maintainer'] = 'bar';

	// One save for the whole document collection.
	await document.save();

	const content = await readFile(projectFile.filename, 'utf-8');
	assert(/maintainer[^\n]*foo/.test(content), 'the first in-memory mutation must be saved');
	assert(/maintainer[^\n]*bar/.test(content), 'the second in-memory mutation must be saved');
}
