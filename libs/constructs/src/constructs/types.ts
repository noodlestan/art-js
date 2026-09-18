import type { FieldBlock } from './FieldBlock';
import type { FieldInline } from './FieldInline';
import type { NaturalBlock } from './NaturalBlock';
import type { NaturalExpression } from './NaturalExpression';
import type { SectionBlock } from './SectionBlock';
import type { Tag } from './Tag';

/** Open registry of block-level constructs. Augment via declaration merging when new constructs land. */
export type BlockConstructMap = {
	SectionBlock: SectionBlock;
	FieldBlock: FieldBlock;
	FieldInline: FieldInline;
	NaturalBlock: NaturalBlock;
};

/** Open registry of inline/expression-level constructs. */
export type InlineConstructMap = {
	NaturalExpression: NaturalExpression;
	Tag: Tag;
};

/** Open registry of all constructs. */
export type ConstructMap = BlockConstructMap & InlineConstructMap;

export type BlockContent = BlockConstructMap[keyof BlockConstructMap];
export type InlineContent = InlineConstructMap[keyof InlineConstructMap];

export type Construct = ConstructMap[keyof ConstructMap];
