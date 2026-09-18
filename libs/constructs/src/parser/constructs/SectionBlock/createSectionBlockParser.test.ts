import { describe, expect, it } from 'vitest';

import { createSectionBlockParser } from './createSectionBlockParser';

describe('createSectionBlockParser', () => {
	it('WHEN called returns a parser with SectionBlock name, processor, integrator and factory', () => {
		const parser = createSectionBlockParser();

		expect(parser.name).toBe('SectionBlock');
		expect(parser.processor).toBeDefined();
		expect(parser.integrator).toBeDefined();
	});
});
