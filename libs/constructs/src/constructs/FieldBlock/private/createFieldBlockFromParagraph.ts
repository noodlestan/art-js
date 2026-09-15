import type { ParserVisitContext } from '@art-js/primitives';
import { nodePosition } from '@art-js/primitives';
import type { Paragraph, Strong } from 'mdast';

import type { Tag } from '../../Tag/private/types';

import { stripStrong } from './stripStrong';
import type { FieldBlock } from './types';

export function createFieldBlockFromParagraph(
	paragraph: Paragraph,
	context: ParserVisitContext,
	tags?: Tag[],
): FieldBlock {
	const strong = paragraph.children[0] as Strong;
	const inner = stripStrong(strong, context);
	const colonIndex = inner.indexOf(':');
	const field: FieldBlock = {
		construct: 'FieldBlock',
		name: inner.slice(0, colonIndex).trim(),
		children: [],
		position: nodePosition(paragraph),
	};
	if (tags?.length) field.tags = tags;
	return field;
}
