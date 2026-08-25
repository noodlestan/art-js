import type { ConstructBase } from '@art-js/primitives';

import type { NaturalExpression } from '../../NaturalExpression/private/types';

export interface FieldInline extends ConstructBase {
	construct: 'FieldInline';
	name: string;
	value: NaturalExpression[];
}
