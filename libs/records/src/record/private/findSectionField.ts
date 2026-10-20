import type { SectionBlock } from '@art-md/constructs';
import type { ConstructBase } from '@art-md/primitives';

import { isSectionField } from './isSectionField.js';
import type { SectionField } from './types.js';

export function findSectionField(section: SectionBlock, name: string): SectionField | undefined {
	function isMatchingSectionField(construct: ConstructBase): construct is SectionField {
		return isSectionField(construct) && construct.name === name;
	}

	return section.children.find(isMatchingSectionField);
}
