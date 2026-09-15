import type { Text } from 'mdast';

import type { Tag } from './types';

export function tagToMdast(tag: Tag): Text {
	return { type: 'text', value: `(#${tag.name})` };
}
