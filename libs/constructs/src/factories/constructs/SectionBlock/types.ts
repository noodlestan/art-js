import type { ConstructBase, ContainerConstructBase } from '@art-js/primitives';

import type { Tag } from '../Tag';

export type SectionBlock = ContainerConstructBase & {
	construct: 'SectionBlock';
	kind?: string;
	name: string;
	tags?: Tag[];
	children: ConstructBase[];
	depth?: number;
};
