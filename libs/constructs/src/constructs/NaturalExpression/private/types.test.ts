import { describe, expect, it } from 'vitest';

import { makeNaturalExpression } from '../../../test/helpers/naturalExpression/makeNaturalExpression';

import type { NaturalExpression } from './types';

describe('NaturalExpression type', () => {
	it('accepts a valid NaturalExpression', () => {
		const expression: NaturalExpression = makeNaturalExpression();
		expect(expression.type).toBe('text');
	});
});
