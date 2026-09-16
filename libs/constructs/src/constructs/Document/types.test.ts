import { describe, expect, it } from 'vitest';

import { makeDocumentMock } from '../../test/helpers/constructs/Document/makeDocumentMock';

import type { ArtDocument } from './types';

describe('ArtDocument type', () => {
	it('accepts a valid ArtDocument', () => {
		const doc: ArtDocument = makeDocumentMock();
		expect(doc.construct).toBe('Document');
	});
});
