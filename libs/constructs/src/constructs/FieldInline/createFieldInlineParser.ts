import type { ConstructParserFactory } from '../types';

import { createFieldInlineProcessor } from './createFieldInlineProcessor';

export const createFieldInlineParser: ConstructParserFactory = () => ({
	processor: createFieldInlineProcessor(),
});
