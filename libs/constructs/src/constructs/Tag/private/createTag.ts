import type { Text } from 'mdast';

import { cleanPosition } from '../../../helpers/cleanPosition';

import { TAG_PATTERN } from './constants';
import type { Tag } from './types';

export function createTag(node: Text): Tag[] {
	const value = node.value;
	const stripped = value.trimEnd();

	TAG_PATTERN.lastIndex = 0;
	const allMatches = [...stripped.matchAll(TAG_PATTERN)];
	if (allMatches.length === 0) return [];

	const lastMatch = allMatches[allMatches.length - 1];
	if (!lastMatch) return [];
	const lastMatchIndex = lastMatch.index ?? 0;
	const lastMatchEnd = lastMatchIndex + lastMatch[0].length;
	if (lastMatchEnd !== stripped.length) return [];

	const endTags: Tag[] = [];
	let remaining = stripped;
	for (let i = allMatches.length - 1; i >= 0; i--) {
		const match = allMatches[i];
		if (!match) break;
		const expectedEnd = remaining.trimEnd().length;
		const matchIndex = match.index ?? 0;
		const matchEnd = matchIndex + match[0].length;
		if (matchEnd !== expectedEnd) break;
		endTags.unshift({
			construct: 'Tag' as const,
			name: match[1] ?? '',
			position: cleanPosition(node.position),
		});
		remaining = remaining.slice(0, matchIndex);
	}

	return endTags;
}
