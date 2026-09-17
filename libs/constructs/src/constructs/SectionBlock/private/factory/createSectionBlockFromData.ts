import type { SectionBlock } from '../../types';

import type { SectionBlockFactoryData } from './types';

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
