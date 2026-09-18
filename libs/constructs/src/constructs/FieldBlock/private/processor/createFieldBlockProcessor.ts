import type { Paragraph } from 'mdast';

import { isFieldStrong } from '../../../../shared/fields';
import type { ConstructProcessor } from '../../../types';
import { createFieldBlockFromNode } from '../helpers/createFieldBlockFromNode';

export function createFieldBlockProcessor(): ConstructProcessor {
	return {
		captureNode(context, node) {
			if (node.type !== 'paragraph') {
				return null;
			}
			const paragraph = node as Paragraph;
			const first = paragraph.children[0];
			if (first === undefined || !isFieldStrong(first, context)) {
				return null;
			}
			return createFieldBlockFromNode(paragraph, context);
		},
	};
}
