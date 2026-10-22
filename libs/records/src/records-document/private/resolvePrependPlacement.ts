import type { ArtDocument } from '@art-md/primitives';

import type { ArtRecord } from '../../record/types.js';

import { findAnchorLocation } from './findAnchorLocation.js';
import { findFirstSectionIndex } from './findFirstSectionIndex.js';
import { getSectionDepth } from './getSectionDepth.js';
import type { SectionPlacement } from './types.js';

export function resolvePrependPlacement(
	document: ArtDocument,
	anchor: ArtRecord,
): SectionPlacement {
	const location = findAnchorLocation(document, anchor);
	const firstSectionIndex = findFirstSectionIndex(location.section.children);
	const index = firstSectionIndex === -1 ? location.section.children.length : firstSectionIndex;
	const placement: SectionPlacement = {
		container: location.section,
		index,
		depth: getSectionDepth(location.section) + 1,
	};

	return placement;
}
