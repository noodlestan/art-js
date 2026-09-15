import { createParserVisitContext } from '@art-js/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it } from 'vitest';

import { createFieldInlineProcessor } from './createFieldInlineProcessor';

describe('createFieldInlineProcessor', () => {
	it('captures inline field values from paragraph siblings after the label', () => {
		const processor = createFieldInlineProcessor();
		const markdown = '# Hello World\n\n**Greeting:** Hello world.';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[1] as never;
		const context = createParserVisitContext(
			{ construct: 'Document', children: [] },
			undefined,
			markdown,
		);
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
		const context = createParserVisitContext(
			{ construct: 'Document', children: [] },
			undefined,
			markdown,
		);
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
		const context = createParserVisitContext(
			{ construct: 'Document', children: [] },
			undefined,
			markdown,
		);
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
