import type { ConstructParserFactory } from '../types';

import {
	createSectionBlockFromData,
	createSectionBlockIntegrator,
	createSectionBlockProcessor,
} from './private';
import type { SectionBlockFactoryData } from './private';

export const createSectionBlockParser: ConstructParserFactory = () => ({
	name: 'SectionBlock',
	processor: createSectionBlockProcessor(),
	integrator: createSectionBlockIntegrator(),
	factory: { fromData: data => createSectionBlockFromData(data as SectionBlockFactoryData) },
});
