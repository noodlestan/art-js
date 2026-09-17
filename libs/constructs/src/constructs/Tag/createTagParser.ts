import type { ConstructParserFactory } from '../types';

import { createTag } from './private';
import type { TagFactoryData } from './private';

export const createTagParser: ConstructParserFactory = () => ({
	name: 'Tag',
	factory: { fromData: data => createTag(data as TagFactoryData) },
});
