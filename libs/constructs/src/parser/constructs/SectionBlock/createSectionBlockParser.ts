import type { ConstructParserFactory } from '../../types';

import { createSectionBlockIntegrator, createSectionBlockProcessor } from './private';

export const createSectionBlockParser: ConstructParserFactory = () => ({
	name: 'SectionBlock',
	processor: createSectionBlockProcessor(),
	integrator: createSectionBlockIntegrator(),
});
