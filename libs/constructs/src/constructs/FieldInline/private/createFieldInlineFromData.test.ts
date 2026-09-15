import { describe, expect, it } from 'vitest';

import { makeNaturalExpression } from '../../../test/helpers/naturalExpression/makeNaturalExpression';
import { makeTag } from '../../../test/helpers/tag/makeTag';

import { createFieldInlineFromData } from './createFieldInlineFromData';

describe('createFieldInlineFromData', () => {
	it('creates a FieldInline from minimal data', () => {
		const result = createFieldInlineFromData({ name: 'Test' });
		expect(result).toEqual({ construct: 'FieldInline', name: 'Test', children: [] });
	});

	it('includes children and tags when provided', () => {
		const result = createFieldInlineFromData({
			name: 'Test',
			children: [makeNaturalExpression()],
			tags: [makeTag()],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
