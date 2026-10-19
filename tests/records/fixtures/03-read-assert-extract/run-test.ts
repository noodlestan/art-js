// Case 03 — Reading and extracting: assertPresence() and extract().
//
// Hardcoded use case from `knowledge/design/records.md`: extract() returns one
// proxy handle per SectionBlock, at any depth, including field-less sections.
// The heading name is the complete heading text.
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
	assert(await document.assertPresence('Project: Art JS'), 'Project: Art JS must be present');
	assert(
		!(await document.assertPresence('Project: Missing')),
		'Project: Missing must not be present',
	);

	const records = await document.extract();
	const names = records.map(record => record.name);
	assert(names.length === 3, `expected 3 records, got ${names.length}: ${names.join(', ')}`);
	assert(
		names[0] === 'Module',
		`the field-less Module section must be extracted: ${names.join(', ')}`,
	);
	assert(names.includes('Project: Art JS'), `missing Project: Art JS in: ${names.join(', ')}`);
	assert(
		names.includes('Package: Records'),
		`nested sections must be extracted: ${names.join(', ')}`,
	);

	const moduleRecord = records.find(record => record.name === 'Module');
	assert(moduleRecord !== undefined, 'Module record was not extracted');
	assert(
		fieldNames(moduleRecord).length === 0,
		`the Module section must be field-less: ${fieldNames(moduleRecord).join(', ')}`,
	);

	for (const record of records) {
		assert(
			record.__section.name === record.name,
			`section name does not match record name: ${record.__section.name}`,
		);
		assert(typeof record.save === 'function', `record ${record.name} has no save()`);
	}
}
