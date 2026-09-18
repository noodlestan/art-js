import { createDocument } from './Document';
import { createFieldBlock } from './FieldBlock';
import { createFieldInline } from './FieldInline';
import { createNaturalBlock } from './NaturalBlock';
import { createNaturalExpression } from './NaturalExpression';
import { createSectionBlock } from './SectionBlock';
import { createTag } from './Tag';

export type { FieldBlock } from './FieldBlock';
export type { FieldInline } from './FieldInline';
export type { NaturalBlock } from './NaturalBlock';
export type { NaturalExpression } from './NaturalExpression';
export type { SectionBlock } from './SectionBlock';
export type { Tag } from './Tag';

export type * from './types';

export const CONSTRUCTS = [
	{
		name: 'Document',
		factory: createDocument,
	},
	{
		name: 'FieldBlock',
		factory: createFieldBlock,
	},
	{
		name: 'FieldInline',
		factory: createFieldInline,
	},
	{
		name: 'NaturalBlock',
		factory: createNaturalBlock,
	},
	{
		name: 'NaturalExpression',
		factory: createNaturalExpression,
	},
	{
		name: 'SectionBlock',
		factory: createSectionBlock,
	},
	{
		name: 'Tag',
		factory: createTag,
	},
];
