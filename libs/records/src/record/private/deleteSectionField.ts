import type { SectionBlock } from '@art-md/constructs';
import type { ConstructBase } from '@art-md/primitives';

import { isSectionField } from './isSectionField.js';

export function deleteSectionField(section: SectionBlock, name: string): boolean {
	function isMatchingSectionField(construct: ConstructBase): boolean {
		return isSectionField(construct) && construct.name === name;
	}

	const fieldIndex = section.children.findIndex(isMatchingSectionField);
	if (fieldIndex === -1) {
		return false;
	}

	section.children.splice(fieldIndex, 1);

	return true;
}
