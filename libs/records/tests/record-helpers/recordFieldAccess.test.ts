import { beforeEach, describe, expect, it } from 'vitest';

import type { ArtRecord } from '../../src/index.js';
import { createSectionRecord, getFieldNames, makeFieldInline } from '../helpers/records/index.js';

import {
	absentKeyCases,
	accessFields,
	accessRecordName,
	deleteFalseCases,
	deleteHandleCases,
	deleteThrowCases,
	deleteTrueCases,
	enumeratedCases,
	expectedExposedKeys,
	memberFalseCases,
	memberTrueCases,
	readThrowCases,
	readValueCases,
	writeThrowCases,
	writeValueCases,
} from './recordFieldAccess.fixtures.js';

function listFieldLabels(artRecord: ArtRecord): string[] {
	const labels: string[] = [];

	for (const child of artRecord.__section.children) {
		if ('name' in child && typeof child.name === 'string') {
			labels.push(child.name);
		}
	}

	return labels;
}

describe('record field access', () => {
	let record: ArtRecord;

	beforeEach(() => {
		const fields = accessFields.map(([name, value]) => makeFieldInline(name, value));

		record = createSectionRecord(accessRecordName, [...fields]);
	});

	it('WHEN reading handle members THEN they are unchanged', () => {
		expect(record.name).toBe(accessRecordName);
		expect(typeof record.renameField).toBe('function');
		expect(typeof record.save).toBe('function');
		expect(record.__section.construct).toBe('SectionBlock');
	});

	it('WHEN writing a handle member THEN the handle keeps its own behaviour and no field is appended', () => {
		const fieldNamesBefore = getFieldNames(record);

		expect(() => {
			record.name = 'Renamed Record';
		}).toThrow('An extracted record name is immutable');
		expect(getFieldNames(record)).toEqual(fieldNamesBefore);
	});

	it.each(readValueCases)(
		'WHEN reading "%s" THEN the indexed value or undefined is returned',
		(name, expected) => {
			expect(record[name]).toBe(expected);
		},
	);

	it.each(readThrowCases)(
		'WHEN reading the reserved name "%s" THEN a TypeError is thrown',
		name => {
			expect(() => record[name]).toThrow(TypeError);
		},
	);

	it.each(writeValueCases)(
		'WHEN writing "%s" THEN the value is written and the loaded or generated label survives',
		(name, value, expectedLabel) => {
			record[name] = value;

			expect(record[name]).toBe(value);
			expect(listFieldLabels(record)).toContain(expectedLabel);
		},
	);

	it.each(writeThrowCases)(
		'WHEN writing the invalid name "%s" THEN a TypeError is thrown and nothing is appended',
		(name, expectedMessage) => {
			const labelsBefore = listFieldLabels(record);

			expect(() => {
				record[name] = 'Updated';
			}).toThrow(expectedMessage);
			expect(listFieldLabels(record)).toEqual(labelsBefore);
		},
	);

	it.each(deleteTrueCases)(
		'WHEN deleting the indexed name "%s" THEN deletion reports true and the name is forgotten',
		name => {
			expect(delete record[name]).toBe(true);
			expect(getFieldNames(record)).not.toContain(name);
		},
	);

	// The trap reports not-removed with a falsy result; the proxy invariant turns
	// that falsy result into a TypeError at the call site.
	it.each(deleteFalseCases)(
		'WHEN deleting the canonical name "%s" outside the index THEN the proxy refuses with a TypeError',
		name => {
			expect(() => {
				delete record[name];
			}).toThrow(TypeError);
			expect(getFieldNames(record)).not.toContain(name);
		},
	);

	it.each(deleteHandleCases)(
		'WHEN deleting the handle member "%s" THEN the proxy refuses with a TypeError',
		name => {
			expect(() => {
				delete record[name];
			}).toThrow(TypeError);
		},
	);

	it.each(deleteThrowCases)(
		'WHEN deleting the invalid name "%s" THEN a TypeError is thrown',
		(name, expectedMessage) => {
			expect(() => {
				delete record[name];
			}).toThrow(expectedMessage);
		},
	);

	it.each(memberTrueCases)('WHEN checking that "%s" is in the record THEN it is true', name => {
		expect(name in record).toBe(true);
	});

	it.each(memberFalseCases)('WHEN checking that "%s" is in the record THEN it is false', name => {
		expect(name in record).toBe(false);
	});

	it.each(enumeratedCases)(
		'WHEN writing "%s" and enumerating keys THEN the name is listed',
		name => {
			record[name] = 'Updated';

			expect(Object.keys(record)).toContain(name);
		},
	);

	it.each(absentKeyCases)(
		'WHEN writing the invalid name "%s" fails and enumerating THEN the name is absent',
		name => {
			expect(() => {
				record[name] = 'Updated';
			}).toThrow();

			expect(Object.keys(record)).not.toContain(name);
		},
	);

	it('WHEN enumerating keys THEN exactly the exposed index names are listed in document order', () => {
		expect(getFieldNames(record)).toEqual([...expectedExposedKeys]);
	});
});
