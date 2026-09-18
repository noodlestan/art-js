/**
 * @fixture SectionBlock of factory`libs/constructs/src/constructs/SectionBlock/factory/createSectionBlock.ts`
 */

import type { SectionBlock, Tag } from '../../../../factories';

export const makeSectionBlockFixture = (options?: {
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
