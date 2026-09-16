import { describe, expect, it } from 'vitest';

import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';

import type { Tag } from './types';

describe('Tag type', () => {
	it('WHEN given a valid Tag accepts', () => {
		const tag: Tag = makeTagMock();
		expect(tag.name).toBe('test');
	});
});
