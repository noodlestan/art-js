import type { Text } from 'mdast';

import type { Tag } from '../../constructs';

export function tagToMdast(tag: Tag): Text {
	return { type: 'text', value: `(#${tag.name})` };
}
