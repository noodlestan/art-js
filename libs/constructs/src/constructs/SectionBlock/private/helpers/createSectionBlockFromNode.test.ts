import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import type { Heading } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { createSectionBlockMock } from '../../../../test/helpers';
import { createSectionBlock } from '../factory/createSectionBlock';

import { createSectionBlockFromNode } from './createSectionBlockFromNode';

vi.mock('../factory/createSectionBlock', async () => {
	return createSectionBlockMock();
});

describe('createSectionBlockFromNode', () => {
	it('WHEN creating a SectionBlock from a heading', () => {
		const markdown = '# Hello World';
		const tree = fromMarkdown(markdown);
		const heading = tree.children[0] as Heading;
		const context = makeParserVisitContextMock({ markdown });

		const result = createSectionBlockFromNode(heading, context);

		expect(createSectionBlock).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'Hello World', depth: 1, children: [], tags: [] }),
		);
		expect(result).toBe(vi.mocked(createSectionBlock).mock.results[0]?.value);
	});

	it('WHEN the heading declares a kind extracts it', () => {
		const markdown = '# Module: Hello';
		const tree = fromMarkdown(markdown);
		const heading = tree.children[0] as Heading;
		const context = makeParserVisitContextMock({ markdown });

		createSectionBlockFromNode(heading, context);

		expect(createSectionBlock).toHaveBeenCalledWith(
			expect.objectContaining({ kind: 'Module', name: 'Hello' }),
		);
	});

	it('WHEN the heading has trailing tags passes them and strips the name', () => {
		const markdown = '# Hello (#tag)';
		const tree = fromMarkdown(markdown);
		const heading = tree.children[0] as Heading;
		const context = makeParserVisitContextMock({ markdown });

		createSectionBlockFromNode(heading, context);

		expect(createSectionBlock).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'Hello',
				tags: [{ construct: 'Tag', name: 'tag' }],
			}),
		);
	});
});
