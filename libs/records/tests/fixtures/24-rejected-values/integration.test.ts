import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import type { SectionBlock } from '@art-md/constructs';
import type { ArtDocument } from '@art-md/primitives';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type ArtRecord, createRecordsDocument } from '../../../src/index.js';
import {
	type AdapterMock,
	type AdapterMockFile,
	createAdapterMock,
} from '../../helpers/adapter/index.js';
import { copyFixtureCase, getFixtureDirectory } from '../../helpers/fixtures/index.js';
import { findRecordByName, findRecordFileByPath } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

const containerValueError =
	'Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline';

const invalidValueError = 'Field value must be a string, number, boolean, or Art AST value';

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 24 — Rejected field values throw the spec TypeErrors through the proxy', () => {
	let workingDirectory: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codec = createArtCodec({});
		const fixtureFiles = {
			'_records/guard.art': await readFile(
				join(workingDirectory, '_records', 'guard.art'),
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
		const savedContent = filesystemRecords.getFileContent('_records/guard.art');

		if (savedContent === undefined) {
			throw new Error('_records/guard.art was not saved');
		}

		return savedContent;
	}

	describe('GIVEN the extracted guard record', () => {
		let guard: ArtRecord;
		let sectionBefore: string;
		let contentBefore: string;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const guardFile = findRecordFileByPath(files, '_records/guard.art');

			expect(guardFile).toBeDefined();
			if (guardFile === undefined) {
				throw new Error('_records/guard.art was not discovered');
			}

			const document = await recordsDocument.read(guardFile);
			const records = await document.extract();
			const extractedGuard = findRecordByName(records, 'Guard: Values');

			expect(extractedGuard).toBeDefined();
			if (extractedGuard === undefined) {
				throw new Error('Guard: Values was not extracted');
			}

			guard = extractedGuard;
			sectionBefore = JSON.stringify(guard.__section);
			contentBefore = getSavedContent();
		});

		it('WHEN writing null to an existing field THEN the value TypeError is thrown and the field is untouched', () => {
			expect(() => {
				// eslint-disable-next-line dot-notation
				guard['purpose'] = null;
			}).toThrow(invalidValueError);
			expect(JSON.stringify(guard.__section)).toBe(sectionBefore);
		});

		it('WHEN writing a Document to a missing field THEN the container TypeError is thrown and nothing is appended', () => {
			const documentValue: ArtDocument = { construct: 'Document', children: [] };

			expect(() => {
				// eslint-disable-next-line dot-notation
				guard['description'] = documentValue;
			}).toThrow(containerValueError);
			expect(JSON.stringify(guard.__section)).toBe(sectionBefore);
		});

		it('WHEN writing a section construct in an array to a missing field THEN the container TypeError is thrown and nothing is appended', () => {
			const sectionValue: SectionBlock = {
				construct: 'SectionBlock',
				name: 'Nested',
				depth: 2,
				children: [],
			};

			expect(() => {
				// eslint-disable-next-line dot-notation
				guard['description'] = [sectionValue];
			}).toThrow(containerValueError);
			expect(JSON.stringify(guard.__section)).toBe(sectionBefore);
		});

		it('WHEN every rejected write is followed by a save THEN the document stays byte-identical', async () => {
			const documentValue: ArtDocument = { construct: 'Document', children: [] };
			const sectionValue: SectionBlock = {
				construct: 'SectionBlock',
				name: 'Nested',
				depth: 2,
				children: [],
			};

			expect(() => {
				// eslint-disable-next-line dot-notation
				guard['purpose'] = null;
			}).toThrow(invalidValueError);
			expect(() => {
				// eslint-disable-next-line dot-notation
				guard['description'] = documentValue;
			}).toThrow(containerValueError);
			expect(() => {
				// eslint-disable-next-line dot-notation
				guard['description'] = [sectionValue];
			}).toThrow(containerValueError);

			await guard.save();

			expect(getSavedContent()).toBe(contentBefore);
		});
	});
});
