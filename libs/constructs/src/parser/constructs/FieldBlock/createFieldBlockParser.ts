import type { ConstructParserFactory } from '../../types';

import { createFieldBlockIntegrator, createFieldBlockProcessor } from './private';

export const createFieldBlockParser: ConstructParserFactory = () => ({
	name: 'FieldBlock',
	processor: createFieldBlockProcessor(),
	integrator: createFieldBlockIntegrator(),
});
