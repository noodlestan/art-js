import type { ConstructParserFactory } from '../types';

import { type DocumentFactoryData, createDocumentFromData } from './private/createDocumentFromData';
import type { ArtDocument } from './types';

export const createDocumentParser: ConstructParserFactory<ArtDocument> = () => ({
	name: 'Document',
	factory: {
		fromData: data => createDocumentFromData(data as DocumentFactoryData),
	},
});
