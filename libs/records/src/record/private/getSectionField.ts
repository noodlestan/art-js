import type { SectionBlock } from '@art-md/constructs';

import { findSectionField } from './findSectionField.js';
import { readText } from './readText.js';

export function getSectionField(section: SectionBlock, name: string): string | undefined {
	const field = findSectionField(section, name);
	if (field === undefined) {
		return undefined;
	}

	return readText(field);
}
