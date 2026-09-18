/**
 * @fixture FieldBlock of factory`libs/constructs/src/constructs/FieldBlock/private/factory/createFieldBlock.ts`
 */

import type { FieldBlock, Tag } from '../../../../factories';

export const makeFieldBlockMock = (options?: {
	name?: string;
	children?: FieldBlock['children'];
	tags?: Tag[];
}): FieldBlock => ({
	construct: 'FieldBlock',
	name: options?.name ?? 'Test',
	children: options?.children ?? [],
	...(options?.tags !== undefined ? { tags: options.tags } : {}),
});
