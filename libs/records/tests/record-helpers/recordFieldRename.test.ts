import { beforeEach, describe, expect, it } from 'vitest';

import type { ArtRecord } from '../../src/index.js';
import type { AdapterMock } from '../helpers/adapter/index.js';
import {
	createSectionRecord,
	extractTestRecord,
	getFieldNames,
	makeFieldInline,
} from '../helpers/records/index.js';

import {
	renameDigitLedFields,
	renameDocument,
	renameRecordName,
	renameRejectionCases,
} from './recordFieldRename.fixtures.js';

describe('record field rename', () => {
	let record: ArtRecord;
	let filesystemRecords: AdapterMock;

	beforeEach(async () => {
		({ record, filesystemRecords } = await extractTestRecord(renameDocument, renameRecordName));
	});

	function snapshotRecordState(): string {
		return JSON.stringify({ section: record.__section, keys: getFieldNames(record) });
	}

	it.each(renameRejectionCases)(
		'WHEN renameField("%s", "%s") is rejected THEN "%s" is thrown and nothing changes',
		(fromName, toName, expectedMessage) => {
			const stateBefore = snapshotRecordState();

			expect(() => {
				record.renameField(fromName, toName);
			}).toThrow(expectedMessage);

			expect(snapshotRecordState()).toBe(stateBefore);
		},
	);

	it('WHEN renaming onto a canonical name THEN the field is relabelled and reads through the new name', () => {
		record.renameField('purpose', 'brandNew');

		// eslint-disable-next-line dot-notation
		expect(record['brandNew']).toBe('First');
		// eslint-disable-next-line dot-notation
		expect(record['purpose']).toBe('Second');
		expect(JSON.stringify(record.__section)).toContain('"name":"Brand New"');
	});

	it('WHEN renaming and saving THEN the new label is written and the old one is gone', async () => {
		record.renameField('purpose', 'brandNew');

		await record.save();

		const content = filesystemRecords.getFileContent('_records/test.art');

		expect(content).toContain('**Brand New:** First');
		expect(content).not.toContain('**Purpose:**');
	});

	describe('GIVEN a hand-built record holding a digit-led field', () => {
		let digitLedRecord: ArtRecord;

		beforeEach(() => {
			const fields = renameDigitLedFields.map(([name, value]) => makeFieldInline(name, value));

			digitLedRecord = createSectionRecord(renameRecordName, [...fields]);
		});

		it('WHEN renaming the extracted non-canonical name THEN it succeeds onto a canonical name', () => {
			digitLedRecord.renameField('3A33', 'repaired');

			// eslint-disable-next-line dot-notation
			expect(digitLedRecord['repaired']).toBe('Digit Led');
			// eslint-disable-next-line dot-notation
			expect(digitLedRecord['3A33']).toBeUndefined();
		});

		it('WHEN renaming onto a name that is non-canonical and taken THEN the canonical check is thrown first', () => {
			expect(() => {
				digitLedRecord.renameField('purpose', '3A33');
			}).toThrow('Invalid record field name: "3A33"');
		});
	});
});
