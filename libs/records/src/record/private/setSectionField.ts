import type { FieldInline, SectionBlock } from '@art-md/constructs';

import { createTextBlock } from './createTextBlock.js';
import { createTextExpression } from './createTextExpression.js';
import { findSectionField } from './findSectionField.js';

export function setSectionField(section: SectionBlock, name: string, value: unknown): void {
	const text = String(value);

	const field = findSectionField(section, name);
	if (field?.construct === 'FieldInline') {
		const expression = createTextExpression(text);
		field.children = [expression];
		return;
	}
	if (field?.construct === 'FieldBlock') {
		const block = createTextBlock(text);
		field.children = [block];
		return;
	}

	const expression = createTextExpression(text);

	const newField: FieldInline = {
		construct: 'FieldInline',
		name,
		children: [expression],
	};

	section.children.push(newField);
}
