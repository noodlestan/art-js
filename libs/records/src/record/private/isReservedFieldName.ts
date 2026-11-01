import { RESERVED_FIELD_NAMES, RESERVED_FIELD_NAME_PREFIX } from './constants.js';
import type { FieldName } from './types.js';

export function isReservedFieldName(name: FieldName): boolean {
	return name.startsWith(RESERVED_FIELD_NAME_PREFIX) || RESERVED_FIELD_NAMES.includes(name);
}
