import type { ArtDocument } from '../../types';

import type { DocumentFactoryData } from './types';

export function createDocumentFromData(data: DocumentFactoryData): ArtDocument {
	return { construct: 'Document', children: data.children };
}
