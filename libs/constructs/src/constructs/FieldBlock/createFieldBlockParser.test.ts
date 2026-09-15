import { describe, expect, it } from 'vitest';

import { createFieldBlockParser } from './createFieldBlockParser';

describe('createFieldBlockParser', () => {
	it('returns a parser with FieldBlock name, processor, integrator and factory', () => {
		const parser = createFieldBlockParser();
		expect(parser.name).toBe('FieldBlock');
		expect(parser.processor).toBeDefined();
		expect(parser.integrator).toBeDefined();
		expect(parser.factory.fromData({ name: 'Test' })).toEqual({
			construct: 'FieldBlock',
			name: 'Test',
			children: [],
		});
	});
});
