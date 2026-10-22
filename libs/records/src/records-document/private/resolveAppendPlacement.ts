import type { ArtDocument } from '@art-md/primitives';

import type { ArtRecord } from '../../record/types.js';

import { findAnchorLocation } from './findAnchorLocation.js';
import { getSectionDepth } from './getSectionDepth.js';
import type { SectionPlacement } from './types.js';

export function resolveAppendPlacement(document: ArtDocument, anchor: ArtRecord): SectionPlacement {
	const location = findAnchorLocation(document, anchor);
	const placement: SectionPlacement = {
		container: location.section,
		index: location.section.children.length,
		depth: getSectionDepth(location.section) + 1,
	};

	return placement;
}
