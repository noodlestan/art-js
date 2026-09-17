import type { NaturalExpression } from '../../../NaturalExpression';
import type { Tag } from '../../../Tag';

export type FieldInlineFactoryData = {
	name: string;
	children?: NaturalExpression[];
	tags?: Tag[];
};
