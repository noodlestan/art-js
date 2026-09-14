import type { ContainerConstructBase } from '@art-js/primitives';

import type { BlockContent } from '../../../registry';

export interface FieldBlock extends ContainerConstructBase {
	construct: 'FieldBlock';
	name: string;
	children: BlockContent[];
}
