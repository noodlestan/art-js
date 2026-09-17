import type { ContainerConstructBase } from '@art-js/primitives';

import type { NaturalExpression } from '../NaturalExpression';
import type { Tag } from '../Tag';

export type FieldInline = ContainerConstructBase & {
	construct: 'FieldInline';
	name: string;
	children: NaturalExpression[];
	tags?: Tag[];
};
