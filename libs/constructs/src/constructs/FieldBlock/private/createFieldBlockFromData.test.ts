import { describe, expect, it } from 'vitest';

import { makeFieldBlockMock } from '../../../test/helpers/constructs/FieldBlock/makeFieldBlockMock';
import { makeNaturalBlockMock } from '../../../test/helpers/constructs/NaturalBlock/makeNaturalBlockMock';
import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';

import { createFieldBlockFromData } from './createFieldBlockFromData';

describe('createFieldBlockFromData', () => {
	it('WHEN creating a FieldBlock from minimal data', () => {
		const result = createFieldBlockFromData({ name: 'Test' });
		expect(result).toEqual(makeFieldBlockMock());
	});

	it('WHEN provided includes children and tags', () => {
		const result = createFieldBlockFromData({
			name: 'Test',
			children: [makeNaturalBlockMock()],
			tags: [makeTagMock()],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
