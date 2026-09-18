import { describe, expect, it } from 'vitest';

import {
	makeFieldInlineMock,
	makeNaturalExpressionMock,
	makeTagMock,
} from '../../../../test/helpers';

import { createFieldInline } from './createFieldInline';

describe('createFieldInline', () => {
	it('WHEN creating a FieldInline from minimal data', () => {
		const result = createFieldInline({ name: 'Test' });
		expect(result).toEqual(makeFieldInlineMock());
	});

	it('WHEN provided includes children and tags', () => {
		const result = createFieldInline({
			name: 'Test',
			children: [makeNaturalExpressionMock()],
			tags: [makeTagMock()],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
