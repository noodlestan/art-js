import type { FieldInline, SectionBlock } from '@art-md/constructs';

import { createTextExpression } from './createTextExpression.js';
import { nameToLabel } from './nameToLabel.js';
import type { FieldName } from './types.js';

export function appendSectionField(section: SectionBlock, name: FieldName, value: unknown): void {
	const text = String(value);
	const expression = createTextExpression(text);

	const field: FieldInline = {
		construct: 'FieldInline',
		name: nameToLabel(name),
		children: [expression],
	};

	section.children.push(field);
}
