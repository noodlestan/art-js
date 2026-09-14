import type { ContainerConstructBase } from '@art-js/primitives';

export interface NaturalBlock extends ContainerConstructBase {
	construct: 'NaturalBlock';
	value: string;
	children: ContainerConstructBase[];
	type?: string;
	lang?: string | null;
	meta?: string | null;
	[key: string]: unknown;
}
