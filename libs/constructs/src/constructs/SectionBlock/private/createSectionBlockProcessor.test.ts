import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => ({
	nodePosition: vi.fn(() => ({
		start: { line: 1, column: 1, offset: 0 },
		end: { line: 1, column: 1, offset: 0 },
	})),
}));

vi.mock('../../../helpers/rawSlice', () => ({
	rawSlice: vi.fn(() => '# Hello World'),
}));

vi.mock('../../Tag/private/extractTags', () => ({
	extractTags: vi.fn(() => ({ tags: [], stripped: 'Hello World' })),
}));

describe('createSectionBlockProcessor', () => {
	it('returns a processor that captures a heading node', async () => {
		const { createSectionBlockProcessor } = await import('./createSectionBlockProcessor');
		const processor = createSectionBlockProcessor();
		const heading = {
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Hello World' }],
		};
		const context = { markdown: '' } as never;
		const result = processor.captureNode(context, heading as never);
		expect(result).toMatchObject({ construct: 'SectionBlock', name: 'Hello World', depth: 1 });
	});

	it('returns null for non-heading nodes', async () => {
		const { createSectionBlockProcessor } = await import('./createSectionBlockProcessor');
		const processor = createSectionBlockProcessor();
		const paragraph = { type: 'paragraph', children: [] };
		const context = { markdown: '' } as never;
		const result = processor.captureNode(context, paragraph as never);
		expect(result).toBeNull();
	});
});

describe('createSectionBlock', () => {
	it('creates a SectionBlock from a heading', async () => {
		const { createSectionBlock } = await import('./createSectionBlockProcessor');
		const heading = {
			type: 'heading',
			depth: 2,
			children: [{ type: 'text', value: 'Hello World' }],
		};
		const context = { markdown: '' } as never;
		const result = createSectionBlock(heading as never, context);
		expect(result.construct).toBe('SectionBlock');
		expect(result.depth).toBe(2);
	});
});
