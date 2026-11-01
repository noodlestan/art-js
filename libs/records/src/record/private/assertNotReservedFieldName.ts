import { isReservedFieldName } from './isReservedFieldName.js';
import type { FieldName } from './types.js';

export function assertNotReservedFieldName(name: FieldName): void {
	if (isReservedFieldName(name)) {
		throw new TypeError('Record field names starting with "__" are reserved');
	}
}
