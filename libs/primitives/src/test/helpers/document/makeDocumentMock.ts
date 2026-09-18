import type { ConstructBase } from '../../../constructs';
import type { ArtDocument } from '../../../document';

export const makeDocumentMock = <T extends ConstructBase = never>(options?: {
	children?: T[];
}): ArtDocument => ({
	construct: 'Document',
	children: (options?.children ?? []) as T[],
});
