import type { FieldName } from './types.js';

const RESERVED_FIELD_NAMES: readonly string[] = ['name', 'save', 'renameField', '__section'];

export function isReservedFieldName(name: FieldName): boolean {
	return name.startsWith('__') || RESERVED_FIELD_NAMES.includes(name);
}
