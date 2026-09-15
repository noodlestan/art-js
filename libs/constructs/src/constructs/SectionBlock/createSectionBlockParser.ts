import type { ConstructParserFactory } from '../types';

import { createSectionBlockCreator } from './private/createSectionBlockCreator';
import { createSectionBlockIntegrator } from './private/createSectionBlockIntegrator';

export const createSectionBlockParser: ConstructParserFactory = () => ({
	integrator: createSectionBlockIntegrator(),
	factory: createSectionBlockCreator(),
});
