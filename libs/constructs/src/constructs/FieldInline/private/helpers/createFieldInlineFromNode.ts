import type { ParserVisitContext } from '@art-js/primitives';
import { nodePosition } from '@art-js/primitives';
import type { Paragraph, Strong } from 'mdast';

import { stripStrong } from '../../../../shared/fields';
import { rawSlice } from '../../../../shared/mdast';
import { createNaturalExpressionFromNode } from '../../../../shared/natural-expression';
import { extractTags } from '../../../../shared/tags';
import type { Tag } from '../../../Tag';
import type { FieldInline } from '../../types';
import { createFieldInline } from '../factory/createFieldInline';

import { trimFieldEdges } from './trimFieldEdges';

export function createFieldInlineFromNode(
	paragraph: Paragraph,
	context: ParserVisitContext,
): FieldInline | null {
	const strong = paragraph.children[0] as Strong;
	const paragraphRaw = rawSlice(paragraph, context);
	const strongRaw = rawSlice(strong, context);

	const afterStrong = paragraphRaw.slice(strongRaw.length);
	const { stripped } = extractTags(afterStrong);
	if (stripped.trim().length === 0) {
		return null;
	}
	const inner = stripStrong(strong, context);
	const colonIndex = inner.indexOf(':');

	const expressions = paragraph.children
		.slice(1)
		.map(child => createNaturalExpressionFromNode(child));
	const children = trimFieldEdges(expressions);
	const last = children[children.length - 1];
	let tags: Tag[] = [];
	if (last?.type === 'text' && typeof last.value === 'string') {
		const extracted = extractTags(last.value);
		if (extracted.tags.length) {
			tags = extracted.tags;
			last.value = extracted.stripped;
		}
	}

	const field = createFieldInline({
		name: inner.slice(0, colonIndex).trim(),
		children,
		tags,
	});
	field.position = nodePosition(paragraph);

	return field;
}
