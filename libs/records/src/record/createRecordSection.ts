import type { SectionBlock } from '@art-md/constructs';

export function createRecordSection(depth: number): SectionBlock {
	const section: SectionBlock = {
		construct: 'SectionBlock',
		name: '',
		depth,
		children: [],
	};

	return section;
}
