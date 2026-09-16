import { describe, expect, it } from 'vitest';

import { makeDocumentMock } from '../../../test/helpers/constructs/Document/makeDocumentMock';

import { createDocumentFromData } from './createDocumentFromData';

describe('createDocumentFromData', () => {
	it('creates an ArtDocument from data', () => {
		const result = createDocumentFromData({ children: [] });
		expect(result).toEqual(makeDocumentMock());
	});
});
