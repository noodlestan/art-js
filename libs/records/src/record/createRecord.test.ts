import { describe, expect, it } from 'vitest';

import { createRecord } from './createRecord.js';

describe('createRecord', () => {
	it('WHEN called, creates a source-bound record with an empty h1 section', () => {
		const record = createRecord({
			codec: {} as never,
			contentSource: {} as never,
		});

		expect(record.name).toBe('');
		expect(record.__section.construct).toBe('SectionBlock');
		expect(record.__section.depth).toBe(1);
		expect(record.__section.children).toEqual([]);
	});

	it('WHEN assigning a field, reserves field names with a double-underscore prefix', () => {
		const record = createRecord({
			codec: {} as never,
			contentSource: {} as never,
		});

		expect(() => {
			// eslint-disable-next-line dot-notation
			record['__private'] = 'value';
		}).toThrow('Record field names starting with "__" are reserved');
	});
});
