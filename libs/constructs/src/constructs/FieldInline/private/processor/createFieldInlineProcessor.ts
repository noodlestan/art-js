import { nodePosition } from '@art-js/primitives';
import type { Paragraph } from 'mdast';

import { isFieldStrong, stripStrong } from '../../../../shared/fields';
import { rawSlice } from '../../../../shared/mdast';
import { createNaturalExpressionFromNode } from '../../../../shared/natural-expression';
import { extractTags } from '../../../../shared/tags';
import type { Construct } from '../../../../types';
import type { ConstructProcessor } from '../../../types';
import type { FieldInline } from '../../types';
import { trimFieldEdges } from '../helpers/trimFieldEdges';

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
			const strong = first as import('mdast').Strong;
			const paragraphRaw = rawSlice(paragraph, context);
			const strongRaw = rawSlice(strong, context);
			const afterStrong = paragraphRaw.slice(strongRaw.length);
			if (afterStrong.trim().length === 0) {
				return null;
			}
			// If content is only tags, let FieldBlock handle it
			const { stripped } = extractTags(afterStrong);
			if (stripped.trim().length === 0) {
				return null;
			}
			const inner = stripStrong(strong, context);
			const colonIndex = inner.indexOf(':');
			const children = trimFieldEdges(
				paragraph.children.slice(1).map(child => createNaturalExpressionFromNode(child, context)),
			);
			const field: FieldInline = {
				construct: 'FieldInline',
				name: inner.slice(0, colonIndex).trim(),
				children,
				position: nodePosition(paragraph),
			};
			const last = children[children.length - 1];
			if (last?.type === 'text' && typeof last.value === 'string') {
				const { tags, stripped } = extractTags(last.value);
				if (tags.length) {
					field.tags = tags;
					last.value = stripped;
				}
			}
			return field as unknown as Construct;
		},
	};
}
