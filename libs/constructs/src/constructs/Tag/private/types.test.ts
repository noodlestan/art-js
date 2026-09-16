import { describe, expect, it } from 'vitest';

import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';

import type { Tag } from './types';

describe('Tag type', () => {
	it('accepts a valid Tag', () => {
		const tag: Tag = makeTagMock();
		expect(tag.name).toBe('test');
	});
});
