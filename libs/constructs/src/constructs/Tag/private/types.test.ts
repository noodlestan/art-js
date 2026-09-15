import { describe, expect, it } from 'vitest';

import type { Tag } from './types';

describe('Tag type', () => {
	it('accepts a valid Tag', () => {
		const tag: Tag = { construct: 'Tag', name: 'test' };
		expect(tag.name).toBe('test');
	});
});
