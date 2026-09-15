import type { ConstructParserFactory } from '../types';

import { createSectionBlockIntegrator } from './private/createSectionBlockIntegrator';
import { createSectionBlockProcessor } from './private/createSectionBlockProcessor';

export const createSectionBlockParser: ConstructParserFactory = () => ({
	processor: createSectionBlockProcessor(),
	integrator: createSectionBlockIntegrator(),
});
