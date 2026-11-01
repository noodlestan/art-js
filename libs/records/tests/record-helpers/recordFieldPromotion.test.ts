import { beforeEach, describe, expect, it } from 'vitest';

import type { ArtRecord } from '../../src/index.js';
import type { AdapterMock } from '../helpers/adapter/index.js';
import { extractTestRecord, getFieldNames } from '../helpers/records/index.js';

import { duplicatePurposeDocument, promotionRecordName } from './recordFieldPromotion.fixtures.js';

describe('record field promotion', () => {
	let record: ArtRecord;
	let filesystemRecords: AdapterMock;

	beforeEach(async () => {
		({ record, filesystemRecords } = await extractTestRecord(
			duplicatePurposeDocument,
			promotionRecordName,
		));
	});

	it('GIVEN duplicate labels WHEN extracting THEN the first occurrence is read and the name is listed once', () => {
		// eslint-disable-next-line dot-notation
		expect(record['purpose']).toBe('First');
		expect(getFieldNames(record)).toEqual(['purpose']);
	});

	it('WHEN deleting the promoted name THEN the skipped duplicate is promoted', () => {
		// eslint-disable-next-line dot-notation
		expect(delete record['purpose']).toBe(true);

		// eslint-disable-next-line dot-notation
		expect(record['purpose']).toBe('Second');
		expect(getFieldNames(record)).toEqual(['purpose']);
	});

	it('WHEN renaming the promoted name THEN the duplicate takes over the vacated name', () => {
		record.renameField('purpose', 'brandNew');

		// eslint-disable-next-line dot-notation
		expect(record['brandNew']).toBe('First');
		// eslint-disable-next-line dot-notation
		expect(record['purpose']).toBe('Second');
	});

	it('WHEN removing the skipped duplicate directly through the section THEN the index is untouched', () => {
		record.__section.children.splice(1, 1);

		// eslint-disable-next-line dot-notation
		expect(record['purpose']).toBe('First');
		expect(getFieldNames(record)).toEqual(['purpose']);
	});

	it('WHEN updating a value THEN the index and the loaded labels are untouched', () => {
		// eslint-disable-next-line dot-notation
		record['purpose'] = 'Updated';

		// eslint-disable-next-line dot-notation
		expect(record['purpose']).toBe('Updated');
		expect(getFieldNames(record)).toEqual(['purpose']);
		expect(JSON.stringify(record.__section)).toContain('"name":"Purpose"');
	});

	it('WHEN deleting and saving THEN the promoted field keeps its own label in the written document', async () => {
		// eslint-disable-next-line dot-notation
		delete record['purpose'];

		await record.save();

		const content = filesystemRecords.getFileContent('_records/test.art');

		expect(content).toContain('**purpose:** Second');
	});
});
