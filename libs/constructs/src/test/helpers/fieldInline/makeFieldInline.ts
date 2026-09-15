import type { FieldInline } from '../../../constructs/FieldInline/private/types';
import type { Tag } from '../../../constructs/Tag/private/types';

export const makeFieldInline = (options?: {
	name?: string;
	children?: FieldInline['children'];
	tags?: Tag[];
}): FieldInline => ({
	construct: 'FieldInline',
	name: options?.name ?? 'Test',
	children: options?.children ?? [],
	...(options?.tags !== undefined ? { tags: options.tags } : {}),
});
