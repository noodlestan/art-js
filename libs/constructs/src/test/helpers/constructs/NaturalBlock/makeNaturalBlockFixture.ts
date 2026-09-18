/**
 * @fixture NaturalBlock of factory`libs/constructs/src/constructs/NaturalBlock/factory/createNaturalBlock.ts`
 */

import type { NaturalBlock, Tag } from '../../../../constructs';

export const makeNaturalBlockFixture = (options?: {
	value?: string;
	type?: string;
	lang?: string | null;
	meta?: string | null;
	children?: NaturalBlock['children'];
	tags?: Tag[];
}): NaturalBlock => ({
	construct: 'NaturalBlock',
	value: options?.value ?? 'hello',
	children: options?.children ?? [],
	...(options?.type !== undefined ? { type: options.type } : {}),
	...(options?.lang !== undefined ? { lang: options.lang } : {}),
	...(options?.meta !== undefined ? { meta: options.meta } : {}),
	...(options?.tags !== undefined ? { tags: options.tags } : {}),
});
