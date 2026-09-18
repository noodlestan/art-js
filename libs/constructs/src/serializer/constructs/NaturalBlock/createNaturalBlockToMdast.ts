import type { Node } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

import type { NaturalBlock } from '../../../factories';
import { tagsToMdast } from '../../tags';
import type { ConstructSerializer } from '../../types';

export function createNaturalBlockToMdast(): ConstructSerializer {
	return {
		name: 'NaturalBlock',
		toMdast(node, children) {
			const block = node as unknown as NaturalBlock;
			const parsed = fromMarkdown(block.value);
			if (block.type === 'paragraph' && children.length > 0) {
				const paragraph = parsed.children.find(child => child.type === 'paragraph');
				if (paragraph && 'children' in paragraph) {
					const tagNode = block.tags?.length ? tagsToMdast(block.tags) : null;
					paragraph.children = [
						...children,
						...(tagNode ? [tagNode] : []),
					] as typeof paragraph.children;
				}
			}
			return {
				type: 'root',
				children: parsed.children,
			} as Node;
		},
	};
}
