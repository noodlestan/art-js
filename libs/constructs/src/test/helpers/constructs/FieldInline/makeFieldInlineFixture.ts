/**
 * @fixture FieldInline of factory`libs/constructs/src/constructs/FieldInline/factory/createFieldInline.ts`
 */

import type { FieldInline, Tag } from '../../../../constructs';

export const makeFieldInlineFixture = (options?: {
	name?: string;
	children?: FieldInline['children'];
	tags?: Tag[];
}): FieldInline => ({
	construct: 'FieldInline',
	name: options?.name ?? 'Test',
	children: options?.children ?? [],
	...(options?.tags !== undefined ? { tags: options.tags } : {}),
});
