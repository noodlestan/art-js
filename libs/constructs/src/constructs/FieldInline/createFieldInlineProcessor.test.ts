import { createParserVisitContext } from '@art-js/primitives';
import { makeDocumentMock } from '@art-js/primitives/src/test/helpers/document/makeDocumentMock';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it } from 'vitest';

import { createFieldInlineProcessor } from './createFieldInlineProcessor';

describe('createFieldInlineProcessor', () => {
	it('returns null for non-paragraph nodes', () => {
		const processor = createFieldInlineProcessor();
		const context = createParserVisitContext(makeDocumentMock(), undefined, '');
		const result = processor.captureNode(context, { type: 'heading', children: [] } as never);
		expect(result).toBeNull();
	});

	it('returns null for paragraphs with no children', () => {
		const processor = createFieldInlineProcessor();
		const context = createParserVisitContext(makeDocumentMock(), undefined, '');
		const result = processor.captureNode(context, { type: 'paragraph', children: [] } as never);
		expect(result).toBeNull();
	});

	it('returns null when the first child is not a field strong', () => {
		const processor = createFieldInlineProcessor();
		const tree = fromMarkdown('Hello world');
		const paragraph = tree.children[0] as never;
		const context = createParserVisitContext(makeDocumentMock(), undefined, 'Hello world');
		const result = processor.captureNode(context, paragraph);
		expect(result).toBeNull();
	});

	it('returns null when nothing but whitespace follows the strong', () => {
		const processor = createFieldInlineProcessor();
		const markdown = '**Name:**   ';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as never;
		const context = createParserVisitContext(makeDocumentMock(), undefined, markdown);
		const result = processor.captureNode(context, paragraph);
		expect(result).toBeNull();
	});

	it('captures inline field values from paragraph siblings after the label', () => {
		const processor = createFieldInlineProcessor();
		const markdown = '# Hello World\n\n**Greeting:** Hello world.';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[1] as never;
		const context = createParserVisitContext(makeDocumentMock(), undefined, markdown);
		const result = processor.captureNode(context, paragraph);

		expect(result).toMatchObject({
			construct: 'FieldInline',
			name: 'Greeting',
			children: [
				{
					construct: 'NaturalExpression',
					type: 'text',
					value: 'Hello world.',
				},
			],
			position: {
				start: { line: 3, column: 1, offset: 15 },
				end: { line: 3, column: 27, offset: 41 },
			},
		});
	});

	it('preserves inline child types in the field children', () => {
		const processor = createFieldInlineProcessor();
		const markdown = '# Hello World\n\n**Remote:** `git@example.com`';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[1] as never;
		const context = createParserVisitContext(makeDocumentMock(), undefined, markdown);
		const result = processor.captureNode(context, paragraph);

		expect(result).toMatchObject({
			construct: 'FieldInline',
			name: 'Remote',
			children: [
				{
					construct: 'NaturalExpression',
					type: 'inlineCode',
					value: 'git@example.com',
				},
			],
		});
	});

	it('extracts tags and strips it from the last text child', () => {
		const processor = createFieldInlineProcessor();
		const markdown = '# Hello World\n\n**Greeting:** Hello there (#friend)';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[1] as never;
		const context = createParserVisitContext(makeDocumentMock(), undefined, markdown);
		const result = processor.captureNode(context, paragraph);

		expect(result).toMatchObject({
			construct: 'FieldInline',
			name: 'Greeting',
			tags: [{ construct: 'Tag', name: 'friend' }],
			children: [
				{
					construct: 'NaturalExpression',
					type: 'text',
					value: 'Hello there',
				},
			],
		});
	});
});
