import type { ConstructParserFactory } from '../types';

import {
	type NaturalBlockFactoryData,
	createNaturalBlockFromData,
} from './private/createNaturalBlockFromData';
import { createNaturalBlockProcessor } from './private/createNaturalBlockProcessor';

export const createNaturalBlockParser: ConstructParserFactory = () => ({
	name: 'NaturalBlock',
	processor: createNaturalBlockProcessor(),
	factory: { fromData: data => createNaturalBlockFromData(data as NaturalBlockFactoryData) },
});
