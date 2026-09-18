import type { ConstructParserFactory } from '@art-js/constructs';

export type ParserConfig = {
	defaultConstruct: ConstructParserFactory;
	constructs: ConstructParserFactory[];
};
