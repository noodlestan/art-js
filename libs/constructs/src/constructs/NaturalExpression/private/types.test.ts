import { describe, expect, it } from 'vitest';

import type { NaturalExpression } from './types';

describe('NaturalExpression type', () => {
	it('accepts a valid NaturalExpression', () => {
		const expression: NaturalExpression = {
			construct: 'NaturalExpression',
			type: 'text',
			value: 'hello',
			children: [],
		};
		expect(expression.type).toBe('text');
	});
});
