import { nodePosition } from '@art-js/primitives';
import type { Node } from 'unist';

import type { ArtDocument } from './types';

export function createDocument(root: Node): ArtDocument {
	return {
		construct: 'Document',
		position: nodePosition(root),
		children: [],
	};
}
