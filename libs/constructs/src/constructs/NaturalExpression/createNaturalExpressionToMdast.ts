import type { Node } from 'mdast';

import type { ConstructSerializer } from '../types';

import type { NaturalExpression } from './private/types';

export function createNaturalExpressionToMdast(): ConstructSerializer {
	return {
		name: 'NaturalExpression',
		toMdast(node, children) {
			const expression = node as unknown as NaturalExpression;
			const attributes = { ...expression.attributes };
			return { type: expression.type, value: expression.value, children, ...attributes } as Node;
		},
	};
}
