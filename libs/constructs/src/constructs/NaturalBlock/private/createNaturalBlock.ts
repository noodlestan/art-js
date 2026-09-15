import type { MdastNode, ParserVisitContext } from '@art-js/primitives';
import { nodePosition } from '@art-js/primitives';
import type { Node } from 'mdast';
import { phrasing } from 'mdast-util-phrasing';

import { rawSlice } from '../../../helpers/rawSlice';
import { createNaturalExpression } from '../../NaturalExpression/private/createNaturalExpression';
import type { NaturalExpression } from '../../NaturalExpression/private/types';
import { extractTags } from '../../Tag/private/extractTags';

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
		position: nodePosition(node),
		children,
	};
	if (node.type === 'paragraph') {
		const last = children[children.length - 1];
		if (last?.type === 'text' && typeof last.value === 'string') {
			const { tags, stripped } = extractTags(last.value);
			if (tags.length) {
				block.tags = tags;
				last.value = stripped;
			}
		}
	}
	return block;
}
