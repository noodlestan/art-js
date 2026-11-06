import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createArtCodec } from '@art-md/codec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type ArtRecord, createRecordsDocument } from '../../../src/index.js';
import { isSectionField } from '../../../src/record/private/section-field/isSectionField.js';
import type { SectionField } from '../../../src/record/private/types.js';
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

function findFieldByLabel(artRecord: ArtRecord, label: string): SectionField {
	const field = artRecord.__section.children.find(
		child => isSectionField(child) && child.name === label,
	);

	if (field === undefined || !isSectionField(field)) {
		throw new Error(`Expected a field carrying the "${label}" label`);
	}

	return field;
}

describe('Case 25 — Relabelling a stored label in place and persisting it', () => {
	let workingDirectory: string;
	let filesystemRecords: AdapterMock;
	let recordsDocument: ReturnType<typeof createRecordsDocument<AdapterMockFile>>;

	beforeEach(async () => {
		const fixtureDir = getFixtureDirectory(import.meta.url);
		const tempDir = makeTempDir(tempDirs);
		workingDirectory = await copyFixtureCase(fixtureDir, tempDir);

		const codec = createArtCodec({});
		const fixtureFiles = {
			'_records/deploy.art': await readFile(
				join(workingDirectory, '_records', 'deploy.art'),
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
		const savedContent = filesystemRecords.getFileContent('_records/deploy.art');

		if (savedContent === undefined) {
			throw new Error('_records/deploy.art was not saved');
		}

		return savedContent;
	}

	async function extractDeployment(): Promise<ArtRecord> {
		const files = await filesystemRecords.discoverRecordFiles();
		const deployFile = findRecordFileByPath(files, '_records/deploy.art');

		expect(deployFile).toBeDefined();
		if (deployFile === undefined) {
			throw new Error('_records/deploy.art was not discovered');
		}

		const document = await recordsDocument.read(deployFile);
		const records = await document.extract();
		const extractedDeployment = findRecordByName(records, 'Deployment: Records');

		expect(extractedDeployment).toBeDefined();
		if (extractedDeployment === undefined) {
			throw new Error('Deployment: Records was not extracted');
		}

		return extractedDeployment;
	}

	describe('GIVEN the extracted deployment record carrying the derived label', () => {
		let deployment: ArtRecord;

		beforeEach(async () => {
			deployment = await extractDeployment();
		});

		it('WHEN relabelling to the house spelling THEN name, position, tags, value, and the index stay unchanged', () => {
			const field = findFieldByLabel(deployment, 'Npm Package Deployment');
			const positionBefore = JSON.stringify(field.position);
			const tagsBefore = JSON.stringify(field.tags);
			const valueBefore = JSON.stringify(field.children);
			const keysBefore = getFieldNames(deployment);

			deployment.relabelField('npmPackageDeployment', 'NPM Package Deployment');

			expect(field.name).toBe('NPM Package Deployment');
			expect(JSON.stringify(field.position)).toBe(positionBefore);
			expect(JSON.stringify(field.tags)).toBe(tagsBefore);
			expect(JSON.stringify(field.children)).toBe(valueBefore);
			expect(getFieldNames(deployment)).toEqual(keysBefore);
			expect(deployment.getFieldMarkdown('npmPackageDeployment')).toBe('Build the package');
			expect(deployment.getFieldTextByLabel('NPM Package Deployment')).toBe('Build the package');
		});

		describe('WHEN saving the relabelled record', () => {
			let content: string;

			beforeEach(async () => {
				deployment.relabelField('npmPackageDeployment', 'NPM Package Deployment');

				await deployment.save();

				content = getSavedContent();
			});

			it('SHOULD write the new label and drop the old spelling', () => {
				expect(content).toContain('**NPM Package Deployment:** Build the package (#ship)');
				expect(content).not.toContain('**Npm Package Deployment:**');
			});

			it('SHOULD extract the same name from the persisted label after a reload', async () => {
				const reloaded = await extractTestRecord(content, 'Deployment: Records');

				expect(reloaded.record.getFieldMarkdown('npmPackageDeployment')).toBe('Build the package');
				expect(getFieldNames(reloaded.record)).toEqual(['npmPackageDeployment', 'purpose']);
				expect(reloaded.record.getFieldValueByLabel('NPM Package Deployment')).toHaveLength(1);
			});
		});

		it('WHEN a gate rejects a relabel and the record is saved THEN the file stays byte-identical', async () => {
			const contentBefore = getSavedContent();
			const sectionBefore = JSON.stringify(deployment.__section);

			expect(() => {
				deployment.relabelField('npmPackageDeployment', 'Deployment');
			}).toThrow('Field label "Deployment" does not match field name "npmPackageDeployment"');
			expect(() => {
				deployment.relabelField('npmPackageDeployment', '3A33');
			}).toThrow('Invalid record field label: "3A33"');

			expect(JSON.stringify(deployment.__section)).toBe(sectionBefore);

			await deployment.save();

			expect(getSavedContent()).toBe(contentBefore);
		});
	});
});
