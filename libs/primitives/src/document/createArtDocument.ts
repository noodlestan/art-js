import type { ArtDocument } from './types';

export function createArtDocument(): ArtDocument {
	return {
		construct: 'Document',
		children: [],
	};
}
