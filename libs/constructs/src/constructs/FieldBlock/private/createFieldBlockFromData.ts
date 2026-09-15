import type { BlockContent } from '../../../registry';
import type { Tag } from '../../Tag/private/types';

import type { FieldBlock } from './types';

export interface FieldBlockFactoryData {
	name: string;
	children?: BlockContent[];
	tags?: Tag[];
}

export function createFieldBlockFromData(data: FieldBlockFactoryData): FieldBlock {
	const field: FieldBlock = {
		construct: 'FieldBlock',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.tags?.length) field.tags = data.tags;
	return field;
}
