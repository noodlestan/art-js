import type { Node } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

import type { ConstructToMdast } from '../types';

import type { SectionBlock } from './private/types';

export function createSectionBlockToMdast(): ConstructToMdast {
	return {
		construct: 'SectionBlock',
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		toMdast(node, _children) {
			const section = node as unknown as SectionBlock;
			const depth = section.depth ?? 1;
			const parsed = fromMarkdown(`# ${section.name}`);
			const heading = parsed.children.find(child => child.type === 'heading');
			const children =
				heading && 'children' in heading
					? (heading.children as typeof heading.children)
					: [{ type: 'text' as const, value: section.name }];
			return {
				type: 'heading',
				depth: depth as 1 | 2 | 3 | 4 | 5 | 6,
				children,
			} as Node;
		},
	};
}
