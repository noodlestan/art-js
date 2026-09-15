import {
	createFieldBlockParser,
	createFieldInlineParser,
	createNaturalBlockParser,
	createSectionBlockParser,
} from '@art-js/constructs';

import type { ParserConfig } from './types';

export function createDefaultConfig(): ParserConfig {
	return {
		defaultConstruct: createNaturalBlockParser,
		constructs: [createFieldInlineParser, createFieldBlockParser, createSectionBlockParser],
	};
}
