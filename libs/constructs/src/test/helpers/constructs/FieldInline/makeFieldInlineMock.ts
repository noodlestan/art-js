/**
 * @fixture FieldInline of factory`libs/constructs/src/constructs/FieldInline/private/factory/createFieldInline.ts`
 */

import type { FieldInline, Tag } from '../../../../factories';

export const makeFieldInlineMock = (options?: {
	name?: string;
	children?: FieldInline['children'];
	tags?: Tag[];
}): FieldInline => ({
	construct: 'FieldInline',
	name: options?.name ?? 'Test',
	children: options?.children ?? [],
	...(options?.tags !== undefined ? { tags: options.tags } : {}),
});
