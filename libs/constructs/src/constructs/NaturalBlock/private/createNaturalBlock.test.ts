import { describe, expect, it, vi } from 'vitest';

import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';
import { extractTags } from '../../Tag/private/extractTags';

vi.mock('@art-js/primitives', async () => {
	const { nodePositionMock } = await import('../../../test/helpers/primitives/nodePositionMock');
	return nodePositionMock();
});

vi.mock('../../../helpers/rawSlice', async () => {
	const { rawSliceMock } = await import('../../../test/helpers/constructs/rawSliceMock');
	return rawSliceMock('hello');
});

vi.mock('../../NaturalExpression/private/createNaturalExpression', async () => {
	const { createNaturalExpressionMock } =
		await import('../../../test/helpers/constructs/NaturalExpression/createNaturalExpressionMock');
	return createNaturalExpressionMock();
});

vi.mock('../../Tag/private/extractTags', async () => {
	const { extractTagsMock } = await import('../../../test/helpers/constructs/Tag/extractTagsMock');
	return extractTagsMock([], 'hello');
});

describe('createNaturalBlock', () => {
	it('creates a NaturalBlock from a node', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'paragraph',
			position: { start: { offset: 0 }, end: { offset: 5 } },
			children: [{ type: 'text', value: 'hello' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.value).toBe('hello');
	});

	it('creates a NaturalBlock without children for nodes that have no children', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = { type: 'thematicBreak' };
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toEqual([]);
	});

	it('treats heading children as phrasing content', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Title' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({ construct: 'NaturalExpression' });
	});

	it('treats table-cell children as phrasing content', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'tableCell',
			children: [{ type: 'text', value: 'Cell' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({ construct: 'NaturalExpression' });
	});

	it('creates natural expressions for phrasing children of block nodes', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'list',
			children: [{ type: 'text', value: 'item' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({ construct: 'NaturalExpression' });
	});

	it('recurses into non-phrasing children of block nodes', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'list',
			children: [{ type: 'code', value: 'const x = 1;' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({ construct: 'NaturalBlock' });
	});

	it('creates an empty NaturalBlock for an empty paragraph', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = { type: 'paragraph', children: [] };
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toEqual([]);
		expect(result.tags).toBeUndefined();
	});

	it('does not extract tags when last child is not text', async () => {
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: 'hello' });
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'paragraph',
			children: [{ type: 'strong', children: [] }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.tags).toBeUndefined();
	});

	it('extracts tags when last text child has trailing tags', async () => {
		vi.mocked(extractTags).mockReturnValue({
			tags: [makeTagMock()],
			stripped: 'hello',
		});
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'paragraph',
			children: [{ type: 'text', value: 'hello (#test)' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.tags).toHaveLength(1);
	});
});
