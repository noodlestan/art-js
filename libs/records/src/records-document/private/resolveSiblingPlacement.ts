import type { ArtDocument } from '@art-md/primitives';

import type { ArtRecord } from '../../record/types.js';

import { findAnchorLocation } from './findAnchorLocation.js';
import { getSectionDepth } from './getSectionDepth.js';
import type { SectionPlacement } from './types.js';

export function resolveSiblingPlacement(
	document: ArtDocument,
	anchor: ArtRecord,
	offset: number,
): SectionPlacement {
	const location = findAnchorLocation(document, anchor);
	const placement: SectionPlacement = {
		container: location.container,
		index: location.index + offset,
		depth: getSectionDepth(location.section),
	};

	return placement;
}
