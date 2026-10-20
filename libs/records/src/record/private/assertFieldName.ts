import { isReservedFieldName } from './isReservedFieldName.js';

export function assertFieldName(name: string): void {
	if (isReservedFieldName(name)) {
		throw new TypeError('Record field names starting with "__" are reserved');
	}
}
