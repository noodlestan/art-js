import type { Text } from 'mdast';

import type { Tag } from '../../constructs/Tag/types';

export function tagToMdast(tag: Tag): Text {
	return { type: 'text', value: `(#${tag.name})` };
}
