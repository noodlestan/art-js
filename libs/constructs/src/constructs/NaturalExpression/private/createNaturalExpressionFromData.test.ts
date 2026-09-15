import { describe, expect, it } from 'vitest';

import { makeNaturalExpression } from '../../../test/helpers/naturalExpression/makeNaturalExpression';

import { createNaturalExpressionFromData } from './createNaturalExpressionFromData';

describe('createNaturalExpressionFromData', () => {
	it('creates a NaturalExpression from data', () => {
		const result = createNaturalExpressionFromData({ type: 'text', value: 'hello' });
		expect(result).toEqual(makeNaturalExpression());
	});

	it('includes children and attributes when provided', () => {
		const result = createNaturalExpressionFromData({
			type: 'strong',
			attributes: { bold: true },
			children: [makeNaturalExpression({ value: 'hi' })],
		});
		expect(result.attributes).toEqual({ bold: true });
		expect(result.children).toHaveLength(1);
	});
});
