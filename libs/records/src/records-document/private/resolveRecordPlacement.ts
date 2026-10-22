import type { ArtDocument } from '@art-md/primitives';

import type { AddRecordPosition } from '../types.js';

import { resolveAppendPlacement } from './resolveAppendPlacement.js';
import { resolvePrependPlacement } from './resolvePrependPlacement.js';
import { resolveRootPlacement } from './resolveRootPlacement.js';
import { resolveSiblingPlacement } from './resolveSiblingPlacement.js';
import type { SectionPlacement } from './types.js';

const BEFORE_INDEX_OFFSET = 0;
const AFTER_INDEX_OFFSET = 1;

export function resolveRecordPlacement(
	document: ArtDocument,
	position?: AddRecordPosition,
): SectionPlacement {
	if (position === undefined) {
		return resolveRootPlacement(document);
	}
	if ('before' in position) {
		return resolveSiblingPlacement(document, position.before, BEFORE_INDEX_OFFSET);
	}
	if ('after' in position) {
		return resolveSiblingPlacement(document, position.after, AFTER_INDEX_OFFSET);
	}
	if ('appendTo' in position) {
		return resolveAppendPlacement(document, position.appendTo);
	}
	if ('prependTo' in position) {
		return resolvePrependPlacement(document, position.prependTo);
	}

	throw new Error('Unknown record placement');
}
