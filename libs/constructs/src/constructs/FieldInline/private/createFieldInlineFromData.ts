import type { NaturalExpression } from '../../NaturalExpression/private/types';
import type { Tag } from '../../Tag/private/types';

import type { FieldInline } from './types';

export interface FieldInlineFactoryData {
	name: string;
	children?: NaturalExpression[];
	tags?: Tag[];
}

export function createFieldInlineFromData(data: FieldInlineFactoryData): FieldInline {
	const field: FieldInline = {
		construct: 'FieldInline',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.tags?.length) field.tags = data.tags;
	return field;
}
