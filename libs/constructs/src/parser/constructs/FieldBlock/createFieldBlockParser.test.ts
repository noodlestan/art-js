import { describe, expect, it } from 'vitest';

import { createFieldBlockParser } from './createFieldBlockParser';

describe('createFieldBlockParser', () => {
	it('WHEN called returns a parser with FieldBlock name, processor, integrator and factory', () => {
		const parser = createFieldBlockParser();

		expect(parser.name).toBe('FieldBlock');
		expect(parser.processor).toBeDefined();
		expect(parser.integrator).toBeDefined();
	});
});
