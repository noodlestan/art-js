import { describe, expect, it } from 'vitest';

import { makeNaturalBlockFixture, makeTagFixture } from '../../../test/helpers';

import { createNaturalBlock } from './createNaturalBlock';

describe('createNaturalBlock', () => {
	it('WHEN creating a NaturalBlock from minimal data', () => {
		const result = createNaturalBlock({ value: 'hello', children: [] });
		expect(result).toEqual(makeNaturalBlockFixture());
	});

	it('WHEN provided includes optional properties', () => {
		const result = createNaturalBlock({
			value: 'hello',
			children: [],
			type: 'paragraph',
			lang: 'ts',
			meta: 'test',
			tags: [makeTagFixture()],
		});
		expect(result.type).toBe('paragraph');
		expect(result.lang).toBe('ts');
		expect(result.meta).toBe('test');
		expect(result.tags).toHaveLength(1);
	});

	it('WHEN provided includes attributes spreads them without overriding value and children', () => {
		const result = createNaturalBlock({
			value: 'hello',
			children: [],
			attributes: { ordered: true, value: 'nope', children: ['x'] },
		});
		expect(result).toMatchObject({ ordered: true, value: 'hello', children: [] });
	});
});
