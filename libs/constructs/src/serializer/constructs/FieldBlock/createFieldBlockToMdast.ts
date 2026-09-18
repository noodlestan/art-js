import type { Node } from 'mdast';

import type { FieldBlock } from '../../../constructs';
import { tagsToMdast } from '../../tags';
import type { ConstructSerializer } from '../../types';

export function createFieldBlockToMdast(): ConstructSerializer {
	return {
		name: 'FieldBlock',
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
