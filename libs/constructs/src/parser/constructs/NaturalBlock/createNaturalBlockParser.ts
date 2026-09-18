import type { ConstructParserFactory } from '../../types';

import { createNaturalBlockProcessor } from './private';

export const createNaturalBlockParser: ConstructParserFactory = () => ({
	name: 'NaturalBlock',
	processor: createNaturalBlockProcessor(),
});
