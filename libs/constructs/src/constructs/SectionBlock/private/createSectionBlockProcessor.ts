import { nodePosition } from '@art-js/primitives';
import type { ParserVisitContext } from '@art-js/primitives';
import type { Heading } from 'mdast';

import { rawSlice } from '../../../helpers/rawSlice';
import { extractTags } from '../../Tag/private/extractTags';
import type { ConstructProcessor } from '../../types';

import { KIND_PATTERN } from './constants';
import type { SectionBlock } from './types';

export function createSectionBlock(node: Heading, context: ParserVisitContext): SectionBlock {
	const text = rawSlice(node, context)
		.replace(/^[ \t]*#+[ \t]*/, '')
		.trim();
	const { tags, stripped: textWithoutTags } = extractTags(text);
	const kindMatch = textWithoutTags.match(KIND_PATTERN);
	const section: SectionBlock = {
		construct: 'SectionBlock',
		name: kindMatch?.[2]?.trim() ?? textWithoutTags,
		children: [],
		depth: node.depth,
		position: nodePosition(node),
	};
	if (kindMatch?.[1]) section.kind = kindMatch[1];
	if (tags.length) section.tags = tags;
	return section;
}

export function createSectionBlockProcessor(): ConstructProcessor {
	return {
		captureNode(context, node) {
			return node.type === 'heading' ? createSectionBlock(node as Heading, context) : null;
		},
	};
}
