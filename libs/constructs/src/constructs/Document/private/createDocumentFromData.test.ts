import { makeDocumentMock } from '@art-js/primitives/src/test/helpers/document/makeDocumentMock';
import { describe, expect, it } from 'vitest';

import { createDocumentFromData } from './createDocumentFromData';

describe('createDocumentFromData', () => {
	it('creates an ArtDocument from data', () => {
		const result = createDocumentFromData({ children: [] });
		expect(result).toEqual(makeDocumentMock());
	});
});
