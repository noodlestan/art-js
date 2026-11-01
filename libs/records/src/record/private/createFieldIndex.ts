import type { SectionBlock } from '@art-md/constructs';

import { isSectionField } from './isSectionField.js';
import { labelToName } from './labelToName.js';
import type { FieldIndex, FieldName, SectionField } from './types.js';

export function createFieldIndex(section: SectionBlock): FieldIndex {
	const index = new Map<FieldName, SectionField>();

	for (const construct of section.children) {
		if (!isSectionField(construct)) {
			continue;
		}

		const name = labelToName(construct.name);

		if (!index.has(name)) {
			index.set(name, construct);
		}
	}

	return index;
}
