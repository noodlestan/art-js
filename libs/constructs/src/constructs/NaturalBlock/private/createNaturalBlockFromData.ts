import type { ContainerConstructBase } from '@art-js/primitives';

import type { Tag } from '../../Tag/private/types';

import type { NaturalBlock } from './types';

export interface NaturalBlockFactoryData {
	value: string;
	children: ContainerConstructBase[];
	type?: string;
	lang?: string | null;
	meta?: string | null;
	tags?: Tag[];
}

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
