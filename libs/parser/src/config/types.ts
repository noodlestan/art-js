import type { ConstructParserFactory } from '@art-js/constructs';

export interface ParserConfig {
	defaultConstruct: ConstructParserFactory;
	constructs: ConstructParserFactory[];
}
