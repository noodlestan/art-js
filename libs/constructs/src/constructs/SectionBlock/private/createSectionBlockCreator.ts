import type { Heading } from 'mdast';

import { cleanPosition } from '../../../helpers/cleanPosition';
import { rawSlice } from '../../../helpers/rawSlice';
import type { Tag } from '../../Tag/private/types';
import type { ConstructCreator } from '../../types';

import { KIND_PATTERN, TAG_PATTERN } from './constants';
import type { SectionBlock } from './types';

function extractEndTags(text: string): { tags: Tag[]; stripped: string } {
	TAG_PATTERN.lastIndex = 0;
	const allMatches = [...text.matchAll(TAG_PATTERN)];
	if (allMatches.length === 0) return { tags: [], stripped: text };

	const lastMatch = allMatches[allMatches.length - 1];
	if (!lastMatch) return { tags: [], stripped: text };
	const lastMatchIndex = lastMatch.index ?? 0;
	const lastMatchEnd = lastMatchIndex + lastMatch[0].length;
	const trimmedEnd = text.trimEnd().length;
	if (lastMatchEnd !== trimmedEnd) return { tags: [], stripped: text };

	const tags: Tag[] = [];
	let remaining = text;
	for (let i = allMatches.length - 1; i >= 0; i--) {
		const match = allMatches[i];
		if (!match) break;
		const expectedEnd = remaining.trimEnd().length;
		const matchIndex = match.index ?? 0;
		const matchEnd = matchIndex + match[0].length;
		if (matchEnd !== expectedEnd) break;
		tags.unshift({
			construct: 'Tag' as const,
			name: match[1] ?? '',
		});
		remaining = remaining.slice(0, matchIndex);
	}

	return { tags, stripped: remaining.trimEnd() };
}

export function createSectionBlockCreator(): ConstructCreator {
	return {
		detect: node => node.type === 'heading',
		create: (node, context) => {
			const heading = node as Heading;
			const text = rawSlice(heading, context)
				.replace(/^[ \t]*#+[ \t]*/, '')
				.trim();
			const { tags, stripped: textWithoutTags } = extractEndTags(text);
			const kindMatch = textWithoutTags.match(KIND_PATTERN);
			const section: SectionBlock = {
				construct: 'SectionBlock',
				name: kindMatch?.[2]?.trim() ?? textWithoutTags,
				children: [],
				depth: heading.depth,
				position: cleanPosition(heading.position),
			};
			if (kindMatch?.[1]) section.kind = kindMatch[1];
			if (tags.length) section.tags = tags;
			return section;
		},
	};
}
