import type { SectionBlock } from '@art-md/constructs';

import { isSectionField } from './isSectionField.js';
import type { SectionField } from './types.js';

export function listSectionFieldNames(section: SectionBlock): string[] {
	function getFieldName(field: SectionField): string {
		return field.name;
	}

	return section.children.filter(isSectionField).map(getFieldName);
}
