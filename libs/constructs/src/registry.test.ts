import { describe, expect, it } from 'vitest';

import type { BlockContent, Construct, InlineContent } from './registry';
import { makeNaturalBlockMock } from './test/helpers/constructs/NaturalBlock/makeNaturalBlockMock';
import { makeSectionBlockMock } from './test/helpers/constructs/SectionBlock/makeSectionBlockMock';
import { makeTagMock } from './test/helpers/constructs/Tag/makeTagMock';

describe('registry types', () => {
	it('WHEN given BlockContent union members accepts', () => {
		const block: BlockContent = makeSectionBlockMock();
		expect(block.construct).toBe('SectionBlock');
	});

	it('WHEN given InlineContent union members accepts', () => {
		const inline: InlineContent = makeTagMock();
		expect(inline.construct).toBe('Tag');
	});

	it('WHEN given Construct union members accepts', () => {
		const construct: Construct = makeNaturalBlockMock();
		expect(construct.construct).toBe('NaturalBlock');
	});
});
