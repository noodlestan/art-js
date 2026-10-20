// Case 08 — Deleting a field removes it from the section.
//
// Hardcoded use case from `knowledge/design/records.md`: deleting a field
// removes it, and the capsule is the single mutation seam behind the public
// record proxy.
//
// Fields are deleted with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature`.
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
		fieldNames(project).join(',') === 'purpose,owner',
		`unexpected fixture fields: ${fieldNames(project).join(', ')}`,
	);

	// eslint-disable-next-line dot-notation
	const removed = delete project['owner'];
	assert(removed === true, 'deleting an existing field must report true');
	// eslint-disable-next-line dot-notation
	assert(project['owner'] === undefined, 'the deleted field must read as undefined');
	assert(
		fieldNames(project).join(',') === 'purpose',
		`only purpose must remain: ${fieldNames(project).join(', ')}`,
	);

	await project.save();

	const content = await readFile(join(workDir, '_records', 'project.art'), 'utf-8');
	assert(!content.includes('**owner:**'), 'saved file must not contain the owner field');
	assert(content.includes('**purpose:**'), 'saved file must keep the purpose field');
}
