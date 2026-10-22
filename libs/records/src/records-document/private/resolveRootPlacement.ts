import type { ArtDocument } from '@art-md/primitives';

import type { SectionPlacement } from './types.js';

export function resolveRootPlacement(document: ArtDocument): SectionPlacement {
	const placement: SectionPlacement = {
		container: document,
		index: document.children.length,
		depth: 1,
	};

	return placement;
}
