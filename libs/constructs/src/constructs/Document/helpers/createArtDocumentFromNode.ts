import { type ArtDocument, nodePosition } from '@art-js/primitives';
import type { Node } from 'unist';

export function createArtDocumentFromNode(root: Node): ArtDocument {
	return {
		construct: 'Document',
		position: nodePosition(root),
		children: [],
	};
}
