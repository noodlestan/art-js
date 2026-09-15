import type { ContainerConstructBase } from '@art-js/primitives';

import type { NaturalExpression } from '../../NaturalExpression/private/types';
import type { Tag } from '../../Tag/private/types';

export interface FieldInline extends ContainerConstructBase {
	construct: 'FieldInline';
	name: string;
	children: NaturalExpression[];
	tags?: Tag[];
}
