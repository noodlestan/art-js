import type { Node } from 'mdast';

import { tagsToMdast } from '../Tag/private/tagsToMdast';
import type { ConstructToMdast } from '../types';

import type { FieldBlock } from './private/types';

export function createFieldBlockToMdast(): ConstructToMdast {
	return {
		construct: 'FieldBlock',
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		toMdast(node, _children) {
			const field = node as unknown as FieldBlock;
			const tagNode = field.tags?.length ? tagsToMdast(field.tags) : null;
			return {
				type: 'paragraph',
				children: [
					{
						type: 'strong',
						children: [{ type: 'text', value: `${field.name}:` }],
					},
					...(tagNode ? [tagNode] : []),
				],
			} as Node;
		},
	};
}
