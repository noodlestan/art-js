import { type MdastNode, type ParserVisitContext } from '@art-js/primitives';
import { nodePosition } from '@art-js/primitives/src/parser/helpers';

import type { NaturalExpression } from './types';

export function createNaturalExpression(
	node: MdastNode,
	_context: ParserVisitContext,
): NaturalExpression {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { position: _, children: mdastChildren, type, value, ...attributes } = node;

	let children: NaturalExpression[] = [];
	if (Array.isArray(mdastChildren)) {
		children = mdastChildren.map((child: MdastNode) => createNaturalExpression(child, _context));
	}

	const expression: NaturalExpression = {
		construct: 'NaturalExpression',
		type,
		attributes,
		value,
		position: nodePosition(node),
		children,
	};

	return expression;
}
