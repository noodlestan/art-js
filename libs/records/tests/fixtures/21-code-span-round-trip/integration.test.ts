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
import { findRecordByName, findRecordFileByPath } from '../../helpers/records/index.js';
import { makeTempDir, removeTempDirs } from '../../helpers/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 21 — A written-back code span survives a value update of another field', () => {
	let workingDirectory: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codec = createArtCodec({});
		const fixtureFiles = {
			'_records/project.art': await readFile(
				join(workingDirectory, '_records', 'project.art'),
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
		const savedContent = filesystemRecords.getFileContent('_records/project.art');

		if (savedContent === undefined) {
			throw new Error('_records/project.art was not saved');
		}

		return savedContent;
	}

	describe('GIVEN the extracted project record', () => {
		let project: ArtRecord;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const projectFile = findRecordFileByPath(files, '_records/project.art');

			expect(projectFile).toBeDefined();
			if (projectFile === undefined) {
				throw new Error('_records/project.art was not discovered');
			}

			const document = await recordsDocument.read(projectFile);
			const records = await document.extract();
			const extractedProject = findRecordByName(records, 'Project: Art Works');

			expect(extractedProject).toBeDefined();
			if (extractedProject === undefined) {
				throw new Error('Project: Art Works was not extracted');
			}

			project = extractedProject;
		});

		it('SHOULD read the location as markdown with its backticks intact', () => {
			// eslint-disable-next-line dot-notation
			expect(project['location']).toBe('`art-works`');
			expect(project.getFieldMarkdown('location')).toBe('`art-works`');
			expect(project.getFieldText('location')).toBe('art-works');
		});

		describe('WHEN setting the code span again, updating another field, and saving', () => {
			beforeEach(async () => {
				project.setFieldMarkdown('location', '`art-works`');
				// eslint-disable-next-line dot-notation
				project['purpose'] = 'Updated Records API';
				await project.save();
			});

			it('SHOULD persist the code span of the untouched field', () => {
				expect(getSavedContent()).toContain('**Location:** `art-works`');
			});

			it('SHOULD persist the updated value of the other field', () => {
				expect(getSavedContent()).toContain('**Purpose:** Updated Records API');
			});

			it('SHOULD still read the code span back as markdown and as text', () => {
				expect(project.getFieldMarkdown('location')).toBe('`art-works`');
				expect(project.getFieldText('location')).toBe('art-works');
			});
		});

		describe('WHEN writing a typed fenced-code value and saving', () => {
			beforeEach(async () => {
				// eslint-disable-next-line dot-notation
				project['codeExample'] = '```typescript\nconst x = 42;\n```';
				await project.save();
			});

			it('SHOULD re-emit the fence in block form', () => {
				expect(getSavedContent()).toContain(
					'**Code Example:**\n\n```typescript\nconst x = 42;\n```',
				);
			});

			it('SHOULD read the fence back as markdown and as text', () => {
				expect(project.getFieldMarkdown('codeExample')).toBe('```typescript\nconst x = 42;\n```');
				expect(project.getFieldText('codeExample')).toBe('```typescript\nconst x = 42;\n```');
			});

			it('SHOULD keep the field in block form', () => {
				expect(JSON.stringify(project.__section)).toContain('"construct":"FieldBlock"');
			});
		});
	});
});
