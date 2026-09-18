import type { ArtDocument, ArtDocumentFactoryData } from './types';

export function createArtDocument(data?: ArtDocumentFactoryData): ArtDocument {
	return {
		construct: 'Document',
		children: data?.children ?? [],
	};
}
