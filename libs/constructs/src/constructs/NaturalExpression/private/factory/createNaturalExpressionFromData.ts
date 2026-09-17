import type { NaturalExpression } from '../../types';

import type { NaturalExpressionFactoryData } from './types';

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
