import type { ArtRecord } from '@art-js/records';

// The proxy exposes these as own properties; everything else own-key is a
// record field.
const API_KEYS = new Set(['name', '__section', 'renameField', 'save']);

export function fieldNames(record: ArtRecord): string[] {
	return Object.keys(record).filter(key => !API_KEYS.has(key) && !key.startsWith('__'));
}
