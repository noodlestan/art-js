import { describe, expect, it } from 'vitest';

import { createNaturalExpressionFromData } from './createNaturalExpressionFromData';

describe('createNaturalExpressionFromData', () => {
	it('creates a NaturalExpression from data', () => {
		const result = createNaturalExpressionFromData({ type: 'text', value: 'hello' });
		expect(result).toEqual({
			construct: 'NaturalExpression',
			type: 'text',
			value: 'hello',
			attributes: undefined,
			children: [],
		});
	});

	it('includes children and attributes when provided', () => {
		const result = createNaturalExpressionFromData({
			type: 'strong',
			attributes: { bold: true },
			children: [{ construct: 'NaturalExpression', type: 'text', value: 'hi', children: [] }],
		});
		expect(result.attributes).toEqual({ bold: true });
		expect(result.children).toHaveLength(1);
	});
});
