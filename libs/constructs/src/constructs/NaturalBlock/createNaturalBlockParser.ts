import type { ConstructParserFactory } from '../types';

import { createNaturalBlockProcessor } from './private/createNaturalBlockProcessor';

export const createNaturalBlockParser: ConstructParserFactory = () => ({
	processor: createNaturalBlockProcessor(),
});
