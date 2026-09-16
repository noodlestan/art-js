import { describe, expect, it, vi } from 'vitest';

import { createDefaultConfig } from './createDefaultConfig';

vi.mock('@art-js/constructs', () => ({
	createFieldBlockParser: vi.fn(() => ({ name: 'FieldBlock' })),
	createFieldInlineParser: vi.fn(() => ({ name: 'FieldInline' })),
	createNaturalBlockParser: vi.fn(() => ({ name: 'NaturalBlock' })),
	createSectionBlockParser: vi.fn(() => ({ name: 'SectionBlock' })),
}));

describe('createDefaultConfig', () => {
	it('WHEN called returns a parser config with default construct and constructs array', async () => {
		const config = createDefaultConfig();

		expect(typeof config.defaultConstruct).toBe('function');
		expect(config.constructs).toHaveLength(3);
	});
});
