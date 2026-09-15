import type { Node } from 'mdast';

import { tagsToMdast } from '../Tag/private/tagsToMdast';
import type { ConstructToMdast } from '../types';

import type { FieldInline } from './private/types';

export function createFieldInlineToMdast(): ConstructToMdast {
	return {
		construct: 'FieldInline',
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
