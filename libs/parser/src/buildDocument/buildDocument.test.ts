import { makeDocumentMock } from '@art-js/primitives/src/test/helpers/document/makeDocumentMock';
import { parserVisitContextMock } from '@art-js/primitives/src/test/helpers/primitives/parserVisitContextMock';
import { describe, expect, it, vi } from 'vitest';

import { buildDocument } from './buildDocument';

const { markdownTree } = vi.hoisted(() => ({
	markdownTree: { type: 'root', children: [] as unknown[] },
}));

vi.mock('@art-js/constructs', () => {
	return {
		createArtDocument: vi.fn(() => makeDocumentMock()),
	};
});

vi.mock('@art-js/primitives', () => {
	return parserVisitContextMock();
});

vi.mock('mdast-util-from-markdown', () => ({
	fromMarkdown: vi.fn(() => markdownTree),
}));

vi.mock('unist-util-visit', () => {
	const SKIP = Symbol('skip');
	const visit = vi.fn((tree: unknown, callback: (node: unknown) => unknown) => {
		const walk = (node: unknown): void => {
			const result = callback(node);
			if (result === SKIP) return;
			const children = (node as { children?: unknown[] }).children ?? [];
			for (const child of children) walk(child);
		};
		walk(tree);
	});
	return { SKIP, visit };
});

const naturalBlockParser =
	(captureNode: (() => unknown) | undefined = () => null) =>
	() => ({
		name: 'NaturalBlock',
		processor: { captureNode: vi.fn(captureNode) },
		factory: { fromData: () => ({}) },
	});

describe('buildDocument', () => {
	it('WHEN building a document from markdown', async () => {
		markdownTree.children = [
			{
				type: 'paragraph',
				children: [{ type: 'text', value: 'Hello' }],
			},
		];
		const config = {
			defaultConstruct: naturalBlockParser(),
			constructs: [],
		};

		const result = buildDocument(config as never, 'Hello');

		expect(result).toEqual(makeDocumentMock());
	});

	it('WHEN the default construct has no processor skips blocks', async () => {
		markdownTree.children = [{ type: 'list', children: [] }];
		const config = {
			defaultConstruct: () => ({ name: 'NaturalBlock', factory: { fromData: () => ({}) } }),
			constructs: [],
		};

		const result = buildDocument(config as never, '# Hello');

		expect(result).toEqual(makeDocumentMock());
	});

	it('WHEN a matched construct has no integrator captures child constructs', async () => {
		markdownTree.children = [{ type: 'paragraph', children: [] }];
		const construct = { construct: 'FieldInline', name: 'Hello', children: [] };
		const config = {
			defaultConstruct: naturalBlockParser(() => null),
			constructs: [
				() => ({
					name: 'FieldInline',
					processor: { captureNode: vi.fn(() => construct) },
					factory: { fromData: () => ({}) },
				}),
			],
		};

		const result = buildDocument(config as never, '**Hello:** world');

		expect(result).toEqual(makeDocumentMock());
	});

	it('WHEN called returns SKIP after handling a non-paragraph block type', async () => {
		markdownTree.children = [{ type: 'list', children: [{ type: 'text', value: 'item' }] }];
		const config = {
			defaultConstruct: naturalBlockParser(() => ({ construct: 'NaturalBlock' })),
			constructs: [],
		};

		const result = buildDocument(config as never, '- item');

		expect(result).toEqual(makeDocumentMock());
	});
});
