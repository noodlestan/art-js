import type { FieldBlock } from '../../../constructs/FieldBlock/private/types';
import type { Tag } from '../../../constructs/Tag/private/types';

export const makeFieldBlock = (options?: {
	name?: string;
	children?: FieldBlock['children'];
	tags?: Tag[];
}): FieldBlock => ({
	construct: 'FieldBlock',
	name: options?.name ?? 'Test',
	children: options?.children ?? [],
	...(options?.tags !== undefined ? { tags: options.tags } : {}),
});
