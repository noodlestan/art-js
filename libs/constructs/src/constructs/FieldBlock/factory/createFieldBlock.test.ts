import { describe, expect, it } from 'vitest';

import {
	makeFieldBlockFixture,
	makeNaturalBlockFixture,
	makeTagFixture,
} from '../../../test/helpers';

import { createFieldBlock } from './createFieldBlock';

describe('createFieldBlock', () => {
	it('WHEN creating a FieldBlock from minimal data', () => {
		const result = createFieldBlock({ name: 'Test' });
		expect(result).toEqual(makeFieldBlockFixture());
	});

	it('WHEN provided includes children and tags', () => {
		const result = createFieldBlock({
			name: 'Test',
			children: [makeNaturalBlockFixture()],
			tags: [makeTagFixture()],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
