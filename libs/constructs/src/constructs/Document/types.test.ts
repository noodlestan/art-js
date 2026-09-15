import { describe, expect, it } from 'vitest';

import type { ArtDocument } from './types';

describe('ArtDocument type', () => {
	it('accepts a valid ArtDocument', () => {
		const doc: ArtDocument = { construct: 'Document', children: [] };
		expect(doc.construct).toBe('Document');
	});
});
