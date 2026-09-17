import type { ConstructParserFactory } from '../types';

import type { FieldInlineFactoryData } from './private';
import { createFieldInlineFromData, createFieldInlineProcessor } from './private';

export const createFieldInlineParser: ConstructParserFactory = () => ({
	name: 'FieldInline',
	processor: createFieldInlineProcessor(),
	factory: { fromData: data => createFieldInlineFromData(data as FieldInlineFactoryData) },
});
