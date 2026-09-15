import { describe, expect, it } from 'vitest';

import type { SerializerConfig } from './types';

describe('SerializerConfig type', () => {
	it('accepts a valid serializer config shape', () => {
		const config: SerializerConfig = {
			constructs: [() => ({ name: 'Document', toMdast: () => ({ type: 'root' }) })],
		};
		expect(config.constructs).toHaveLength(1);
	});
});
