import type { NaturalExpression } from './types';

export interface NaturalExpressionFactoryData {
	type: string;
	value?: string;
	attributes?: Record<string, unknown>;
	children?: NaturalExpression[];
}

export function createNaturalExpressionFromData(
	data: NaturalExpressionFactoryData,
): NaturalExpression {
	return {
		construct: 'NaturalExpression',
		type: data.type,
		value: data.value,
		attributes: data.attributes,
		children: data.children ?? [],
	};
}
