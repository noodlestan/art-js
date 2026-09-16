import { nodePositionMock } from '@art-js/primitives/src/test/helpers/primitives/nodePositionMock';
import { describe, expect, it, vi } from 'vitest';

import { createArtDocument } from './createArtDocument';

vi.mock('@art-js/primitives', () => {
	return nodePositionMock();
});

describe('createArtDocument', () => {
	it('WHEN creating an ArtDocument from a root node', async () => {
		const root = { type: 'root' };

		const result = createArtDocument(root);

		expect(result.construct).toBe('Document');
		expect(result.children).toEqual([]);
	});
});
