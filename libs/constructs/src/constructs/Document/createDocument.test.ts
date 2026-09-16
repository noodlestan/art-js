import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', async () => {
	const { nodePositionMock } = await import('../../test/helpers/primitives/nodePositionMock');
	return nodePositionMock();
});

describe('createDocument', () => {
	it('creates an ArtDocument from a root node', async () => {
		const { createDocument } = await import('./createDocument');
		const root = { type: 'root' };
		const result = createDocument(root);
		expect(result.construct).toBe('Document');
		expect(result.children).toEqual([]);
	});
});
