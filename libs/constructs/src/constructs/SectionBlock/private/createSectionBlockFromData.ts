import type { ConstructBase } from '@art-js/primitives';

import type { Tag } from '../../Tag/private/types';

import type { SectionBlock } from './types';

export interface SectionBlockFactoryData {
	name: string;
	kind?: string;
	depth?: number;
	children?: ConstructBase[];
	tags?: Tag[];
}

export function createSectionBlockFromData(data: SectionBlockFactoryData): SectionBlock {
	const section: SectionBlock = {
		construct: 'SectionBlock',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.kind) section.kind = data.kind;
	if (data.depth !== undefined) section.depth = data.depth;
	if (data.tags?.length) section.tags = data.tags;
	return section;
}
