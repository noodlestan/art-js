import type { ConstructParserFactory } from '../types';

import {
	type FieldBlockFactoryData,
	createFieldBlockFromData,
} from './private/createFieldBlockFromData';
import { createFieldBlockIntegrator } from './private/createFieldBlockIntegrator';
import { createFieldBlockProcessor } from './private/createFieldBlockProcessor';

export const createFieldBlockParser: ConstructParserFactory = () => ({
	name: 'FieldBlock',
	processor: createFieldBlockProcessor(),
	integrator: createFieldBlockIntegrator(),
	factory: { fromData: data => createFieldBlockFromData(data as FieldBlockFactoryData) },
});
