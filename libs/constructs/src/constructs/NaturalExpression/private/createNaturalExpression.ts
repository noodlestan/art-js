import type { MdastNode, ParserVisitContext } from '@art-js/primitives';

import { cleanPosition } from '../../../helpers/cleanPosition';

import type { NaturalExpression } from './types';

export function createNaturalExpression(
	node: MdastNode,
	_context: ParserVisitContext,
): NaturalExpression {
	const { children: mdastChildren, position, type, value, ...attributes } = node;

	let children: NaturalExpression[] = [];
	if (Array.isArray(mdastChildren)) {
		children = mdastChildren.map((child: MdastNode) => createNaturalExpression(child, _context));
	}

	const expression: NaturalExpression = {
		construct: 'NaturalExpression',
		type,
		attributes,
		value,
		position: cleanPosition(position),
		children,
	};

	return expression;
}
