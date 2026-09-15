import { describe, expect, it } from 'vitest';

import { createFieldBlockFromData } from './createFieldBlockFromData';

describe('createFieldBlockFromData', () => {
	it('creates a FieldBlock from minimal data', () => {
		const result = createFieldBlockFromData({ name: 'Test' });
		expect(result).toEqual({ construct: 'FieldBlock', name: 'Test', children: [] });
	});

	it('includes children and tags when provided', () => {
		const result = createFieldBlockFromData({
			name: 'Test',
			children: [{ construct: 'NaturalBlock', value: 'hello', children: [] }],
			tags: [{ construct: 'Tag', name: 'test' }],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
