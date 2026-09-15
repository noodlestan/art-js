import { describe, expect, it } from 'vitest';

import { createTag } from './createTag';

describe('createTag', () => {
	it('creates a Tag from data', () => {
		const result = createTag({ name: 'friend' });
		expect(result).toEqual({ construct: 'Tag', name: 'friend' });
	});
});
