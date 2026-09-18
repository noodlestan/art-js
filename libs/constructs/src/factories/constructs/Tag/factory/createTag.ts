import type { Tag } from '../types';

import type { TagFactoryData } from './types';

export function createTag(tagData: TagFactoryData): Tag {
	return { construct: 'Tag' as const, name: tagData.name };
}
