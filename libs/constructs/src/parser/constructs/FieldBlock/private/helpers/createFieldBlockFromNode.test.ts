import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import type { Paragraph } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { createFieldBlock } from '../../../../../constructs';

import { createFieldBlockFromNode } from './createFieldBlockFromNode';

vi.mock('../../../../../constructs/FieldBlock/factory/createFieldBlock', async () => {
	const { createFieldBlockMock } = await import('../../../../../test/helpers');
	return createFieldBlockMock();
});

describe('createFieldBlockFromNode', () => {
	it('WHEN text does not start with strong returns null', () => {
		const markdown = 'Foo **Purpose:**';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as Paragraph;
		const context = makeParserVisitContextMock({ markdown });

		const result = createFieldBlockFromNode(paragraph, context);

		expect(result).toBeNull();
	});

	it('WHEN text after the strong is not empty returns null', () => {
		const markdown = '**Purpose:** leftover';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as Paragraph;
		const context = makeParserVisitContextMock({ markdown });

		const result = createFieldBlockFromNode(paragraph, context);

		expect(result).toBeNull();
	});

	it('WHEN creating a FieldBlock from a paragraph', () => {
		const markdown = '**Purpose:**';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as Paragraph;
		const context = makeParserVisitContextMock({ markdown });

		const result = createFieldBlockFromNode(paragraph, context);

		expect(createFieldBlock).toHaveBeenCalledWith({ name: 'Purpose', tags: [] });
		expect(result).toBe(vi.mocked(createFieldBlock).mock.results[0]?.value);
	});

	it('WHEN trailing tags follow the strong passes them to createFieldBlock', () => {
		const markdown = '**Purpose:** (#purpose)';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as Paragraph;
		const context = makeParserVisitContextMock({ markdown });

		createFieldBlockFromNode(paragraph, context);

		expect(createFieldBlock).toHaveBeenCalledWith({
			name: 'Purpose',
			tags: [{ construct: 'Tag', name: 'purpose' }],
		});
	});
});
