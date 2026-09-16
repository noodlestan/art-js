import { describe, expect, it } from 'vitest';

import { createTag } from './createTag';

describe('createTag', () => {
	it('WHEN creating a Tag from data', () => {
		const result = createTag({ name: 'friend' });
		expect(result).toEqual({ construct: 'Tag', name: 'friend' });
	});
});
