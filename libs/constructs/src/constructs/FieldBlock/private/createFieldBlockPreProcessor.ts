import type { Paragraph } from 'mdast';

import { rawSlice } from '../../../helpers/rawSlice';
import type { Construct } from '../../../registry';
import { extractTags } from '../../Tag/private/extractTags';
import type { ConstructPreProcessor } from '../../types';

import { createFieldBlockFromParagraph } from './createFieldBlockFromParagraph';
import { isFieldStrong } from './isFieldStrong';
export function createFieldBlockPreProcessor(): ConstructPreProcessor {
	return {
		preProcess(node, context) {
			if (node.type !== 'paragraph') return null;
			const paragraph = node as Paragraph;
			const first = paragraph.children[0];
			if (first === undefined || !isFieldStrong(first, context)) return null;
			const strong = first as import('mdast').Strong;
			const paragraphRaw = rawSlice(paragraph, context);
			const strongRaw = rawSlice(strong, context);
			const afterStrong = paragraphRaw.slice(strongRaw.length);
			const { tags, stripped } = extractTags(afterStrong);
			if (stripped.trim().length > 0) return null;
			return createFieldBlockFromParagraph(node as Paragraph, context, tags) as Construct;
		},
	};
}
