import { describe, expect, it } from 'vitest';

import { makeDocument } from '../../test/helpers/document/makeDocument';

import type { ArtDocument } from './types';

describe('ArtDocument type', () => {
	it('accepts a valid ArtDocument', () => {
		const doc: ArtDocument = makeDocument();
		expect(doc.construct).toBe('Document');
	});
});
