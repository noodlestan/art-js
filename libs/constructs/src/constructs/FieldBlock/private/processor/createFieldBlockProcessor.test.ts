import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { createFieldBlockFromNodeMock } from '../../../../test/helpers';
import { createFieldBlockFromNode } from '../helpers/createFieldBlockFromNode';

import { createFieldBlockProcessor } from './createFieldBlockProcessor';

vi.mock('../helpers/createFieldBlockFromNode', async () => {
	return createFieldBlockFromNodeMock();
});

describe('createFieldBlockProcessor', () => {
	it('WHEN called returns a processor function', () => {
		const processor = createFieldBlockProcessor();

		expect(processor.captureNode).toBeInstanceOf(Function);
	});

	it('FOR non-paragraph nodes returns null', () => {
		const processor = createFieldBlockProcessor();
		const context = makeParserVisitContextMock({ markdown: 'Hello' });

		const result = processor.captureNode(context, { type: 'heading', children: [] } as never);

		expect(result).toBeNull();
	});

	it('FOR paragraph with no children returns null', () => {
		const processor = createFieldBlockProcessor();
		const context = makeParserVisitContextMock({ markdown: 'Hello' });

		const result = processor.captureNode(context, { type: 'paragraph', children: [] } as never);

		expect(result).toBeNull();
	});

	it('WHEN first child is not a field strong returns null', () => {
		const processor = createFieldBlockProcessor();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);
		const context = makeParserVisitContextMock({ markdown });
		const paragraph = tree.children[0] as never;

		const result = processor.captureNode(context, paragraph);

		expect(result).toBeNull();
	});

	it('WHEN first child is a field strong returns the createFieldBlockFromNode result', () => {
		const processor = createFieldBlockProcessor();
		const markdown = '**Name:** value';
		const tree = fromMarkdown(markdown);
		const context = makeParserVisitContextMock({ markdown });
		const paragraph = tree.children[0] as never;

		const result = processor.captureNode(context, paragraph);

		expect(createFieldBlockFromNode).toHaveBeenCalledWith(paragraph, context);
		expect(result).toMatchObject({ construct: 'FieldBlock', name: 'Test' });
	});
});
