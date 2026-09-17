import type { ConstructParserFactory } from '../types';

import {
	createFieldBlockFromData,
	createFieldBlockIntegrator,
	createFieldBlockProcessor,
} from './private';
import type { FieldBlockFactoryData } from './private';

export const createFieldBlockParser: ConstructParserFactory = () => ({
	name: 'FieldBlock',
	processor: createFieldBlockProcessor(),
	integrator: createFieldBlockIntegrator(),
	factory: { fromData: data => createFieldBlockFromData(data as FieldBlockFactoryData) },
});
