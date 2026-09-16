import { makeDocumentMock } from '@art-js/primitives/src/test/helpers/document/makeDocumentMock';
import { parserVisitContextMock } from '@art-js/primitives/src/test/helpers/primitives/parserVisitContextMock';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => {
	return parserVisitContextMock();
});

describe('createDocumentContext', () => {
	it('WHEN creating a document context', async () => {
		const { createDocumentContext } = await import('./createDocumentContext');
		const document = makeDocumentMock();

		const result = createDocumentContext(document as never, '# Hello');

		expect(result.construct).toBe(document);
		expect(result.markdown).toBe('# Hello');
	});
});
