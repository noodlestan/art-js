import type { ParserVisitContext } from '@art-js/primitives';
import { nodePosition } from '@art-js/primitives';
import type { Paragraph, Strong } from 'mdast';

import { type FieldBlock, createFieldBlock } from '../../../../../constructs';
import { stripStrong } from '../../../../fields';
import { rawSlice } from '../../../../mdast';
import { extractTags } from '../../../../tags';

export function createFieldBlockFromNode(
	paragraph: Paragraph,
	context: ParserVisitContext,
): FieldBlock | null {
	const strong = paragraph.children[0] as Strong;
	const paragraphRaw = rawSlice(paragraph, context);
	const strongRaw = rawSlice(strong, context);

	const afterStrong = paragraphRaw.slice(strongRaw.length);
	const { tags, stripped } = extractTags(afterStrong);
	if (stripped.trim().length > 0) {
		return null;
	}
	const inner = stripStrong(strong, context);
	const colonIndex = inner.indexOf(':');

	const field = createFieldBlock({
		name: inner.slice(0, colonIndex).trim(),
		tags,
	});
	field.position = nodePosition(paragraph);

	return field;
}
