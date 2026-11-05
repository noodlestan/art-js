import type { BlockContent, NaturalExpression } from '@art-md/constructs';
import type { ArtCodec } from '@art-md/primitives';

import type { SectionField, SectionFieldForm } from '../types.js';

import { classifySectionFieldValue } from './classifySectionFieldValue.js';

type MutableSectionField = {
	construct: SectionFieldForm;
	children: NaturalExpression[] | BlockContent[];
};

export function setSectionField(codec: ArtCodec, field: SectionField, value: unknown): void {
	const classified = classifySectionFieldValue(codec, value);

	// The field converts in place: identity, name, tags, and position stay untouched.
	const mutableField: MutableSectionField = field;

	mutableField.construct = classified.form;
	mutableField.children = classified.children;
}
