import { makeDocumentMock, parserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import { createDocumentContext } from './createDocumentContext';

vi.mock('@art-js/primitives', () => {
	return parserVisitContextMock();
});

describe('createDocumentContext', () => {
	it('WHEN creating a document context', async () => {
		const document = makeDocumentMock();

		const result = createDocumentContext(document as never, '# Hello');

		expect(result.construct).toBe(document);
		expect(result.markdown).toBe('# Hello');
	});
});
