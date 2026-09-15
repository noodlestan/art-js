import { describe, expect, it } from 'vitest';

import { createFieldInlineParser } from './createFieldInlineParser';

describe('createFieldInlineParser', () => {
	it('returns a parser with FieldInline name, processor and factory', () => {
		const parser = createFieldInlineParser();
		expect(parser.name).toBe('FieldInline');
		expect(parser.processor).toBeDefined();
		expect(parser.factory.fromData({ name: 'Test' })).toEqual({
			construct: 'FieldInline',
			name: 'Test',
			children: [],
		});
	});
});
