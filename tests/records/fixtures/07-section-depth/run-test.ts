// Case 07 — record.__section exposes the complete SectionBlock and its depth.
//
// Hardcoded use case from `knowledge/design/records.md`: consumers change
// section properties through `record.__section`, then call `record.save()`.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createRecordsDocument } from '@art-js/records';
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
		project.__section.construct === 'SectionBlock',
		`record.__section must be a SectionBlock: ${project.__section.construct}`,
	);

	project.__section.depth = 3;
	await project.save();

	const content = await readFile(join(workDir, '_records', 'project.art'), 'utf-8');
	assert(/^### Project: Art JS$/m.test(content), 'saved heading must be written at depth 3 (###)');
	assert(
		!/^## Project: Art JS$/m.test(content),
		'saved heading must no longer be written at depth 2 (##)',
	);
}
