import { createDocument } from './constructs/Document';
import { createFieldBlock } from './constructs/FieldBlock';
import { createFieldInline } from './constructs/FieldInline';
import { createNaturalBlock } from './constructs/NaturalBlock';
import { createNaturalExpression } from './constructs/NaturalExpression';
import { createSectionBlock } from './constructs/SectionBlock';
import { createTag } from './constructs/Tag';

export type { FieldBlock } from './constructs/FieldBlock';
export type { FieldInline } from './constructs/FieldInline';
export type { NaturalBlock } from './constructs/NaturalBlock';
export type { NaturalExpression } from './constructs/NaturalExpression';
export type { SectionBlock } from './constructs/SectionBlock';
export type { Tag } from './constructs/Tag';

export type * from './types';

export const FACTORIES = [
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
