import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', async () => {
	const { makeNodePositionMock } =
		await import('../../../test/helpers/primitives/makeNodePositionMock');
	return makeNodePositionMock();
});

vi.mock('../../../helpers/rawSlice', async () => {
	const { makeRawSliceMock } = await import('../../../test/helpers/rawSlice/makeRawSliceMock');
	return makeRawSliceMock('# Hello World');
});

vi.mock('../../Tag/private/extractTags', async () => {
	const { makeExtractTagsMock } =
		await import('../../../test/helpers/extractTags/makeExtractTagsMock');
	return makeExtractTagsMock([], 'Hello World');
});

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
