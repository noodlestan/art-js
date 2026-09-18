import type { Tag } from '../../Tag';
import type { BlockContent } from '../../types';

export type FieldBlockFactoryData = {
	name: string;
	children?: BlockContent[];
	tags?: Tag[];
};
