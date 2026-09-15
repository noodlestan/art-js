import type { Content, Node } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

import { tagsToMdast } from '../Tag/private/tagsToMdast';
import type { ConstructSerializer } from '../types';

import type { SectionBlock } from './private/types';

export function createSectionBlockToMdast(): ConstructSerializer {
	return {
		name: 'SectionBlock',
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		toMdast(node, _children) {
			const section = node as unknown as SectionBlock;
			const depth = section.depth ?? 1;
			const parsed = fromMarkdown(`# ${section.name}`);
			const heading = parsed.children.find(child => child.type === 'heading');
			const tagNode = section.tags?.length ? tagsToMdast(section.tags) : null;
			const children: Content[] =
				heading && 'children' in heading
					? [...heading.children, ...(tagNode ? [tagNode] : [])]
					: [{ type: 'text' as const, value: section.name }, ...(tagNode ? [tagNode] : [])];
			return {
				type: 'heading',
				depth: depth as 1 | 2 | 3 | 4 | 5 | 6,
				children,
			} as Node;
		},
	};
}
