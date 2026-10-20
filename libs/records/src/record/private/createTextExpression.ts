import type { NaturalExpression } from '@art-md/constructs';

export function createTextExpression(value: string): NaturalExpression {
	return {
		construct: 'NaturalExpression',
		type: 'text',
		value,
		children: [],
	};
}
