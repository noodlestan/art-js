import type { ConstructBase, ContainerConstructBase } from '@art-js/primitives';

import type { Tag } from '../../Tag/private/types';

export interface SectionBlock extends ContainerConstructBase {
	construct: 'SectionBlock';
	kind?: string;
	name: string;
	tags?: Tag[];
	children: ConstructBase[];
	depth?: number;
}
