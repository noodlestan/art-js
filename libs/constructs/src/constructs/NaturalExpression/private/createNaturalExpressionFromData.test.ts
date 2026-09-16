import { describe, expect, it } from 'vitest';

import { makeNaturalExpressionMock } from '../../../test/helpers/constructs/NaturalExpression/makeNaturalExpressionMock';

import { createNaturalExpressionFromData } from './createNaturalExpressionFromData';

describe('createNaturalExpressionFromData', () => {
	it('WHEN creating a NaturalExpression from data', () => {
		const result = createNaturalExpressionFromData({ type: 'text', value: 'hello' });
		expect(result).toEqual(makeNaturalExpressionMock());
	});

	it('WHEN provided includes children and attributes', () => {
		const result = createNaturalExpressionFromData({
			type: 'strong',
			attributes: { bold: true },
			children: [makeNaturalExpressionMock({ value: 'hi' })],
		});
		expect(result.attributes).toEqual({ bold: true });
		expect(result.children).toHaveLength(1);
	});
});
