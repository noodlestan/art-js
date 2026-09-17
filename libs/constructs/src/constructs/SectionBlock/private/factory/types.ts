import type { ConstructBase } from '@art-js/primitives';

import type { Tag } from '../../../Tag';

export type SectionBlockFactoryData = {
	name: string;
	kind?: string;
	depth?: number;
	children?: ConstructBase[];
	tags?: Tag[];
};
