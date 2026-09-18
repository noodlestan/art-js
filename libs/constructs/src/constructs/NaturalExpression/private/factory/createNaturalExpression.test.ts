import { describe, expect, it } from 'vitest';

import { makeNaturalExpressionMock } from '../../../../test/helpers';

import { createNaturalExpression } from './createNaturalExpression';

describe('createNaturalExpression', () => {
	it('WHEN creating a NaturalExpression from data', () => {
		const result = createNaturalExpression({ type: 'text', value: 'hello' });
		expect(result).toEqual(makeNaturalExpressionMock());
	});

	it('WHEN provided includes children and attributes', () => {
		const result = createNaturalExpression({
			type: 'strong',
			attributes: { bold: true },
			children: [makeNaturalExpressionMock({ value: 'hi' })],
		});
		expect(result.attributes).toEqual({ bold: true });
		expect(result.children).toHaveLength(1);
	});
});
