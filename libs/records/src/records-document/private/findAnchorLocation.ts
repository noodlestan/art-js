import type { SectionBlock } from '@art-md/constructs';
import type { ArtDocument } from '@art-md/primitives';

import type { ArtRecord } from '../../record/types.js';

import { findSectionContainer } from './findSectionContainer.js';
import type { AnchorLocation } from './types.js';

export function findAnchorLocation(document: ArtDocument, anchor: ArtRecord): AnchorLocation {
	const section = anchor.__section as SectionBlock;
	const match = findSectionContainer(document, section);
	if (match === undefined) {
		throw new Error('The placement anchor is not part of this document');
	}
	const location: AnchorLocation = {
		section,
		container: match.container,
		index: match.index,
	};

	return location;
}
