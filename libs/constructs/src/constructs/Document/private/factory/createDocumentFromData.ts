import type { ArtDocument } from '@art-js/primitives';

import type { DocumentFactoryData } from './types';

export function createDocumentFromData(data: DocumentFactoryData): ArtDocument {
	return { construct: 'Document', children: data.children };
}
