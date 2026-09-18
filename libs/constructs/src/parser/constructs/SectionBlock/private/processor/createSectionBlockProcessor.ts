import type { Heading } from 'mdast';

import type { ConstructProcessor } from '../../../../types';
import { createSectionBlockFromNode } from '../helpers/createSectionBlockFromNode';

export function createSectionBlockProcessor(): ConstructProcessor {
	return {
		captureNode(context, node) {
			if (node.type !== 'heading') {
				return null;
			}
			return createSectionBlockFromNode(node as Heading, context);
		},
	};
}
