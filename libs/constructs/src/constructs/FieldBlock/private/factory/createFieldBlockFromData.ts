import type { FieldBlock } from '../../types';

import type { FieldBlockFactoryData } from './types';

export function createFieldBlockFromData(data: FieldBlockFactoryData): FieldBlock {
	const field: FieldBlock = {
		construct: 'FieldBlock',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.tags?.length) field.tags = data.tags;
	return field;
}
