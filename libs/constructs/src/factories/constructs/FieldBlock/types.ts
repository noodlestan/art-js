import type { ContainerConstructBase } from '@art-js/primitives';

import type { BlockContent } from '../../types';
import type { Tag } from '../Tag';

export type FieldBlock = ContainerConstructBase & {
	construct: 'FieldBlock';
	name: string;
	children: BlockContent[];
	tags?: Tag[];
};
