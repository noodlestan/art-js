import type { ConstructParserFactory } from '../types';

import { createFieldInlineProcessor } from './createFieldInlineProcessor';
import {
	type FieldInlineFactoryData,
	createFieldInlineFromData,
} from './private/createFieldInlineFromData';

export const createFieldInlineParser: ConstructParserFactory = () => ({
	name: 'FieldInline',
	processor: createFieldInlineProcessor(),
	factory: { fromData: data => createFieldInlineFromData(data as FieldInlineFactoryData) },
});
