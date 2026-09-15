import { describe, expect, it } from 'vitest';

import { TAG_PATTERN } from './constants';

describe('TAG_PATTERN', () => {
	it('matches a tag pattern', () => {
		const resultFriend = '(#friend)'.match(TAG_PATTERN);
		const resultMyTag = '(#my-tag)'.match(TAG_PATTERN);
		expect(resultFriend).toBeTruthy();
		expect(resultMyTag).toBeTruthy();
	});

	it('does not match non-tag text', () => {
		const result = 'hello'.match(TAG_PATTERN);
		expect(result).toBeFalsy();
	});
});
