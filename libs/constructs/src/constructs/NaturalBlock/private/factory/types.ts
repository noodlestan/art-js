import type { ContainerConstructBase } from '@art-js/primitives';

import type { Tag } from '../../../Tag';

export type NaturalBlockFactoryData = {
	value: string;
	children: ContainerConstructBase[];
	type?: string;
	lang?: string | null;
	meta?: string | null;
	tags?: Tag[];
	attributes?: Record<string, unknown>;
};
