import type { SectionBlock } from '@art-md/constructs';

import { defineReadOnlyProperty } from './defineReadOnlyProperty.js';

export function makeSectionNameReadOnly(section: SectionBlock): void {
	defineReadOnlyProperty(section, 'name', section.name);
}
