// Case 09 — Creating a new record in a new destination file.
//
// Hardcoded use case from `libs/records/knowledge/design/records.md`:
// recordsDocument.create(file) creates an empty document collection, and
// addRecord() appends a source-bound handle that can save the new file.
import { access, mkdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { RECORDS_PATTERNS, copyFixtureCase, fixtureDirOf } from '../../src/fixtures.js';

export async function runTest(): Promise<void> {
	const workDir = await copyFixtureCase(fixtureDirOf(import.meta.url));

	const recordsDirectory = join(workDir, '_records');
	await mkdir(recordsDirectory, { recursive: true });

	const filename = join(recordsDirectory, 'project.art');
	const destinationFile: FSRecordFile = {
		filename,
		basePath: workDir,
		path: relative(workDir, filename),
	};

	const existsBefore = await access(filename).then(
		() => true,
		() => false,
	);
	assert(!existsBefore, 'the destination file must not exist before save()');

	const codecOptions: PartialArtCodecConfig = {};
	const codec: ArtCodec = createArtCodec(codecOptions);
	const fsRecords = createFSRecordsAdapter({ basePath: workDir, patterns: RECORDS_PATTERNS });
	const recordsDocument = createRecordsDocument<FSRecordFile>({
		codec,
		createContentSource: file => fsRecords.createContentSource(file),
	});
	const document = await recordsDocument.create(destinationFile);
	const record = document.addRecord();

	assert(record.name === '', `a new record starts with an empty name: ${record.name}`);
	assert(
		record.__section.construct === 'SectionBlock',
		`a new record starts with a SectionBlock: ${record.__section.construct}`,
	);

	// The design requires a non-empty name before saving: expect this rejection.
	const rejection = await record.save().then(
		() => undefined,
		(error: unknown) => error,
	);
	assert(rejection instanceof Error, 'saving a record without a name must fail');

	record.name = 'Project: Art JS';
	record.__section.depth = 2;
	// eslint-disable-next-line dot-notation
	record['owner'] = 'foo';
	await record.save();

	const content = await readFile(filename, 'utf-8');
	assert(/^## Project: Art JS$/m.test(content), 'created file must contain the record heading');
	assert(/owner[^\n]*foo/.test(content), 'created file must contain the owner field');
}
