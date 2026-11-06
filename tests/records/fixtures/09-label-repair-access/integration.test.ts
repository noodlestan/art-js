import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { type ArtRecord, createRecordsDocument } from '@art-js/records';
import { type FSRecordFile, createFSRecordsAdapter } from '@art-lib/fs-records';
import { type PartialArtCodecConfig, createArtCodec } from '@art-md/codec';
import type { NaturalExpression } from '@art-md/constructs';
import type { ArtCodec } from '@art-md/primitives';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { recordsPatterns } from '../../src/constants.js';
import { copyFixtureCase } from '../../src/copyFixtureCase.js';
import { findRecordByName } from '../../src/findRecordByName.js';
import { findRecordFileByPath } from '../../src/findRecordFileByPath.js';
import { getFieldNames } from '../../src/getFieldNames.js';
import { getFixtureDirectory } from '../../src/getFixtureDirectory.js';
import { makeTempDir, removeTempDirs } from '../../src/tempDirs/index.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

describe('Case 09 — Repairing a stored label and accessing values by label', () => {
	let workingDirectory: string;
	let filename: string;
	let filesystemRecords: ReturnType<typeof createFSRecordsAdapter>;
	let recordsDocument: ReturnType<typeof createRecordsDocument<FSRecordFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);
		filename = join(workingDirectory, '_records', 'release.art');

		const codecOptions: PartialArtCodecConfig = {};
		const codec: ArtCodec = createArtCodec(codecOptions);

		const filesystemRecordsOptions = { basePath: workingDirectory, patterns: recordsPatterns };
		filesystemRecords = createFSRecordsAdapter(filesystemRecordsOptions);

		function createContentSource(file: FSRecordFile) {
			return filesystemRecords.createContentSource(file);
		}

		const recordsDocumentOptions = { codec, createContentSource };
		recordsDocument = createRecordsDocument<FSRecordFile>(recordsDocumentOptions);
	});

	async function extractRelease(): Promise<ArtRecord> {
		const files = await filesystemRecords.discoverRecordFiles();
		const releaseFile = findRecordFileByPath(files, '_records/release.art');

		expect(releaseFile).toBeDefined();
		if (releaseFile === undefined) {
			throw new Error('_records/release.art was not discovered');
		}

		const document = await recordsDocument.read(releaseFile);
		const records = await document.extract();
		const extractedRelease = findRecordByName(records, 'Release: Records');

		expect(extractedRelease).toBeDefined();
		if (extractedRelease === undefined) {
			throw new Error('Release: Records was not extracted');
		}

		return extractedRelease;
	}

	describe('GIVEN the extracted release record', () => {
		let release: ArtRecord;

		beforeEach(async () => {
			release = await extractRelease();
		});

		it('SHOULD rewrite the stored label in place while the name, position, value, and index stay unchanged', () => {
			const field = release.__section.children[0];
			const positionBefore = JSON.stringify(field?.position);
			const keysBefore = getFieldNames(release);

			release.relabelField('npmPackageDeployment', 'NPM Package Deployment');

			expect(field).toMatchObject({ name: 'NPM Package Deployment' });
			expect(JSON.stringify(field?.position)).toBe(positionBefore);
			expect(getFieldNames(release)).toEqual(keysBefore);
			expect(release.getFieldMarkdown('npmPackageDeployment')).toBe('Build the package');
		});

		it('SHOULD read the shadowed field by label while the name keeps reading first-wins', () => {
			// eslint-disable-next-line dot-notation
			expect(release['id']).toBe('First');
			expect(release.getFieldMarkdownByLabel('Id')).toBe('First');
			expect(release.getFieldTextByLabel('Id')).toBe('First');
			expect(release.getFieldValueByLabel('ID')).toHaveLength(1);
			expect(release.getFieldMarkdownByLabel('ID')).toBe('Second');
		});

		it('SHOULD return undefined on every by-label read for a label no field carries', () => {
			expect(release.getFieldMarkdownByLabel('Missing')).toBeUndefined();
			expect(release.getFieldTextByLabel('Missing')).toBeUndefined();
			expect(release.getFieldValueByLabel('Missing')).toBeUndefined();
		});

		it('SHOULD throw on a by-label write miss and never create a field', () => {
			const childrenBefore = release.__section.children.length;

			expect(() => {
				release.setFieldMarkdownByLabel('Missing', 'Updated');
			}).toThrow('Field not found: Missing');
			expect(() => {
				release.setFieldValueByLabel('Missing', []);
			}).toThrow('Field not found: Missing');

			expect(release.__section.children).toHaveLength(childrenBefore);
		});

		it('SHOULD write the shadowed field by label without touching the holder', () => {
			release.setFieldMarkdownByLabel('ID', 'Second Updated');

			expect(release.getFieldMarkdownByLabel('ID')).toBe('Second Updated');
			// eslint-disable-next-line dot-notation
			expect(release['id']).toBe('First');
		});

		it('SHOULD write a construct by label and keep the stored label', () => {
			const expression: NaturalExpression = {
				construct: 'NaturalExpression',
				type: 'text',
				value: 'Records API Updated',
				children: [],
			};

			release.setFieldValueByLabel('Purpose', [expression]);

			expect(release.getFieldValueByLabel('Purpose')).toEqual([expression]);
			expect(release.getFieldMarkdown('purpose')).toBe('Records API Updated');
			expect(JSON.stringify(release.__section)).toContain('"name":"Purpose"');
		});

		it('SHOULD persist the repaired label and both duplicate labels after a save, and re-extract them unchanged', async () => {
			release.relabelField('npmPackageDeployment', 'NPM Package Deployment');
			release.setFieldMarkdownByLabel('ID', 'Second Updated');

			await release.save();

			const content = await readFile(filename, 'utf-8');

			expect(content).toContain('**NPM Package Deployment:** Build the package');
			expect(content).not.toContain('**Npm Package Deployment:**');
			expect(content).toContain('**Id:** First');
			expect(content).toContain('**ID:** Second Updated');

			const reloaded = await extractRelease();

			// eslint-disable-next-line dot-notation
			expect(reloaded['id']).toBe('First');
			expect(reloaded.getFieldMarkdown('npmPackageDeployment')).toBe('Build the package');
			expect(reloaded.getFieldMarkdownByLabel('ID')).toBe('Second Updated');
			expect(getFieldNames(reloaded)).toEqual(['npmPackageDeployment', 'id', 'purpose']);
		});
	});
});
