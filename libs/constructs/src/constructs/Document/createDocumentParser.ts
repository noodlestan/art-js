import type { ConstructParserFactory } from '../types';

import { createDocumentFromData } from './private';
import type { DocumentFactoryData } from './private';
import type { ArtDocument } from './types';

export const createDocumentParser: ConstructParserFactory<ArtDocument> = () => ({
	name: 'Document',
	factory: {
		fromData: data => createDocumentFromData(data as DocumentFactoryData),
	},
});
