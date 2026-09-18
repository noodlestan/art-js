import { createFieldBlockParser } from './constructs/FieldBlock';
import { createFieldInlineParser } from './constructs/FieldInline';
import { createNaturalBlockParser } from './constructs/NaturalBlock';
import { createSectionBlockParser } from './constructs/SectionBlock';
import type { ConstructParserFactory } from './types';

export type * from './types';

export const CONSTRUCT_PARSERS: ConstructParserFactory[] = [
	createFieldBlockParser,
	createFieldInlineParser,
	createSectionBlockParser,
];
export const DEFAULT_CONSTRUCT_PARSER = createNaturalBlockParser;
