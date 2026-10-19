// Case 10 — Batch saving across files, one save per document.
//
// Hardcoded use case from `knowledge/design/records.md`: the delivered FS
// adapter has no `batch()` method, so batch across files by creating one
// document collection per file and saving each collection once.
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
	const readableFiles = files.filter(file => file.error === undefined);
	assert(
		readableFiles.length === 2,
		`expected 2 readable files, got ${readableFiles.length}: ${files
			.map(file => file.path)
			.join(', ')}`,
	);

	const documents = await Promise.all(readableFiles.map(file => documentRecords.read(file)));
	const recordGroups = await Promise.all(documents.map(document => document.extract()));
	const allRecords = recordGroups.flat();
	assert(
		allRecords.length === 4,
		`expected 4 records across 2 files, got ${allRecords.length}: ${allRecords
			.map(record => record.name)
			.join(', ')}`,
	);

	for (const record of allRecords) {
		// eslint-disable-next-line dot-notation
		record['owner'] = 'foo';
	}

	await Promise.all(documents.map(document => document.save()));

	for (const file of readableFiles) {
		const content = await readFile(file.filename, 'utf-8');
		assert(
			/owner[^\n]*foo/.test(content),
			`batch save did not persist an owner field in ${file.path}`,
		);
	}
}
