import { nodePositionMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import {
	createNaturalExpressionFromNodeMock,
	extractTagsMock,
	makeTagMock,
	rawSliceMock,
} from '../../../../test/helpers';
// eslint-disable-next-line import/order
import { extractTags } from '../../../../shared/tags';

import { createNaturalBlockFromNode } from './createNaturalBlockFromNode';

vi.mock('@art-js/primitives', () => {
	return nodePositionMock();
});

vi.mock('../../../../shared/mdast', () => {
	return rawSliceMock('hello');
});

vi.mock('../../../../shared/natural-expression', async importOriginal => {
	const actual = (await importOriginal()) as object;
	return {
		...actual,
		...createNaturalExpressionFromNodeMock(),
	};
});

vi.mock('../../../../shared/tags', async () => {
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

		const result = createNaturalBlockFromNode(node as never, context);

		expect(result.construct).toBe('NaturalBlock');
		expect(result.value).toBe('hello');
	});

	it('FOR nodes that have no children creates a NaturalBlock without children', async () => {
		const node = { type: 'thematicBreak' };
		const context = { markdown: '' } as never;

		const result = createNaturalBlockFromNode(node as never, context);

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

		const result = createNaturalBlockFromNode(node as never, context);

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

		const result = createNaturalBlockFromNode(node as never, context);

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

		const result = createNaturalBlockFromNode(node as never, context);

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

		const result = createNaturalBlockFromNode(node as never, context);

		expect(result.construct).toBe('NaturalBlock');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({ construct: 'NaturalBlock' });
	});

	it('FOR an empty paragraph creates an empty NaturalBlock', async () => {
		const node = { type: 'paragraph', children: [] };
		const context = { markdown: '' } as never;

		const result = createNaturalBlockFromNode(node as never, context);

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

		const result = createNaturalBlockFromNode(node as never, context);

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
		const result = createNaturalBlockFromNode(node as never, context);
		expect(result.tags).toHaveLength(1);
	});
});
