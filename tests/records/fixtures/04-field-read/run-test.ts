// Case 04 — Field reads resolve by exact field name.
//
// Hardcoded use case from `knowledge/design/records.md`: a field property such
// as `record.owner` resolves by exact field name against the section's
// FieldInline or FieldBlock children.
//
// Fields are read with brackets because this repository's tsconfig sets
// `noPropertyAccessFromIndexSignature` and ArtRecord resolves unknown fields
// through its string index signature. Each bracket access carries an
// `eslint-disable-next-line dot-notation`, the one rule that contradicts it.
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
	const packageFile = files.find(file => file.path === '_records/package.art');
	assert(packageFile !== undefined, '_records/package.art was not discovered');

	const document = await documentRecords.read(packageFile);
	const records = await document.extract();
	const record = records.find(candidate => candidate.name === 'Package: Records');
	assert(record !== undefined, 'Package: Records was not extracted');

	// eslint-disable-next-line dot-notation
	const owner = record['owner'];
	assert(owner === 'Project: Art JS', `inline field read returned: ${JSON.stringify(owner)}`);
	assert(
		// eslint-disable-next-line dot-notation
		record['Owner'] === undefined,
		'field lookup must match the field name exactly, including case',
	);

	// eslint-disable-next-line dot-notation
	const purpose = record['purpose'];
	assert(
		typeof purpose === 'string' && purpose.length > 0,
		`block field read returned: ${JSON.stringify(purpose)}`,
	);

	// eslint-disable-next-line dot-notation
	const keywords = record['keywords'];
	assert(
		typeof keywords === 'string' && keywords.includes('art'),
		`list field read returned: ${JSON.stringify(keywords)}`,
	);

	// eslint-disable-next-line dot-notation
	assert(record['missing'] === undefined, 'an unknown field must read as undefined');
	assert('owner' in record, "'owner' must resolve through the section fields");
	assert(!('missing' in record), "'missing' must not resolve through the section fields");
}
