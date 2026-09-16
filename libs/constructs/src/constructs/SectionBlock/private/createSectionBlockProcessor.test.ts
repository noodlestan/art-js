import { describe, expect, it, vi } from 'vitest';

import { rawSlice } from '../../../helpers/rawSlice';
import { extractTags } from '../../Tag/private/extractTags';

vi.mock('@art-js/primitives', async () => {
	const { nodePositionMock } =
		await import('@art-js/primitives/src/test/helpers/primitives/nodePositionMock');
	return nodePositionMock();
});

vi.mock('../../../helpers/rawSlice', async () => {
	const { rawSliceMock } = await import('../../../test/helpers/constructs/rawSliceMock');
	return rawSliceMock('# Hello World');
});

vi.mock('../../Tag/private/extractTags', async () => {
	const { extractTagsMock } = await import('../../../test/helpers/constructs/Tag/extractTagsMock');
	return extractTagsMock([], 'Hello World');
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

	it('extracts kind from heading text', async () => {
		vi.mocked(rawSlice).mockReturnValue('# Module: Hello');
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: 'Module: Hello' });
		const { createSectionBlock } = await import('./createSectionBlockProcessor');
		const heading = {
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Module: Hello' }],
		};
		const context = { markdown: '' } as never;
		const result = createSectionBlock(heading as never, context);
		expect(result.kind).toBe('Module');
		expect(result.name).toBe('Hello');
	});

	it('extracts tags from heading text', async () => {
		vi.mocked(rawSlice).mockReturnValue('# Hello (#tag)');
		vi.mocked(extractTags).mockReturnValue({
			tags: [{ construct: 'Tag', name: 'tag' }],
			stripped: 'Hello',
		});
		const { createSectionBlock } = await import('./createSectionBlockProcessor');
		const heading = {
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Hello' }],
		};
		const context = { markdown: '' } as never;
		const result = createSectionBlock(heading as never, context);
		expect(result.tags).toHaveLength(1);
	});
});
