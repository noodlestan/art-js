import type { SectionBlock } from '@art-md/constructs';
import type { ConstructBase } from '@art-md/primitives';

export function collectSectionBlocks(root: ConstructBase): SectionBlock[] {
	const sections: SectionBlock[] = [];

	function visit(node: ConstructBase): void {
		if (node.construct === 'SectionBlock') {
			sections.push(node as SectionBlock);
		}
		if ('children' in node && Array.isArray(node.children)) {
			node.children.forEach(visit);
		}
	}

	visit(root);

	return sections;
}
