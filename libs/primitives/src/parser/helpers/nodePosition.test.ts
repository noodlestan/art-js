import { describe, expect, it } from 'vitest';

import { nodePosition } from './nodePosition';

describe('nodePosition', () => {
	it('FOR a node with valid position returns the position', () => {
		const node = {
			type: 'text',
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 6, offset: 5 },
			},
		};

		const result = nodePosition(node);

		expect(result).toEqual({
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 1, column: 6, offset: 5 },
		});
	});

	it('WHEN node has no position throws', () => {
		expect(() => nodePosition({ type: 'text' })).toThrow('Expected source position for text');
	});

	it('WHEN position lacks start or end throws', () => {
		expect(() => nodePosition({ type: 'text', position: {} as never })).toThrow(
			'Expected source position for text',
		);
	});

	it('WHEN offset is missing defaults to 0', () => {
		const node = {
			type: 'text',
			position: {
				start: { line: 1, column: 1 },
				end: { line: 1, column: 6 },
			},
		};

		const result = nodePosition(node);

		expect(result.start.offset).toBe(0);
		expect(result.end.offset).toBe(0);
	});
});
