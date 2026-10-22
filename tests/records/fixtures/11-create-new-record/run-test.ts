// Case 11 — Creating a new record in a new destination file.
//
// Hardcoded use case from `libs/records/knowledge/design/records.md`:
// recordsDocument.create(file) creates an empty document collection, and
// addRecord() appends a source-bound handle that can save the new file.
// The default first record on an empty file is a sectionBlock at h1
// (depth 1) appended to the document's children.
import { access, mkdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';

export async function runTest(): Promise<void> {
	const workingDirectory = await copyFixtureCase(getFixtureDirectory(import.meta.url));

	const recordsDirectory = join(workingDirectory, '_records');
	await mkdir(recordsDirectory, { recursive: true });

	const filename = join(recordsDirectory, 'artist.art');
	const relativePath = relative(workingDirectory, filename);
	const destinationFile: FSRecordFile = {
		filename,
		basePath: workingDirectory,
		path: relativePath,
	};

	function isFileAccessible(): boolean {
		return true;
	}
	function isFileInaccessible(): boolean {
		return false;
	}
	const existsBefore = await access(filename).then(isFileAccessible, isFileInaccessible);
	assert(!existsBefore, 'the destination file must not exist before save()');

	const codecOptions: PartialArtCodecConfig = {};
	const codec: ArtCodec = createArtCodec(codecOptions);
	const filesystemRecordsOptions = { basePath: workingDirectory, patterns: recordsPatterns };
	const filesystemRecords = createFSRecordsAdapter(filesystemRecordsOptions);
	function createContentSource(file: FSRecordFile) {
		return filesystemRecords.createContentSource(file);
	}
	const recordsDocumentOptions = { codec, createContentSource };
	const recordsDocument = createRecordsDocument<FSRecordFile>(recordsDocumentOptions);
	const document = await recordsDocument.create(destinationFile);
	const record = document.addRecord();

	assert(record.name === '', `a new record starts with an empty name: ${record.name}`);
	assert(
		record.__section.construct === 'SectionBlock',
		`a new record starts with a SectionBlock: ${record.__section.construct}`,
	);
	assert(
		record.__section.depth === 1,
		`a new record defaults to section depth 1: ${record.__section.depth}`,
	);

	// The design requires a non-empty name before saving: expect this rejection.
	function returnNoError(): undefined {
		return undefined;
	}
	function returnSaveError(error: unknown): unknown {
		return error;
	}
	const rejection = await record.save().then(returnNoError, returnSaveError);
	assert(rejection instanceof Error, 'saving a record without a name must fail');

	record.name = 'Artist: Nina Simone';
	// eslint-disable-next-line dot-notation
	record['Born'] = 'Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.';
	await record.save();

	const content = await readFile(filename, 'utf-8');
	assert(/^# Artist: Nina Simone$/m.test(content), 'created file must contain the record heading');
	assert(
		content.includes(
			'**Born:** Eunice Kathleen Waymon | February 21, 1933 | Tryon, North Carolina, U.S.',
		),
		'created file must contain the supplied Born field',
	);
}
