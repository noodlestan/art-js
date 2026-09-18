import type { ConstructParserFactory } from '../types';

import { createFieldBlock, createFieldBlockIntegrator, createFieldBlockProcessor } from './private';
import type { FieldBlockFactoryData } from './private';

export const createFieldBlockParser: ConstructParserFactory = () => ({
	name: 'FieldBlock',
	processor: createFieldBlockProcessor(),
	integrator: createFieldBlockIntegrator(),
	factory: { fromData: data => createFieldBlock(data as FieldBlockFactoryData) },
});
