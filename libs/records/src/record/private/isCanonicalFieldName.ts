import { CANONICAL_FIELD_NAME_PATTERN } from './constants.js';
import type { FieldName } from './types.js';

export function isCanonicalFieldName(name: FieldName): boolean {
	return CANONICAL_FIELD_NAME_PATTERN.test(name);
}
