import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type ArtRecord, createRecordsDocument } from '../../../src/index.js';
import { isSectionField } from '../../../src/record/private/section-field/isSectionField.js';
import {
	type AdapterMock,
	type AdapterMockFile,
	createAdapterMock,
} from '../../helpers/adapter/index.js';
import { copyFixtureCase, getFixtureDirectory } from '../../helpers/fixtures/index.js';
import { findRecordByName, findRecordFileByPath } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

function getFieldConstruct(record: ArtRecord, label: string): string {
	for (const child of record.__section.children) {
		if (isSectionField(child) && child.name === label) {
			return child.construct;
		}
	}

	throw new Error(`Field "${label}" was not found`);
}

describe('Case 22 — The field form follows the value being set', () => {
	let workingDirectory: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codec = createArtCodec({});
		const fixtureFiles = {
			'_records/shape.art': await readFile(
				join(workingDirectory, '_records', 'shape.art'),
				'utf-8',
			),
		};

		filesystemRecords = createAdapterMock({ basePath: workingDirectory, files: fixtureFiles });

		function createContentSource(file: AdapterMockFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<AdapterMockFile>(recordsDocumentOptions);
	});

	function getSavedContent(): string {
		const savedContent = filesystemRecords.getFileContent('_records/shape.art');

		if (savedContent === undefined) {
			throw new Error('_records/shape.art was not saved');
		}

		return savedContent;
	}

	describe('GIVEN the extracted shape record', () => {
		let shape: ArtRecord;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const shapeFile = findRecordFileByPath(files, '_records/shape.art');

			expect(shapeFile).toBeDefined();
			if (shapeFile === undefined) {
				throw new Error('_records/shape.art was not discovered');
			}

			const document = await recordsDocument.read(shapeFile);
			const records = await document.extract();
			const extractedShape = findRecordByName(records, 'Shape: Mixed');

			expect(extractedShape).toBeDefined();
			if (extractedShape === undefined) {
				throw new Error('Shape: Mixed was not extracted');
			}

			shape = extractedShape;
		});

		it('SHOULD start with the code example in block form', () => {
			expect(JSON.stringify(shape.__section)).toContain('"construct":"FieldBlock"');
		});

		describe('WHEN replacing the block field with a phrasing-only value', () => {
			beforeEach(async () => {
				// eslint-disable-next-line dot-notation
				shape['codeExample'] = 'plain phrasing';
				await shape.save();
			});

			it('SHOULD convert the field to inline form in place', () => {
				expect(getFieldConstruct(shape, 'Code Example')).toBe('FieldInline');
			});

			it('SHOULD persist the value on the label line without a fence', () => {
				const content = getSavedContent();

				expect(content).toContain('**Code Example:** plain phrasing');
				expect(content).not.toContain('```typescript');
			});

			it('SHOULD read the value back as markdown', () => {
				expect(shape.getFieldMarkdown('codeExample')).toBe('plain phrasing');
			});
		});

		describe('WHEN appending a block value to a missing field', () => {
			beforeEach(async () => {
				// eslint-disable-next-line dot-notation
				shape['addedBlock'] = '```typescript\nconst y = 43;\n```';
				await shape.save();
			});

			it('SHOULD append the new field in block form', () => {
				expect(getFieldConstruct(shape, 'Added Block')).toBe('FieldBlock');
			});

			it('SHOULD persist the fence on its own lines', () => {
				expect(getSavedContent()).toContain(
					'**Added Block:**\n\n```typescript\nconst y = 43;\n```',
				);
			});

			it('SHOULD read the fence back as markdown', () => {
				expect(shape.getFieldMarkdown('addedBlock')).toBe('```typescript\nconst y = 43;\n```');
			});
		});
	});
});
