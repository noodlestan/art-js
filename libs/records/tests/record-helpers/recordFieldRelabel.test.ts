import { beforeEach, describe, expect, it } from 'vitest';

import type { ArtRecord } from '../../src/index.js';
import { isSectionField } from '../../src/record/private/section-field/isSectionField.js';
import type { SectionField } from '../../src/record/private/types.js';
import type { AdapterMock } from '../helpers/adapter/index.js';
import { extractTestRecord, getFieldNames } from '../helpers/records/index.js';

import {
	relabelDocument,
	relabelRecordName,
	relabelRejectionCases,
	relabelSuccessCases,
} from './recordFieldRelabel.fixtures.js';

function findFieldByLabel(artRecord: ArtRecord, label: string): SectionField {
	const field = artRecord.__section.children.find(
		child => isSectionField(child) && child.name === label,
	);

	if (field === undefined || !isSectionField(field)) {
		throw new Error(`Expected a field carrying the "${label}" label`);
	}

	return field;
}

describe('record field relabel', () => {
	let record: ArtRecord;
	let filesystemRecords: AdapterMock;

	beforeEach(async () => {
		({ record, filesystemRecords } = await extractTestRecord(relabelDocument, relabelRecordName));
	});

	function snapshotRecordState(): string {
		return JSON.stringify({ section: record.__section, keys: getFieldNames(record) });
	}

	it.each(relabelRejectionCases)(
		'WHEN relabelField("%s", "%s") is rejected THEN "%s" is thrown and nothing changes',
		(name, label, expectedMessage) => {
			const stateBefore = snapshotRecordState();

			expect(() => {
				record.relabelField(name, label);
			}).toThrow(expectedMessage);

			expect(snapshotRecordState()).toBe(stateBefore);
		},
	);

	it.each(relabelSuccessCases)(
		'WHEN relabelField("%s", "%s") is accepted THEN the label becomes "%s" and the index keys stay identical',
		(name, label, expectedLabel) => {
			const keysBefore = getFieldNames(record);

			record.relabelField(name, label);

			expect(findFieldByLabel(record, label).name).toBe(expectedLabel);
			expect(getFieldNames(record)).toEqual(keysBefore);
		},
	);

	it('WHEN relabelling THEN only the stored label changes: position, tags, and value stay untouched', () => {
		const field = findFieldByLabel(record, 'Canonical Name');
		const positionBefore = JSON.stringify(field.position);
		const tagsBefore = JSON.stringify(field.tags);
		const valueBefore = JSON.stringify(field.children);

		record.relabelField('canonicalName', 'Canonical name');

		expect(field.name).toBe('Canonical name');
		expect(JSON.stringify(field.position)).toBe(positionBefore);
		expect(JSON.stringify(field.tags)).toBe(tagsBefore);
		expect(JSON.stringify(field.children)).toBe(valueBefore);
		// eslint-disable-next-line dot-notation
		expect(record['canonicalName']).toBe('Canonical');
	});

	it('WHEN relabelling the first-wins holder of a duplicate THEN no promotion happens', () => {
		record.relabelField('purpose', 'PURPOSE');

		// eslint-disable-next-line dot-notation
		expect(record['purpose']).toBe('First');
		expect(Object.keys(record).filter(key => key === 'purpose')).toEqual(['purpose']);
		expect(JSON.stringify(record.__section)).toContain('"name":"PURPOSE"');
		expect(JSON.stringify(record.__section)).toContain('"name":"purpose"');
		expect(record.__section.children[1]).toMatchObject({
			construct: 'FieldInline',
			name: 'purpose',
		});
	});

	it('WHEN relabelling and saving THEN the new label persists and reload derives the same name', async () => {
		record.relabelField('canonicalName', 'Canonical name');

		await record.save();

		const content = filesystemRecords.getFileContent('_records/test.art');

		if (content === undefined) {
			throw new Error('_records/test.art was not saved');
		}

		expect(content).toContain('**Canonical name:** Canonical (#tag)');
		expect(content).not.toContain('**Canonical Name:**');

		const reloaded = await extractTestRecord(content, relabelRecordName);

		expect(reloaded.record.getFieldMarkdown('canonicalName')).toBe('Canonical');
		expect(getFieldNames(reloaded.record)).toEqual(['purpose', 'canonicalName']);
	});

	it('WHEN renaming and then relabelling THEN the custom spelling of the renamed field persists', async () => {
		record.renameField('canonicalName', 'brandNew');
		record.relabelField('brandNew', 'Brand new');

		expect(JSON.stringify(record.__section)).toContain('"name":"Brand new"');
		expect(record.getFieldMarkdown('brandNew')).toBe('Canonical');

		await record.save();

		const content = filesystemRecords.getFileContent('_records/test.art');

		if (content === undefined) {
			throw new Error('_records/test.art was not saved');
		}

		expect(content).toContain('**Brand new:** Canonical');
		expect(content).not.toContain('**Brand New:**');

		const reloaded = await extractTestRecord(content, relabelRecordName);

		expect(reloaded.record.getFieldMarkdown('brandNew')).toBe('Canonical');
	});
});
