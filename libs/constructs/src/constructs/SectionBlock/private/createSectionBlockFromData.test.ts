import { describe, expect, it } from 'vitest';

import { createSectionBlockFromData } from './createSectionBlockFromData';

describe('createSectionBlockFromData', () => {
	it('creates a SectionBlock from minimal data', () => {
		const result = createSectionBlockFromData({ name: 'Test' });
		expect(result).toEqual({ construct: 'SectionBlock', name: 'Test', children: [] });
	});

	it('includes optional properties when provided', () => {
		const result = createSectionBlockFromData({
			name: 'Test',
			kind: 'Module',
			depth: 2,
			children: [{ construct: 'NaturalBlock', value: 'hello', children: [] } as never],
			tags: [{ construct: 'Tag', name: 'test' }],
		});
		expect(result.kind).toBe('Module');
		expect(result.depth).toBe(2);
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
