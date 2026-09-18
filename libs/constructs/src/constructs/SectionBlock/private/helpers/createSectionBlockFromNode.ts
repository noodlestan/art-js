import { nodePosition } from '@art-js/primitives';
import type { ParserVisitContext } from '@art-js/primitives';
import type { Heading } from 'mdast';

import { rawSlice } from '../../../../shared/mdast';
import { extractTags } from '../../../../shared/tags';
import type { SectionBlock } from '../../types';
import { KIND_PATTERN } from '../constants';
import { createSectionBlock } from '../factory/createSectionBlock';

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
