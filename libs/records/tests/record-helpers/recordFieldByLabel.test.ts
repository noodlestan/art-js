import type { NaturalExpression, SectionBlock } from '@art-md/constructs';
import { beforeEach, describe, expect, it } from 'vitest';

import type { ArtRecord } from '../../src/index.js';
import { isSectionField } from '../../src/record/private/section-field/isSectionField.js';
import type { SectionField } from '../../src/record/private/types.js';
import type { AdapterMock } from '../helpers/adapter/index.js';
import { extractTestRecord, getFieldNames } from '../helpers/records/index.js';

import {
	byLabelDocument,
	byLabelReadHitCases,
	byLabelReadMissCases,
	byLabelRecordName,
	byLabelWriteMissCases,
} from './recordFieldByLabel.fixtures.js';

const containerValueError =
	'Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline';

function findFieldByLabel(artRecord: ArtRecord, label: string): SectionField {
	const field = artRecord.__section.children.find(
		child => isSectionField(child) && child.name === label,
	);

	if (field === undefined || !isSectionField(field)) {
		throw new Error(`Expected a field carrying the "${label}" label`);
	}

	return field;
}

describe('record field by label', () => {
	let record: ArtRecord;
	let filesystemRecords: AdapterMock;

	beforeEach(async () => {
		({ record, filesystemRecords } = await extractTestRecord(byLabelDocument, byLabelRecordName));
	});

	it('GIVEN a shadowed duplicate WHEN reading by name and by label THEN the name reads first-wins and the label reaches the shadowed field', () => {
		// eslint-disable-next-line dot-notation
		expect(record['id']).toBe('First');
		expect(record.getFieldMarkdownByLabel('ID')).toBe('Second');
		expect(record.getFieldTextByLabel('ID')).toBe('Second');
		expect(record.getFieldValueByLabel('ID')).toHaveLength(1);
	});

	it.each(byLabelReadHitCases)(
		'WHEN reading the exact "%s" label THEN markdown, text, and value reads all reach it',
		(label, expected) => {
			expect(record.getFieldMarkdownByLabel(label)).toBe(expected);
			expect(record.getFieldTextByLabel(label)).toBe(expected);
			expect(record.getFieldValueByLabel(label)).toBeDefined();
		},
	);

	it.each(byLabelReadMissCases)(
		'WHEN reading the "%s" address by label THEN markdown, text, and value reads all return undefined',
		label => {
			expect(record.getFieldMarkdownByLabel(label)).toBeUndefined();
			expect(record.getFieldTextByLabel(label)).toBeUndefined();
			expect(record.getFieldValueByLabel(label)).toBeUndefined();
		},
	);

	it('WHEN reading a value by label twice THEN the clones are isolated from the document', () => {
		const value = record.getFieldValueByLabel('Id');

		if (value === undefined) {
			throw new Error('Expected the Id field to hold a value');
		}

		const firstExpression = value[0];

		if (firstExpression === undefined || firstExpression.construct !== 'NaturalExpression') {
			throw new Error('Expected a text expression as the first value construct');
		}

		firstExpression.value = 'Injected';

		expect(record.getFieldMarkdownByLabel('Id')).toBe('First');
		expect(record.getFieldValueByLabel('Id')).not.toBe(value);
	});

	it.each(byLabelWriteMissCases)(
		'WHEN writing the missing "%s" label THEN "%s" is thrown and no field is created',
		(label, expectedMessage) => {
			const childrenBefore = record.__section.children.length;
			const keysBefore = getFieldNames(record);

			expect(() => {
				record.setFieldMarkdownByLabel(label, 'Updated');
			}).toThrow(expectedMessage);
			expect(() => {
				record.setFieldValueByLabel(label, []);
			}).toThrow(expectedMessage);

			expect(record.__section.children).toHaveLength(childrenBefore);
			expect(getFieldNames(record)).toEqual(keysBefore);
		},
	);

	it('WHEN writing the shadowed field by label THEN only that field changes and its label is preserved', () => {
		record.setFieldMarkdownByLabel('ID', 'Updated');

		expect(record.getFieldMarkdownByLabel('ID')).toBe('Updated');
		// eslint-disable-next-line dot-notation
		expect(record['id']).toBe('First');
		expect(getFieldNames(record)).toEqual(['id', 'purpose']);
		expect(findFieldByLabel(record, 'ID').name).toBe('ID');
		expect(JSON.stringify(record.__section)).toContain('"name":"Id"');
	});

	it('WHEN writing a construct by label THEN the value installs as-is and only the addressed field changes', () => {
		const expression: NaturalExpression = {
			construct: 'NaturalExpression',
			type: 'text',
			value: 'Second Value',
			children: [],
		};

		record.setFieldValueByLabel('ID', [expression]);

		expect(record.getFieldValueByLabel('ID')).toEqual([expression]);
		expect(record.getFieldMarkdownByLabel('ID')).toBe('Second Value');
		// eslint-disable-next-line dot-notation
		expect(record['id']).toBe('First');
		expect(findFieldByLabel(record, 'ID').name).toBe('ID');
	});

	it('WHEN writing a block value by label THEN the field converts in place preserving name, tags, and position', () => {
		const field = findFieldByLabel(record, 'Purpose');
		const positionBefore = JSON.stringify(field.position);
		const tagsBefore = JSON.stringify(field.tags);

		record.setFieldMarkdownByLabel('Purpose', '```typescript\nconst x = 42;\n```');

		expect(field.construct).toBe('FieldBlock');
		expect(field.name).toBe('Purpose');
		expect(JSON.stringify(field.position)).toBe(positionBefore);
		expect(JSON.stringify(field.tags)).toBe(tagsBefore);
		expect(record.getFieldTextByLabel('Purpose')).toContain('const x = 42;');
	});

	it('WHEN writing a container construct by label THEN the container TypeError is thrown and nothing changes', () => {
		const sectionValue: SectionBlock = {
			construct: 'SectionBlock',
			name: 'Nested',
			depth: 2,
			children: [],
		};
		const stateBefore = JSON.stringify(record.__section);

		expect(() => {
			record.setFieldValueByLabel('Purpose', sectionValue);
		}).toThrow(containerValueError);
		expect(JSON.stringify(record.__section)).toBe(stateBefore);
	});

	it('WHEN writing by label and saving THEN only the addressed field is written and both labels survive a reload', async () => {
		record.setFieldMarkdownByLabel('ID', 'Second Updated');

		await record.save();

		const content = filesystemRecords.getFileContent('_records/test.art');

		if (content === undefined) {
			throw new Error('_records/test.art was not saved');
		}

		expect(content).toContain('**Id:** First');
		expect(content).toContain('**ID:** Second Updated');

		const reloaded = await extractTestRecord(content, byLabelRecordName);

		// eslint-disable-next-line dot-notation
		expect(reloaded.record['id']).toBe('First');
		expect(reloaded.record.getFieldMarkdownByLabel('ID')).toBe('Second Updated');
	});
});
