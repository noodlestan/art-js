import { describe, expect, it } from 'vitest';

import { createNaturalBlockParser } from './createNaturalBlockParser';

describe('createNaturalBlockParser', () => {
	it('WHEN called returns a parser with NaturalBlock name, processor and factory', () => {
		const parser = createNaturalBlockParser();

		expect(parser.name).toBe('NaturalBlock');
		expect(parser.processor).toBeDefined();
	});
});
