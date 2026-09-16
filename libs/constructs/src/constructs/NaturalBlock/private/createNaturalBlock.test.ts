import { nodePositionMock } from '@art-js/primitives/src/test/helpers/primitives/nodePositionMock';
import { describe, expect, it, vi } from 'vitest';

import { createNaturalExpressionMock } from '../../../test/helpers/constructs/NaturalExpression/createNaturalExpressionMock';
import { extractTagsMock } from '../../../test/helpers/constructs/Tag/extractTagsMock';
import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';
import { rawSliceMock } from '../../../test/helpers/constructs/rawSliceMock';
import { extractTags } from '../../Tag/private/extractTags';

import { createNaturalBlock } from './createNaturalBlock';

vi.mock('@art-js/primitives', () => {
	return nodePositionMock();
});

vi.mock('../../../helpers/rawSlice', () => {
	return rawSliceMock('hello');
});

vi.mock('../../NaturalExpression/private/createNaturalExpression', () => {
	return createNaturalExpressionMock();
});

vi.mock('../../Tag/private/extractTags', async () => {
	return extractTagsMock([], 'hello');
});

describe('createNaturalBlock', () => {
	it('WHEN creating a NaturalBlock from a node', async () => {
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

	it('FOR nodes that have no children creates a NaturalBlock without children', async () => {
		const node = { type: 'thematicBreak' };
		const context = { markdown: '' } as never;

		const result = createNaturalBlock(node as never, context);

		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toEqual([]);
	});

	it('WHEN treating heading children as phrasing content', async () => {
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

	it('WHEN treating table-cell children as phrasing content', async () => {
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

	it('FOR phrasing children of block nodes creates natural expressions', async () => {
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

	it('WHEN recursing into non-phrasing children of block nodes', async () => {
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

	it('FOR an empty paragraph creates an empty NaturalBlock', async () => {
		const node = { type: 'paragraph', children: [] };
		const context = { markdown: '' } as never;

		const result = createNaturalBlock(node as never, context);

		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toEqual([]);
		expect(result.tags).toBeUndefined();
	});

	it('WHEN last child is not text does not extract tags', async () => {
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: 'hello' });
		const node = {
			type: 'paragraph',
			children: [{ type: 'strong', children: [] }],
		};
		const context = { markdown: '' } as never;

		const result = createNaturalBlock(node as never, context);

		expect(result.tags).toBeUndefined();
	});

	it('WHEN last text child has trailing tags extracts tags', async () => {
		vi.mocked(extractTags).mockReturnValue({
			tags: [makeTagMock()],
			stripped: 'hello',
		});
		const node = {
			type: 'paragraph',
			children: [{ type: 'text', value: 'hello (#test)' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.tags).toHaveLength(1);
	});
});
