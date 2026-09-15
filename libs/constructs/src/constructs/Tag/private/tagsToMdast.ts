import type { Node } from 'mdast';

import { tagToMdast } from './tagToMdast';
import type { Tag } from './types';

export function tagsToMdast(tags: Tag[]): Node[] {
	return tags.map(tagToMdast);
}
