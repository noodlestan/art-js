import type { ContainerConstructBase } from '@art-js/primitives';

import type { Tag } from '../Tag';
import type { BlockContent } from '../types';

export type FieldBlock = ContainerConstructBase & {
	construct: 'FieldBlock';
	name: string;
	children: BlockContent[];
	tags?: Tag[];
};
