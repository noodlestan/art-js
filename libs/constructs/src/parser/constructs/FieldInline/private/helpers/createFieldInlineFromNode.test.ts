import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { createFieldInline } from '../../../../../factories';

import { createFieldInlineFromNode } from './createFieldInlineFromNode';

vi.mock('../../../../../factories/constructs/FieldInline/factory/createFieldInline', async () => {
	const { createFieldInlineMock } = await import('../../../../../test/helpers');
	return createFieldInlineMock();
});

describe('createFieldInlineFromNode', () => {
	it('WHEN nothing but whitespace follows the strong returns null', () => {
		const markdown = '**Name:**   ';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as never;
		const context = makeParserVisitContextMock({ markdown });

		const result = createFieldInlineFromNode(paragraph, context);

		expect(result).toBeNull();
	});

	it('WHEN only tags follow the strong returns null', () => {
		const markdown = '**Name:** (#tag)';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as never;
		const context = makeParserVisitContextMock({ markdown });

		const result = createFieldInlineFromNode(paragraph, context);

		expect(result).toBeNull();
	});

	it('WHEN capturing inline field values from paragraph siblings after the label', () => {
		const markdown = '**Greeting:** Hello world.';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as never;
		const context = makeParserVisitContextMock({ markdown });

		const result = createFieldInlineFromNode(paragraph, context);

		expect(createFieldInline).toHaveBeenCalledWith({
			name: 'Greeting',
			children: [
				expect.objectContaining({
					construct: 'NaturalExpression',
					type: 'text',
					value: 'Hello world.',
				}),
			],
			tags: [],
		});
		expect(result).toBe(vi.mocked(createFieldInline).mock.results[0]?.value);
	});

	it('WHEN converting preserves inline child types in the field children', () => {
		const markdown = '**Remote:** `git@example.com`';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as never;
		const context = makeParserVisitContextMock({ markdown });

		createFieldInlineFromNode(paragraph, context);

		expect(createFieldInline).toHaveBeenCalledWith({
			name: 'Remote',
			children: [
				expect.objectContaining({
					construct: 'NaturalExpression',
					type: 'inlineCode',
					value: 'git@example.com',
				}),
			],
			tags: [],
		});
	});

	it('WHEN extracting tags and strips it from the last text child', () => {
		const markdown = '**Greeting:** Hello there (#friend)';
		const tree = fromMarkdown(markdown);
		const paragraph = tree.children[0] as never;
		const context = makeParserVisitContextMock({ markdown });

		createFieldInlineFromNode(paragraph, context);

		expect(createFieldInline).toHaveBeenCalledWith({
			name: 'Greeting',
			children: [
				expect.objectContaining({
					construct: 'NaturalExpression',
					type: 'text',
					value: 'Hello there',
				}),
			],
			tags: [{ construct: 'Tag', name: 'friend' }],
		});
	});
});
