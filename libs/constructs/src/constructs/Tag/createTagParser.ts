import type { ConstructParserFactory } from '../types';

import { type TagFactoryData, createTag } from './private/createTag';

export const createTagParser: ConstructParserFactory = () => ({
	name: 'Tag',
	factory: { fromData: data => createTag(data as TagFactoryData) },
});
