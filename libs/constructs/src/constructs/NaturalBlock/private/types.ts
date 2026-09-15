import type { ContainerConstructBase } from '@art-js/primitives';

import type { Tag } from '../../Tag/private/types';

export interface NaturalBlock extends ContainerConstructBase {
	construct: 'NaturalBlock';
	value: string;
	children: ContainerConstructBase[];
	type?: string;
	lang?: string | null;
	meta?: string | null;
	tags?: Tag[];
	[key: string]: unknown;
}
