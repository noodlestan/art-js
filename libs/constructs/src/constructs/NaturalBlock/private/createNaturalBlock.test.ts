import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => ({
	nodePosition: vi.fn(() => ({
		start: { line: 1, column: 1, offset: 0 },
		end: { line: 1, column: 1, offset: 0 },
	})),
}));

vi.mock('../../../helpers/rawSlice', () => ({
	rawSlice: vi.fn(() => 'hello'),
}));

vi.mock('../../NaturalExpression/private/createNaturalExpression', () => ({
	createNaturalExpression: vi.fn(child => ({
		construct: 'NaturalExpression',
		type: child.type,
		value: child.value,
		children: [],
	})),
}));

vi.mock('../../Tag/private/extractTags', () => ({
	extractTags: vi.fn(() => ({ tags: [], stripped: 'hello' })),
}));

describe('createNaturalBlock', () => {
	it('creates a NaturalBlock from a node', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'paragraph',
			position: { start: { offset: 0 }, end: { offset: 5 } },
			children: [{ type: 'text', value: 'hello' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.value).toBe('hello');
	});
});
