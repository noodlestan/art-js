import type { ConstructParserFactory } from '../types';

import { createNaturalBlock, createNaturalBlockProcessor } from './private';
import type { NaturalBlockFactoryData } from './private/factory/types';

export const createNaturalBlockParser: ConstructParserFactory = () => ({
	name: 'NaturalBlock',
	processor: createNaturalBlockProcessor(),
	factory: { fromData: data => createNaturalBlock(data as NaturalBlockFactoryData) },
});
