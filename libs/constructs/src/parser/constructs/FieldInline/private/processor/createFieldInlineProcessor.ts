import type { Paragraph } from 'mdast';

import { isFieldStrong } from '../../../../fields';
import type { ConstructProcessor } from '../../../../types';
import { createFieldInlineFromNode } from '../helpers/createFieldInlineFromNode';

export function createFieldInlineProcessor(): ConstructProcessor {
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
			return createFieldInlineFromNode(paragraph, context);
		},
	};
}
