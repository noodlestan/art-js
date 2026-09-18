import type { Text } from 'mdast';

import type { Tag } from '../../factories';

import { tagToMdast } from './tagToMdast';

export function tagsToMdast(tags: Tag[]): Text {
	const value = tags.map(tag => tagToMdast(tag).value).join(' ');
	return { type: 'text', value: ` ${value}` };
}
