import type { FieldName } from '../types.js';

import { isReservedFieldName } from './isReservedFieldName.js';

export function assertNotReservedFieldName(name: FieldName): void {
	if (isReservedFieldName(name)) {
		throw new TypeError('Record field names starting with "__" are reserved');
	}
}
