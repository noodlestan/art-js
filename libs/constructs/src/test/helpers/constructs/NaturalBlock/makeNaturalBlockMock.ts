/**
 * @provides NaturalBlock test fixture
 */

import type { NaturalBlock } from '../../../../constructs/NaturalBlock/private/types';
import type { Tag } from '../../../../constructs/Tag/private/types';

export const makeNaturalBlockMock = (options?: {
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
