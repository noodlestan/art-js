import type { ArtDocument } from '@art-js/primitives';

import type { ConstructParserFactory } from '../types';

import { createDocumentFromData } from './private';
import type { DocumentFactoryData } from './private';

export const createDocumentParser: ConstructParserFactory<ArtDocument> = () => ({
	name: 'Document',
	factory: {
		fromData: data => createDocumentFromData(data as DocumentFactoryData),
	},
});
