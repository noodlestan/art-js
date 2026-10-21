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

import { createRecordsDocument } from '@art-js/records';
import type { ArtRecord, RecordsDocumentBase } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import { assert } from '../../src/assert.js';
import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { findRecordFileByPath } from '../../src/findRecordFileByPath.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';

export async function runTest(): Promise<void> {
	const workingDirectory = await copyFixtureCase(getFixtureDirectory(import.meta.url));

	const codecOptions: PartialArtCodecConfig = {};
	const codec: ArtCodec = createArtCodec(codecOptions);
	const filesystemRecordsOptions = { basePath: workingDirectory, patterns: recordsPatterns };
	const filesystemRecords = createFSRecordsAdapter(filesystemRecordsOptions);
	function createContentSource(file: FSRecordFile) {
		return filesystemRecords.createContentSource(file);
	}
	const recordsDocumentOptions = { codec, createContentSource };
	const recordsDocument = createRecordsDocument<FSRecordFile>(recordsDocumentOptions);

	const files = await filesystemRecords.discoverRecordFiles();
	function isReadableFile(file: FSRecordFile): boolean {
		return file.error === undefined;
	}
	const readableFiles = files.filter(isReadableFile);
	assert(readableFiles.length === 2, `expected 2 readable files, got ${readableFiles.length}`);
	const artistFile = findRecordFileByPath(readableFiles, '_records/artist.art');
	const songFile = findRecordFileByPath(readableFiles, '_records/song.art');
	assert(artistFile !== undefined, '_records/artist.art was not discovered');
	assert(songFile !== undefined, '_records/song.art was not discovered');

	async function readRecordsDocument(file: FSRecordFile): Promise<RecordsDocumentBase> {
		return recordsDocument.read(file);
	}
	const recordsFiles = [artistFile, songFile];
	const documents = await Promise.all(recordsFiles.map(readRecordsDocument));
	async function extractDocumentRecords(document: RecordsDocumentBase): Promise<ArtRecord[]> {
		return document.extract();
	}
	const recordGroups = await Promise.all(documents.map(extractDocumentRecords));
	const allRecords = recordGroups.flat();
	function getRecordName(record: ArtRecord): string {
		return record.name;
	}
	const recordNames = allRecords.map(getRecordName);
	assert(
		allRecords.length === 2,
		`expected 2 records across 2 files, got ${allRecords.length}: ${recordNames.join(', ')}`,
	);
	assert(recordNames.includes('Artist: Nina Simone'), 'Artist: Nina Simone must be extracted');
	assert(recordNames.includes('Song: Feeling Good'), 'Song: Feeling Good must be extracted');

	for (const record of allRecords) {
		if (record.name === 'Artist: Nina Simone') {
			// eslint-disable-next-line dot-notation
			record['Born'] = 'Eunice Kathleen Waymon';
		}
		if (record.name === 'Song: Feeling Good') {
			// eslint-disable-next-line dot-notation
			record['Artist'] = 'Nina Simone';
		}
	}

	async function saveRecordsDocument(document: RecordsDocumentBase): Promise<void> {
		await document.save();
	}
	await Promise.all(documents.map(saveRecordsDocument));

	const artistContent = await readFile(artistFile.filename, 'utf-8');
	const songContent = await readFile(songFile.filename, 'utf-8');
	assert(artistContent.includes('**Born:** Eunice Kathleen Waymon'), 'Artist data must be saved');
	assert(songContent.includes('**Artist:** Nina Simone'), 'Song data must be saved');
}
