import type { ConstructBase } from '@art-js/primitives';

import type { BlockContent } from '../../registry';

/** Document — the parse result for one source file. */
export interface ArtDocument extends ConstructBase {
	construct: 'Document';
	children: BlockContent[];
}
