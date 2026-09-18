import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { createFieldInlineFromNodeMock } from '../../../../../test/helpers';
import { createFieldInlineFromNode } from '../helpers/createFieldInlineFromNode';

import { createFieldInlineProcessor } from './createFieldInlineProcessor';

vi.mock('../helpers/createFieldInlineFromNode', async () => {
	return createFieldInlineFromNodeMock();
});

describe('createFieldInlineProcessor', () => {
	it('FOR non-paragraph nodes returns null', () => {
		const processor = createFieldInlineProcessor();
		const context = makeParserVisitContextMock({ markdown: 'Hello world' });

		const result = processor.captureNode(context, { type: 'heading', children: [] } as never);

		expect(result).toBeNull();
	});

	it('FOR paragraphs with no children returns null', () => {
		const processor = createFieldInlineProcessor();
		const context = makeParserVisitContextMock({ markdown: 'Hello world' });

		const result = processor.captureNode(context, { type: 'paragraph', children: [] } as never);

		expect(result).toBeNull();
	});

	it('WHEN the first child is not a field strong returns null', () => {
		const processor = createFieldInlineProcessor();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as never;
		const context = makeParserVisitContextMock({ markdown });

		const result = processor.captureNode(context, paragraph);

		expect(result).toBeNull();
	});

	it('WHEN the first child is a field strong returns the createFieldInlineFromNode result', () => {
		const processor = createFieldInlineProcessor();
		const markdown = '**Name:** value';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as never;
		const context = makeParserVisitContextMock({ markdown });

		const result = processor.captureNode(context, paragraph);

		expect(createFieldInlineFromNode).toHaveBeenCalledWith(paragraph, context);
		expect(result).toMatchObject({ construct: 'FieldInline', name: 'Test' });
	});
});
