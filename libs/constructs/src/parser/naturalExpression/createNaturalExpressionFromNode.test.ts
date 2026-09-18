import type { MdastNode } from '@art-js/primitives';
import { nodePositionMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import { createNaturalExpressionFromNode } from './createNaturalExpressionFromNode';

vi.mock('@art-js/primitives/src/parser/helpers', () => {
	return nodePositionMock();
});

describe('createNaturalExpressionFronNode', () => {
	it('WHEN creating a NaturalExpression from a node', async () => {
		const node = {
			type: 'text',
			value: 'hello',
			position: { start: { offset: 0 }, end: { offset: 5 } },
		};

		const result = createNaturalExpressionFromNode(node as MdastNode);

		expect(result.construct).toBe('NaturalExpression');
		expect(result.type).toBe('text');
		expect(result.value).toBe('hello');
	});

	it('WHEN recursively creating children from node children', async () => {
		const node = {
			type: 'paragraph',
			position: { start: { offset: 0 }, end: { offset: 5 } },
			children: [
				{ type: 'text', value: 'hello', position: { start: { offset: 0 }, end: { offset: 5 } } },
			],
		};

		const result = createNaturalExpressionFromNode(node as MdastNode);

		expect(result.children).toHaveLength(1);
		expect(result.children[0]?.type).toBe('text');
	});
});
