import { type ArtDocument, createArtDocument } from '@art-js/primitives';

import type { DocumentFactoryData } from './types';

export function createDocument(data: DocumentFactoryData): ArtDocument {
	const docData = {
		...data,
		children: data.children || [],
	};
	return createArtDocument(docData);
}
