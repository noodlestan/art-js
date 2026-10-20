import type { ConstructBase } from '@art-md/primitives';

import type { SectionField } from './types.js';

export function isSectionField(construct: ConstructBase): construct is SectionField {
	return construct.construct === 'FieldBlock' || construct.construct === 'FieldInline';
}
