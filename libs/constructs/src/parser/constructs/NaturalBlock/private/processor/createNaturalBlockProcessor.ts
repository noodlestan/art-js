import type { ConstructProcessor } from '../../../../types';
import { createNaturalBlockFromNode } from '../helpers/createNaturalBlockFromNode';

export function createNaturalBlockProcessor(): ConstructProcessor {
	return {
		captureNode(context, node) {
			return createNaturalBlockFromNode(node, context);
		},
	};
}
