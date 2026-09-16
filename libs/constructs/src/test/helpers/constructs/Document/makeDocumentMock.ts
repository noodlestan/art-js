/**
 * @provides Document test fixture
 */

import type { ArtDocument } from '../../../../constructs/Document/types';

export const makeDocumentMock = (options?: {
	children?: ArtDocument['children'];
}): ArtDocument => ({
	construct: 'Document',
	children: options?.children ?? [],
});
