import { nodePosition } from '@art-js/primitives';
import type { Heading } from 'mdast';

import { rawSlice } from '../../../helpers/rawSlice';
import { extractTags } from '../../Tag/private/extractTags';
import type { ConstructCreator } from '../../types';

import { KIND_PATTERN } from './constants';
import type { SectionBlock } from './types';

export function createSectionBlockCreator(): ConstructCreator {
	return {
		detect: node => node.type === 'heading',
		create: (node, context) => {
			const heading = node as Heading;
			const text = rawSlice(heading, context)
				.replace(/^[ \t]*#+[ \t]*/, '')
				.trim();
			const { tags, stripped: textWithoutTags } = extractTags(text);
			const kindMatch = textWithoutTags.match(KIND_PATTERN);
			const section: SectionBlock = {
				construct: 'SectionBlock',
				name: kindMatch?.[2]?.trim() ?? textWithoutTags,
				children: [],
				depth: heading.depth,
				position: nodePosition(heading),
			};
			if (kindMatch?.[1]) section.kind = kindMatch[1];
			if (tags.length) section.tags = tags;
			return section;
		},
	};
}
