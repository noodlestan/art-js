import { type ArtDocument, nodePosition } from '@art-js/primitives';
import type { Node } from 'unist';

import { createDocument } from '../../constructs';

export function createArtDocumentFromNode(root: Node): ArtDocument {
	const document = createDocument({});
	document.position = nodePosition(root);
	return document;
}
