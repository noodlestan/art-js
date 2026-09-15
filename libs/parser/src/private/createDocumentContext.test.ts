import { describe, expect, it, vi } from 'vitest';

import { makeDocument } from '../test/helpers/document/makeDocument';

vi.mock('@art-js/primitives', async () => {
	const { makeParserVisitContextMock } =
		await import('../test/helpers/primitives/makeParserVisitContextMock');
	return makeParserVisitContextMock();
});

describe('createDocumentContext', () => {
	it('creates a document context', async () => {
		const { createDocumentContext } = await import('./createDocumentContext');
		const document = makeDocument();
		const result = createDocumentContext(document as never, '# Hello');
		expect(result.construct).toBe(document);
		expect(result.markdown).toBe('# Hello');
	});
});
