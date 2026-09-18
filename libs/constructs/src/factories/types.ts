import type { FieldBlock } from './constructs/FieldBlock';
import type { FieldInline } from './constructs/FieldInline';
import type { NaturalBlock } from './constructs/NaturalBlock';
import type { NaturalExpression } from './constructs/NaturalExpression';
import type { SectionBlock } from './constructs/SectionBlock';
import type { Tag } from './constructs/Tag';

/**
 * Open registry of block-level constructs. Augment via declaration merging when new constructs land.
 *
 * @conventions-ignore Conventions: Typescript / Types / No Interface
 */
export interface BlockConstructMap {
	SectionBlock: SectionBlock;
	FieldBlock: FieldBlock;
	FieldInline: FieldInline;
	NaturalBlock: NaturalBlock;
}

/**
 * Open registry of inline/expression-level constructs. Augment via declaration merging when new constructs land.
 *
 * @conventions-ignore Conventions: Typescript / Types / No Interface
 */
export interface InlineConstructMap {
	NaturalExpression: NaturalExpression;
	Tag: Tag;
}

/** Open registry of all constructs. */
export type ConstructMap = BlockConstructMap & InlineConstructMap;

export type BlockContent = BlockConstructMap[keyof BlockConstructMap];
export type InlineContent = InlineConstructMap[keyof InlineConstructMap];

export type Construct = ConstructMap[keyof ConstructMap];
