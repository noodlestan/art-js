import { nodePositionMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import { createArtDocumentFromNode } from './createArtDocumentFromNode';

vi.mock('@art-js/primitives', () => {
	return nodePositionMock();
});

describe('createArtDocument', () => {
	it('WHEN creating an ArtDocument from a root node', async () => {
		const root = { type: 'root' };

		const result = createArtDocumentFromNode(root);

		expect(result.construct).toBe('Document');
		expect(result.children).toEqual([]);
	});
});
