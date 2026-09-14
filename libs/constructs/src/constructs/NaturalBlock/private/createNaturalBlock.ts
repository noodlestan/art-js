import type { MdastNode, ParserVisitContext } from '@art-js/primitives';
import type { Node } from 'mdast';
import { phrasing } from 'mdast-util-phrasing';

import { cleanPosition } from '../../../helpers/cleanPosition';
import { rawSlice } from '../../../helpers/rawSlice';
import { createNaturalExpression } from '../../NaturalExpression/private/createNaturalExpression';
import type { NaturalExpression } from '../../NaturalExpression/private/types';

import type { NaturalBlock } from './types';

export function createNaturalBlock(node: Node, context: ParserVisitContext): NaturalBlock {
	let children: (NaturalBlock | NaturalExpression)[] = [];
	if (Array.isArray((node as MdastNode).children)) {
		const nodeChildren = (node as MdastNode).children ?? [];
		const phrasingContainer =
			node.type === 'paragraph' || node.type === 'heading' || node.type === 'tableCell';
		children = nodeChildren.map(child =>
			phrasingContainer || phrasing(child)
				? createNaturalExpression(child, context)
				: createNaturalBlock(child as Node, context),
		);
	}
	const block: NaturalBlock = {
		construct: 'NaturalBlock',
		...node,
		value: rawSlice(node, context),
		position: cleanPosition(node.position),
		children,
	};
	return block;
}
