import { makeDocumentMock } from '@art-js/primitives/src/test/helpers/document/makeDocumentMock';
import { describe, expect, it } from 'vitest';

import type { ArtDocument } from './types';

describe('ArtDocument type', () => {
	it('accepts a valid ArtDocument', () => {
		const doc: ArtDocument = makeDocumentMock();
		expect(doc.construct).toBe('Document');
	});
});
