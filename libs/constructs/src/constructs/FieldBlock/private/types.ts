import type { ContainerConstructBase } from '@art-js/primitives';

import type { BlockContent } from '../../../registry';
import type { Tag } from '../../Tag/private/types';

export interface FieldBlock extends ContainerConstructBase {
	construct: 'FieldBlock';
	name: string;
	children: BlockContent[];
	tags?: Tag[];
}
