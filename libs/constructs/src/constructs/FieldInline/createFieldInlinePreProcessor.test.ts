import { createParserVisitContext } from '@art-js/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it } from 'vitest';

import { createFieldInlinePreProcessor } from './createFieldInlinePreProcessor';

describe('createFieldInlinePreProcessor', () => {
	it('captures inline field values from paragraph siblings after the label', () => {
		const impl = createFieldInlinePreProcessor();
		const markdown = '# Hello World\n\n**Greeting:** Hello world.';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[1] as never;
		const context = createParserVisitContext(
			{ construct: 'Document', children: [] },
			undefined,
			markdown,
		);

		expect(impl.preProcess(paragraph, context)).toMatchObject({
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
		const impl = createFieldInlinePreProcessor();
		const markdown = '# Hello World\n\n**Remote:** `git@example.com`';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[1] as never;
		const context = createParserVisitContext(
			{ construct: 'Document', children: [] },
			undefined,
			markdown,
		);

		expect(impl.preProcess(paragraph, context)).toMatchObject({
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
});
