import type { SectionBlock } from '@art-md/constructs';

import { defineReadOnlyProperty } from './defineReadOnlyProperty.js';

export function makeSectionDepthReadOnly(section: SectionBlock): void {
	defineReadOnlyProperty(section, 'depth', section.depth);
}
