import type { SectionBlock } from '@art-md/constructs';

import type { SectionContainer, SectionContainerMatch } from './types.js';

export function findSectionContainer(
	root: SectionContainer,
	section: SectionBlock,
): SectionContainerMatch | undefined {
	const index = root.children.indexOf(section);
	if (index !== -1) {
		const match: SectionContainerMatch = {
			container: root,
			index,
		};
		return match;
	}
	for (const child of root.children) {
		if (child.construct !== 'SectionBlock') {
			continue;
		}
		const childSection = child as SectionBlock;
		const match = findSectionContainer(childSection, section);
		if (match !== undefined) {
			return match;
		}
	}

	return undefined;
}
