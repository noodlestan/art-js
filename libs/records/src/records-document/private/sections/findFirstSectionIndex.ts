import type { ConstructBase } from '@art-md/primitives';

export function findFirstSectionIndex(children: ConstructBase[]): number {
	function isSectionBlock(construct: ConstructBase): boolean {
		return construct.construct === 'SectionBlock';
	}
	return children.findIndex(isSectionBlock);
}
