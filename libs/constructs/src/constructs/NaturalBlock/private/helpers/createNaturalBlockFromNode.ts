import type { MdastNode, ParserVisitContext } from '@art-js/primitives';
import { nodePosition } from '@art-js/primitives';
import type { Node } from 'mdast';
import { phrasing } from 'mdast-util-phrasing';

import { rawSlice } from '../../../../shared/mdast';
import { createNaturalExpressionFromNode } from '../../../../shared/natural-expression';
import { extractTags } from '../../../../shared/tags';
import type { NaturalExpression } from '../../../NaturalExpression';
import type { Tag } from '../../../Tag';
import type { NaturalBlock } from '../../types';
import { createNaturalBlock } from '../factory/createNaturalBlock';

export function createNaturalBlockFromNode(node: Node, context: ParserVisitContext): NaturalBlock {
	let children: (NaturalBlock | NaturalExpression)[] = [];
	if (Array.isArray((node as MdastNode).children)) {
		const nodeChildren = (node as MdastNode).children ?? [];
		const phrasingContainer =
			node.type === 'paragraph' || node.type === 'heading' || node.type === 'tableCell';
		children = nodeChildren.map(child =>
			phrasingContainer || phrasing(child)
				? createNaturalExpressionFromNode(child)
				: createNaturalBlockFromNode(child as Node, context),
		);
	}

	let tags: Tag[] = [];
	if (node.type === 'paragraph') {
		const last = children[children.length - 1];
		if (last?.type === 'text' && typeof last.value === 'string') {
			const { tags: extractedTags, stripped } = extractTags(last.value);
			if (extractedTags.length) {
				tags = extractedTags;
				last.value = stripped;
			}
		}
	}

	const { type, ...attributes } = node as MdastNode;
	const block = createNaturalBlock({
		value: rawSlice(node, context),
		children,
		type,
		attributes,
		tags,
	});
	block.position = nodePosition(node);
	return block;
}
