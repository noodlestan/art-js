import { describe, expect, it } from 'vitest';

import { tagToMdast } from './tagToMdast';

describe('tagToMdast', () => {
	it('returns a text node with the tag name', () => {
		const result = tagToMdast({ construct: 'Tag', name: 'friend' });
		expect(result).toEqual({ type: 'text', value: '(#friend)' });
	});
});
