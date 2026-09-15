import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/constructs', () => ({
	createDocument: vi.fn(() => ({ construct: 'Document', children: [] })),
}));

vi.mock('@art-js/primitives', () => ({
	createParserVisitContext: vi.fn(() => ({
		construct: { construct: 'Document', children: [] },
		captureChildConstruct: vi.fn(),
		onBeforeConstruct: vi.fn(() => ({})),
		parent: vi.fn(() => undefined),
		markdown: '',
	})),
}));

vi.mock('mdast-util-from-markdown', () => ({
	fromMarkdown: vi.fn(() => ({
		type: 'root',
		children: [
			{
				type: 'paragraph',
				children: [{ type: 'text', value: 'Hello' }],
			},
		],
	})),
}));

vi.mock('unist-util-visit', () => ({
	SKIP: 'SKIP',
	visit: vi.fn(),
}));

describe('buildDocument', () => {
	it('builds a document from markdown', async () => {
		const { buildDocument } = await import('./builder');
		const config = {
			defaultConstruct: vi.fn(() => ({
				name: 'NaturalBlock',
				processor: {
					captureNode: vi.fn(() => null),
				},
				factory: { fromData: () => ({}) },
			})),
			constructs: [],
		};
		const result = buildDocument(config as never, 'Hello');
		expect(result).toEqual({ construct: 'Document', children: [] });
	});
});
