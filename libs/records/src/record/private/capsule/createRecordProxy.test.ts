import { createArtCodec } from '@art-md/codec';
import { describe, expect, it } from 'vitest';

import { createRecord } from '../../createRecord.js';
import type { ArtRecord } from '../../types.js';

describe('createRecordProxy', () => {
	function createTestRecord(): ArtRecord {
		return createRecord({ codec: createArtCodec(), contentSource: {} as never });
	}

	it('GIVEN a reserved name WHEN reading THEN a TypeError is thrown', () => {
		const record = createTestRecord();

		expect(
			() =>
				// eslint-disable-next-line dot-notation
				record['__private'],
		).toThrow('Record field names starting with "__" are reserved');
	});

	it('GIVEN a reserved name WHEN deleting THEN a TypeError is thrown', () => {
		const record = createTestRecord();

		expect(() => {
			// eslint-disable-next-line dot-notation
			delete record['__private'];
		}).toThrow('Record field names starting with "__" are reserved');
	});

	it('GIVEN a non-canonical name WHEN writing THEN a TypeError is thrown and nothing is appended', () => {
		const record = createTestRecord();

		expect(() => {
			// eslint-disable-next-line dot-notation
			record['Canonical Name'] = 'x';
		}).toThrow('Invalid record field name: "Canonical Name"');
		expect(record.__section.children).toHaveLength(0);
	});

	it('GIVEN a non-canonical name outside the index WHEN reading THEN it resolves to undefined', () => {
		const record = createTestRecord();

		// eslint-disable-next-line dot-notation
		expect(record['Years active']).toBeUndefined();
	});

	it('GIVEN a non-canonical name outside the index WHEN deleting THEN a TypeError is thrown', () => {
		const record = createTestRecord();

		expect(() => {
			// eslint-disable-next-line dot-notation
			delete record['Years active'];
		}).toThrow('Invalid record field name: "Years active"');
	});

	it('GIVEN a canonical name outside the index WHEN reading THEN it resolves to undefined', () => {
		const record = createTestRecord();

		// eslint-disable-next-line dot-notation
		expect(record['brandNew']).toBeUndefined();
	});

	it('GIVEN a canonical name outside the index WHEN writing THEN the field is appended with a generated label', () => {
		const record = createTestRecord();

		// eslint-disable-next-line dot-notation
		record['brandNew'] = 'x';

		expect(record.__section.children).toHaveLength(1);
		expect(record.__section.children[0]).toMatchObject({
			construct: 'FieldInline',
			name: 'Brand New',
		});
	});

	it('GIVEN a canonical name outside the index WHEN deleting THEN the proxy refuses with a TypeError', () => {
		const record = createTestRecord();

		// The trap reports not-removed with a falsy result; the proxy invariant
		// turns that falsy result into a TypeError at the call site.
		expect(() => {
			// eslint-disable-next-line dot-notation
			delete record['brandNew'];
		}).toThrow(TypeError);
	});

	const labelRepairMembers = [
		'relabelField',
		'setFieldMarkdownByLabel',
		'setFieldValueByLabel',
		'getFieldMarkdownByLabel',
		'getFieldTextByLabel',
		'getFieldValueByLabel',
	] as const;

	it.each(labelRepairMembers)(
		'GIVEN the "%s" handle member WHEN reading it THEN it is the member function, not a field',
		member => {
			const record = createTestRecord();
			const descriptor = Object.getOwnPropertyDescriptor(record, member);

			expect(typeof record[member]).toBe('function');
			expect(descriptor).toMatchObject({ configurable: true, enumerable: false });
			expect(Object.keys(record)).not.toContain(member);
			expect(member in record).toBe(true);
		},
	);

	it.each(labelRepairMembers)(
		'GIVEN the "%s" handle member WHEN writing or deleting it THEN the proxy refuses with a TypeError',
		member => {
			const record = createTestRecord();
			const fieldTarget = record as unknown as Record<string, unknown>;

			expect(() => {
				fieldTarget[member] = 'Updated';
			}).toThrow(TypeError);
			expect(() => {
				delete fieldTarget[member];
			}).toThrow(TypeError);
			expect(Object.keys(record)).not.toContain(member);
		},
	);
});
