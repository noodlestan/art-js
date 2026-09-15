import type { Node } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

import { tagsToMdast } from '../Tag/private/tagsToMdast';
import type { ConstructToMdast } from '../types';

import type { NaturalBlock } from './private/types';

export function createNaturalBlockToMdast(): ConstructToMdast {
	return {
		construct: 'NaturalBlock',
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
