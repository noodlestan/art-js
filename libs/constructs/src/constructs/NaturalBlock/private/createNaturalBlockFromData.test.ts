import { describe, expect, it } from 'vitest';

import { makeNaturalBlockMock } from '../../../test/helpers/constructs/NaturalBlock/makeNaturalBlockMock';
import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';

import { createNaturalBlockFromData } from './createNaturalBlockFromData';

describe('createNaturalBlockFromData', () => {
	it('creates a NaturalBlock from minimal data', () => {
		const result = createNaturalBlockFromData({ value: 'hello', children: [] });
		expect(result).toEqual(makeNaturalBlockMock());
	});

	it('includes optional properties when provided', () => {
		const result = createNaturalBlockFromData({
			value: 'hello',
			children: [],
			type: 'paragraph',
			lang: 'ts',
			meta: 'test',
			tags: [makeTagMock()],
		});
		expect(result.type).toBe('paragraph');
		expect(result.lang).toBe('ts');
		expect(result.meta).toBe('test');
		expect(result.tags).toHaveLength(1);
	});
});
