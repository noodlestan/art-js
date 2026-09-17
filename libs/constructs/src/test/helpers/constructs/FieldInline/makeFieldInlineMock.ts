/**
 * @provides FieldInline test fixture
 */

import type { FieldInline } from '../../../../constructs/';
import type { Tag } from '../../../../constructs/Tag/types';

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
