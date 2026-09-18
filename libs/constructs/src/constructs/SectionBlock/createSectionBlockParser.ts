import type { ConstructParserFactory } from '../types';

import {
	createSectionBlock,
	createSectionBlockIntegrator,
	createSectionBlockProcessor,
} from './private';
import type { SectionBlockFactoryData } from './private';

export const createSectionBlockParser: ConstructParserFactory = () => ({
	name: 'SectionBlock',
	processor: createSectionBlockProcessor(),
	integrator: createSectionBlockIntegrator(),
	factory: { fromData: data => createSectionBlock(data as SectionBlockFactoryData) },
});
