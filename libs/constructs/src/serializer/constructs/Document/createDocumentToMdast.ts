import type { Node } from 'mdast';

import type { ConstructSerializer } from '../../types';

export function createDocumentToMdast(): ConstructSerializer {
	return {
		name: 'Document',
		toMdast(_node, children) {
			return {
				type: 'root',
				children,
			} as Node;
		},
	};
}
