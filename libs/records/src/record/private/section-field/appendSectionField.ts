import type { FieldInline, NaturalExpression, SectionBlock } from '@art-md/constructs';
import type { ArtCodec } from '@art-md/primitives';

import { nameToLabel } from '../field-name/nameToLabel.js';
import type { FieldName } from '../types.js';

export function appendSectionField(
	codec: ArtCodec,
	section: SectionBlock,
	name: FieldName,
	value: unknown,
): void {
	const text = String(value);
	const expression = codec.create<NaturalExpression>('NaturalExpression', {
		type: 'text',
		value: text,
	});

	const field: FieldInline = {
		construct: 'FieldInline',
		name: nameToLabel(name),
		children: [expression],
	};

	section.children.push(field);
}
