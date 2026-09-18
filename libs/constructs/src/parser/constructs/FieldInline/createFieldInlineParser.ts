import type { ConstructParserFactory } from '../../types';

import { createFieldInlineProcessor } from './private';

export const createFieldInlineParser: ConstructParserFactory = () => ({
	name: 'FieldInline',
	processor: createFieldInlineProcessor(),
});
