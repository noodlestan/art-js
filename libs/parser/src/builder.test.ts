import { makeDocumentMock } from '@art-js/primitives/src/test/helpers/document/makeDocumentMock';
import { describe, expect, it, vi } from 'vitest';

const { markdownTree } = vi.hoisted(() => ({
	markdownTree: { type: 'root', children: [] as unknown[] },
}));

vi.mock('@art-js/constructs', async () => {
	const { makeDocumentMock } =
		await import('@art-js/primitives/src/test/helpers/document/makeDocumentMock');
	return {
		createDocument: vi.fn(() => makeDocumentMock()),
	};
});

vi.mock('@art-js/primitives', async () => {
	const { parserVisitContextMock } =
		await import('@art-js/primitives/src/test/helpers/primitives/parserVisitContextMock');
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
	it('builds a document from markdown', async () => {
		markdownTree.children = [
			{
				type: 'paragraph',
				children: [{ type: 'text', value: 'Hello' }],
			},
		];
		const { buildDocument } = await import('./builder');
		const config = {
			defaultConstruct: naturalBlockParser(),
			constructs: [],
		};
		const result = buildDocument(config as never, 'Hello');
		expect(result).toEqual(makeDocumentMock());
	});

	it('skips blocks when the default construct has no processor', async () => {
		markdownTree.children = [{ type: 'list', children: [] }];
		const { buildDocument } = await import('./builder');
		const config = {
			defaultConstruct: () => ({ name: 'NaturalBlock', factory: { fromData: () => ({}) } }),
			constructs: [],
		};
		const result = buildDocument(config as never, '# Hello');
		expect(result).toEqual(makeDocumentMock());
	});

	it('captures child constructs when a matched construct has no integrator', async () => {
		markdownTree.children = [{ type: 'paragraph', children: [] }];
		const { buildDocument } = await import('./builder');
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

	it('returns SKIP after handling a non-paragraph block type', async () => {
		markdownTree.children = [{ type: 'list', children: [{ type: 'text', value: 'item' }] }];
		const { buildDocument } = await import('./builder');
		const config = {
			defaultConstruct: naturalBlockParser(() => ({ construct: 'NaturalBlock' })),
			constructs: [],
		};
		const result = buildDocument(config as never, '- item');
		expect(result).toEqual(makeDocumentMock());
	});
});
