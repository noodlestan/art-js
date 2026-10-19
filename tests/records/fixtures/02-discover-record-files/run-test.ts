// Case 02 — Finding records: discovery filters filenames, not headings.
//
// Hardcoded use case from `knowledge/design/records.md`: discover without a
// kind filter, then interpret the complete heading name after parsing. Files
// that do not match `**/_records/**/*.art` must not be discovered.
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
	const paths = files.map(file => file.path).sort();

	assert(paths.length === 2, `expected 2 record files, got ${paths.length}: ${paths.join(', ')}`);
	assert(paths[0] === '_records/project.art', `unexpected path: ${String(paths[0])}`);
	assert(paths[1] === '_records/repository.art', `unexpected path: ${String(paths[1])}`);
	assert(
		!paths.some(path => path.endsWith('.md')),
		`a non-.art file was discovered: ${paths.join(', ')}`,
	);
	assert(!paths.some(path => path === 'outside.art'), 'a record outside _records/ was discovered');

	const projectFile = files.find(file => file.path === '_records/project.art');
	assert(projectFile !== undefined, '_records/project.art was not discovered');
	assert(projectFile.error === undefined, `discovery error: ${String(projectFile.error)}`);
	assert(
		projectFile.filename === join(workDir, '_records', 'project.art'),
		`filename must be absolute: ${projectFile.filename}`,
	);
	assert(projectFile.basePath === workDir, `basePath mismatch: ${projectFile.basePath}`);

	const document = await documentRecords.read(projectFile);
	assert(await document.assertPresence('Project: Art JS'), 'Project: Art JS must be present');
}
