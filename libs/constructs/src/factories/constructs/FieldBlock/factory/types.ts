import type { BlockContent } from '../../../types';
import type { Tag } from '../../Tag';

export type FieldBlockFactoryData = {
	name: string;
	children?: BlockContent[];
	tags?: Tag[];
};
