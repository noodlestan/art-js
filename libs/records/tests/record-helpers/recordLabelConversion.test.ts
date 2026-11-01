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
	conversionFields,
	conversionRecordName,
	directionBDocument,
	directionBWriteCases,
	nonCanonicalExtractedNames,
} from './recordLabelConversion.fixtures.js';

describe('record label conversion', () => {
	let record: ArtRecord;

	beforeEach(() => {
		const fields = conversionFields.map(([name, value]) => makeFieldInline(name, value));

		record = createSectionRecord(conversionRecordName, [...fields]);
	});

	it('GIVEN digit-led and non-ASCII labels WHEN extracting THEN the labels keep their original spelling', () => {
		const sectionContent = JSON.stringify(record.__section);

		expect(sectionContent).toContain('"name":"3A33"');
		expect(sectionContent).toContain('"name":"Ação"');
		expect(getFieldNames(record)).toEqual(['3A33', 'ação']);
	});

	it.each(nonCanonicalExtractedNames)(
		'WHEN reading the extracted non-canonical name "%s" THEN its value resolves',
		name => {
			const expectedValue = name === '3A33' ? 'Digit Led' : 'Accented';

			expect(record[name]).toBe(expectedValue);
		},
	);

	it('WHEN writing a non-canonical extracted name THEN the value is replaced and the label is kept', () => {
		const digitLedName = '3A33';

		record[digitLedName] = 'Updated';

		expect(record[digitLedName]).toBe('Updated');
		expect(JSON.stringify(record.__section)).toContain('"name":"3A33"');
	});
});

describe('record direction B round trip', () => {
	let record: ArtRecord;
	let filesystemRecords: AdapterMock;

	beforeEach(async () => {
		({ record, filesystemRecords } = await extractTestRecord(
			directionBDocument,
			conversionRecordName,
		));
	});

	it.each(directionBWriteCases)(
		'WHEN writing "%s", saving, and extracting again THEN the generated label round-trips',
		async (name, value, expectedLine) => {
			record[name] = value;

			await record.save();

			const savedContent = filesystemRecords.getFileContent('_records/test.art');
			const reExtracted = await extractTestRecord(savedContent ?? '', conversionRecordName);

			expect(savedContent).toContain(expectedLine);
			expect(reExtracted.record[name]).toBe(value);
		},
	);
});
