import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import type { Node } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { createNaturalBlockMock } from '../../../../test/helpers';
import { createNaturalBlock } from '../factory/createNaturalBlock';

import { createNaturalBlockFromNode } from './createNaturalBlockFromNode';

vi.mock('../factory/createNaturalBlock', async () => {
	return createNaturalBlockMock();
});

describe('createNaturalBlockFromNode', () => {
	it('WHEN creating a NaturalBlock from a paragraph', () => {
		const markdown = 'hello';
		const tree = fromMarkdown(markdown);
		const node = tree.children[0] as Node;
		const context = makeParserVisitContextMock({ markdown });

		const result = createNaturalBlockFromNode(node, context);

		expect(createNaturalBlock).toHaveBeenCalledWith(
			expect.objectContaining({
				value: 'hello',
				type: 'paragraph',
				children: [
					expect.objectContaining({
						construct: 'NaturalExpression',
						type: 'text',
						value: 'hello',
					}),
				],
				tags: [],
			}),
		);
		expect(result).toBe(vi.mocked(createNaturalBlock).mock.results[0]?.value);
	});

	it('WHEN trailing tags follow the last text child passes them to createNaturalBlock', () => {
		const markdown = 'hello (#test)';
		const tree = fromMarkdown(markdown);
		const node = tree.children[0] as Node;
		const context = makeParserVisitContextMock({ markdown });

		createNaturalBlockFromNode(node, context);

		expect(createNaturalBlock).toHaveBeenCalledWith(
			expect.objectContaining({
				children: [expect.objectContaining({ value: 'hello' })],
				tags: [{ construct: 'Tag', name: 'test' }],
			}),
		);
	});

	it('WHEN a child is not phrasing recurses into a nested NaturalBlock', () => {
		const markdown = '> hello';
		const tree = fromMarkdown(markdown);
		const node = tree.children[0] as Node;
		const context = makeParserVisitContextMock({ markdown });

		createNaturalBlockFromNode(node, context);

		expect(createNaturalBlock).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'blockquote',
				children: [expect.objectContaining({ construct: 'NaturalBlock' })],
			}),
		);
	});

	it('FOR nodes without children creates a NaturalBlock without children', () => {
		const markdown = '---';
		const tree = fromMarkdown(markdown);
		const node = tree.children[0] as Node;
		const context = makeParserVisitContextMock({ markdown });

		createNaturalBlockFromNode(node, context);

		expect(createNaturalBlock).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'thematicBreak', children: [] }),
		);
	});

	it('WHEN the node has extra mdast fields passes them as attributes', () => {
		const markdown = '- one\n- two';
		const tree = fromMarkdown(markdown);
		const node = tree.children[0] as Node;
		const context = makeParserVisitContextMock({ markdown });

		createNaturalBlockFromNode(node, context);

		expect(createNaturalBlock).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'list',
				attributes: expect.objectContaining({ ordered: false }),
			}),
		);
	});
});
