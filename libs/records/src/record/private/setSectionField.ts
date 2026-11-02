import type { NaturalBlock, NaturalExpression } from '@art-md/constructs';
import type { ArtCodec } from '@art-md/primitives';

import type { SectionField } from './types.js';

export function setSectionField(codec: ArtCodec, field: SectionField, value: unknown): void {
	const text = String(value);

	if (field.construct === 'FieldInline') {
		const expression = codec.create<NaturalExpression>('NaturalExpression', {
			type: 'text',
			value: text,
		});
		field.children = [expression];
		return;
	}

	const block = codec.create<NaturalBlock>('NaturalBlock', { value: text, children: [] });
	field.children = [block];
}
