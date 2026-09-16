import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives/src/parser/helpers', async () => {
	const { nodePositionMock } = await import('../../../test/helpers/primitives/nodePositionMock');
	return nodePositionMock();
});

describe('createNaturalExpression', () => {
	it('creates a NaturalExpression from a node', async () => {
		const { createNaturalExpression } = await import('./createNaturalExpression');
		const node = {
			type: 'text',
			value: 'hello',
			position: { start: { offset: 0 }, end: { offset: 5 } },
		};
		const context = { markdown: '' } as never;
		const result = createNaturalExpression(node as never, context);
		expect(result.construct).toBe('NaturalExpression');
		expect(result.type).toBe('text');
		expect(result.value).toBe('hello');
	});

	it('recursively creates children from node children', async () => {
		const { createNaturalExpression } = await import('./createNaturalExpression');
		const node = {
			type: 'paragraph',
			position: { start: { offset: 0 }, end: { offset: 5 } },
			children: [
				{ type: 'text', value: 'hello', position: { start: { offset: 0 }, end: { offset: 5 } } },
			],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalExpression(node as never, context);
		expect(result.children).toHaveLength(1);
		expect(result.children[0]?.type).toBe('text');
	});
});
