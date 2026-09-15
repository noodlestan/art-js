import type { ConstructParserFactory } from '../types';

import {
	type SectionBlockFactoryData,
	createSectionBlockFromData,
} from './private/createSectionBlockFromData';
import { createSectionBlockIntegrator } from './private/createSectionBlockIntegrator';
import { createSectionBlockProcessor } from './private/createSectionBlockProcessor';

export const createSectionBlockParser: ConstructParserFactory = () => ({
	name: 'SectionBlock',
	processor: createSectionBlockProcessor(),
	integrator: createSectionBlockIntegrator(),
	factory: { fromData: data => createSectionBlockFromData(data as SectionBlockFactoryData) },
});
