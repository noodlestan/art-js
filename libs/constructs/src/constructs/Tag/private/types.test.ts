import { describe, expect, it } from 'vitest';

import { makeTag } from '../../../test/helpers/tag/makeTag';

import type { Tag } from './types';

describe('Tag type', () => {
	it('accepts a valid Tag', () => {
		const tag: Tag = makeTag();
		expect(tag.name).toBe('test');
	});
});
