import { createTextBlock } from './createTextBlock.js';
import { createTextExpression } from './createTextExpression.js';
import type { SectionField } from './types.js';

export function setSectionField(field: SectionField, value: unknown): void {
	const text = String(value);

	if (field.construct === 'FieldInline') {
		const expression = createTextExpression(text);
		field.children = [expression];
		return;
	}

	const block = createTextBlock(text);
	field.children = [block];
}
