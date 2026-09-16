import { nodePosition } from '@art-js/primitives';
import type { Node } from 'unist';

import type { ArtDocument } from '../constructs/Document/types';

export function createArtDocument(root: Node): ArtDocument {
	return {
		construct: 'Document',
		position: nodePosition(root),
		children: [],
	};
}
