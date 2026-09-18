import { describe, expect, it } from 'vitest';

import {
	makeFieldInlineFixture,
	makeNaturalExpressionFixture,
	makeTagFixture,
} from '../../../test/helpers';

import { createFieldInline } from './createFieldInline';

describe('createFieldInline', () => {
	it('WHEN creating a FieldInline from minimal data', () => {
		const result = createFieldInline({ name: 'Test' });
		expect(result).toEqual(makeFieldInlineFixture());
	});

	it('WHEN provided includes children and tags', () => {
		const result = createFieldInline({
			name: 'Test',
			children: [makeNaturalExpressionFixture()],
			tags: [makeTagFixture()],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
