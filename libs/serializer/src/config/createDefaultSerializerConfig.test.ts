import { describe, expect, it, vi } from 'vitest';

import { createDefaultSerializerConfig } from './createDefaultSerializerConfig';

vi.mock('@art-js/constructs', () => ({
	CONSTRUCT_SERIALIZERS: [
		vi.fn(() => ({ name: 'Document' })),
		vi.fn(() => ({ name: 'FieldBlock' })),
		vi.fn(() => ({ name: 'FieldInline' })),
	],
}));

describe('createDefaultSerializerConfig', () => {
	it('returns a serializer config with constructs array', async () => {
		const config = createDefaultSerializerConfig();

		expect(config.constructs).toHaveLength(3);
	});
});
