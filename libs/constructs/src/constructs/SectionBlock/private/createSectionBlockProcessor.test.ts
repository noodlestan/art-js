import { nodePositionMock } from '@art-js/primitives/src/test/helpers/primitives/nodePositionMock';
import { describe, expect, it, vi } from 'vitest';

// eslint-disable-next-line import/order
import { rawSliceMock } from '../../../test/helpers/constructs/rawSliceMock';

import { rawSlice } from '../../../helpers/rawSlice';
import { extractTagsMock } from '../../../test/helpers/constructs/Tag/extractTagsMock';
import { extractTags } from '../../Tag/private/extractTags';

import { createSectionBlock, createSectionBlockProcessor } from './createSectionBlockProcessor';

vi.mock('@art-js/primitives', () => {
	return nodePositionMock();
});

vi.mock('../../../helpers/rawSlice', async () => {
	return rawSliceMock('# Hello World');
});

vi.mock('../../Tag/private/extractTags', async () => {
	return extractTagsMock([], 'Hello World');
});

describe('createSectionBlockProcessor', () => {
	it('WHEN called returns a processor that captures a heading node', async () => {
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

	it('FOR non-heading nodes returns null', async () => {
		const processor = createSectionBlockProcessor();
		const paragraph = { type: 'paragraph', children: [] };
		const context = { markdown: '' } as never;

		const result = processor.captureNode(context, paragraph as never);

		expect(result).toBeNull();
	});
});

describe('createSectionBlock', () => {
	it('WHEN creating a SectionBlock from a heading', async () => {
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

	it('WHEN extracting kind from heading text', async () => {
		vi.mocked(rawSlice).mockReturnValue('# Module: Hello');
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: 'Module: Hello' });
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

	it('WHEN extracting tags from heading text', async () => {
		vi.mocked(rawSlice).mockReturnValue('# Hello (#tag)');
		vi.mocked(extractTags).mockReturnValue({
			tags: [{ construct: 'Tag', name: 'tag' }],
			stripped: 'Hello',
		});
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
