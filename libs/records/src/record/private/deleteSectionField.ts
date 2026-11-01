import type { SectionBlock } from '@art-md/constructs';

import type { SectionField } from './types.js';

export function deleteSectionField(section: SectionBlock, field: SectionField): boolean {
	const fieldIndex = section.children.indexOf(field);
	if (fieldIndex === -1) {
		return false;
	}

	section.children.splice(fieldIndex, 1);

	return true;
}
