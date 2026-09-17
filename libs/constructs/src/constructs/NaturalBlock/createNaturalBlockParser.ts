import type { ConstructParserFactory } from '../types';

import { createNaturalBlockFromData, createNaturalBlockProcessor } from './private';
import type { NaturalBlockFactoryData } from './private/factory/types';

export const createNaturalBlockParser: ConstructParserFactory = () => ({
	name: 'NaturalBlock',
	processor: createNaturalBlockProcessor(),
	factory: { fromData: data => createNaturalBlockFromData(data as NaturalBlockFactoryData) },
});
