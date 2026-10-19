// Case 05 — Setting a missing field appends it to the section.
//
// Hardcoded use case from `knowledge/design/records.md`: setting a missing
// field appends a new inline field, and `save()` persists the document through
// the record's source.
//
// Fields are written with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature` and ArtRecord resolves unknown fields
// through its string index signature.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtDocumentRecords } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { fieldNames } from '../../src/fields.js';
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
	assert(project !== undefined, 'Project: Art JS was not extracted');

	assert(
		fieldNames(project).join(',') === 'purpose',
		`fixture must start with purpose only: ${fieldNames(project).join(', ')}`,
	);
	// eslint-disable-next-line dot-notation
	assert(project['owner'] === undefined, 'fixture must start without an owner field');

	// eslint-disable-next-line dot-notation
	project['owner'] = 'foo';
	// eslint-disable-next-line dot-notation
	assert(project['owner'] === 'foo', `field did not read back: ${String(project['owner'])}`);
	const names = fieldNames(project);
	assert(
		names[names.length - 1] === 'owner',
		`a missing field must be appended last: ${names.join(', ')}`,
	);

	await project.save();

	const content = await readFile(join(workDir, '_records', 'project.art'), 'utf-8');
	assert(/owner[^\n]*foo/.test(content), 'saved file must contain an owner field set to foo');
}
