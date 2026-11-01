import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type ArtRecord, createRecordsDocument } from '../../../src/index.js';
import {
	type AdapterMock,
	type AdapterMockFile,
	createAdapterMock,
} from '../../helpers/adapter/index.js';
import { copyFixtureCase, getFixtureDirectory } from '../../helpers/fixtures/index.js';
import {
	extractTestRecord,
	findRecordByName,
	findRecordFileByPath,
	getFieldNames,
} from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 18 — A canonical name update preserves the loaded label and untouched structure', () => {
	let workingDirectory: string;
	let originalContent: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codec = createArtCodec({});
		originalContent = await readFile(join(workingDirectory, '_records', 'package.art'), 'utf-8');
		const fixtureFiles = {
			'_records/package.art': originalContent,
		};

		filesystemRecords = createAdapterMock({ basePath: workingDirectory, files: fixtureFiles });

		function createContentSource(file: AdapterMockFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<AdapterMockFile>(recordsDocumentOptions);
	});

	describe('GIVEN the Package: Records record', () => {
		let record: ArtRecord;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const packageFile = findRecordFileByPath(files, '_records/package.art');

			expect(packageFile).toBeDefined();
			if (packageFile === undefined) {
				throw new Error('_records/package.art was not discovered');
			}

			const document = await recordsDocument.read(packageFile);
			const records = await document.extract();
			const extractedRecord = findRecordByName(records, 'Package: Records');

			expect(extractedRecord).toBeDefined();
			if (extractedRecord === undefined) {
				throw new Error('Package: Records was not extracted');
			}

			record = extractedRecord;
		});

		it('SHOULD resolve the extracted names to the loaded labels', () => {
			// eslint-disable-next-line dot-notation
			expect(String(record['canonicalName'])).toContain('art-js/records');
			// eslint-disable-next-line dot-notation
			expect(record['purpose']).toContain('Record identity');
			expect(getFieldNames(record)).toEqual(['purpose', 'canonicalName', 'keywords']);
		});

		describe('WHEN updating canonicalName and saving', () => {
			let content: string;

			beforeEach(async () => {
				// eslint-disable-next-line dot-notation
				record['canonicalName'] = 'Art Records';

				await record.save();

				const savedContent = filesystemRecords.getFileContent('_records/package.art');

				if (savedContent === undefined) {
					throw new Error('_records/package.art was not saved');
				}

				content = savedContent;
			});

			it('SHOULD persist the update under the loaded label', () => {
				expect(content).toContain('**Canonical Name:** Art Records');
			});

			it('SHOULD keep every untouched line byte-identical', () => {
				const expectedContent = originalContent.replace(
					'**Canonical Name:** `@art-js/records`',
					'**Canonical Name:** Art Records',
				);

				expect(content).toBe(expectedContent);
			});

			it('SHOULD read back the updated canonical name after a reload', async () => {
				const reloaded = await extractTestRecord(content, 'Package: Records');

				// eslint-disable-next-line dot-notation
				expect(reloaded.record['canonicalName']).toBe('Art Records');
				// eslint-disable-next-line dot-notation
				expect(reloaded.record['purpose']).toContain('Record identity');
			});
		});
	});
});
