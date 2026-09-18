/**
 * @provides FieldBlock test fixture
 */

import type { FieldBlock, Tag } from '../../../../constructs';

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
