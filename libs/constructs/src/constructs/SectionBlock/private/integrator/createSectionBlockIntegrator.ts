import { sectionDepth } from '@art-js/primitives';
import type { Heading } from 'mdast';

import type { ConstructIntegrator } from '../../../types';
import type { SectionBlock } from '../../types';
import { findParentSection } from '../helpers/findParentSection';

export function createSectionBlockIntegrator(): ConstructIntegrator {
	return {
		integrate(context, node, construct) {
			const section = construct as SectionBlock;
			let currentContext = context;

			const heading = node as Heading;
			while (currentContext.construct.construct === 'SectionBlock') {
				const parentSection = findParentSection(currentContext);
				if (parentSection && sectionDepth(parentSection) >= heading.depth) {
					const parentContext = currentContext.parent();
					if (parentContext) {
						currentContext = parentContext;
					}
				} else {
					break;
				}
			}

			currentContext.captureChildConstruct(section);
			return currentContext.childContext(section);
		},
	};
}
