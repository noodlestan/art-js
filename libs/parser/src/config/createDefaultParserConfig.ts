import { CONSTRUCT_PARSERS, DEFAULT_CONSTRUCT_PARSER } from '@art-js/constructs';

import type { ParserConfig } from './types';

export function createDefaultParserConfig(): ParserConfig {
	return {
		defaultConstruct: DEFAULT_CONSTRUCT_PARSER,
		constructs: CONSTRUCT_PARSERS,
	};
}
