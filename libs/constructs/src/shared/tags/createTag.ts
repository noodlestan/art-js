import type { Tag } from '../../constructs/Tag/types';

import type { TagFactoryData } from './types';

export function createTag(tagData: TagFactoryData): Tag {
	return { construct: 'Tag' as const, name: tagData.name };
}
