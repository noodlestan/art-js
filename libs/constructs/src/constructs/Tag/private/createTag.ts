import type { Tag } from './types';

export interface TagFactoryData {
	name: string;
}

export function createTag(tagData: TagFactoryData): Tag {
	return { construct: 'Tag' as const, name: tagData.name };
}
