import { describe, expect, it } from 'vitest';

import { createArtRecord } from './createArtRecord.js';

describe('createArtRecord', () => {
	it('creates a source-bound record with an empty section', () => {
		const record = createArtRecord({
			codec: {} as never,
			contentSource: {} as never,
		});

		expect(record.name).toBe('');
		expect(record.__section.construct).toBe('SectionBlock');
		expect(record.__section.children).toEqual([]);
	});

	it('reserves field names with a double-underscore prefix', () => {
		const record = createArtRecord({
			codec: {} as never,
			contentSource: {} as never,
		});

		expect(() => {
			// eslint-disable-next-line dot-notation
			record['__private'] = 'value';
		}).toThrow('Record field names starting with "__" are reserved');
	});
});
