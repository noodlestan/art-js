import { describe, expect, it } from 'vitest';

import { TAG_PATTERN } from './constants';

describe('TAG_PATTERN', () => {
	it('matches a tag pattern', () => {
		expect('(#friend)'.match(TAG_PATTERN)).toBeTruthy();
		expect('(#my-tag)'.match(TAG_PATTERN)).toBeTruthy();
	});

	it('does not match non-tag text', () => {
		expect('hello'.match(TAG_PATTERN)).toBeFalsy();
	});
});
