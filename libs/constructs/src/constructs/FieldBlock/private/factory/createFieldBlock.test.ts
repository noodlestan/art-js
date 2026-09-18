import { describe, expect, it } from 'vitest';

import { makeFieldBlockMock, makeNaturalBlockMock, makeTagMock } from '../../../../test/helpers';

import { createFieldBlock } from './createFieldBlock';

describe('createFieldBlock', () => {
	it('WHEN creating a FieldBlock from minimal data', () => {
		const result = createFieldBlock({ name: 'Test' });
		expect(result).toEqual(makeFieldBlockMock());
	});

	it('WHEN provided includes children and tags', () => {
		const result = createFieldBlock({
			name: 'Test',
			children: [makeNaturalBlockMock()],
			tags: [makeTagMock()],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
