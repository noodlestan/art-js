import type { BlockContent } from '../../../registry';
import type { ArtDocument } from '../types';

export interface DocumentFactoryData {
	children: BlockContent[];
}

export function createDocumentFromData(data: DocumentFactoryData): ArtDocument {
	return { construct: 'Document', children: data.children };
}
