import type { Paragraph } from 'mdast';

import { isFieldStrong } from '../../../../shared/fields';
import { rawSlice } from '../../../../shared/mdast';
import { extractTags } from '../../../../shared/tags';
import type { Construct } from '../../../../types';
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
			const strong = first as import('mdast').Strong;
			const paragraphRaw = rawSlice(paragraph, context);
			const strongRaw = rawSlice(strong, context);
			const afterStrong = paragraphRaw.slice(strongRaw.length);
			const { tags, stripped } = extractTags(afterStrong);
			if (stripped.trim().length > 0) {
				return null;
			}
			return createFieldBlockFromNode(node as Paragraph, context, tags) as Construct;
		},
	};
}
