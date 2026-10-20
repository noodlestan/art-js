// Case 06 — renameField() changes the label in place and preserves position.
//
// Hardcoded use case from `knowledge/design/records.md`: renaming a field
// changes its label in place and preserves its position; the record heading is
// identity and cannot be renamed after extraction.
//
// Fields are written with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature` and ArtRecord resolves unknown fields
// through its string index signature.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createRecordsDocument } from '@art-js/records';
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
	const recordsDocument = createRecordsDocument<FSRecordFile>({
		codec,
		createContentSource: file => fsRecords.createContentSource(file),
	});

	const files = await fsRecords.discoverRecordFiles();
	const projectFile = files.find(file => file.path === '_records/project.art');
	assert(projectFile !== undefined, '_records/project.art was not discovered');

	const document = await recordsDocument.read(projectFile);
	const records = await document.extract();
	const project = records.find(record => record.name === 'Project: Art JS');
	assert(project !== undefined, 'Project: Art JS was not extracted');

	assert(
		fieldNames(project).join(',') === 'purpose,owner,author',
		`unexpected fixture fields: ${fieldNames(project).join(', ')}`,
	);
	assert(project.name === 'Project: Art JS', 'the record heading is identity');

	project.renameField('owner', 'maintainer');
	assert(
		fieldNames(project).join(',') === 'purpose,maintainer,author',
		`renameField must preserve position: ${fieldNames(project).join(', ')}`,
	);
	assert(
		// eslint-disable-next-line dot-notation
		project['maintainer'] === 'Project: Art JS',
		// eslint-disable-next-line dot-notation
		`renamed field must keep its value: ${String(project['maintainer'])}`,
	);
	// eslint-disable-next-line dot-notation
	assert(project['owner'] === undefined, 'the old field name must be gone');

	// eslint-disable-next-line dot-notation
	project['maintainer'] = 'foo';
	await project.save();

	const content = await readFile(join(workDir, '_records', 'project.art'), 'utf-8');
	assert(/maintainer[^\n]*foo/.test(content), 'saved file must contain the renamed field');
	assert(!content.includes('**owner:**'), 'saved file must not contain the old field label');
}
