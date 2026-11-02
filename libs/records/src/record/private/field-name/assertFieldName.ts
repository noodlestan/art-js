import type { FieldName } from '../types.js';

import { assertNotReservedFieldName } from './assertNotReservedFieldName.js';
import { isCanonicalFieldName } from './isCanonicalFieldName.js';

export function assertFieldName(name: FieldName): void {
	assertNotReservedFieldName(name);

	if (!isCanonicalFieldName(name)) {
		throw new TypeError(`Invalid record field name: "${name}"`);
	}
}
