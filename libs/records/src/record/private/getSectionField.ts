import { readText } from './readText.js';
import type { SectionField } from './types.js';

export function getSectionField(field: SectionField): string {
	return readText(field);
}
