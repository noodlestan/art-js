import type { NaturalBlock } from '../../types';

import type { NaturalBlockFactoryData } from './types';

export function createNaturalBlockFromData(data: NaturalBlockFactoryData): NaturalBlock {
	const block: NaturalBlock = {
		construct: 'NaturalBlock',
		value: data.value,
		children: data.children,
	};
	if (data.type) block.type = data.type;
	if (data.lang !== undefined) block.lang = data.lang;
	if (data.meta !== undefined) block.meta = data.meta;
	if (data.tags?.length) block.tags = data.tags;
	return block;
}
