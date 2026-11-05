import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import type { NaturalBlock, NaturalExpression } from '@art-md/constructs';
import type { ArtCodec } from '@art-md/primitives';
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

describe('Case 23 — A field value installs from constructs without re-encoding', () => {
	let workingDirectory: string;
	let codec: ArtCodec;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		codec = createArtCodec({});
		const fixtureFiles = {
			'_records/build.art': await readFile(
				join(workingDirectory, '_records', 'build.art'),
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
		const savedContent = filesystemRecords.getFileContent('_records/build.art');

		if (savedContent === undefined) {
			throw new Error('_records/build.art was not saved');
		}

		return savedContent;
	}

	describe('GIVEN the extracted build record', () => {
		let build: ArtRecord;

		beforeEach(async () => {
			const files = await filesystemRecords.discoverRecordFiles();
			const buildFile = findRecordFileByPath(files, '_records/build.art');

			expect(buildFile).toBeDefined();
			if (buildFile === undefined) {
				throw new Error('_records/build.art was not discovered');
			}

			const document = await recordsDocument.read(buildFile);
			const records = await document.extract();
			const extractedBuild = findRecordByName(records, 'Build: Demo');

			expect(extractedBuild).toBeDefined();
			if (extractedBuild === undefined) {
				throw new Error('Build: Demo was not extracted');
			}

			build = extractedBuild;
		});

		describe('WHEN installing a consumer-built code block through setFieldValue', () => {
			let code: NaturalBlock;

			beforeEach(async () => {
				code = codec.create<NaturalBlock>('NaturalBlock', {
					type: 'code',
					lang: 'typescript',
					value: '```typescript\nconst x = 42;\n```',
					children: [],
				});

				build.setFieldValue('codeExample', code);
				await build.save();
			});

			it('SHOULD hold the installed construct as the field value', () => {
				expect(build.getFieldValue('codeExample')).toEqual([code]);
			});

			it('SHOULD persist the fence in block form', () => {
				expect(getSavedContent()).toContain(
					'**Code Example:**\n\n```typescript\nconst x = 42;\n```',
				);
			});

			it('SHOULD read the fence back as markdown and as text', () => {
				expect(build.getFieldMarkdown('codeExample')).toBe('```typescript\nconst x = 42;\n```');
				expect(build.getFieldText('codeExample')).toBe('```typescript\nconst x = 42;\n```');
			});
		});

		describe('WHEN installing an array of constructs through setFieldValue', () => {
			let expressions: NaturalExpression[];

			beforeEach(async () => {
				const first = codec.create<NaturalExpression>('NaturalExpression', {
					type: 'text',
					value: 'first',
					children: [],
				});
				const second = codec.create<NaturalExpression>('NaturalExpression', {
					type: 'emphasis',
					children: [
						codec.create<NaturalExpression>('NaturalExpression', {
							type: 'text',
							value: 'second',
							children: [],
						}),
					],
				});

				expressions = [first, second];

				build.setFieldValue('greeting', expressions);
				await build.save();
			});

			it('SHOULD hold the members as the field value in order', () => {
				expect(build.getFieldValue('greeting')).toEqual(expressions);
			});

			it('SHOULD persist the members in order', () => {
				expect(getSavedContent()).toContain('**Greeting:** first_second_');
			});

			it('SHOULD read the members back as markdown', () => {
				expect(build.getFieldMarkdown('greeting')).toBe('first_second_');
			});
		});
	});
});
