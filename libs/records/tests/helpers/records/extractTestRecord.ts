import { createArtCodec } from '@art-md/codec';

import { type ArtRecord, createRecordsDocument } from '../../../src/index.js';
import { type AdapterMock, type AdapterMockFile, createAdapterMock } from '../adapter/index.js';

import { findRecordByName } from './findRecordByName.js';
import { findRecordFileByPath } from './findRecordFileByPath.js';

const TEST_DOCUMENT_PATH = '_records/test.art';

export type TestRecordExtraction = {
	readonly record: ArtRecord;
	readonly filesystemRecords: AdapterMock;
};

/**
 * Extracts `recordName` from an in-memory document built from `documentContent`.
 *
 * @provides the extracted record, bound to the mock content source, and the
 * mock itself so tests can read the content written back on save.
 */
export async function extractTestRecord(
	documentContent: string,
	recordName: string,
): Promise<TestRecordExtraction> {
	const codec = createArtCodec({});
	const filesystemRecords = createAdapterMock({
		basePath: 'test',
		files: { [TEST_DOCUMENT_PATH]: documentContent },
	});

	function createContentSource(file: AdapterMockFile) {
		return filesystemRecords.createContentSource(file);
	}

	const recordsDocument = createRecordsDocument<AdapterMockFile>({ codec, createContentSource });
	const files = await filesystemRecords.discoverRecordFiles();
	const file = findRecordFileByPath(files, TEST_DOCUMENT_PATH);

	if (file === undefined) {
		throw new Error(`${TEST_DOCUMENT_PATH} was not discovered`);
	}

	const document = await recordsDocument.read(file);
	const records = await document.extract();
	const record = findRecordByName(records, recordName);

	if (record === undefined) {
		throw new Error(`${recordName} was not extracted`);
	}

	return { record, filesystemRecords };
}
