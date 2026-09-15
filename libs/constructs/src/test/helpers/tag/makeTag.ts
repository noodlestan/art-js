import type { Tag } from '../../../constructs/Tag/private/types';

export const makeTag = (options?: { name?: string }): Tag => ({
	construct: 'Tag',
	name: options?.name ?? 'test',
});
