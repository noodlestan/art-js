import type { SectionBlock } from '@art-md/constructs';

import type { SectionField } from '../types.js';

import { isSectionField } from './isSectionField.js';

/**
 * Finds the first field carrying the exact stored label, in document order.
 *
 * Label addressing scans the section directly: no `labelToName` conversion and
 * no index involvement, so a field shadowed by an earlier duplicate stays
 * reachable by its own label.
 *
 * @returns the matching field, or `undefined` when no field carries the label.
 */
export function findSectionFieldByLabel(
	section: SectionBlock,
	label: string,
): SectionField | undefined {
	for (const construct of section.children) {
		if (!isSectionField(construct)) {
			continue;
		}

		if (construct.name === label) {
			return construct;
		}
	}

	return undefined;
}
