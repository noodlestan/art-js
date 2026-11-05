import type { FieldBlock, FieldInline, SectionBlock } from '@art-md/constructs';
import type { ArtCodec } from '@art-md/primitives';

import { nameToLabel } from '../field-name/nameToLabel.js';
import type { FieldName } from '../types.js';

import { classifySectionFieldValue } from './classifySectionFieldValue.js';

export function appendSectionField(
	codec: ArtCodec,
	section: SectionBlock,
	name: FieldName,
	value: unknown,
): void {
	const classified = classifySectionFieldValue(codec, value);
	const label = nameToLabel(name);

	if (classified.form === 'FieldInline') {
		const field: FieldInline = {
			construct: 'FieldInline',
			name: label,
			children: classified.children,
		};

		section.children.push(field);
		return;
	}

	const field: FieldBlock = {
		construct: 'FieldBlock',
		name: label,
		children: classified.children,
	};

	section.children.push(field);
}
