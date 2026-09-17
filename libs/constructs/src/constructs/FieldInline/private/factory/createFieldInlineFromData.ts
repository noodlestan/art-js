import type { FieldInline } from '../../types';

import type { FieldInlineFactoryData } from './types';

export function createFieldInlineFromData(data: FieldInlineFactoryData): FieldInline {
	const field: FieldInline = {
		construct: 'FieldInline',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.tags?.length) field.tags = data.tags;
	return field;
}
