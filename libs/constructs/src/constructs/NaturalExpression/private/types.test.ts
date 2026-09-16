import { describe, expect, it } from 'vitest';

import { makeNaturalExpressionMock } from '../../../test/helpers/constructs/NaturalExpression/makeNaturalExpressionMock';

import type { NaturalExpression } from './types';

describe('NaturalExpression type', () => {
	it('WHEN given a valid NaturalExpression accepts', () => {
		const expression: NaturalExpression = makeNaturalExpressionMock();
		expect(expression.type).toBe('text');
	});
});
