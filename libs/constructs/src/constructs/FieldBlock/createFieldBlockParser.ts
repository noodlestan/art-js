import type { ConstructParserFactory } from '../types';

import { createFieldBlockIntegrator } from './private/createFieldBlockIntegrator';
import { createFieldBlockProcessor } from './private/createFieldBlockProcessor';

export const createFieldBlockParser: ConstructParserFactory = () => ({
	processor: createFieldBlockProcessor(),
	integrator: createFieldBlockIntegrator(),
});
