import type { ContainerConstructBase } from '@art-js/primitives';

import type { NaturalExpression } from '../../NaturalExpression/private/types';

export interface FieldInline extends ContainerConstructBase {
	construct: 'FieldInline';
	name: string;
	children: NaturalExpression[];
}
