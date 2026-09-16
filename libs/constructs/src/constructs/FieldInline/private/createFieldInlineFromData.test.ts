import { describe, expect, it } from 'vitest';

import { makeNaturalExpressionMock } from '../../../test/helpers/constructs/NaturalExpression/makeNaturalExpressionMock';
import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';

import { createFieldInlineFromData } from './createFieldInlineFromData';

describe('createFieldInlineFromData', () => {
	it('creates a FieldInline from minimal data', () => {
		const result = createFieldInlineFromData({ name: 'Test' });
		expect(result).toEqual({ construct: 'FieldInline', name: 'Test', children: [] });
	});

	it('includes children and tags when provided', () => {
		const result = createFieldInlineFromData({
			name: 'Test',
			children: [makeNaturalExpressionMock()],
			tags: [makeTagMock()],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
