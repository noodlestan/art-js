import { describe, expect, it } from 'vitest';

import { makeNaturalBlock } from '../../../test/helpers/naturalBlock/makeNaturalBlock';
import { makeTag } from '../../../test/helpers/tag/makeTag';

import { createNaturalBlockFromData } from './createNaturalBlockFromData';

describe('createNaturalBlockFromData', () => {
	it('creates a NaturalBlock from minimal data', () => {
		const result = createNaturalBlockFromData({ value: 'hello', children: [] });
		expect(result).toEqual(makeNaturalBlock());
	});

	it('includes optional properties when provided', () => {
		const result = createNaturalBlockFromData({
			value: 'hello',
			children: [],
			type: 'paragraph',
			lang: 'ts',
			meta: 'test',
			tags: [makeTag()],
		});
		expect(result.type).toBe('paragraph');
		expect(result.lang).toBe('ts');
		expect(result.meta).toBe('test');
		expect(result.tags).toHaveLength(1);
	});
});
