import { isReservedFieldName } from './isReservedFieldName.js';
import type { FieldIndex, FieldName } from './types.js';

export function getExposedFieldNames(fields: FieldIndex): FieldName[] {
	function isExposedFieldName(name: FieldName): boolean {
		return !isReservedFieldName(name);
	}

	return [...fields.keys()].filter(isExposedFieldName);
}
