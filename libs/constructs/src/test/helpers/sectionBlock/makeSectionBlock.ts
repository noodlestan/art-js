import type { SectionBlock } from '../../../constructs/SectionBlock/private/types';
import type { Tag } from '../../../constructs/Tag/private/types';

export const makeSectionBlock = (options?: {
	name?: string;
	depth?: number;
	kind?: string;
	children?: SectionBlock['children'];
	tags?: Tag[];
}): SectionBlock => ({
	construct: 'SectionBlock',
	name: options?.name ?? 'Test',
	children: options?.children ?? [],
	...(options?.depth !== undefined ? { depth: options.depth } : {}),
	...(options?.kind !== undefined ? { kind: options.kind } : {}),
	...(options?.tags !== undefined ? { tags: options.tags } : {}),
});
