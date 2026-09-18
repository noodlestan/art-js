import { nodePosition } from '@art-js/primitives';
import type { ParserVisitContext } from '@art-js/primitives';
import type { Heading } from 'mdast';

import { type SectionBlock, createSectionBlock } from '../../../../../constructs';
import { rawSlice } from '../../../../mdast';
import { extractTags } from '../../../../tags';
import { KIND_PATTERN } from '../constants';

export function createSectionBlockFromNode(
	node: Heading,
	context: ParserVisitContext,
): SectionBlock {
	const text = rawSlice(node, context)
		.replace(/^[ \t]*#+[ \t]*/, '')
		.trim();
	const { tags, stripped } = extractTags(text);
	const kindMatch = stripped.match(KIND_PATTERN);
	const section = createSectionBlock({
		name: kindMatch?.[2]?.trim() ?? stripped,
		kind: kindMatch?.[1],
		depth: node.depth,
		children: [],
		tags,
	});
	section.position = nodePosition(node);
	return section;
}
