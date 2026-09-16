import { describe, expect, it } from 'vitest';

import type { BlockContent, Construct, InlineContent } from './registry';
import { makeNaturalBlockMock } from './test/helpers/constructs/NaturalBlock/makeNaturalBlockMock';
import { makeSectionBlockMock } from './test/helpers/constructs/SectionBlock/makeSectionBlockMock';
import { makeTagMock } from './test/helpers/constructs/Tag/makeTagMock';

describe('registry types', () => {
	it('accepts BlockContent union members', () => {
		const block: BlockContent = makeSectionBlockMock();
		expect(block.construct).toBe('SectionBlock');
	});

	it('accepts InlineContent union members', () => {
		const inline: InlineContent = makeTagMock();
		expect(inline.construct).toBe('Tag');
	});

	it('accepts Construct union members', () => {
		const construct: Construct = makeNaturalBlockMock();
		expect(construct.construct).toBe('NaturalBlock');
	});
});
