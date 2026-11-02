import type { SectionBlock } from '@art-md/constructs';

export function getSectionDepth(section: SectionBlock): number {
	return section.depth ?? 1;
}
