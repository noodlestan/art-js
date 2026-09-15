import type { ConstructParserFactory } from '../types';

import { createFieldBlockHandler } from './private/createFieldBlockHandler';
import { createFieldBlockProcessor } from './private/createFieldBlockProcessor';

export const createFieldBlockParser: ConstructParserFactory = () => ({
	processor: createFieldBlockProcessor(),
	handler: createFieldBlockHandler(),
});
