import type { Text } from 'mdast';

import { tagToMdast } from './tagToMdast';
import type { Tag } from './types';

export function tagsToMdast(tags: Tag[]): Text {
	const value = tags.map(tag => tagToMdast(tag).value).join(' ');
	return { type: 'text', value: ` ${value}` };
}
