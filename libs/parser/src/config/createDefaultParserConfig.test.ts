import { describe, expect, it, vi } from 'vitest';

import { createDefaultParserConfig } from './createDefaultParserConfig';

vi.mock('@art-js/constructs', () => ({
	CONSTRUCT_PARSERS: [
		vi.fn(() => ({ name: 'FieldInline' })),
		vi.fn(() => ({ name: 'FieldBlock' })),
		vi.fn(() => ({ name: 'SectionBlock' })),
	],
	DEFAULT_CONSTRUCT_PARSER: vi.fn(() => ({ name: 'NaturalBlock' })),
}));

describe('createDefaultParserConfig', () => {
	it('WHEN called returns a parser config with default construct and constructs array', async () => {
		const config = createDefaultParserConfig();

		expect(typeof config.defaultConstruct).toBe('function');
		expect(config.constructs).toHaveLength(3);
	});
});
