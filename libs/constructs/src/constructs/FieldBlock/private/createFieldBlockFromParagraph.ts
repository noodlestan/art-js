import type { ParserVisitContext } from '@art-js/primitives';
import { nodePosition } from '@art-js/primitives';
import type { Paragraph, Strong } from 'mdast';

import { createNaturalBlock } from '../../NaturalBlock/private/createNaturalBlock';
import type { NaturalBlock } from '../../NaturalBlock/private/types';

import { stripStrong } from './stripStrong';
import type { FieldBlock } from './types';

export function createFieldBlockFromParagraph(
	paragraph: Paragraph,
	context: ParserVisitContext,
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
	const remainder = inner.slice(colonIndex + 1);
	if (remainder)
		field.children.push({
			construct: 'NaturalBlock',
			type: 'text',
			value: remainder.trim(),
			position: nodePosition(strong),
		} as NaturalBlock);
	for (const child of paragraph.children.slice(1))
		field.children.push(createNaturalBlock(child, context));
	return field;
}
