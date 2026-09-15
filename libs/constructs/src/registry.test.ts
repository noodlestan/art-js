import { describe, expect, it } from 'vitest';

import type { BlockContent, Construct, InlineContent } from './registry';

describe('registry types', () => {
	it('accepts BlockContent union members', () => {
		const block: BlockContent = { construct: 'SectionBlock', name: 'Test', children: [] };
		expect(block.construct).toBe('SectionBlock');
	});

	it('accepts InlineContent union members', () => {
		const inline: InlineContent = { construct: 'Tag', name: 'test' };
		expect(inline.construct).toBe('Tag');
	});

	it('accepts Construct union members', () => {
		const construct: Construct = { construct: 'NaturalBlock', value: 'hello', children: [] };
		expect(construct.construct).toBe('NaturalBlock');
	});
});
