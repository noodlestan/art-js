import { describe, expect, it } from 'vitest';

import { makeNaturalBlockMock, makeTagMock } from '../../../../test/helpers';

import { createNaturalBlockFromData } from './createNaturalBlockFromData';

describe('createNaturalBlockFromData', () => {
	it('WHEN creating a NaturalBlock from minimal data', () => {
		const result = createNaturalBlockFromData({ value: 'hello', children: [] });
		expect(result).toEqual(makeNaturalBlockMock());
	});

	it('WHEN provided includes optional properties', () => {
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
