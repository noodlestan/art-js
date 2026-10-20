import { isReservedFieldName } from './isReservedFieldName.js';
import type { ArtRecordCapsule } from './types.js';

export function getExposedFieldNames(capsule: ArtRecordCapsule): string[] {
	function isExposedFieldName(name: string): boolean {
		return !isReservedFieldName(name);
	}

	return capsule.fieldNames().filter(isExposedFieldName);
}
