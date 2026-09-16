import { nodePositionMock } from '@art-js/primitives/src/test/helpers/primitives/nodePositionMock';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => {
	return nodePositionMock();
});

describe('createDocument', () => {
	it('WHEN creating an ArtDocument from a root node', async () => {
		const { createDocument } = await import('./createDocument');
		const root = { type: 'root' };

		const result = createDocument(root);

		expect(result.construct).toBe('Document');
		expect(result.children).toEqual([]);
	});
});
