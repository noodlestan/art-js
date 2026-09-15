import { describe, expect, it } from 'vitest';

import { createDocumentFromData } from './createDocumentFromData';

describe('createDocumentFromData', () => {
	it('creates an ArtDocument from data', () => {
		const result = createDocumentFromData({ children: [] });
		expect(result).toEqual({ construct: 'Document', children: [] });
	});
});
