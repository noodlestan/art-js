import type { ConstructProcessor } from '../../types';

import { createNaturalBlock } from './createNaturalBlock';

export function createNaturalBlockProcessor(): ConstructProcessor {
	return {
		captureNode(context, node) {
			return createNaturalBlock(node, context);
		},
	};
}
