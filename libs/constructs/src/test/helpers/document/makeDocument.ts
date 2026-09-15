import type { ArtDocument } from '../../../constructs/Document/types';

export const makeDocument = (options?: { children?: ArtDocument['children'] }): ArtDocument => ({
	construct: 'Document',
	children: options?.children ?? [],
});
