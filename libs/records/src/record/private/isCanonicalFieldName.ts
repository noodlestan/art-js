import type { FieldName } from './types.js';

const CANONICAL_FIELD_NAME_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

export function isCanonicalFieldName(name: FieldName): boolean {
	return CANONICAL_FIELD_NAME_PATTERN.test(name);
}
