import type { Node } from 'mdast';

import type { FieldInline } from '../../../factories';
import { tagsToMdast } from '../../tags';
import type { ConstructSerializer } from '../../types';

export function createFieldInlineToMdast(): ConstructSerializer {
	return {
		name: 'FieldInline',
		toMdast(node, children) {
			const field = node as unknown as FieldInline;
			const tagNode = field.tags?.length ? tagsToMdast(field.tags) : null;
			return {
				type: 'paragraph',
				children: [
					{
						type: 'strong',
						children: [{ type: 'text', value: `${field.name}:` }],
					},
					{ type: 'text', value: ' ' },
					...children,
					...(tagNode ? [tagNode] : []),
				],
			} as Node;
		},
	};
}
