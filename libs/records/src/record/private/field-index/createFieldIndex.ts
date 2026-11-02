import type { SectionBlock } from '@art-md/constructs';

import { isReservedFieldName } from '../field-name/isReservedFieldName.js';
import { labelToName } from '../field-name/labelToName.js';
import { isSectionField } from '../section-field/isSectionField.js';
import type { FieldIndex, FieldName, SectionField } from '../types.js';

export function createFieldIndex(section: SectionBlock): FieldIndex {
	const index = new Map<FieldName, SectionField>();

	for (const construct of section.children) {
		if (!isSectionField(construct)) {
			continue;
		}

		const name = labelToName(construct.name);

		if (isReservedFieldName(name)) {
			throw new TypeError(`Field label "${construct.name}" resolves to reserved name "${name}"`);
		}

		if (!index.has(name)) {
			index.set(name, construct);
		}
	}

	return index;
}
