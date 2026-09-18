import type { ConstructParserFactory } from '../types';

import type { FieldInlineFactoryData } from './private';
import { createFieldInline, createFieldInlineProcessor } from './private';

export const createFieldInlineParser: ConstructParserFactory = () => ({
	name: 'FieldInline',
	processor: createFieldInlineProcessor(),
	factory: { fromData: data => createFieldInline(data as FieldInlineFactoryData) },
});
