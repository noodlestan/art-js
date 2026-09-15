import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => ({
	createParserVisitContext: vi.fn((construct, parentContext, markdown) => ({
		construct,
		parent: () => parentContext,
		markdown: markdown ?? parentContext?.markdown ?? '',
		captureChildConstruct: vi.fn(),
		onBeforeConstruct: vi.fn(() => ({})),
	})),
}));

describe('createDocumentContext', () => {
	it('creates a document context', async () => {
		const { createDocumentContext } = await import('./createDocumentContext');
		const document = { construct: 'Document', children: [] };
		const result = createDocumentContext(document as never, '# Hello');
		expect(result.construct).toBe(document);
		expect(result.markdown).toBe('# Hello');
	});
});
