import { makeDocumentMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it } from 'vitest';

import { createDocumentFromData } from './createDocumentFromData';

describe('createDocumentFromData', () => {
	it('WHEN creating an ArtDocument from data', () => {
		const result = createDocumentFromData({ children: [] });
		expect(result).toEqual(makeDocumentMock());
	});
});
