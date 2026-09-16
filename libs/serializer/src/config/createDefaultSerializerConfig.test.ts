import { describe, expect, it, vi } from 'vitest';

import { createDefaultSerializerConfig } from './createDefaultSerializerConfig';

vi.mock('@art-js/constructs', () => ({
	createDocumentToMdast: vi.fn(() => ({ name: 'Document' })),
	createFieldBlockToMdast: vi.fn(() => ({ name: 'FieldBlock' })),
	createFieldInlineToMdast: vi.fn(() => ({ name: 'FieldInline' })),
	createNaturalBlockToMdast: vi.fn(() => ({ name: 'NaturalBlock' })),
	createNaturalExpressionToMdast: vi.fn(() => ({ name: 'NaturalExpression' })),
	createSectionBlockToMdast: vi.fn(() => ({ name: 'SectionBlock' })),
}));

describe('createDefaultSerializerConfig', () => {
	it('returns a serializer config with constructs array', async () => {
		const config = createDefaultSerializerConfig();
		expect(config.constructs).toHaveLength(6);
	});
});
