import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => ({
	nodePosition: vi.fn(() => ({
		start: { line: 1, column: 1, offset: 0 },
		end: { line: 1, column: 1, offset: 0 },
	})),
}));

describe('createDocument', () => {
	it('creates an ArtDocument from a root node', async () => {
		const { createDocument } = await import('./createDocument');
		const root = { type: 'root' };
		const result = createDocument(root);
		expect(result.construct).toBe('Document');
		expect(result.children).toEqual([]);
	});
});
