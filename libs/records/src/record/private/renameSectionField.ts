import type { SectionBlock } from '@art-md/constructs';

import { findSectionField } from './findSectionField.js';

export function renameSectionField(section: SectionBlock, oldName: string, newName: string): void {
	const field = findSectionField(section, oldName);
	if (field === undefined) {
		throw new Error(`Field not found: ${oldName}`);
	}

	field.name = newName;
}
