import { describe, expect, it } from 'vitest';

import type { BlockContent, Construct, InlineContent } from './registry';
import { makeNaturalBlock } from './test/helpers/naturalBlock/makeNaturalBlock';
import { makeSectionBlock } from './test/helpers/sectionBlock/makeSectionBlock';
import { makeTag } from './test/helpers/tag/makeTag';

describe('registry types', () => {
	it('accepts BlockContent union members', () => {
		const block: BlockContent = makeSectionBlock();
		expect(block.construct).toBe('SectionBlock');
	});

	it('accepts InlineContent union members', () => {
		const inline: InlineContent = makeTag();
		expect(inline.construct).toBe('Tag');
	});

	it('accepts Construct union members', () => {
		const construct: Construct = makeNaturalBlock();
		expect(construct.construct).toBe('NaturalBlock');
	});
});
